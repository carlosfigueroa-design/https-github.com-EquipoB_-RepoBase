# Estructura de Archivos — SIOP

```
hackathon-17042026/
├── .kiro/                              # Configuración de Kiro IDE
│   ├── settings/mcp.json              # MCP servers (Jira, GitHub, Supabase)
│   ├── specs/api-portal-platform/     # Spec del proyecto
│   │   ├── .config.kiro
│   │   ├── requirements.md
│   │   ├── design.md
│   │   └── tasks.md
│   └── steering/                      # Reglas de steering
│       ├── comportamiento-agente-qa.md
│       └── reglas-frontend.md
│
├── backend/                            # Backend Node.js + Express
│   ├── src/
│   │   ├── app.ts                     # Entry point: Express app setup
│   │   ├── config/
│   │   │   └── app.config.ts          # JWT_SECRET, OTP_CODE, PORT, DATA_DIR, CORS
│   │   ├── controllers/
│   │   │   ├── ai.controller.ts       # POST /ai/assistant
│   │   │   ├── analytics.controller.ts # GET /analytics/dashboard, POST /analytics/events
│   │   │   ├── auth.controller.ts     # POST /auth/otp/request, POST /auth/otp/verify, GET /auth/me
│   │   │   ├── catalog.controller.ts  # GET /catalog, GET /catalog/search, GET /catalog/:id, GET /catalog/:id/spec
│   │   │   ├── lifecycle.controller.ts # GET/POST /apis, PATCH /apis/:id/status, GET /apis/:id/audit
│   │   │   ├── observability.controller.ts # GET /observability/dashboard
│   │   │   └── sandbox.controller.ts  # POST /sandbox/execute, GET /sandbox/history
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts      # JWT Bearer token verification
│   │   │   ├── correlation-id.middleware.ts # UUID per request
│   │   │   └── error-handler.middleware.ts  # Standardized error responses
│   │   ├── routes/v1/
│   │   │   ├── index.ts               # Route registration (public + protected)
│   │   │   ├── ai.routes.ts
│   │   │   ├── analytics.routes.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── catalog.routes.ts
│   │   │   ├── lifecycle.routes.ts
│   │   │   ├── observability.routes.ts
│   │   │   └── sandbox.routes.ts
│   │   ├── services/
│   │   │   ├── ai-assistant.service.ts # Pattern matching AI
│   │   │   ├── analytics.service.ts    # Metrics aggregation + event tracking
│   │   │   ├── auth.service.ts         # OTP verification + JWT generation
│   │   │   ├── catalog.service.ts      # Public API listing + spec generation
│   │   │   ├── json-store.service.ts   # JSON file read/write
│   │   │   ├── lifecycle.service.ts    # State machine + audit + AI spec parsing
│   │   │   ├── observability.service.ts # APM/RUM/CNM/NPM data
│   │   │   └── sandbox.service.ts      # Mock execution + history
│   │   └── types/
│   │       └── index.ts               # All TypeScript interfaces
│   ├── jest.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── frontend/                           # Frontend Angular 19 Standalone
│   ├── src/
│   │   ├── app/
│   │   │   ├── app.component.ts       # Root shell (<router-outlet>)
│   │   │   ├── app.config.ts          # Providers: router, httpClient, animations
│   │   │   ├── app.routes.ts          # All routes with lazy loading
│   │   │   ├── core/
│   │   │   │   ├── config/
│   │   │   │   │   └── api.config.ts  # Centralized API endpoint URLs
│   │   │   │   ├── guards/
│   │   │   │   │   └── auth.guard.ts  # CanActivateFn for protected routes
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.interceptor.ts         # JWT Bearer token
│   │   │   │   │   └── correlation-id.interceptor.ts # UUID per request
│   │   │   │   ├── models/
│   │   │   │   │   ├── analytics.model.ts
│   │   │   │   │   ├── api-catalog.model.ts
│   │   │   │   │   ├── auth.model.ts
│   │   │   │   │   ├── observability.model.ts
│   │   │   │   │   └── sandbox.model.ts
│   │   │   │   └── services/
│   │   │   │       ├── ai-assistant.service.ts
│   │   │   │       ├── analytics.service.ts
│   │   │   │       ├── auth.service.ts
│   │   │   │       ├── catalog.service.ts
│   │   │   │       ├── lifecycle.service.ts
│   │   │   │       ├── observability.service.ts
│   │   │   │       └── sandbox.service.ts
│   │   │   ├── features/
│   │   │   │   ├── ai-assistant/
│   │   │   │   │   └── ai-chat.component.ts
│   │   │   │   ├── analytics/
│   │   │   │   │   └── analytics-dashboard.component.ts
│   │   │   │   ├── api-management/
│   │   │   │   │   ├── api-create.component.ts
│   │   │   │   │   └── api-lifecycle.component.ts
│   │   │   │   ├── auth/
│   │   │   │   │   ├── login.component.ts
│   │   │   │   │   └── otp-verify.component.ts
│   │   │   │   ├── observability/
│   │   │   │   │   └── observability-dashboard.component.ts
│   │   │   │   ├── public-catalog/
│   │   │   │   │   ├── catalog-detail.component.ts
│   │   │   │   │   └── catalog-list.component.ts
│   │   │   │   ├── sandbox/
│   │   │   │   │   ├── request-builder.component.ts
│   │   │   │   │   ├── response-viewer.component.ts
│   │   │   │   │   └── sandbox.component.ts
│   │   │   │   └── swagger-viewer/
│   │   │   │       └── swagger-viewer.component.ts
│   │   │   └── shared/
│   │   │       ├── components/
│   │   │       │   ├── header.component.ts
│   │   │       │   ├── loading-spinner.component.ts
│   │   │       │   └── sidebar.component.ts
│   │   │       └── styles/
│   │   │           └── admin-layout.scss
│   │   ├── assets/
│   │   │   ├── logo-seguros-bolivar.png
│   │   │   └── ui-bundle/
│   │   ├── index.html
│   │   ├── main.ts
│   │   └── styles.scss
│   ├── angular.json
│   ├── proxy.conf.json                # Dev proxy: /v1/api → localhost:3000
│   ├── tsconfig.json
│   └── package.json
│
├── data/                               # JSON data store
│   ├── apis.json                      # 28+ APIs del catálogo
│   ├── users.json                     # 7 usuarios precargados
│   ├── ai-responses.json             # 20+ respuestas del asistente IA
│   ├── audit-log.json                # Historial de cambios de estado
│   ├── analytics.json                # Métricas de analítica
│   ├── observability.json            # Datos de observabilidad
│   ├── specs/                        # Especificaciones OpenAPI 3.0
│   │   ├── emision-polizas.json
│   │   ├── consulta-siniestros.json
│   │   ├── cotizacion-seguros.json
│   │   └── cai-procurement.json
│   └── sandbox-responses/            # 40+ respuestas mock
│       ├── api-001-200.json
│       ├── api-001-400.json
│       └── ...
│
├── docs/                              # Documentación del proyecto
│   └── proyecto/
│
├── .env                               # Variables de entorno (Supabase)
├── .gitignore
├── .npmrc
├── package.json
└── README.md
```
