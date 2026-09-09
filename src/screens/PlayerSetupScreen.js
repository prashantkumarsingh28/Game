import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ImageBackground,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PLAYER_CONFIGS, TIMER_OPTIONS, GAME_COLORS } from '../styles/theme';
import { SoundManager } from '../utils/soundManager';
import { ASSETS, getAssetSource } from '../assets';

export default function PlayerSetupScreen({ onNext }) {
  const [playerCount, setPlayerCount] = useState(2);
  const [selectedTimer, setSelectedTimer] = useState(15);
  const [playerNames, setPlayerNames] = useState({
    1: 'Player 1',
    2: 'Player 2',
    3: 'Player 3',
    4: 'Player 4',
  });

  const handleNameChange = (id, text) => {
    setPlayerNames((prev) => ({
      ...prev,
      [id]: text,
    }));
  };

  const handleProceed = () => {
    SoundManager.playButtonClick();
    const selectedPlayers = Array.from({ length: playerCount }).map((_, i) => {
      const config = PLAYER_CONFIGS[i];
      return {
        id: config.id,
        name: playerNames[config.id].trim() || config.defaultName,
        color: config.color,
        cash: 0,
        loan: 0,
        position: 0,
        citiesOwned: [],
        citiesPurchasedThisRound: 0,
        roundCount: 1,
        isEliminated: false,
      };
    });

    onNext(selectedPlayers, selectedTimer);
  };

  return (
    <ImageBackground
      source={getAssetSource(ASSETS.images.luxuryGameWallpaper || ASSETS.images.backgroundWallpaper)}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.title}>PLAYER SETUP</Text>
          <Text style={styles.subtitle}>Configure match options and player profiles</Text>

          <View style={styles.formCard}>
            {/* 1. Total Players Selection */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>TOTAL PLAYERS</Text>
              <View style={styles.countSelectorRow}>
                {[2, 3, 4].map((count) => (
                  <TouchableOpacity
                    key={count}
                    activeOpacity={0.8}
                    onPress={() => {
                      SoundManager.playButtonClick();
                      setPlayerCount(count);
                    }}
                    style={[
                      styles.countButton,
                      playerCount === count && styles.selectedCountButton,
                    ]}
                  >
                    <Text
                      style={[
                        styles.countButtonText,
                        playerCount === count && styles.selectedCountText,
                      ]}
                    >
                      {count} Players
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* 2. Match Duration Timer */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>MATCH DURATION TIMER</Text>
              <View style={styles.timerGrid}>
                {TIMER_OPTIONS.map((opt) => {
                  const isSelected = selectedTimer === opt.minutes;
                  return (
                    <TouchableOpacity
                      key={opt.minutes}
                      activeOpacity={0.8}
                      onPress={() => {
                        SoundManager.playButtonClick();
                        setSelectedTimer(opt.minutes);
                      }}
                      style={[
                        styles.timerCard,
                        isSelected && styles.selectedTimerCard,
                      ]}
                    >
                      <FontAwesome5
                        name="clock"
                        size={12}
                        color={isSelected ? '#F59E0B' : '#94A3B8'}
                        style={{ marginBottom: 2 }}
                      />
                      <Text
                        style={[
                          styles.timerText,
                          isSelected && styles.selectedTimerText,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* 3. Player Names */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeader}>PLAYER NAMES</Text>
              <View style={styles.inputsContainer}>
                {Array.from({ length: playerCount }).map((_, i) => {
                  const config = PLAYER_CONFIGS[i];

                  return (
                    <View
                      key={config.id}
                      style={[styles.playerInputRow, { borderColor: config.color }]}
                    >
                      <View
                        style={[styles.colorBadge, { backgroundColor: config.color }]}
                      >
                        <FontAwesome5 name={config.icon} size={14} color="#FFFFFF" />
                      </View>

                      <TextInput
                        style={styles.textInput}
                        value={playerNames[config.id]}
                        onChangeText={(text) => handleNameChange(config.id, text)}
                        placeholder={config.defaultName}
                        placeholderTextColor="#64748B"
                        maxLength={16}
                      />
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Next Action Button */}
            <TouchableOpacity
              activeOpacity={0.85}
              style={styles.nextButton}
              onPress={handleProceed}
            >
              <Text style={styles.nextButtonText}>NEXT: STARTING MONEY</Text>
              <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
    fontSize: 13,
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
  sectionContainer: {
    marginBottom: 20,
    width: '100%',
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1.2,
    marginBottom: 10,
    textAlign: 'center',
  },
  countSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  countButton: {
    flex: 1,
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  selectedCountButton: {
    backgroundColor: '#D97706',
    borderColor: '#FCD34D',
  },
  countButtonText: {
    color: '#CBD5E1',
    fontSize: 13,
    fontWeight: '800',
  },
  selectedCountText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  timerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  timerCard: {
    width: '31%',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  selectedTimerCard: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  timerText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '800',
  },
  selectedTimerText: {
    color: '#F59E0B',
    fontWeight: '900',
  },
  inputsContainer: {
    width: '100%',
    gap: 10,
  },
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  colorBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '700',
  },
  nextButton: {
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
    marginTop: 10,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
