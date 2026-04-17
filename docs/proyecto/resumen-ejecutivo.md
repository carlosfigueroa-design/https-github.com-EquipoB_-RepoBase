# Resumen Ejecutivo — Portal de APIs Empresarial (Proyecto SIOP)

## Contexto

El Portal de APIs Empresarial de Seguros Bolívar (Proyecto SIOP) es una plataforma web que centraliza, documenta y permite la exploración interactiva de las APIs internas del ecosistema asegurador. Fue concebido como un MVP funcional en contexto de hackathon, con el objetivo de demostrar capacidades de gobernanza de APIs, documentación técnica automatizada y experiencia de desarrollador (DX).

## Problema que Resuelve

Seguros Bolívar cuenta con múltiples APIs distribuidas entre equipos (Core Seguros, Siniestros, Productos Digitales, CAI Procurement, Financiero, entre otros). La falta de un punto centralizado de descubrimiento y documentación genera:

- Duplicación de esfuerzos al integrar APIs existentes.
- Desconocimiento de las capacidades disponibles por parte de equipos internos y externos.
- Ausencia de gobernanza sobre el ciclo de vida de las APIs (publicación, deprecación, retiro).
- Dificultad para probar APIs sin acceso a ambientes productivos.

## Solución

SIOP ofrece un portal web con seis módulos principales:

1. **Catálogo Público de APIs** — Exploración visual con búsqueda en tiempo real de 28+ APIs del dominio asegurador y módulo CAI.
2. **Visor Swagger/OpenAPI** — Documentación técnica interactiva renderizada con swagger-ui-dist para especificaciones OpenAPI 3.0.
3. **Sandbox Interactivo** — Ejecución de llamadas simuladas con respuestas mock realistas, historial de peticiones y metadatos (Correlation-ID, tiempos de respuesta).
4. **Asistente de IA** — Chat conversacional con respuestas pre-construidas, efecto de escritura progresiva y enlaces directos a documentación.
5. **Gestión del Ciclo de Vida** — Administración de estados (Borrador → Publicada → Deprecada → Retirada) con auditoría completa.
6. **Autenticación OTP Simulada** — Flujo de login con código OTP fijo y sesión JWT para demostrar seguridad.

## Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 19+ Standalone, @seguros-bolivar/ui-bundle, swagger-ui-dist |
| Backend | Node.js 20.x, Express.js 4.x, TypeScript |
| Persistencia | Archivos JSON en `/data` (sin base de datos) |
| Autenticación | JWT simulado con jsonwebtoken |
| Testing | Jest 29.x, Supertest |

## Estado Actual

El MVP se encuentra **completamente implementado** con todas las tareas del plan de implementación finalizadas. El sistema es funcional de extremo a extremo: login → catálogo → documentación → sandbox → IA → administración.

## Métricas del Proyecto

- **28 APIs** registradas en el catálogo (10 dominio asegurador + 7 CAI Procurement + 11 adicionales).
- **4 especificaciones OpenAPI** completas (Emisión, Siniestros, Cotización, CAI Procurement).
- **40 archivos** de respuestas mock para sandbox.
- **20 respuestas** pre-construidas para el asistente de IA.
- **6 usuarios** precargados con roles Admin y Externo.
- **~15 endpoints** REST en el backend.

## Equipo

Diseñado para ejecución paralela por 5 personas, cada una responsable de un módulo vertical (Backend Core, Frontend Shell, Catálogo, Swagger+Sandbox, IA+Lifecycle).
