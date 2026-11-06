import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_CONFIG } from '../services/mockData';

const STEPS = ['REGISTRADA', 'RECIBIDA', 'EN_PROCESO', 'FINALIZADA'];

export default function SolicitudesList({ solicitudes, onSelectSolicitud, onQuickAdvanceStatus }) {
  const renderItem = ({ item }) => {
    const statusCfg = STATUS_CONFIG[item.currentStatus] || STATUS_CONFIG.REGISTRADA;
    const currentStepIndex = STEPS.indexOf(item.currentStatus);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => onSelectSolicitud(item)}
        activeOpacity={0.8}
      >
        {/* Cabecera del Item */}
        <View style={styles.cardHeader}>
          <View style={styles.idBadge}>
            <Text style={styles.idText}>{item.id}</Text>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bgColor, borderColor: statusCfg.borderColor }]}>
            <Ionicons name={statusCfg.icon} size={13} color={statusCfg.color} style={{ marginRight: 3 }} />
            <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* Título y Cliente */}
        <Text style={styles.titleText}>{item.title}</Text>
        <Text style={styles.clientText}>
          <Ionicons name="business-outline" size={12} color="#64748B" /> Cliente: {item.client}
        </Text>

        {/* Técnico Asignado */}
        <View style={styles.techRow}>
          <Ionicons name="person-outline" size={12} color="#475569" />
          <Text style={styles.techText}>
            Responsable: <Text style={styles.techBold}>{item.assignedTech}</Text>
          </Text>
        </View>

        {/* Línea de Tiempo Visual de 4 Estados (Requisito Clave) */}
        <View style={styles.stepperContainer}>
          {STEPS.map((stepKey, idx) => {
            const stepCfg = STATUS_CONFIG[stepKey];
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <React.Fragment key={stepKey}>
                <View style={styles.stepNode}>
                  <View
                    style={[
                      styles.circle,
                      isCompleted ? { backgroundColor: stepCfg.color } : styles.circleInactive,
                      isCurrent && styles.circleCurrent,
                    ]}
                  >
                    {isCompleted ? (
                      <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.circleNumber}>{idx + 1}</Text>
                    )}
                  </View>
                  <Text
                    style={[
                      styles.stepLabel,
                      isCurrent ? { color: stepCfg.color, fontWeight: '700' } : isCompleted ? styles.stepLabelPassed : styles.stepLabelInactive,
                    ]}
                    numberOfLines={1}
                  >
                    {stepKey === 'REGISTRADA' ? 'Registrada' : stepKey === 'RECIBIDA' ? 'Recibida' : stepKey === 'EN_PROCESO' ? 'Proceso' : 'Finalizada'}
                  </Text>
                </View>

                {/* Línea conectora entre nodos */}
                {idx < STEPS.length - 1 && (
                  <View
                    style={[
                      styles.connectorLine,
                      idx < currentStepIndex ? { backgroundColor: '#2563EB' } : styles.connectorLineInactive,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        {/* Pie de la tarjeta con acción rápida */}
        <View style={styles.cardFooter}>
          <Text style={styles.footerDate}>
            <Ionicons name="calendar-outline" size={11} color="#94A3B8" /> {item.dateCreated}
          </Text>

          <View style={styles.footerActions}>
            {onQuickAdvanceStatus && item.currentStatus !== 'FINALIZADA' && (
              <TouchableOpacity
                style={styles.advanceButton}
                onPress={() => onQuickAdvanceStatus(item)}
                activeOpacity={0.7}
              >
                <Ionicons name="cloud-upload-outline" size={12} color="#2563EB" />
                <Text style={styles.advanceButtonText}>Avanzar Estado</Text>
              </TouchableOpacity>
            )}

            <View style={styles.viewDetailLink}>
              <Text style={styles.viewDetailText}>Detalles</Text>
              <Ionicons name="chevron-forward" size={14} color="#2563EB" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <View>
          <Text style={styles.sectionTitle}>Solicitudes Activas ({solicitudes.length})</Text>
          <Text style={styles.sectionSubtitle}>
            Recibe actualizaciones automáticas de estado en tiempo real
          </Text>
        </View>
      </View>

      <FlatList
        data={solicitudes}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  idBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  categoryBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    marginLeft: 'auto',
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  clientText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  techRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  techText: {
    fontSize: 12,
    color: '#475569',
  },
  techBold: {
    fontWeight: '600',
    color: '#1E293B',
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F8FAFC',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 12,
  },
  stepNode: {
    alignItems: 'center',
    width: 60,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  circleInactive: {
    backgroundColor: '#E2E8F0',
  },
  circleCurrent: {
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  circleNumber: {
    fontSize: 9.5,
    color: '#94A3B8',
    fontWeight: '700',
  },
  stepLabel: {
    fontSize: 9.5,
    textAlign: 'center',
  },
  stepLabelPassed: {
    color: '#475569',
    fontWeight: '500',
  },
  stepLabelInactive: {
    color: '#94A3B8',
  },
  connectorLine: {
    flex: 1,
    height: 2,
    marginBottom: 16,
  },
  connectorLineInactive: {
    backgroundColor: '#E2E8F0',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    paddingTop: 10,
  },
  footerDate: {
    fontSize: 11,
    color: '#94A3B8',
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  advanceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  advanceButtonText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#2563EB',
  },
  viewDetailLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  viewDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
});
