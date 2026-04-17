import { Response, NextFunction } from 'express';
import { JsonStoreService } from '../services/json-store.service';
import { LifecycleService } from '../services/lifecycle.service';
import { AuthenticatedRequest, CreateApiPayload, ApiStatus } from '../types';

const store = new JsonStoreService();
const lifecycleService = new LifecycleService(store);

/**
 * Helper: checks that req.user.role === 'Admin'.
 * Returns true if NOT admin (i.e. request was rejected with 403).
 */
function requireAdmin(req: AuthenticatedRequest, res: Response): boolean {
  if (!req.user || req.user.role !== 'Admin') {
    res.status(403).json({
      error: 'Forbidden',
      message: 'Se requiere rol de Administrador',
      correlationId: (req.headers['x-correlation-id'] as string) || 'unknown',
      statusCode: 403,
    });
    return true;
  }
  return false;
}

/** GET /apis — Lista todas las APIs (Admin) */
export async function listAllApis(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (requireAdmin(req, res)) return;
  try {
    const apis = await lifecycleService.getAllApis();
    res.status(200).json(apis);
  } catch (err) {
    next(err);
  }
}

/** POST /apis — Crear nueva API (Admin) */
export async function createApi(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (requireAdmin(req, res)) return;
  try {
    const data = req.body as CreateApiPayload;
    const userId = req.user!.userId;
    const api = await lifecycleService.createApi(data, userId);
    res.status(201).json(api);
  } catch (err) {
    next(err);
  }
}

/** POST /apis/from-spec — Crear API desde spec OpenAPI con IA (Admin) */
export async function createApiFromSpec(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (requireAdmin(req, res)) return;
  try {
    const spec = req.body as Record<string, unknown>;
    const userId = req.user!.userId;
    const api = await lifecycleService.createApiFromSpec(spec, userId);
    res.status(201).json(api);
  } catch (err) {
    next(err);
  }
}

/** PATCH /apis/:id/status — Cambiar estado de API (Admin) */
export async function changeStatus(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (requireAdmin(req, res)) return;
  try {
    const apiId = req.params.id as string;
    const { newStatus } = req.body as { newStatus: ApiStatus };
    const userId = req.user!.userId;
    const api = await lifecycleService.changeStatus(apiId, newStatus, userId);
    res.status(200).json(api);
  } catch (err) {
    next(err);
  }
}

/** GET /apis/:id/audit — Log de auditoría de una API (Admin) */
export async function getAuditLog(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (requireAdmin(req, res)) return;
  try {
    const apiId = req.params.id as string;
    const log = await lifecycleService.getAuditLog(apiId);
    res.status(200).json(log);
  } catch (err) {
    next(err);
  }
}
