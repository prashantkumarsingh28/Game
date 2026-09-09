import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { GAME_COLORS } from '../styles/theme';
import { SoundManager } from '../utils/soundManager';
import { ASSETS, getAssetSource } from '../assets';

export default function WelcomeScreen({ onStart }) {
  const handlePressStart = () => {
    SoundManager.unlockAudio();
    SoundManager.startBackgroundMusic();
    SoundManager.playMoneyReceived();
    onStart();
  };

  return (
    <ImageBackground
      source={getAssetSource(ASSETS.images.luxuryGameWallpaper || ASSETS.images.backgroundWallpaper)}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        <View style={styles.container}>
          {/* Central Logo Badge */}
          <View style={styles.badgeContainer}>
            <FontAwesome5 name="city" size={54} color="#F59E0B" />
          </View>

          <Text style={styles.title}>LUXURY</Text>
          <Text style={styles.subtitle}>BUSINESS MONOPOLY</Text>

          <Text style={styles.tagline}>
            Premium Real-Estate & Financial Board Game
          </Text>

          {/* Features Card */}
          <View style={styles.featuresList}>
            <View style={styles.featureItem}>
              <FontAwesome5 name="dice-d6" size={16} color="#F59E0B" />
              <Text style={styles.featureText}>Physical 3D Dice & Smooth Token Stepping</Text>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="building" size={16} color="#34D399" />
              <Text style={styles.featureText}>Buy Cities & Build Luxury Properties</Text>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="piggy-bank" size={16} color="#60A5FA" />
              <Text style={styles.featureText}>Automated Bank Loans & Round Bonuses</Text>
            </View>

            <View style={styles.featureItem}>
              <FontAwesome5 name="users" size={16} color="#C084FC" />
              <Text style={styles.featureText}>2 to 4 Player Pass & Play Multiplayer</Text>
            </View>
          </View>

          {/* Start Action Button */}
          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.startButton}
            onPress={handlePressStart}
          >
            <FontAwesome5 name="play" size={16} color="#FFFFFF" style={{ marginRight: 10 }} />
            <Text style={styles.startButtonText}>START GAME</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 25, 0.55)',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  badgeContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#0F172A',
    borderWidth: 3,
    borderColor: '#D97706',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 3,
  },
  subtitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 2,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 32,
    fontWeight: '600',
  },
  featuresList: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    gap: 14,
    elevation: 6,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    color: '#F8FAFC',
    fontSize: 13,
    fontWeight: '700',
  },
  startButton: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#D97706',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    elevation: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
