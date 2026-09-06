import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { GAME_COLORS } from '../styles/theme';

export default function WelcomeScreen({ onStart }) {
  return (
    <View style={styles.container}>
      {/* Background Decor */}
      <View style={styles.badgeContainer}>
        <FontAwesome5 name="city" size={56} color="#F59E0B" />
      </View>

      <Text style={styles.title}>BUSINESS</Text>
      <Text style={styles.subtitle}>MONOPOLY</Text>

      <Text style={styles.tagline}>
        Indian Cities Board Game for 2 to 4 Players
      </Text>

      <View style={styles.featuresList}>
        <View style={styles.featureItem}>
          <FontAwesome5 name="dice" size={16} color="#10B981" />
          <Text style={styles.featureText}>Animated Dice & Token Movement</Text>
        </View>

        <View style={styles.featureItem}>
          <FontAwesome5 name="building" size={16} color="#3B82F6" />
          <Text style={styles.featureText}>Buy Cities & Upgrade Houses</Text>
        </View>

        <View style={styles.featureItem}>
          <FontAwesome5 name="piggy-bank" size={16} color="#F59E0B" />
          <Text style={styles.featureText}>Bank Loans & Origin Round Bonuses</Text>
        </View>

        <View style={styles.featureItem}>
          <FontAwesome5 name="users" size={16} color="#EC4899" />
          <Text style={styles.featureText}>Local Same-Device Multiplayer</Text>
        </View>
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.startButton}
        onPress={onStart}
      >
        <FontAwesome5 name="play" size={16} color="#FFFFFF" style={{ marginRight: 10 }} />
        <Text style={styles.startButtonText}>START GAME</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  badgeContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#FFFFFF',
    borderWidth: 3,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 36,
    fontWeight: '900',
    color: '#D97706',
    letterSpacing: 4,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    marginBottom: 32,
  },
  featuresList: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    marginBottom: 36,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 12,
    elevation: 2,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
  },
  startButton: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
