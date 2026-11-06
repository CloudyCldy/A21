#!/usr/bin/env node
/**
 * Servicio Remoto de Notificaciones Push (CLI Emisor)
 * Actividad 21: Integración de notificaciones push
 * 
 * Permite enviar notificaciones push a la aplicación móvil mediante
 * el Expo Push Notification Service Gateway (HTTP/2 REST API).
 * 
 * Uso:
 *   node remote-service/send-push.js --token "ExponentPushToken[xxxx]" --id "SOL-1041" --status "EN_PROCESO"
 */

const STATUS_TEMPLATES = {
  REGISTRADA: {
    title: 'Solicitud Registrada con Éxito',
    body: '¡Tu solicitud #{id} ha sido registrada en el sistema! Un asesor la revisará en breve.',
    step: 1
  },
  RECIBIDA: {
    title: 'Solicitud Recibida por Personal',
    body: 'El personal técnico asignado ha recibido y validado tu solicitud #{id}.',
    step: 2
  },
  EN_PROCESO: {
    title: 'Solicitud en Proceso Técnico',
    body: 'El equipo técnico se encuentra activamente trabajando en tu solicitud #{id}.',
    step: 3
  },
  FINALIZADA: {
    title: 'Solicitud Completada con Éxito',
    body: 'Servicio concluido: Tu solicitud #{id} ha sido resuelta satisfactoriamente.',
    step: 4
  }
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    token: null,
    id: 'SOL-1041',
    status: 'EN_PROCESO',
    message: null,
    title: null
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--token' && args[i + 1]) options.token = args[++i];
    else if (arg === '--id' && args[i + 1]) options.id = args[++i];
    else if (arg === '--status' && args[i + 1]) options.status = args[++i].toUpperCase();
    else if (arg === '--message' && args[i + 1]) options.message = args[++i];
    else if (arg === '--title' && args[i + 1]) options.title = args[++i];
  }

  return options;
}

async function sendRemotePushNotification() {
  const opts = parseArgs();

  console.log('='.repeat(70));
  console.log('  SERVICIO REMOTO DE NOTIFICACIONES PUSH - ACTIVIDAD 21');
  console.log('  Mecanismo: Emisor Backend Cloud -> Expo Push Gateway -> Dispositivo');
  console.log('='.repeat(70));

  if (!opts.token) {
    console.error('\n❌ ERROR: Falta el parámetro --token.');
    console.log('\n📖 Modo de uso:');
    console.log('  node remote-service/send-push.js --token "ExponentPushToken[xxxx]" --id "SOL-1041" --status "EN_PROCESO"');
    console.log('\n💡 Opciones disponibles:');
    console.log('  --token   <token>    Token Expo del dispositivo móvil (Requerido)');
    console.log('  --id      <id>       Identificador de la solicitud (Ej: SOL-1041)');
    console.log('  --status  <estado>   REGISTRADA | RECIBIDA | EN_PROCESO | FINALIZADA');
    console.log('  --message <texto>    Mensaje de texto personalizado (opcional)');
    console.log('  --title   <texto>    Título personalizado (opcional)');
    process.exit(1);
  }

  const template = STATUS_TEMPLATES[opts.status] || STATUS_TEMPLATES.EN_PROCESO;
  const finalTitle = opts.title || `Solicitud #${opts.id}: ${template.title}`;
  const finalBody = opts.message || template.body.replace('{id}', opts.id);

  const payload = {
    to: opts.token,
    title: finalTitle,
    body: finalBody,
    sound: 'default',
    priority: 'high',
    channelId: 'solicitudes_status',
    data: {
      requestId: opts.id,
      status: opts.status,
      timestamp: new Date().toISOString(),
      source: 'Remote Cloud Backend Service'
    }
  };

  console.log('\n📦 Preparando payload para despacho remoto:');
  console.log(JSON.stringify(payload, null, 2));

  console.log('\n🚀 Transmitiendo vía HTTPS POST a https://exp.host/--/api/v2/push/send ...');

  try {
    const startTime = Date.now();
    const response = await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const elapsed = Date.now() - startTime;
    const data = await response.json();

    console.log(`\n✅ Respuesta del Expo Push Gateway recibida en ${elapsed}ms (HTTP ${response.status}):`);
    console.log(JSON.stringify(data, null, 2));

    if (data.data) {
      const tickets = Array.isArray(data.data) ? data.data : [data.data];
      tickets.forEach((ticket, idx) => {
        if (ticket.status === 'ok') {
          console.log(`\n🎉 Ticket de entrega generado con éxito [ID: ${ticket.id}]`);
          console.log('   El mensaje ha sido encolado y enviado a APNs/FCM hacia el dispositivo.');
        } else if (ticket.status === 'error') {
          console.error(`\n⚠️ Error reportado por el Gateway: ${ticket.message} (${ticket.details?.error})`);
        }
      });
    }

  } catch (err) {
    console.error('\n❌ Error de red al contactar con el Expo Push Gateway:', err.message);
  }

  console.log('\n' + '='.repeat(70));
}

sendRemotePushNotification();
