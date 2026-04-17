import { Request, Response, NextFunction } from 'express';
import { JsonStoreService } from '../services/json-store.service';
import { ObservabilityService } from '../services/observability.service';

const store = new JsonStoreService();
const observabilityService = new ObservabilityService(store);

/** GET /observability/dashboard — Dashboard completo de observabilidad */
export async function getDashboard(
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const dashboard = await observabilityService.getDashboard();
    res.status(200).json(dashboard);
  } catch (err) {
    next(err);
  }
}
