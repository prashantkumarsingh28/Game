import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SoundManager } from '../../utils/soundManager';

export default function TransactionModal({ visible, title, message, icon, color, onClose }) {
  if (!visible) return null;

  const handleClose = () => {
    SoundManager.playButtonClick();
    if (onClose) onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: color || '#D97706' }]}>
            <FontAwesome5 name={icon || 'info-circle'} size={22} color="#FFFFFF" />
            <Text style={styles.headerTitle}>{title || 'NOTIFICATION'}</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.messageText}>{message}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.button, { backgroundColor: color || '#D97706' }]}
              onPress={handleClose}
            >
              <Text style={styles.buttonText}>CONTINUE</Text>
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
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 330,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D97706',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 10,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  body: {
    padding: 20,
    alignItems: 'center',
  },
  messageText: {
    fontSize: 14,
    color: '#F8FAFC',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    fontWeight: '600',
  },
  button: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
