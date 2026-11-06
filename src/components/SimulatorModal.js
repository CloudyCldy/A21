import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_CONFIG } from '../services/mockData';

export default function SimulatorModal({
  visible,
  onClose,
  expoPushToken,
  solicitudes,
  onTriggerNotification,
  onSimulateNoPermissions,
}) {
  const [selectedRequestId, setSelectedRequestId] = useState(solicitudes[0]?.id || 'SOL-1041');
  const [selectedStatus, setSelectedStatus] = useState('EN_PROCESO');
  const [customMsg, setCustomMsg] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [resultLog, setResultLog] = useState(null);

  const handleSend = async () => {
    setIsSending(true);
    setResultLog(null);

    try {
      const result = await onTriggerNotification({
        requestId: selectedRequestId,
        status: selectedStatus,
        customMessage: customMsg.trim() || undefined,
      });

      setResultLog({
        success: true,
        message: '¡Notificación procesada y emitida con éxito!',
        data: result,
      });
    } catch (err) {
      setResultLog({
        success: false,
        message: `Error al emitir notificación: ${err.message}`,
      });
    } finally {
      setIsSending(false);
    }
  };

  const statusList = ['REGISTRADA', 'RECIBIDA', 'EN_PROCESO', 'FINALIZADA'];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconCircle}>
                <Ionicons name="cloud-upload" size={18} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.title}>Simulador de Servicio Remoto</Text>
                <Text style={styles.subtitle}>Emisor de Notificaciones Push (Cloud Gateway)</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={20} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Paso 1: Seleccionar Solicitud */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>1. Selecciona la Solicitud de Servicio:</Text>
              <View style={styles.requestSelector}>
                {solicitudes.map((sol) => (
                  <TouchableOpacity
                    key={sol.id}
                    style={[
                      styles.reqChip,
                      selectedRequestId === sol.id && styles.reqChipSelected,
                    ]}
                    onPress={() => setSelectedRequestId(sol.id)}
                  >
                    <Text
                      style={[
                        styles.reqChipText,
                        selectedRequestId === sol.id && styles.reqChipTextSelected,
                      ]}
                    >
                      {sol.id}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Paso 2: Seleccionar Evento / Estado Requerido */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>2. Evento / Estado a Notificar (Parte 4):</Text>
              <View style={styles.statusButtonsCol}>
                {statusList.map((stKey) => {
                  const cfg = STATUS_CONFIG[stKey];
                  const isSelected = selectedStatus === stKey;

                  return (
                    <TouchableOpacity
                      key={stKey}
                      style={[
                        styles.statusSelectBtn,
                        isSelected && { borderColor: cfg.color, backgroundColor: cfg.bgColor },
                      ]}
                      onPress={() => setSelectedStatus(stKey)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={cfg.icon}
                        size={18}
                        color={isSelected ? cfg.color : '#64748B'}
                      />
                      <View style={{ flex: 1, marginLeft: 8 }}>
                        <Text
                          style={[
                            styles.statusSelectTitle,
                            isSelected && { color: cfg.color, fontWeight: '700' },
                          ]}
                        >
                          {cfg.label}
                        </Text>
                        <Text style={styles.statusSelectDesc} numberOfLines={1}>
                          {cfg.defaultMessage}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && { borderColor: cfg.color, backgroundColor: cfg.color },
                        ]}
                      >
                        {isSelected && <View style={styles.radioInner} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Mensaje Personalizado Opcional */}
            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>3. Mensaje Técnico Adicional (Opcional):</Text>
              <TextInput
                style={styles.input}
                placeholder="Ej: El técnico se encuentra en camino al domicilio..."
                placeholderTextColor="#94A3B8"
                value={customMsg}
                onChangeText={setCustomMsg}
              />
            </View>

            {/* Log / Feedback de Envío */}
            {resultLog && (
              <View
                style={[
                  styles.logCard,
                  resultLog.success ? styles.logSuccess : styles.logError,
                ]}
              >
                <Ionicons
                  name={resultLog.success ? 'checkmark-circle' : 'alert-circle'}
                  size={18}
                  color={resultLog.success ? '#16A34A' : '#DC2626'}
                />
                <Text
                  style={[
                    styles.logText,
                    resultLog.success ? styles.textSuccess : styles.textError,
                  ]}
                >
                  {resultLog.message}
                </Text>
              </View>
            )}

            {/* Prueba especial: Comportamiento sin permisos (Parte 4.5) */}
            <TouchableOpacity
              style={styles.testPermBtn}
              onPress={onSimulateNoPermissions}
              activeOpacity={0.7}
            >
              <Ionicons name="shield-outline" size={16} color="#DC2626" />
              <View style={{ flex: 1, marginLeft: 6 }}>
                <Text style={styles.testPermTitle}>Probar Comportamiento SIN Permisos</Text>
                <Text style={styles.testPermSub}>
                  Comprueba el manejo de errores y estado bloqueado
                </Text>
              </View>
            </TouchableOpacity>

            {/* Token Destino Info */}
            <View style={styles.tokenInfoBox}>
              <Text style={styles.tokenInfoLabel}>Token Destino Actual:</Text>
              <Text style={styles.tokenInfoCode} numberOfLines={1}>
                {expoPushToken || 'No disponible'}
              </Text>
            </View>
          </ScrollView>

          {/* Footer con Botón de Envío */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.sendBtn, isSending && styles.sendBtnDisabled]}
              onPress={handleSend}
              disabled={isSending}
              activeOpacity={0.8}
            >
              {isSending ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <>
                  <Ionicons name="paper-plane" size={16} color="#FFFFFF" />
                  <Text style={styles.sendBtnText}>Enviar Notificación Push Remota</Text>
                </>
              )}
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
  iconCircle: {
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
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  requestSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reqChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  reqChipSelected: {
    backgroundColor: '#0F172A',
    borderColor: '#0F172A',
  },
  reqChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  reqChipTextSelected: {
    color: '#FFFFFF',
  },
  statusButtonsCol: {
    gap: 8,
  },
  statusSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  statusSelectTitle: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusSelectDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 12.5,
    color: '#1E293B',
  },
  logCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
    marginBottom: 14,
  },
  logSuccess: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  logError: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
  },
  logText: {
    fontSize: 12,
    flex: 1,
  },
  textSuccess: {
    color: '#15803D',
  },
  textError: {
    color: '#B91C1C',
  },
  testPermBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#FFF1F2',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FECDD3',
    marginBottom: 14,
  },
  testPermTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#BE123C',
  },
  testPermSub: {
    fontSize: 10.5,
    color: '#881337',
  },
  tokenInfoBox: {
    backgroundColor: '#F8FAFC',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  tokenInfoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  tokenInfoCode: {
    fontFamily: 'monospace',
    fontSize: 10,
    color: '#334155',
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sendBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  sendBtnDisabled: {
    opacity: 0.6,
  },
  sendBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
