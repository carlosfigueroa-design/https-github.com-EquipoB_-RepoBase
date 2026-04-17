# 🏢 Vínculo Bolívar — Portal de APIs Empresarial (SIOP)

Portal web que centraliza, documenta y permite la exploración interactiva de las APIs internas de Seguros Bolívar.

## Módulos

| Módulo | Descripción | Acceso |
|--------|-------------|--------|
| 📚 Catálogo de APIs | Exploración visual de 28+ APIs con búsqueda en tiempo real | Público |
| 📖 Visor Swagger | Documentación técnica interactiva OpenAPI 3.0 | Autenticado |
| 🧪 Sandbox | Ejecución de llamadas simuladas con respuestas mock | Autenticado |
| 🤖 Asistente IA | Chat con respuestas sobre APIs y ejemplos cURL | Autenticado |
| ⚙️ Ciclo de Vida | Gestión de estados de APIs con auditoría | Admin |
| 📊 Analítica | Métricas de uso, engagement y negocio | Admin |
| 📡 Observabilidad | APM, RUM, CNM, NPM | Admin |

## Stack

- **Frontend**: Angular 19 Standalone + @seguros-bolivar/ui-bundle
- **Backend**: Node.js 20 + Express 4 + TypeScript
- **Datos**: JSON files en `/data` (sin BD)
- **Auth**: JWT + OTP simulado

## Inicio Rápido

```bash
# Backend
cd backend && npm install && npx ts-node src/app.ts

# Frontend (otra terminal)
cd frontend && npm install && npx ng serve --proxy-config proxy.conf.json
```

Abrir http://localhost:4200

## Credenciales

| Email | Rol | OTP |
|-------|-----|-----|
| admin@segurosbolivar.com | Admin | 123456 |
| demo@segurosbolivar.com | Externo | 123456 |

## Documentación

Toda la documentación del proyecto está en [`docs/proyecto/`](docs/proyecto/):

- [Resumen Ejecutivo](docs/proyecto/resumen-ejecutivo.md)
- [Estructura del Proyecto](docs/proyecto/estructura-proyecto.md)
- [Alcances Actuales](docs/proyecto/alcances-actuales.md)
- [Backlog](docs/proyecto/backlog.md)
- [ADRs](docs/proyecto/adrs.md)
- [Glosario](docs/proyecto/glosario.md)
- [Estructura de Archivos](docs/proyecto/estructura-archivos.md)
- [Épicas e Historias de Usuario](docs/proyecto/epicas-hu.md)

## Equipo

Equipo B — Hackathon Kiro Abril 2026
