import { v4 as uuidv4 } from 'uuid';
import { JsonStoreService } from './json-store.service';
import {
  ApiCatalogItem,
  ApiStatus,
  AuditEntry,
  CreateApiPayload,
} from '../types';

/** Valid state transitions: key = current status, value = allowed next statuses */
const VALID_TRANSITIONS: Record<string, ApiStatus[]> = {
  Borrador: ['Publicada'],
  Publicada: ['Deprecada'],
  Deprecada: ['Retirada', 'Publicada'],
};

export class LifecycleService {
  constructor(private store: JsonStoreService) {}

  /** Returns all APIs (including Borrador/Retirada) for admin view */
  async getAllApis(): Promise<ApiCatalogItem[]> {
    return this.store.read<ApiCatalogItem[]>('apis.json');
  }

  /** Creates a new API with status "Borrador" */
  async createApi(
    data: CreateApiPayload,
    userId: string
  ): Promise<ApiCatalogItem> {
    const apis = await this.store.read<ApiCatalogItem[]>('apis.json');
    const now = new Date().toISOString();

    const newApi: ApiCatalogItem = {
      id: uuidv4(),
      name: data.name,
      category: data.category,
      description: data.description,
      descriptionSummary: data.descriptionSummary,
      useCases: data.useCases,
      status: 'Borrador',
      version: 'v1',
      contactTeam: data.contactTeam,
      icon: data.icon,
      specFile: '',
      createdAt: now,
      updatedAt: now,
    };

    apis.push(newApi);
    await this.store.write('apis.json', apis);

    return newApi;
  }

  /**
   * AI Agent: Interprets an OpenAPI spec and creates an API with all fields auto-filled.
   * Saves the spec file to data/specs/ for Swagger viewer.
   */
  async createApiFromSpec(
    spec: Record<string, unknown>,
    userId: string
  ): Promise<ApiCatalogItem & { aiAnalysis: Record<string, unknown> }> {
    const info = (spec['info'] as Record<string, unknown>) || {};
    const paths = (spec['paths'] as Record<string, unknown>) || {};
    const tags = (spec['tags'] as Array<Record<string, string>>) || [];
    const servers = (spec['servers'] as Array<Record<string, string>>) || [];

    // --- AI Agent: Extract name ---
    const name = (info['title'] as string) || 'API sin nombre';

    // --- AI Agent: Extract description ---
    const description = (info['description'] as string) || `API generada desde especificación OpenAPI: ${name}`;
    const descriptionSummary = description.length > 120 ? description.substring(0, 117) + '...' : description;

    // --- AI Agent: Infer category from tags, paths, and title ---
    const category = this.inferCategory(name, tags, paths);

    // --- AI Agent: Infer icon from category ---
    const icon = this.inferIcon(category);

    // --- AI Agent: Extract use cases from paths ---
    const useCases = this.extractUseCases(paths);

    // --- AI Agent: Extract contact info ---
    const contact = (info['contact'] as Record<string, string>) || {};
    const contactTeam = {
      teamName: contact['name'] || 'Equipo API',
      email: contact['email'] || 'api-team@segurosbolivar.com',
      area: this.inferArea(category),
    };

    // --- AI Agent: Extract version ---
    const version = (info['version'] as string) || 'v1';

    // --- Save spec file ---
    const specFileName = `spec-${uuidv4().substring(0, 8)}.json`;
    await this.store.write(`specs/${specFileName}`, spec);

    // --- AI Agent: Count endpoints and methods ---
    const endpointCount = Object.keys(paths).length;
    const methods = new Set<string>();
    for (const pathDef of Object.values(paths)) {
      if (pathDef && typeof pathDef === 'object') {
        for (const method of Object.keys(pathDef as object)) {
          if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
            methods.add(method.toUpperCase());
          }
        }
      }
    }

    // --- Create API entry ---
    const apis = await this.store.read<ApiCatalogItem[]>('apis.json');
    const now = new Date().toISOString();

    const newApi: ApiCatalogItem = {
      id: uuidv4(),
      name,
      category,
      description,
      descriptionSummary,
      useCases,
      status: 'Borrador',
      version: version.startsWith('v') ? version : `v${version}`,
      contactTeam,
      icon,
      specFile: specFileName,
      createdAt: now,
      updatedAt: now,
    };

    apis.push(newApi);
    await this.store.write('apis.json', apis);

