import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_CONFIG } from '../services/mockData';

export default function NotificationHistoryModal({
  visible,
  notifications,
  onClose,
  onClearHistory,
  onSelectNotification,
}) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBox}>
                <Ionicons name="notifications" size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.title}>Bandeja de Notificaciones ({notifications.length})</Text>
                <Text style={styles.subtitle}>Historial de mensajes push recibidos del servidor</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Listado */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {notifications.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="mail-open-outline" size={48} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>Sin notificaciones recibidas aún</Text>
                <Text style={styles.emptyText}>
                  Usa el botón de pruebas o envía un mensaje desde el servicio remoto para ver
                  las notificaciones en tiempo real.
                </Text>
              </View>
            ) : (
              notifications.map((notif, index) => {
                const statusCfg =
                  (notif.data && notif.data.status && STATUS_CONFIG[notif.data.status]) ||
                  STATUS_CONFIG.REGISTRADA;

                return (
                  <TouchableOpacity
                    key={notif.id || index}
                    style={styles.notifItem}
                    onPress={() => onSelectNotification(notif)}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.notifIcon, { backgroundColor: statusCfg.bgColor }]}>
                      <Ionicons name={statusCfg.icon} size={20} color={statusCfg.color} />
                    </View>

                    <View style={styles.notifContent}>
                      <View style={styles.notifHeaderRow}>
                        <Text style={styles.notifTitle} numberOfLines={1}>{notif.title}</Text>
                        <Text style={styles.notifTime}>{notif.receivedAt || 'Reciente'}</Text>
                      </View>
                      <Text style={styles.notifBody}>{notif.body}</Text>

                      {/* Payload Metadata Inspector */}
                      {notif.data && Object.keys(notif.data).length > 0 && (
                        <View style={styles.payloadBox}>
                          <Text style={styles.payloadLabel}>Payload JSON Data:</Text>
                          <Text style={styles.payloadCode}>
                            {JSON.stringify(notif.data, null, 2)}
                          </Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            {notifications.length > 0 && (
              <TouchableOpacity style={styles.clearBtn} onPress={onClearHistory}>
                <Ionicons name="trash-outline" size={14} color="#DC2626" />
                <Text style={styles.clearBtnText}>Limpiar Historial</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.closeActionBtn} onPress={onClose}>
              <Text style={styles.closeActionText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 10,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 11,
    color: '#64748B',
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#334155',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  notifItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
    gap: 10,
  },
  notifIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  notifContent: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
    marginRight: 6,
  },
  notifTime: {
    fontSize: 10,
    color: '#94A3B8',
  },
  notifBody: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 6,
  },
  payloadBox: {
    backgroundColor: '#F8FAFC',
    padding: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  payloadLabel: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 2,
  },
  payloadCode: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#1E293B',
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#DC2626',
  },
  closeActionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  closeActionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
});
