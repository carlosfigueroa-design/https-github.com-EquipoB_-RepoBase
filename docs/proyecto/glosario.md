# Glosario — Proyecto SIOP

| Término | Definición |
|---------|-----------|
| **SIOP** | Sistema Integrado de Operaciones del Portal. Nombre interno del proyecto del Portal de APIs Empresarial de Seguros Bolívar. |
| **Portal** | La aplicación web del Portal de APIs empresarial. |
| **Catálogo de APIs** | Módulo que lista, clasifica y permite buscar todas las APIs registradas. |
| **Visor Swagger** | Componente que renderiza documentación técnica OpenAPI 3.0/3.1 usando swagger-ui-dist. |
| **Sandbox** | Entorno interactivo que simula llamadas a APIs usando respuestas mock predefinidas. |
| **Asistente IA** | Módulo de chat que responde consultas sobre APIs usando pattern matching sobre respuestas pre-construidas. |
| **Gestor de Ciclo de Vida** | Módulo que administra los estados de una API (Borrador → Publicada → Deprecada → Retirada). |
| **OTP** | One-Time Password. Código de un solo uso para autenticación. En el MVP es simulado con valor fijo "123456". |
| **JWT** | JSON Web Token. Estándar para transmitir claims de autenticación entre frontend y backend. |
| **Correlation-ID** | Identificador UUID único por request HTTP para trazabilidad end-to-end. |
| **OpenAPI** | Estándar de especificación para describir APIs REST (antes conocido como Swagger). |
| **Almacén JSON** | Carpeta `/data` del proyecto que contiene archivos JSON con datos mock. |
| **Especificación OpenAPI** | Documento JSON/YAML que describe una API siguiendo el estándar OpenAPI 3.0. |
| **Usuario Público** | Visitante no autenticado que accede a la zona pública del Portal. |
| **Usuario Autenticado** | Usuario que ha completado el flujo de login con OTP. Rol "Externo". |
| **Usuario Admin** | Usuario autenticado con rol de administrador para gestionar el ciclo de vida. |
| **Datos Mock** | Datos realistas del dominio asegurador precargados para la demo. |
| **APM** | Application Performance Monitoring. Monitoreo de rendimiento de servicios backend. |
| **RUM** | Real User Monitoring. Monitoreo de experiencia real del usuario en el frontend. |
| **CNM** | Cloud Network Monitoring. Monitoreo de red entre contenedores y zonas de disponibilidad. |
| **NPM** | Network Performance Monitoring. Monitoreo de rendimiento de red (latencia, pérdida de paquetes). |
| **Synthetic Monitoring** | Pruebas automatizadas que simulan flujos de usuario para medir disponibilidad. |
| **Design System** | Librería @seguros-bolivar/ui-bundle con componentes, tokens CSS y estilos corporativos. |
| **Standalone Component** | Componente Angular que no requiere NgModule. Patrón por defecto en Angular 19+. |
| **Lazy Loading** | Carga diferida de componentes Angular solo cuando se navega a su ruta. |
| **MCP** | Model Context Protocol. Estándar para conectar herramientas de IA con servicios externos. |
| **Supabase** | Plataforma BaaS (Backend as a Service) con PostgreSQL, auth y storage. Candidata para migración de persistencia. |
