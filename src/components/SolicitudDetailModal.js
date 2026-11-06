import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_CONFIG } from '../services/mockData';

export default function SolicitudDetailModal({ visible, solicitud, onClose, onAdvanceStatus }) {
  if (!solicitud) return null;

  const currentCfg = STATUS_CONFIG[solicitud.currentStatus] || STATUS_CONFIG.REGISTRADA;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Cabecera */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.badgeId}>
                <Text style={styles.badgeIdText}>{solicitud.id}</Text>
              </View>
              <Text style={styles.headerTitle}>{solicitud.title}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Tarjeta de Estado Actual */}
            <View style={[styles.statusBanner, { backgroundColor: currentCfg.bgColor, borderColor: currentCfg.borderColor }]}>
              <Ionicons name={currentCfg.icon} size={28} color={currentCfg.color} />
              <View style={styles.statusTextCol}>
                <Text style={[styles.statusBannerTitle, { color: currentCfg.color }]}>
                  {currentCfg.label}
                </Text>
                <Text style={styles.statusBannerDesc}>
                  {currentCfg.defaultMessage}
                </Text>
              </View>
            </View>

            {/* Datos Generales */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Información General</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Cliente:</Text>
                  <Text style={styles.infoValue}>{solicitud.client}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Categoría:</Text>
                  <Text style={styles.infoValue}>{solicitud.category}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Fecha Creación:</Text>
                  <Text style={styles.infoValue}>{solicitud.dateCreated}</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoLabel}>Técnico Responsable:</Text>
                  <Text style={[styles.infoValue, { fontWeight: '700', color: '#1E293B' }]}>
                    {solicitud.assignedTech}
                  </Text>
                </View>
                <View style={styles.infoItemFull}>
                  <Text style={styles.infoLabel}>Departamento:</Text>
                  <Text style={styles.infoValue}>{solicitud.department}</Text>
                </View>
              </View>
            </View>

            {/* Trazabilidad Histórica de Estados (Auditoría de Notificaciones Recibidas) */}
            <View style={styles.section}>
              <Text style={styles.sectionHeader}>Historial de Eventos y Notificaciones Push</Text>
              <View style={styles.timeline}>
                {solicitud.history.map((event, index) => {
                  const evCfg = STATUS_CONFIG[event.status] || STATUS_CONFIG.REGISTRADA;
                  const isLast = index === solicitud.history.length - 1;

                  return (
                    <View key={index} style={styles.timelineItem}>
                      <View style={styles.timelineLeftCol}>
                        <View style={[styles.timelineDot, { backgroundColor: evCfg.color }]}>
                          <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                        </View>
                        {!isLast && <View style={styles.timelineLine} />}
                      </View>
                      <View style={styles.timelineContent}>
                        <View style={styles.timelineHeaderRow}>
                          <Text style={[styles.timelineStatusName, { color: evCfg.color }]}>
                            {evCfg.label}
                          </Text>
                          <Text style={styles.timelineTimestamp}>{event.timestamp}</Text>
                        </View>
                        <Text style={styles.timelineMessage}>{event.message}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Explicación Técnica de la Interacción (Requisito Parte 2.5) */}
            <View style={styles.techNote}>
              <Ionicons name="information-circle" size={16} color="#2563EB" />
              <Text style={styles.techNoteText}>
                <Text style={{ fontWeight: '700' }}>Comportamiento al tocar notificación:</Text> El listener{' '}
                <Text style={{ fontFamily: 'monospace' }}>addNotificationResponseReceivedListener</Text>{' '}
                detecta la interacción del usuario con la barra del SO, extrae el identificador{' '}
                <Text style={{ fontWeight: '700' }}>{solicitud.id}</Text> del payload JSON y navega automáticamente
                hacia esta pantalla, actualizando el estado visual sin recargar la app.
              </Text>
            </View>
          </ScrollView>

          {/* Botones de acción */}
          <View style={styles.footer}>
            {onAdvanceStatus && solicitud.currentStatus !== 'FINALIZADA' && (
              <TouchableOpacity
                style={styles.advanceBtn}
                onPress={() => onAdvanceStatus(solicitud)}
                activeOpacity={0.8}
              >
                <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                <Text style={styles.advanceBtnText}>Simular Avance Remoto de Estado</Text>
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
    maxHeight: '90%',
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
  badgeId: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeIdText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    flex: 1,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    marginBottom: 16,
  },
  statusTextCol: {
    flex: 1,
  },
  statusBannerTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  statusBannerDesc: {
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
    lineHeight: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoItem: {
    width: '48%',
  },
  infoItemFull: {
    width: '100%',
    marginTop: 4,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
  },
  infoValue: {
    fontSize: 12.5,
    color: '#1E293B',
    fontWeight: '500',
  },
  timeline: {
    paddingLeft: 4,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  timelineLeftCol: {
    alignItems: 'center',
    marginRight: 10,
    width: 20,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#CBD5E1',
    marginTop: 2,
  },
  timelineContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timelineHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  timelineStatusName: {
    fontSize: 12,
    fontWeight: '700',
  },
  timelineTimestamp: {
    fontSize: 10,
    color: '#94A3B8',
  },
  timelineMessage: {
    fontSize: 12,
    color: '#334155',
  },
  techNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    gap: 8,
    marginBottom: 16,
  },
  techNoteText: {
    fontSize: 11,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    gap: 8,
  },
  advanceBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  advanceBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  closeActionBtn: {
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
  },
  closeActionText: {
    color: '#475569',
    fontSize: 13,
    fontWeight: '600',
  },
});
