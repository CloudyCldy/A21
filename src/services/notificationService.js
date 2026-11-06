import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

// Configuración global del manejador de notificaciones cuando la app está en PRIMER PLANO (Foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Solicita permisos de notificaciones al sistema operativo y obtiene el token push.
 * Compatible con Android, iOS y Web.
 */
export async function registerForPushNotificationsAsync() {
  let token = null;
  let permissionStatus = 'undetermined';
  let errorDetails = null;

  try {
    // 1. Configuración de canales de notificación para Android (Obligatorio desde Android 8.0 Oreo)
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'Seguimiento de Solicitudes',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#2563EB',
        sound: 'default',
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });

      // Canal adicional de alta prioridad para cambios de estado críticos
      await Notifications.setNotificationChannelAsync('solicitudes_status', {
        name: 'Cambios de Estado de Solicitudes',
        description: 'Notificaciones automáticas sobre el avance del servicio técnico',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 300, 150, 300],
        lightColor: '#16A34A',
        sound: 'default',
        enableLights: true,
        enableVibrate: true,
        showBadge: true,
      });
    }

    // 2. Comprobación si se ejecuta en un dispositivo físico
    if (!Device.isDevice && Platform.OS !== 'web') {
      console.warn('Las notificaciones push físicas requieren un dispositivo real.');
      errorDetails = 'Dispositivo emulador detectado. Se utilizará token de prueba simulado.';
    }

    // 3. Verificación de permisos existentes
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // 4. Si aún no se han concedido, solicitarlos explícitamente al usuario
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    permissionStatus = finalStatus;

    if (finalStatus !== 'granted') {
      return {
        success: false,
        token: null,
        permissionStatus: finalStatus,
        error: 'El usuario no concedió permisos de notificación en el dispositivo.',
      };
    }

    // 5. Obtención del Expo Push Token
    // Se extrae el projectId desde app.json / Constants si existe
    const projectId =
      Constants.expoConfig?.extra?.eas?.projectId ||
      Constants.easConfig?.projectId ||
      'act21-solicitudes-project';

    try {
      const pushTokenData = await Notifications.getExpoPushTokenAsync({
        projectId: projectId,
      });
      token = pushTokenData.data;
    } catch (tokenErr) {
      console.warn('No se pudo obtener token remoto de Expo:', tokenErr.message);
      // Generar token simulado para entornos de prueba web / emulador
      token = `ExponentPushToken[SIM_${Platform.OS.toUpperCase()}_${Math.random().toString(36).substring(2, 10)}]`;
      errorDetails = `Modo simulado activo: ${tokenErr.message}`;
    }

    return {
      success: true,
      token,
      permissionStatus: finalStatus,
      isRealDevice: Device.isDevice,
      platform: Platform.OS,
      error: errorDetails,
    };
  } catch (err) {
    console.error('Error durante el registro de notificaciones:', err);
    return {
      success: false,
      token: null,
      permissionStatus: 'error',
      error: err.message,
    };
  }
}

/**
 * Despacha una notificación local directa al dispositivo (útil para pruebas inmediatas en foreground)
 */
export async function scheduleLocalNotification({ title, body, data }) {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: title || 'Notificación de Servicio',
        body: body || 'Su solicitud ha sido actualizada.',
        data: data || {},
        sound: 'default',
        priority: Notifications.AndroidNotificationPriority.HIGH,
      },
      trigger: null, // Envío inmediato
    });
  } catch (err) {
    console.error('Error al programar notificación local:', err);
    throw err;
  }
}

/**
 * Envía una notificación mediante la API HTTP/REST remota de Expo Push Notifications.
 * Endpoint: https://exp.host/--/api/v2/push/send
 */
export async function sendPushViaExpoApi({ expoPushToken, title, body, data }) {
  if (!expoPushToken) {
    throw new Error('No se ha proporcionado un Expo Push Token válido.');
  }

  const message = {
    to: expoPushToken,
    sound: 'default',
    title: title,
    body: body,
    data: data || {},
    priority: 'high',
    channelId: 'solicitudes_status',
  };

  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });

  const responseJson = await response.json();
  return responseJson;
}

/**
 * Suscribe un listener para cuando la notificación es RECIBIDA mientras la aplicación está abierta.
 */
export function addNotificationReceivedListener(callback) {
  return Notifications.addNotificationReceivedListener(callback);
}

/**
 * Suscribe un listener para cuando el usuario TOCA o SELECCIONA la notificación (interacción).
 */
export function addNotificationResponseReceivedListener(callback) {
  return Notifications.addNotificationResponseReceivedListener(callback);
}
