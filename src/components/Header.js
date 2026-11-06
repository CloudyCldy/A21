import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Header({
  permissionStatus,
  notificationCount = 0,
  onOpenNotifications,
  onOpenSimulator,
  onRefreshPermissions,
}) {
  const isGranted = permissionStatus === 'granted';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.titleContainer}>
          <View style={styles.logoBadge}>
            <Ionicons name="notifications-circle" size={28} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.appTitle}>AutoTrack Servicios</Text>
            <Text style={styles.appSubtitle}>Sistema de Notificaciones Push Remotas</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          {/* Botón Bandeja de Notificaciones con Badge */}
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onOpenNotifications}
            accessibilityLabel="Bandeja de Notificaciones"
          >
            <Ionicons name="notifications-outline" size={22} color="#1E293B" />
            {notificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Botón de Pruebas / Simulador */}
          <TouchableOpacity
            style={[styles.iconButton, styles.simButton]}
            onPress={onOpenSimulator}
            accessibilityLabel="Panel de Pruebas"
          >
            <Ionicons name="flask-outline" size={20} color="#2563EB" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra de Estado de Permisos y Conexión */}
      <View style={styles.statusBarRow}>
        <TouchableOpacity
          style={[styles.statusPill, isGranted ? styles.pillGranted : styles.pillDenied]}
          onPress={onRefreshPermissions}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isGranted ? 'shield-checkmark' : 'alert-circle'}
            size={14}
            color={isGranted ? '#16A34A' : '#DC2626'}
          />
          <Text style={[styles.statusPillText, isGranted ? styles.textGranted : styles.textDenied]}>
            Permisos: {isGranted ? 'Concedidos (Activo)' : 'Requeridos (Toca para activar)'}
          </Text>
        </TouchableOpacity>

        <View style={styles.remoteIndicator}>
          <View style={[styles.ledDot, isGranted ? styles.ledGreen : styles.ledYellow]} />
          <Text style={styles.remoteIndicatorText}>Expo Push Gateway</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  appSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
    marginTop: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  simButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  badge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  statusBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 4,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 6,
  },
  pillGranted: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  pillDenied: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '600',
  },
  textGranted: {
    color: '#15803D',
  },
  textDenied: {
    color: '#B91C1C',
  },
  remoteIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  ledDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  ledGreen: {
    backgroundColor: '#22C55E',
  },
  ledYellow: {
    backgroundColor: '#EAB308',
  },
  remoteIndicatorText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#64748B',
  },
});
