import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { STATUS_CONFIG } from '../services/mockData';

export default function NotificationBanner({ notification, onPress, onDismiss }) {
  if (!notification) return null;

  const { title, body, data } = notification;
  const statusCfg = (data && data.status && STATUS_CONFIG[data.status]) || STATUS_CONFIG.REGISTRADA;

  return (
    <Animated.View style={styles.wrapper}>
      <TouchableOpacity
        style={[styles.container, { borderLeftColor: statusCfg.color }]}
        onPress={() => onPress(notification)}
        activeOpacity={0.9}
      >
        <View style={[styles.iconBox, { backgroundColor: statusCfg.bgColor }]}>
          <Ionicons name={statusCfg.icon} size={22} color={statusCfg.color} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.topRow}>
            <Text style={styles.badgeLabel}>NOTIFICACIÓN REMOTA ENTRANTE</Text>
            {data?.requestId && (
              <View style={styles.requestIdBadge}>
                <Text style={styles.requestIdText}>{data.requestId}</Text>
              </View>
            )}
          </View>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          <Text style={styles.body} numberOfLines={2}>{body}</Text>
          <Text style={styles.actionHint}>Toca para abrir la solicitud y ver detalles</Text>
        </View>

        <TouchableOpacity
          style={styles.closeButton}
          onPress={onDismiss}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons name="close" size={18} color="#94A3B8" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 55,
    left: 12,
    right: 12,
    zIndex: 9999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderLeftWidth: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  badgeLabel: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: 0.5,
  },
  requestIdBadge: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  requestIdText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '700',
  },
  title: {
    fontSize: 13.5,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  body: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
  },
  actionHint: {
    fontSize: 10,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 4,
  },
  closeButton: {
    padding: 4,
    marginLeft: 4,
  },
});
