# Actividad 21: Integración de Notificaciones Push a una Aplicación Móvil

> **Caso de Estudio:** Aplicación móvil de seguimiento de solicitudes de servicio técnico.  
> **Framework:** React Native con Expo SDK  
> **Servicio de Notificación:** Expo Push Notification Gateway (retransmitido a FCM/APNs)

---

## 📋 Resumen del Proyecto

Este proyecto resuelve el problema de cómo mantener a los clientes informados en tiempo real sobre los cambios de estado de sus solicitudes técnicas **sin requerir que consulten o sondeen manualmente la aplicación** (eliminando el HTTP Polling).

### Los 4 Estados Clave Notificados:
1. 🔵 **Solicitud Registrada** (`REGISTRADA`): Notificación inmediata de confirmación al cliente.
2. 🟡 **Solicitud Recibida por Personal** (`RECIBIDA`): Notificación informando el técnico asignado.
3. 🟠 **Solicitud en Proceso** (`EN_PROCESO`): Notificación sobre el inicio de labores técnicas.
4. 🟢 **Solicitud Finalizada** (`FINALIZADA`): Notificación de culminación exitosa y cierre del ticket.

---

## 🚀 Guía de Inicio Rápido

### 1. Iniciar la Aplicación Móvil
```bash
npm start
```
- **En Celular Físico:** Escanea el código QR desde la aplicación **Expo Go** (Android o iOS).
- **En Navegador Web:** Presiona `w` en la consola o ejecuta `npm run web`.
- **En Emulador Android:** Presiona `a` en la consola.

Al iniciar la app:
- Solicitará los permisos de notificación al dispositivo.
- Creará el canal de alta prioridad para Android.
- Generará y mostrará tu **Expo Push Token** (`ExponentPushToken[...]`).

---

### 2. Iniciar el Panel Web del Servicio Remoto
```bash
node server.js
```
Abre tu navegador en:  
👉 **http://localhost:3000**

Desde este panel podrás:
- Pegar tu Expo Push Token copiado desde la app móvil.
- Seleccionar cualquiera de las solicitudes (`SOL-1041`, `SOL-1042`, etc.).
- Presionar cualquiera de los 4 botones de estado para despachar la notificación al móvil con un solo clic.
- Ver los tickets de entrega y logs en tiempo real.

---

### 3. Enviar Notificaciones desde la Terminal (CLI)
También puedes emitir notificaciones mediante el script Node.js:
```bash
node send-push.js --token "ExponentPushToken[TU_TOKEN]" --id "SOL-1041" --status "EN_PROCESO"
```

Parámetros disponibles:
- `--token <token>`: Push token del móvil (Requerido).
- `--id <id>`: Identificador del ticket (Ej: `SOL-1041`).
- `--status <estado>`: `REGISTRADA` | `RECIBIDA` | `EN_PROCESO` | `FINALIZADA`.
- `--message <texto>`: Mensaje complementario personalizado.

---

### 4. Consultar el Reporte Completo y Evidencias
- 📄 **Documento Completo de Entrega:** [`DOCUMENTO_ENTREGA_ACTIVIDAD_21.md`](./DOCUMENTO_ENTREGA_ACTIVIDAD_21.md)
  *(Incluye respuestas a los 6 entregables, diagramas Mermaid, tablas comparativas y análisis de seguridad).*
- 🌐 **Dashboard de Evidencias Interactivas:** Abre [`interactive_evidence.html`](./interactive_evidence.html) en tu navegador para ver la simulación visual interactiva de los 4 estados y la auditoría de payloads.

---

## 📁 Estructura del Código Fuente

```text
Act21/
├── App.js                               # Componente raíz y controlador de eventos
├── app.json                             # Configuración Expo, permisos y plugins
├── package.json                         # Dependencias del proyecto
├── index.js                             # Punto de entrada Expo
├── send-push.js                         # Herramienta CLI para emitir notificaciones remotas
├── server.js                            # Servidor backend remoto (Express/HTTP)
├── interactive_evidence.html            # Dashboard visual de evidencias y simulación
├── DOCUMENTO_ENTREGA_ACTIVIDAD_21.md    # Reporte formal académico de entrega
├── assets/                              # Iconos y recursos gráficos de la aplicación
├── remote-service/                      # Servicio remoto y panel web estático
│   ├── server.js
│   ├── send-push.js
│   └── public/
│       └── index.html                   # Interfaz gráfica del servidor remoto
└── src/
    ├── components/
    │   ├── Header.js                    # Encabezado con estado de permisos
    │   ├── TokenCard.js                 # Tarjeta con Push Token y botón para copiar
    │   ├── SolicitudesList.js           # Listado de solicitudes con stepper de 4 fases
    │   ├── NotificationBanner.js        # Banner in-app interactivo en primer plano
    │   ├── SolicitudDetailModal.js      # Detalle de solicitud y auditoría de eventos
    │   ├── NotificationHistoryModal.js  # Bandeja de notificaciones recibidas
    │   └── SimulatorModal.js            # Consola de pruebas y simulador interno
    └── services/
        ├── mockData.js                  # Solicitudes y configuración de los 4 estados
        └── notificationService.js       # Registro, canales Android y listeners Expo
```


# A21
