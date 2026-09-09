import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { STARTING_MONEY_OPTIONS, GAME_COLORS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import { SoundManager } from '../utils/soundManager';
import { ASSETS, getAssetSource } from '../assets';
import PlayerToken from '../components/PlayerToken';

export default function StartingMoneyScreen({ players, onStartGame }) {
  const [selectedMoney, setSelectedMoney] = useState(10000);

  const handleLaunch = () => {
    SoundManager.playButtonClick();
    SoundManager.playMoneyReceived();
    const updatedPlayers = players.map((p) => ({
      ...p,
      cash: selectedMoney,
    }));
    onStartGame(updatedPlayers);
  };

  return (
    <ImageBackground
      source={getAssetSource(ASSETS.images.luxuryGameWallpaper || ASSETS.images.backgroundWallpaper)}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>STARTING CASH</Text>
          <Text style={styles.subtitle}>Select starting capital for all players</Text>

          <View style={styles.formCard}>
            {/* Grid of Money Options */}
            <Text style={styles.sectionHeader}>STARTING CAPITAL SELECTION</Text>
            <View style={styles.optionsGrid}>
              {STARTING_MONEY_OPTIONS.map((amount) => {
                const isSelected = selectedMoney === amount;

                return (
                  <TouchableOpacity
                    key={amount}
                    activeOpacity={0.8}
                    onPress={() => {
                      SoundManager.playButtonClick();
                      setSelectedMoney(amount);
                    }}
                    style={[
                      styles.optionCard,
                      isSelected && styles.selectedOptionCard,
                    ]}
                  >
                    <FontAwesome5
                      name="coins"
                      size={20}
                      color={isSelected ? '#F59E0B' : '#94A3B8'}
                      style={{ marginBottom: 6 }}
                    />
                    <Text
                      style={[
                        styles.optionText,
                        isSelected && styles.selectedOptionText,
                      ]}
                    >
                      {formatCurrency(amount)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Players Preview Box */}
            <Text style={styles.sectionHeader}>INITIAL PLAYER BALANCES</Text>
            <View style={styles.previewBox}>
              <View style={styles.playersList}>
                {players.map((p) => (
                  <View key={p.id} style={styles.playerPreviewRow}>
                    <View style={styles.playerLeftRow}>
                      <PlayerToken player={p} size={18} />
                      <Text style={styles.playerPreviewName}>{p.name}</Text>
                    </View>

                    <Text style={styles.playerPreviewCash}>
                      {formatCurrency(selectedMoney)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Launch Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.launchButton}
              onPress={handleLaunch}
            >
              <FontAwesome5 name="gamepad" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.launchButtonText}>LAUNCH BOARD GAME</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 2,
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    marginBottom: 20,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.4)',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 10,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1.2,
    marginBottom: 10,
    textAlign: 'center',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
    marginBottom: 20,
  },
  optionCard: {
    width: '48%',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#334155',
  },
  selectedOptionCard: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  optionText: {
    fontSize: 17,
    fontWeight: '900',
    color: '#CBD5E1',
  },
  selectedOptionText: {
    color: '#F59E0B',
  },
  previewBox: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 24,
  },
  playersList: {
    gap: 8,
  },
  playerPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  playerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playerPreviewName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  playerPreviewCash: {
    fontSize: 14,
    fontWeight: '900',
    color: '#34D399',
  },
  launchButton: {
    width: '100%',
    backgroundColor: '#D97706',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    elevation: 8,
  },
  launchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
