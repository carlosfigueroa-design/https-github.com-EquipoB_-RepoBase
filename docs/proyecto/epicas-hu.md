# Épicas e Historias de Usuario — SIOP

## EP-001: Catálogo Público de APIs

### HU-001: Explorar catálogo de APIs
**Como** usuario público, **quiero** explorar un catálogo visual de APIs de seguros sin autenticarme, **para** evaluar las capacidades de integración del portal.

**Criterios de aceptación**:
- Muestra 28+ APIs con nombre, categoría, descripción, ícono y estado
- Solo APIs con estado "Publicada" y "Deprecada" son visibles
- Cada API muestra equipo de contacto y casos de uso

### HU-002: Buscar APIs en tiempo real
**Como** usuario público, **quiero** buscar APIs por nombre, categoría o descripción, **para** encontrar rápidamente la API que necesito.

**Criterios de aceptación**:
- Filtrado en tiempo real (client-side) sin llamadas al backend
- Búsqueda por nombre, categoría y descripción (case-insensitive)

### HU-003: Ver detalle de API
**Como** usuario público, **quiero** ver la información completa de una API, **para** entender su propósito y cómo contactar al equipo responsable.

**Criterios de aceptación**:
- Muestra descripción completa, casos de uso, versión, equipo de contacto
- No expone endpoints ni esquemas de autenticación al público

---

## EP-002: Documentación Técnica (Swagger)

### HU-004: Consultar documentación Swagger
**Como** usuario autenticado, **quiero** ver la documentación técnica interactiva de cada API, **para** entender cómo integrarla.

**Criterios de aceptación**:
- Renderiza specs OpenAPI 3.0 con swagger-ui-dist
- Muestra endpoints, métodos, parámetros, schemas y códigos de respuesta
- 4 specs completas disponibles (Emisión, Siniestros, Cotización, CAI)
- Auto-genera spec básica para APIs sin archivo de especificación

### HU-005: Probar API desde Swagger
**Como** usuario autenticado, **quiero** ejecutar "Try it out" desde el visor Swagger, **para** probar la API sin salir de la documentación.

**Criterios de aceptación**:
- Botón "Try it out" ejecuta contra el sandbox
- Muestra respuesta mock con código HTTP, headers y body

---

## EP-003: Sandbox Interactivo

### HU-006: Ejecutar requests mock
**Como** desarrollador, **quiero** ejecutar llamadas simuladas a las APIs, **para** entender el formato de request/response sin afectar sistemas reales.

**Criterios de aceptación**:
- Soporta escenarios 200, 400, 404, 500
- Genera Correlation-ID y tiempo de respuesta simulado
- 40+ respuestas mock predefinidas

### HU-007: Ver historial de requests
**Como** desarrollador, **quiero** ver el historial de mis peticiones al sandbox, **para** comparar respuestas y depurar integraciones.

**Criterios de aceptación**:
- Máximo 10 entradas por usuario (en memoria)
- Muestra request, response, timestamp y correlation-id

---

## EP-004: Asistente de IA

### HU-008: Consultar asistente sobre APIs
**Como** usuario autenticado, **quiero** hacer preguntas en lenguaje natural sobre las APIs, **para** obtener respuestas rápidas sin leer toda la documentación.

**Criterios de aceptación**:
- 20+ respuestas pre-construidas con pattern matching
- Efecto de escritura progresiva en las respuestas
- Enlaces directos a documentación Swagger de la API relacionada
- Ejemplos cURL copiables

---

## EP-005: Autenticación

### HU-009: Iniciar sesión con OTP
**Como** usuario nuevo, **quiero** iniciar sesión con un flujo de OTP, **para** acceder a las funcionalidades protegidas del portal.

**Criterios de aceptación**:
- Flujo: email → solicitar OTP → verificar código → JWT
- OTP simulado con código fijo "123456"
- Creación automática de usuario si no existe
- JWT con expiración de 24 horas

---

## EP-006: Gestión del Ciclo de Vida

### HU-010: Crear nueva API
**Como** administrador, **quiero** registrar una nueva API en el catálogo, **para** que esté disponible para los desarrolladores.

**Criterios de aceptación**:
- Formulario con nombre, categoría, descripción, casos de uso, equipo de contacto
- API se crea en estado "Borrador"
- Opción de crear desde spec OpenAPI con análisis automático (AI Agent)

### HU-011: Cambiar estado de API
**Como** administrador, **quiero** cambiar el estado de una API, **para** gestionar su ciclo de vida.

**Criterios de aceptación**:
- Transiciones válidas: Borrador → Publicada → Deprecada → Retirada
- Rollback permitido: Deprecada → Publicada
- Cada cambio genera entrada de auditoría

### HU-012: Consultar auditoría
**Como** administrador, **quiero** ver el historial de cambios de una API, **para** saber quién hizo qué y cuándo.

**Criterios de aceptación**:
- Muestra usuario, acción, estado anterior, estado nuevo, timestamp

---

## EP-007: Analítica

### HU-013: Ver dashboard de analítica
**Como** administrador, **quiero** ver métricas de uso del portal, **para** entender cómo se está utilizando.

**Criterios de aceptación**:
- Métricas de uso: visitas, usuarios únicos, promedio diario, tendencia, dispositivos
- Engagement: tiempo en sitio, páginas/sesión, tasa de rebote, usuarios recurrentes
- Negocio: llamadas a APIs, ejecuciones sandbox, desarrolladores activos, top 5 APIs

---

## EP-008: Observabilidad

### HU-014: Monitorear APM
**Como** administrador, **quiero** ver el estado de los servicios backend, **para** detectar problemas de rendimiento.

**Criterios de aceptación**:
- Estado por servicio (ok/warn/alert), tiempos de respuesta, errores, uptime
- Top errores con código, mensaje, servicio y conteo
- Análisis causa/solución con severidad y usuarios afectados

### HU-015: Monitorear RUM/Synthetic
**Como** administrador, **quiero** ver la disponibilidad de los flujos de usuario, **para** asegurar la experiencia del usuario final.

**Criterios de aceptación**:
- 5 flujos monitoreados con estado
- Disponibilidad vs indisponibilidad (minutos y %)
- Tests ejecutados/exitosos/fallidos, tiempos, tasas de éxito/fallo

### HU-016: Monitorear CNM
**Como** administrador, **quiero** ver la salud de la red entre contenedores, **para** detectar problemas de conectividad.

**Criterios de aceptación**:
- Zonas de disponibilidad con contenedores saludables y latencia
- Conexiones entre servicios con estado, latencia y pérdida de paquetes

### HU-017: Monitorear NPM
**Como** administrador, **quiero** ver métricas de rendimiento de red, **para** identificar cuellos de botella.

**Criterios de aceptación**:
- Disponibilidad vs indisponibilidad (minutos, %, incidentes)
- Latencia (actual, promedio, P95, P99) con tendencia
- Pérdida de paquetes y rendimiento por servicio (inbound/outbound Mbps)
