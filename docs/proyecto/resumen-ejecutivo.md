# Resumen Ejecutivo — Portal de APIs Empresarial (Proyecto SIOP)

## Contexto

El Portal de APIs Empresarial de Seguros Bolívar (Proyecto SIOP) es una plataforma web que centraliza, documenta y permite la exploración interactiva de las APIs internas del ecosistema asegurador. Fue concebido como un MVP funcional en contexto de hackathon, con el objetivo de demostrar capacidades de gobernanza de APIs, documentación técnica automatizada y experiencia de desarrollador (DX).

## Problema que Resuelve

Seguros Bolívar cuenta con múltiples APIs distribuidas entre equipos (Core Seguros, Siniestros, Productos Digitales, CAI Procurement, Financiero, entre otros). La falta de un punto centralizado genera:

- Duplicación de esfuerzos al integrar APIs existentes
- Desconocimiento de las capacidades disponibles por parte de equipos internos y externos
- Ausencia de gobernanza sobre el ciclo de vida de las APIs
- Dificultad para probar APIs sin acceso a ambientes productivos

## Solución

SIOP ofrece un portal web con ocho módulos principales:

| # | Módulo | Descripción |
|---|--------|-------------|
| 1 | **Catálogo Público de APIs** | Exploración visual con búsqueda en tiempo real de 28+ APIs del dominio asegurador y módulo CAI |
| 2 | **Visor Swagger/OpenAPI** | Documentación técnica interactiva con swagger-ui-dist para especificaciones OpenAPI 3.0 |
| 3 | **Sandbox Interactivo** | Ejecución de llamadas simuladas con respuestas mock, historial y Correlation-ID |
| 4 | **Asistente de IA** | Chat conversacional con respuestas pre-construidas y enlaces directos a documentación |
| 5 | **Gestión del Ciclo de Vida** | Administración de estados (Borrador → Publicada → Deprecada → Retirada) con auditoría |
| 6 | **Autenticación OTP** | Flujo de login simulado con código OTP fijo y sesión JWT |
| 7 | **Dashboard de Analítica** | Métricas de uso, engagement y negocio en tiempo real |
| 8 | **Dashboard de Observabilidad** | Monitoreo APM, RUM/Synthetic, CNM y NPM |

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 19.2 Standalone, @seguros-bolivar/ui-bundle, swagger-ui-dist 5.18 |
| Backend | Node.js 20.x, Express.js 4.21, TypeScript 5.8 |
| Persistencia | Archivos JSON en `/data` (sin base de datos) |
| Autenticación | JWT con jsonwebtoken |
| Testing | Jest 29.x, Supertest |

## Métricas del Proyecto

- **28 APIs** registradas en el catálogo
- **4 especificaciones OpenAPI** completas
- **40 archivos** de respuestas mock para sandbox
- **20 respuestas** pre-construidas para el asistente de IA
- **7 usuarios** precargados con roles Admin y Externo
- **~18 endpoints** REST en el backend
- **12 rutas** en el frontend
- **9 tests unitarios** en backend

## Estado Actual

MVP completamente implementado y funcional de extremo a extremo.

## Equipo

Diseñado para ejecución paralela por 5 personas, cada una responsable de un módulo vertical.
