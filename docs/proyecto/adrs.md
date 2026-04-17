# Architecture Decision Records (ADRs)

## ADR-001: Persistencia con Archivos JSON

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: El MVP se desarrolla en contexto de hackathon con tiempo limitado. No hay infraestructura de base de datos disponible.
**Decisión**: Usar archivos JSON en el directorio `/data` como almacén de datos, accedidos mediante `JsonStoreService`.
**Consecuencias**:
- (+) Cero configuración de infraestructura
- (+) Datos versionables con Git
- (+) Fácil de inspeccionar y modificar manualmente
- (-) Sin concurrencia segura (race conditions posibles)
- (-) Sin transacciones ACID
- (-) No escala para producción
**Migración futura**: PostgreSQL vía Supabase (ver BL-001)

---

## ADR-002: Autenticación OTP Simulada con JWT

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: Se necesita demostrar un flujo de autenticación seguro sin integrar un proveedor SMTP real.
**Decisión**: OTP fijo "123456" para todos los usuarios. JWT firmado con secret estático y expiración de 24h. Token almacenado en memoria del frontend (no localStorage).
**Consecuencias**:
- (+) Demuestra el flujo completo de autenticación
- (+) Creación automática de usuarios nuevos
- (-) No es seguro para producción
- (-) Token se pierde al recargar la página
**Migración futura**: OTP real con SES/SendGrid + refresh tokens (ver BL-002)

---

## ADR-003: Asistente IA con Pattern Matching

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: Integrar un LLM real requiere API keys, manejo de rate limits y costos. El hackathon requiere respuestas deterministas para la demo.
**Decisión**: Respuestas pre-construidas en `ai-responses.json` con búsqueda por keywords tokenizadas. Se retorna la respuesta con mayor score de coincidencia.
**Consecuencias**:
- (+) Respuestas instantáneas y deterministas
- (+) Sin costos de API externa
- (+) Fácil de agregar nuevas respuestas
- (-) No entiende contexto ni preguntas complejas
- (-) Limitado al vocabulario predefinido
**Migración futura**: OpenAI/Bedrock con RAG sobre el catálogo (ver BL-003)

---

## ADR-004: Angular Standalone sin NgModules

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: Angular 19 promueve componentes standalone como patrón por defecto.
**Decisión**: Todos los componentes son `standalone: true`. No se usan NgModules. Lazy loading con `loadComponent` en rutas.
**Consecuencias**:
- (+) Menor boilerplate
- (+) Tree shaking más efectivo
- (+) Alineado con la dirección de Angular
- (-) Algunos paquetes legacy pueden requerir adaptación

---

## ADR-005: Design System @seguros-bolivar/ui-bundle

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: Se requiere consistencia visual con la marca Seguros Bolívar.
**Decisión**: Usar el design system corporativo como fuente primaria de estilos. Tokens CSS `--sb-ui-*` con fallbacks. PrimeNG como complemento para componentes complejos no cubiertos por el bundle.
**Consecuencias**:
- (+) Consistencia con la marca corporativa
- (+) Tokens centralizados facilitan theming
- (-) Dependencia de un paquete interno no público

---

## ADR-006: Máquina de Estados para Ciclo de Vida

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: Las APIs necesitan un proceso de gobernanza con transiciones controladas.
**Decisión**: Implementar una máquina de estados con transiciones válidas: Borrador → Publicada → Deprecada → Retirada (con rollback Deprecada → Publicada). Cada transición genera una entrada de auditoría.
**Consecuencias**:
- (+) Gobernanza clara y auditable
- (+) Previene transiciones inválidas
- (-) No soporta workflows de aprobación (ver BL-008)

---

## ADR-007: Correlation-ID por Request

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: Se necesita trazabilidad de requests para debugging y observabilidad.
**Decisión**: Middleware que genera UUID v4 por request y lo propaga en header `X-Correlation-ID`. El frontend también genera correlation-id via interceptor.
**Consecuencias**:
- (+) Trazabilidad end-to-end
- (+) Incluido en respuestas de error
- (+) Compatible con sistemas de logging centralizados

---

## ADR-008: Sandbox con Respuestas Mock Predefinidas

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: No se pueden hacer llamadas reales a APIs de producción durante la demo.
**Decisión**: Respuestas mock en archivos JSON (`data/sandbox-responses/api-XXX-YYY.json`). El servicio carga la respuesta según apiId y escenario (200, 400, 404, 500). Tiempo de respuesta simulado aleatorio (50-500ms).
**Consecuencias**:
- (+) Demo segura sin afectar sistemas reales
- (+) Escenarios de error controlados
- (-) No refleja comportamiento real de las APIs

---

## ADR-009: Dashboards de Analítica y Observabilidad con Datos Mock

**Estado**: Aceptada
**Fecha**: 2026-04-17
**Contexto**: No hay integración con GA4 ni Datadog en el MVP.
**Decisión**: Datos mock realistas en `analytics.json` y `observability.json` que simulan métricas de uso, engagement, APM, RUM, CNM y NPM.
**Consecuencias**:
- (+) Demuestra la visión completa del producto
- (+) UI lista para conectar con datos reales
- (-) No refleja métricas reales
**Migración futura**: GA4 Data API + Datadog MCP (ver BL-009, BL-010)
