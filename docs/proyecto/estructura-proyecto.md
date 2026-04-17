# Estructura del Proyecto — SIOP

## Arquitectura General

```
┌─────────────────┐     HTTP/JSON      ┌─────────────────┐     File I/O     ┌──────────┐
│   Angular 19    │ ◄──────────────► │  Express 4.x    │ ◄──────────────► │  /data   │
│   (Frontend)    │   Proxy :4200    │  (Backend)      │                  │  (JSON)  │
│   Port: 4200    │                  │  Port: 3000     │                  │          │
└─────────────────┘                  └─────────────────┘                  └──────────┘
```

## Capas del Sistema

### Frontend (Angular 19 Standalone)
- **Componentes standalone** sin NgModules
- **Lazy loading** con `loadComponent` en rutas
- **Hash-based routing** (`withHashLocation()`)
- **Interceptores**: auth (JWT), correlation-id (UUID)
- **Design System**: @seguros-bolivar/ui-bundle con tokens CSS `--sb-ui-*`

### Backend (Express + TypeScript)
- **Middleware pipeline**: CORS → JSON parser → Correlation-ID → Routes → Error handler
- **Rutas públicas**: catalog, auth, sandbox, ai, analytics, observability
- **Rutas protegidas**: lifecycle (admin only)
- **Autenticación**: JWT Bearer token verificado en middleware
- **Persistencia**: JsonStoreService lee/escribe archivos en `/data`

### Datos (JSON Files)
- Sin base de datos relacional
- Archivos JSON con datos mock realistas del dominio asegurador
- Specs OpenAPI 3.0 completas para visor Swagger
- Respuestas predefinidas para sandbox y asistente IA

## Flujo de Autenticación

```
Usuario → Login (email) → Request OTP → OTP fijo "123456"
       → Verify OTP → JWT generado → Almacenado en memoria (frontend)
       → Interceptor agrega Bearer token a cada request
```

## Flujo de Datos

```
Frontend Service → HTTP GET/POST → Angular Proxy (:4200/v1/api/*)
                                 → Express Router (:3000/v1/api/*)
                                 → Controller → Service → JsonStoreService
                                 → Lee/escribe /data/*.json
                                 → Response JSON → Frontend
```

## Roles y Permisos

| Rol | Acceso |
|-----|--------|
| **Público** | Catálogo de APIs (solo lectura) |
| **Externo** | Catálogo + Swagger + Sandbox + IA |
| **Admin** | Todo lo anterior + Lifecycle + Analítica + Observabilidad |
