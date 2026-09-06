import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PLAYER_CONFIGS } from '../styles/theme';

export default function PlayerToken({ player, size = 20 }) {
  if (!player) return null;
  const config = PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];

  return (
    <View
      style={[
        styles.tokenContainer,
        {
          backgroundColor: config.color,
          borderColor: '#FFFFFF',
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text style={[styles.tokenText, { fontSize: size * 0.55 }]}>
        P{player.id}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tokenContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    margin: 1,
  },
  tokenText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});
