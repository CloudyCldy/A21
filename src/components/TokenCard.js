import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TokenCard({ expoPushToken, permissionStatus, isRealDevice, platform, onSimulateRemoteSend }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!expoPushToken) return;
    try {
      // En entorno Web o React Native estándar
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        navigator.clipboard.writeText(expoPushToken);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconCircle}>
            <Ionicons name="key-outline" size={18} color="#2563EB" />
          </View>
          <View>
            <Text style={styles.cardTitle}>Token de Notificaciones Push</Text>
            <Text style={styles.cardSubtitle}>Identificador único de suscripción al servicio</Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.copyButton, copied && styles.copyButtonActive]}
          onPress={handleCopy}
          activeOpacity={0.7}
        >
          <Ionicons
            name={copied ? 'checkmark-circle' : 'copy-outline'}
            size={14}
            color={copied ? '#16A34A' : '#2563EB'}
          />
          <Text style={[styles.copyButtonText, copied && styles.copyButtonTextActive]}>
            {copied ? 'Copiado' : 'Copiar'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Caja de visualización del Token */}
      <View style={styles.tokenBox}>
        <Text style={styles.tokenText} numberOfLines={2} selectable>
          {expoPushToken || 'Generando token del dispositivo...'}
        </Text>
      </View>

      {/* Metadata y Explicación Técnica (Entregable 5) */}
      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <Ionicons
            name={isRealDevice ? 'phone-portrait-outline' : 'laptop-outline'}
            size={13}
            color="#64748B"
          />
          <Text style={styles.metaText}>
            {isRealDevice ? 'Dispositivo Físico' : `Entorno ${platform || 'Simulado'}`}
          </Text>
        </View>

        <View style={styles.metaItem}>
          <Ionicons name="shield-outline" size={13} color="#64748B" />
          <Text style={styles.metaText}>Canal Seguro TLS 1.3</Text>
        </View>

        {onSimulateRemoteSend && (
          <TouchableOpacity
            style={styles.actionChip}
            onPress={onSimulateRemoteSend}
            activeOpacity={0.7}
          >
            <Ionicons name="paper-plane" size={11} color="#FFFFFF" />
            <Text style={styles.actionChipText}>Despacho Remoto</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 14,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardSubtitle: {
    fontSize: 10.5,
    color: '#64748B',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  copyButtonActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  copyButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },
  copyButtonTextActive: {
    color: '#16A34A',
  },
  tokenBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  tokenText: {
    fontFamily: 'monospace',
    fontSize: 11.5,
    color: '#334155',
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 10.5,
    color: '#64748B',
    fontWeight: '500',
  },
  actionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#2563EB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionChipText: {
    fontSize: 10.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
