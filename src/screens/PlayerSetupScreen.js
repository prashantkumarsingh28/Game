import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PLAYER_CONFIGS, GAME_COLORS } from '../styles/theme';

export default function PlayerSetupScreen({ onNext }) {
  const [playerCount, setPlayerCount] = useState(2);
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

    onNext(selectedPlayers);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>PLAYER SETUP</Text>
      <Text style={styles.subtitle}>How many players?</Text>

      {/* Player Count Selector (2, 3, 4) */}
      <View style={styles.countSelectorRow}>
        {[2, 3, 4].map((count) => (
          <TouchableOpacity
            key={count}
            activeOpacity={0.8}
            onPress={() => setPlayerCount(count)}
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

      {/* Player Names Input Section */}
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

      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.nextButton}
        onPress={handleProceed}
      >
        <Text style={styles.nextButtonText}>NEXT: STARTING MONEY</Text>
        <FontAwesome5 name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: GAME_COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#94A3B8',
    marginBottom: 24,
  },
  countSelectorRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
    width: '100%',
    maxWidth: 340,
  },
  countButton: {
    flex: 1,
    backgroundColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  selectedCountButton: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  countButtonText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '800',
  },
  selectedCountText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  inputsContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 32,
  },
  playerInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  colorBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '700',
  },
  nextButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
