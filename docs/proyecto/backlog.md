# Backlog — Implementaciones Pendientes

## Prioridad Alta

### BL-001: Integración con Base de Datos PostgreSQL
**Estado**: Pendiente
**Descripción**: Migrar la persistencia de archivos JSON a PostgreSQL/Supabase para soportar concurrencia, transacciones y escalabilidad.
**Impacto**: Permite operación multi-usuario real y consultas complejas.
**Archivos afectados**: `JsonStoreService`, todos los servicios que lo usan.

### BL-002: Autenticación OTP Real
**Estado**: Pendiente
**Descripción**: Integrar proveedor SMTP (SES, SendGrid) para envío real de códigos OTP con expiración de 5 minutos.
**Impacto**: Seguridad real para ambientes no-demo.

### BL-003: Integración con LLM Real (OpenAI/Bedrock)
**Estado**: Pendiente
**Descripción**: Reemplazar pattern matching por llamadas a un LLM para respuestas contextuales sobre el catálogo de APIs.
**Impacto**: Experiencia de IA significativamente mejorada.

### BL-004: Rate Limiting y Circuit Breakers
**Estado**: Pendiente
**Descripción**: Implementar rate limiting por IP/usuario y circuit breakers para dependencias externas.
**Impacto**: Protección contra abuso y resiliencia del sistema.

## Prioridad Media

### BL-005: RBAC Complejo con Permisos Granulares
**Estado**: Pendiente
**Descripción**: Implementar sistema de roles y permisos más allá de Admin/Externo. Incluir roles como API Owner, Reviewer, Viewer.
**Impacto**: Gobernanza más precisa del ciclo de vida.

### BL-006: Versionamiento de APIs
**Estado**: Pendiente
**Descripción**: Soportar múltiples versiones de una misma API (v1, v2) con specs y sandbox independientes.
**Impacto**: Gestión real del ciclo de vida de APIs.

### BL-007: Notificaciones por Email
**Estado**: Pendiente
**Descripción**: Notificar a equipos cuando una API cambia de estado, se depreca o se retira.
**Impacto**: Comunicación proactiva con consumidores de APIs.

### BL-008: Flujo de Solicitud de Paso a Producción
**Estado**: Pendiente
**Descripción**: Workflow de aprobación para promover APIs de Borrador a Publicada con revisores asignados.
**Impacto**: Gobernanza formal del proceso de publicación.

### BL-009: Integración Google Analytics 4
**Estado**: Pendiente
**Descripción**: Implementar tracking real con GA4 para métricas de uso y engagement. Consultar GA4 Data API para el dashboard.
**Impacto**: Métricas reales en lugar de datos mock.

### BL-010: Integración Datadog para Observabilidad
**Estado**: Pendiente
**Descripción**: Conectar con Datadog APM, RUM, NPM para métricas reales de observabilidad.
**Impacto**: Monitoreo real de servicios en producción.

## Prioridad Baja

### BL-011: Caché con Redis
**Estado**: Pendiente
**Descripción**: Implementar caché para consultas frecuentes del catálogo y respuestas del asistente IA.
**Impacto**: Mejora de rendimiento.

### BL-012: Compresión Gzip/Brotli
**Estado**: Pendiente
**Descripción**: Habilitar compresión de respuestas HTTP.
**Impacto**: Reducción de ancho de banda.

### BL-013: Enmascaramiento de Datos Sensibles
**Estado**: Pendiente
**Descripción**: Implementar enmascaramiento automático de datos PII en logs y respuestas de sandbox.
**Impacto**: Cumplimiento de políticas de seguridad.

### BL-014: Logs Centralizados (CloudWatch/ELK)
**Estado**: Pendiente
**Descripción**: Enviar logs estructurados a un sistema centralizado para análisis y alertas.
**Impacto**: Debugging y auditoría en producción.

### BL-015: Green IT — Optimización de Recursos
**Estado**: Pendiente
**Descripción**: Lazy loading de imágenes, tree shaking agresivo, service workers para caché offline.
**Impacto**: Reducción de huella de carbono y mejora de rendimiento.

### BL-016: Autogeneración de Documentación con IA
**Estado**: Pendiente
**Descripción**: Generar automáticamente descripciones, casos de uso y ejemplos a partir de specs OpenAPI usando LLM.
**Impacto**: Reducción de esfuerzo manual en documentación.
