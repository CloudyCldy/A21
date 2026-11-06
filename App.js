import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  Alert,
  Platform,
} from 'react-native';
import Header from './src/components/Header';
import TokenCard from './src/components/TokenCard';
import SolicitudesList from './src/components/SolicitudesList';
import NotificationBanner from './src/components/NotificationBanner';
import SolicitudDetailModal from './src/components/SolicitudDetailModal';
import NotificationHistoryModal from './src/components/NotificationHistoryModal';
import SimulatorModal from './src/components/SimulatorModal';
import { INITIAL_SOLICITUDES, STATUS_CONFIG } from './src/services/mockData';
import {
  registerForPushNotificationsAsync,
  scheduleLocalNotification,
  sendPushViaExpoApi,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
} from './src/services/notificationService';

export default function App() {
  const [solicitudes, setSolicitudes] = useState(INITIAL_SOLICITUDES);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [permissionStatus, setPermissionStatus] = useState('undetermined');
  const [isRealDevice, setIsRealDevice] = useState(false);
  const [incomingNotification, setIncomingNotification] = useState(null);
  const [notificationsHistory, setNotificationsHistory] = useState([]);
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);

  // Modales
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  // Referencias a listeners de Expo Notifications para limpieza al desmontar
  const notificationListener = useRef();
  const responseListener = useRef();

  // 1. Inicialización y registro de notificaciones al arrancar la aplicación
  useEffect(() => {
    initPushNotifications();

    // Listener 1: Notificación RECIBIDA (Foreground)
    notificationListener.current = addNotificationReceivedListener((notification) => {
      console.log('Notificación recibida en Foreground:', notification);
      handleIncomingNotificationPayload(notification);
    });

    // Listener 2: Notificación SELECCIONADA / TOCADA por el usuario (Respuesta del usuario)
    responseListener.current = addNotificationResponseReceivedListener((response) => {
      console.log('El usuario tocó la notificación:', response);
      const data = response?.notification?.request?.content?.data;
      if (data?.requestId) {
        openSolicitudById(data.requestId);
      }
    });

    return () => {
      if (notificationListener.current && notificationListener.current.remove) {
        notificationListener.current.remove();
      }
      if (responseListener.current && responseListener.current.remove) {
        responseListener.current.remove();
      }
    };
  }, []);

  const initPushNotifications = async () => {
    const regResult = await registerForPushNotificationsAsync();
    setPermissionStatus(regResult.permissionStatus);
    setIsRealDevice(regResult.isRealDevice || false);

    if (regResult.success && regResult.token) {
      setExpoPushToken(regResult.token);
      console.log('Expo Push Token registrado:', regResult.token);
    } else {
      console.warn('Permisos no concedidos o modo simulado:', regResult.error);
    }
  };

  /**
   * Procesa el payload entrante de una notificación y actualiza el estado de la aplicación.
   */
  const handleIncomingNotificationPayload = (notification) => {
    const content = notification?.request?.content || notification;
    const title = content.title || 'Nueva Actualización';
    const body = content.body || 'Tu solicitud ha sido modificada.';
    const data = content.data || {};
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotifItem = {
      id: notification?.request?.identifier || `notif_${Date.now()}`,
      title,
      body,
      data,
      receivedAt: timestamp,
    };

    // Agregar a la bandeja de historial
    setNotificationsHistory((prev) => [newNotifItem, ...prev]);

    // Mostrar banner flotante en pantalla
    setIncomingNotification(newNotifItem);

    // Auto-ocultar banner después de 7 segundos
    setTimeout(() => {
      setIncomingNotification((curr) => (curr?.id === newNotifItem.id ? null : curr));
    }, 7000);

    // Si viene asociada a una solicitud, actualizar su estado en tiempo real
    if (data.requestId && data.status) {
      applyStatusUpdate(data.requestId, data.status, body, timestamp);
    }
  };

  /**
   * Aplica la transición de estado a la solicitud específica y registra el evento en su historial
   */
  const applyStatusUpdate = (requestId, newStatus, message, timestamp) => {
    setSolicitudes((prevList) =>
      prevList.map((sol) => {
        if (sol.id === requestId) {
          const updatedHistory = [
            ...sol.history,
            {
              status: newStatus,
              timestamp: `${new Date().toLocaleDateString()} ${timestamp || ''}`,
              message: message || STATUS_CONFIG[newStatus]?.defaultMessage || 'Estado actualizado.',
            },
          ];

          const updatedSol = {
            ...sol,
            currentStatus: newStatus,
            history: updatedHistory,
          };

          // Si está abierto el modal de esta solicitud, actualizar también su vista
          setSelectedSolicitud((current) => (current?.id === requestId ? updatedSol : current));

          return updatedSol;
        }
        return sol;
      })
    );
  };

  const openSolicitudById = (requestId) => {
    const found = solicitudes.find((s) => s.id === requestId);
    if (found) {
      setSelectedSolicitud(found);
      setIsDetailOpen(true);
      setIncomingNotification(null); // Quitar banner si estaba visible
    }
  };

  /**
   * Despacha una notificación simulando el servicio remoto o llamando al Expo Push Gateway
   */
  const handleTriggerNotification = async ({ requestId, status, customMessage }) => {
    const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.REGISTRADA;
    const sol = solicitudes.find((s) => s.id === requestId) || solicitudes[0];
    const title = `Solicitud #${sol.id}: ${statusCfg.label}`;
    const body = customMessage || statusCfg.defaultMessage;
    const data = {
      requestId: sol.id,
      status: status,
      client: sol.client,
      timestamp: new Date().toISOString(),
    };

    // 1. Si tenemos un token real de Expo, intentar emitir mediante la API REST de Expo
    if (expoPushToken && !expoPushToken.includes('SIM_')) {
      try {
        const expoRes = await sendPushViaExpoApi({
          expoPushToken,
          title,
          body,
          data,
        });
        console.log('Respuesta de Expo Push Gateway:', expoRes);
      } catch (err) {
        console.warn('Fallo en Expo Push Gateway, despachando notificación local:', err.message);
      }
    }

    // 2. Programar notificación local inmediata (para emuladores, web o confirmación en dispositivo)
    try {
      await scheduleLocalNotification({ title, body, data });
    } catch (localErr) {
      console.warn('Simulación directa por listener:', localErr.message);
    }

    // 3. Inyectar directamente en el flujo para retroalimentación visual garantizada
    handleIncomingNotificationPayload({
      title,
      body,
      data,
    });

    return { title, body, data };
  };

  /**
   * Avanza la solicitud seleccionada al siguiente estado secuencial y envía la notificación
   */
  const handleAdvanceStatus = async (solicitud) => {
    const steps = ['REGISTRADA', 'RECIBIDA', 'EN_PROCESO', 'FINALIZADA'];
    const currentIndex = steps.indexOf(solicitud.currentStatus);
    if (currentIndex < steps.length - 1) {
      const nextStatus = steps[currentIndex + 1];
      await handleTriggerNotification({
        requestId: solicitud.id,
        status: nextStatus,
      });
    } else {
      Alert.alert('Solicitud Finalizada', 'Esta solicitud ya ha alcanzado el estado final.');
    }
  };

  /**
   * Prueba de Comportamiento cuando NO se han concedido permisos (Parte 4.5)
   */
  const handleSimulateNoPermissions = () => {
    setPermissionStatus('denied');
    setExpoPushToken('');
    Alert.alert(
      'Permisos Denegados (Prueba 4.5)',
      'Se ha simulado el estado sin permisos. La aplicación no podrá registrar tokens push ni emitir alertas en la barra del dispositivo hasta que el usuario conceda los permisos en Ajustes.',
      [{ text: 'Entendido' }]
    );
  };

  const handleRefreshPermissions = async () => {
    await initPushNotifications();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Banner flotante de notificación entrante */}
      <NotificationBanner
        notification={incomingNotification}
        onPress={(notif) => {
          if (notif?.data?.requestId) {
            openSolicitudById(notif.data.requestId);
          }
        }}
        onDismiss={() => setIncomingNotification(null)}
      />

      {/* Encabezado Principal */}
      <Header
        permissionStatus={permissionStatus}
        notificationCount={notificationsHistory.length}
        onOpenNotifications={() => setIsHistoryOpen(true)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onRefreshPermissions={handleRefreshPermissions}
      />

      <View style={styles.mainContent}>
        {/* Tarjeta Informativa del Token Push (Entregable 5) */}
        <TokenCard
          expoPushToken={expoPushToken}
          permissionStatus={permissionStatus}
          isRealDevice={isRealDevice}
          platform={Platform.OS}
          onSimulateRemoteSend={() => setIsSimulatorOpen(true)}
        />

        {/* Listado de Solicitudes y Trazabilidad (Caso de Estudio) */}
        <SolicitudesList
          solicitudes={solicitudes}
          onSelectSolicitud={(sol) => {
            setSelectedSolicitud(sol);
            setIsDetailOpen(true);
          }}
          onQuickAdvanceStatus={handleAdvanceStatus}
        />
      </View>

      {/* Modal de Detalle de Solicitud */}
      <SolicitudDetailModal
        visible={isDetailOpen}
        solicitud={selectedSolicitud}
        onClose={() => setIsDetailOpen(false)}
        onAdvanceStatus={handleAdvanceStatus}
      />

      {/* Modal de Historial / Bandeja de Notificaciones */}
      <NotificationHistoryModal
        visible={isHistoryOpen}
        notifications={notificationsHistory}
        onClose={() => setIsHistoryOpen(false)}
        onClearHistory={() => setNotificationsHistory([])}
        onSelectNotification={(notif) => {
          setIsHistoryOpen(false);
          if (notif?.data?.requestId) {
            openSolicitudById(notif.data.requestId);
          }
        }}
      />

      {/* Modal Simulador de Servicio Remoto */}
      <SimulatorModal
        visible={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        expoPushToken={expoPushToken}
        solicitudes={solicitudes}
        onTriggerNotification={handleTriggerNotification}
        onSimulateNoPermissions={handleSimulateNoPermissions}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  mainContent: {
    flex: 1,
  },
});
