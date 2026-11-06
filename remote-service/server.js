const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const STATUS_TEMPLATES = {
  REGISTRADA: {
    title: 'Solicitud Registrada con Éxito',
    body: '¡Tu solicitud #{id} ha sido registrada en el sistema! Un asesor la revisará en breve.',
  },
  RECIBIDA: {
    title: 'Solicitud Recibida por Personal',
    body: 'El personal técnico asignado ha recibido y validado tu solicitud #{id}.',
  },
  EN_PROCESO: {
    title: 'Solicitud en Proceso Técnico',
    body: 'El equipo técnico se encuentra activamente trabajando en tu solicitud #{id}.',
  },
  FINALIZADA: {
    title: 'Solicitud Completada con Éxito',
    body: 'Servicio concluido: Tu solicitud #{id} ha sido resuelta satisfactoriamente.',
  },
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Habilitar CORS para permitir llamadas desde cualquier cliente web / móvil
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // 1. Endpoint REST de comprobación de salud
  if (req.method === 'GET' && pathname === '/api/status') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'online',
      service: 'Servidor Remoto de Notificaciones Push (Actividad 21)',
      mechanism: 'Backend Cloud -> Expo Push Gateway API -> Dispositivo Móvil',
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // 2. Endpoint REST de envío de notificaciones
  if (req.method === 'POST' && pathname === '/api/send') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const payloadData = JSON.parse(body || '{}');
        const { token, id = 'SOL-1041', status = 'EN_PROCESO', message, title } = payloadData;

        if (!token) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: false,
            error: 'El campo "token" es obligatorio. Copia el token desde la app móvil.',
          }));
          return;
        }

        const template = STATUS_TEMPLATES[status] || STATUS_TEMPLATES.EN_PROCESO;
        const finalTitle = title || `Solicitud #${id}: ${template.title}`;
        const finalBody = message || template.body.replace('{id}', id);

        const expoPayload = {
          to: token,
          title: finalTitle,
          body: finalBody,
          sound: 'default',
          priority: 'high',
          channelId: 'solicitudes_status',
          data: {
            requestId: id,
            status: status,
            timestamp: new Date().toISOString(),
            source: 'Servidor Remoto Cloud Express/Node.js',
          },
        };

        // Enviar a la API de Expo Push Gateway
        const expoRes = await fetch('https://exp.host/--/api/v2/push/send', {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(expoPayload),
        });

        const expoData = await expoRes.json();

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          expoPayloadSent: expoPayload,
          gatewayResponse: expoData,
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          error: err.message,
        }));
      }
    });
    return;
  }

  // 3. Servir Panel Web Estático (public/index.html)
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Recurso No Encontrado');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Error Interno del Servidor');
      }
    } else {
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

server.listen(PORT, () => {
  console.log('='.repeat(70));
  console.log(`🚀 SERVIDOR REMOTO DE NOTIFICACIONES PUSH ACTIVO`);
  console.log(`🌐 Panel Web disponible en: http://localhost:${PORT}`);
  console.log(`📡 Endpoint de Despacho API: POST http://localhost:${PORT}/api/send`);
  console.log(`🔍 Comprobación de Estado: GET http://localhost:${PORT}/api/status`);
  console.log('='.repeat(70));
});
