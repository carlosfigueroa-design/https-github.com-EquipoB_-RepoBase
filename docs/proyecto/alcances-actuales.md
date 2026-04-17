# Alcances Actuales — SIOP MVP

## Módulos Implementados

### 1. Catálogo Público de APIs
- Listado visual de 28+ APIs con íconos, categorías y estados
- Búsqueda en tiempo real por nombre, categoría o descripción (client-side)
- Vista de detalle con descripción completa, casos de uso y equipo de contacto
- Filtrado por estado: solo APIs "Publicada" y "Deprecada" visibles al público

### 2. Visor Swagger/OpenAPI
- Renderizado interactivo con swagger-ui-dist
- 4 especificaciones OpenAPI 3.0 completas (Emisión, Siniestros, Cotización, CAI Procurement)
- Auto-generación de spec básica para APIs sin archivo de especificación
- Botón "Try it out" conectado al sandbox

### 3. Sandbox Interactivo
- Ejecución de requests mock con respuestas predefinidas
- 40 archivos de respuestas (escenarios 200, 400, 404, 500)
- Historial de peticiones por usuario (máximo 10 entradas, en memoria)
- Metadatos: Correlation-ID, tiempo de respuesta simulado (50-500ms)
- Pre-fill desde catálogo (seleccionar API → sandbox con datos precargados)

### 4. Asistente de IA
- Chat conversacional con efecto de escritura progresiva
- 20+ respuestas pre-construidas con pattern matching por keywords
- Enlaces directos a documentación Swagger de la API relacionada
- Ejemplos cURL copiables
- Redireccionamiento a detalle de API desde respuesta

### 5. Gestión del Ciclo de Vida
- Máquina de estados: Borrador → Publicada → Deprecada → Retirada
- Creación de APIs con formulario completo
- Creación inteligente desde spec OpenAPI (AI Agent que interpreta la spec)
- Cambio de estado con validación de transiciones permitidas
- Auditoría completa de cambios (quién, cuándo, de qué estado a cuál)

### 6. Autenticación OTP
- Flujo de login: email → solicitar OTP → verificar código → JWT
- OTP simulado con código fijo "123456"
- Creación automática de usuario si no existe
- JWT con expiración de 24 horas
- Interceptor automático de token en frontend

### 7. Dashboard de Analítica (Admin)
- **Métricas de uso**: visitas totales, usuarios únicos, promedio diario, tendencia por día, dispositivos
- **Engagement**: tiempo promedio en sitio, páginas por sesión, tasa de rebote, usuarios recurrentes
- **Métricas de negocio**: llamadas a APIs, ejecuciones sandbox, desarrolladores activos, top 5 APIs

### 8. Dashboard de Observabilidad (Admin)
- **APM**: estado de 7 servicios (ok/warn/alert), tiempos de respuesta, errores, uptime, análisis causa/solución
- **RUM/Synthetic**: 5 flujos monitoreados, disponibilidad, tests ejecutados/exitosos/fallidos, tiempos
- **CNM**: 3 zonas de disponibilidad, 7 conexiones entre servicios, contenedores saludables
- **NPM**: disponibilidad de red, latencia (actual/P95/P99), pérdida de paquetes, rendimiento por servicio

## Restricciones del MVP

- Sin base de datos real (JSON files)
- Sin envío real de OTP (código fijo)
- Sin LLM real (pattern matching)
- Sin llamadas reales a APIs externas (mock)
- Sin RBAC complejo (validación simple de rol)
- Sin rate limiting ni circuit breakers
- Sin integración con servicios cloud (S3, Redis, CloudWatch)
