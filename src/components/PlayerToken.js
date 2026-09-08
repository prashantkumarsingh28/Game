import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PLAYER_CONFIGS } from '../styles/theme';

export default function PlayerToken({ player, size = 22, isCurrentTurn = false }) {
  if (!player) return null;
  const config = PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];

  return (
    <View style={styles.outerShadowWrapper}>
      {/* Subtle Shadow beneath the piece */}
      <View
        style={[
          styles.groundShadow,
          {
            width: size * 1.1,
            height: size * 0.35,
            borderRadius: size * 0.2,
          },
        ]}
      />

      {/* Main 3D Token Piece */}
      <View
        style={[
          styles.tokenBody,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: config.color,
            borderColor: '#FCD34D', // Gold outer ring
            borderWidth: isCurrentTurn ? 2.5 : 1.5,
          },
          isCurrentTurn && styles.activeGlow,
        ]}
      >
        {/* Top Glossy Highlight */}
        <View style={[styles.glossHighlight, { width: size * 0.6, height: size * 0.25 }]} />

        {/* Inner Label / Icon */}
        <Text style={[styles.tokenText, { fontSize: size * 0.5 }]}>
          P{player.id}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerShadowWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1.5,
    position: 'relative',
  },
  groundShadow: {
    position: 'absolute',
    bottom: -2,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  tokenBody: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
  },
  activeGlow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
    borderColor: '#FFFFFF',
  },
  glossHighlight: {
    position: 'absolute',
    top: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    borderRadius: 8,
  },
  tokenText: {
    color: '#FFFFFF',
    fontWeight: '900',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});