    // Return API + AI analysis summary
    return {
      ...newApi,
      aiAnalysis: {
        endpointsDetected: endpointCount,
        methodsDetected: Array.from(methods),
        serversDetected: servers.map((s) => s['url'] || s['description'] || 'unknown'),
        tagsDetected: tags.map((t) => t['name'] || ''),
        categoryInferred: category,
        iconInferred: icon,
        areaInferred: contactTeam.area,
      },
    };
  }

  /** AI: Infer category from API name, tags, and paths */
  private inferCategory(name: string, tags: Array<Record<string, string>>, paths: Record<string, unknown>): string {
    const text = [
      name,
      ...tags.map((t) => t['name'] || ''),
      ...Object.keys(paths),
    ].join(' ').toLowerCase();

    const categoryMap: Array<[string[], string]> = [
      [['emisi', 'poliza', 'emitir'], 'Emisión'],
      [['renov', 'renovar'], 'Renovación'],
      [['siniestro', 'reclamacion', 'accidente'], 'Siniestros'],
      [['cotiz', 'prima', 'tarifa', 'precio'], 'Cotización'],
      [['pago', 'factur', 'recaudo', 'cobro'], 'Pagos'],
      [['cancel', 'anular', 'rescate'], 'Cancelación'],
      [['auth', 'login', 'otp', 'token', 'sesion'], 'Autenticación'],
      [['notific', 'alerta', 'sms', 'push'], 'Notificaciones'],
      [['coupa', 'procurement', 'compra', 'orden'], 'CAI - Procurement'],
      [['presupuesto', 'financiero'], 'CAI - Financiero'],
      [['beneficiari'], 'Beneficiarios'],
      [['inspeccion', 'vehicul'], 'Inspección'],
      [['coaseguro'], 'Coaseguro'],
      [['reaseguro', 'cesion'], 'Reaseguro'],
      [['asistencia', 'viaje', 'grua'], 'Asistencias'],
      [['documento', 'archivo', 'pdf'], 'Documentos'],
      [['salud', 'medic', 'telemedicina'], 'Salud'],
      [['firma', 'digital', 'certificado'], 'Firma Digital'],
      [['scoring', 'riesgo', 'suscripcion'], 'Suscripción'],
      [['consult', 'buscar', 'detalle'], 'Consultas'],
    ];

    for (const [keywords, cat] of categoryMap) {
      if (keywords.some((kw) => text.includes(kw))) return cat;
    }
    return 'Consultas';
  }

  /** AI: Infer icon from category */
  private inferIcon(category: string): string {
    const iconMap: Record<string, string> = {
      'Emisión': 'fa-file-contract',
      'Renovación': 'fa-sync-alt',
      'Siniestros': 'fa-car-crash',
      'Cotización': 'fa-calculator',
      'Pagos': 'fa-credit-card',
      'Cancelación': 'fa-ban',
      'Autenticación': 'fa-lock',
      'Notificaciones': 'fa-bell',
      'CAI - Procurement': 'fa-cart-shopping',
      'CAI - Financiero': 'fa-file-invoice-dollar',
      'Beneficiarios': 'fa-users',
      'Inspección': 'fa-car',
      'Coaseguro': 'fa-handshake',
      'Reaseguro': 'fa-shield-halved',
      'Asistencias': 'fa-plane-departure',
      'Documentos': 'fa-file-pdf',
      'Salud': 'fa-stethoscope',
      'Firma Digital': 'fa-signature',
      'Suscripción': 'fa-chart-line',
      'Consultas': 'fa-search',
    };
    return iconMap[category] || 'fa-cogs';
  }

  /** AI: Extract use cases from OpenAPI paths */
  private extractUseCases(paths: Record<string, unknown>): string[] {
    const useCases: string[] = [];
    for (const [path, methods] of Object.entries(paths)) {
      if (!methods || typeof methods !== 'object') continue;
      for (const [method, def] of Object.entries(methods as Record<string, unknown>)) {
        if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
        const opDef = def as Record<string, unknown>;
        const summary = (opDef['summary'] as string) || `${method.toUpperCase()} ${path}`;
        useCases.push(summary);
      }
    }
    return useCases.slice(0, 8);
  }

  /** AI: Infer area from category */
  private inferArea(category: string): string {
    const areaMap: Record<string, string> = {
      'Emisión': 'Tecnología',
      'Renovación': 'Tecnología',
      'Siniestros': 'Operaciones',
      'Cotización': 'Comercial',
      'Pagos': 'Finanzas',
      'Cancelación': 'Tecnología',
      'Autenticación': 'Seguridad',
      'Notificaciones': 'Marketing',
      'CAI - Procurement': 'Compras y Abastecimiento',
      'CAI - Financiero': 'Finanzas Corporativas',
      'Beneficiarios': 'Tecnología',
      'Inspección': 'Operaciones',
      'Coaseguro': 'Técnica',
      'Reaseguro': 'Técnica',
      'Asistencias': 'Operaciones',
      'Documentos': 'Tecnología',
      'Salud': 'Salud',
      'Firma Digital': 'Seguridad',
      'Suscripción': 'Técnica',
      'Consultas': 'Tecnología',
    };
    return areaMap[category] || 'Tecnología';
  }

  /** Changes API status validating allowed transitions. Records audit entry. */
  async changeStatus(
    apiId: string,
    newStatus: ApiStatus,
    userId: string
  ): Promise<ApiCatalogItem> {
    const apis = await this.store.read<ApiCatalogItem[]>('apis.json');
    const api = apis.find((a) => a.id === apiId);

    if (!api) {
      const error = new Error('API no encontrada') as Error & {
        statusCode?: number;
      };
      error.statusCode = 404;
      throw error;
    }

    const allowed = VALID_TRANSITIONS[api.status] || [];
    if (!allowed.includes(newStatus)) {
      const error = new Error(
        `Transición no permitida de ${api.status} a ${newStatus}`
      ) as Error & { statusCode?: number };
      error.statusCode = 400;
      throw error;
    }

    const previousStatus = api.status;
    api.status = newStatus;
    api.updatedAt = new Date().toISOString();

    await this.store.write('apis.json', apis);

    // Record audit entry
    const auditLog = await this.store.read<AuditEntry[]>('audit-log.json');
    const entry: AuditEntry = {
      id: uuidv4(),
      apiId,
      userId,
      action: `Cambio de estado: ${previousStatus} → ${newStatus}`,
      previousStatus,
      newStatus,
      timestamp: new Date().toISOString(),
    };
    auditLog.push(entry);
    await this.store.write('audit-log.json', auditLog);

    return api;
  }

  /** Returns audit log entries filtered by apiId */
  async getAuditLog(apiId: string): Promise<AuditEntry[]> {
    const auditLog = await this.store.read<AuditEntry[]>('audit-log.json');
    return auditLog.filter((entry) => entry.apiId === apiId);
  }
}
