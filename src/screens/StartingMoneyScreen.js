import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { STARTING_MONEY_OPTIONS, GAME_COLORS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import PlayerToken from '../components/PlayerToken';

export default function StartingMoneyScreen({ players, onStartGame }) {
  const [selectedMoney, setSelectedMoney] = useState(10000);

  const handleLaunch = () => {
    const updatedPlayers = players.map((p) => ({
      ...p,
      cash: selectedMoney,
    }));
    onStartGame(updatedPlayers);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STARTING CASH</Text>
      <Text style={styles.subtitle}>Select starting money for all players</Text>

      {/* Grid of Money Options */}
      <View style={styles.optionsGrid}>
        {STARTING_MONEY_OPTIONS.map((amount) => {
          const isSelected = selectedMoney === amount;

          return (
            <TouchableOpacity
              key={amount}
              activeOpacity={0.8}
              onPress={() => setSelectedMoney(amount)}
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
      <View style={styles.previewBox}>
        <Text style={styles.previewTitle}>INITIAL BALANCES</Text>

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
        activeOpacity={0.8}
        style={styles.launchButton}
        onPress={handleLaunch}
      >
        <FontAwesome5 name="gamepad" size={18} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.launchButtonText}>LAUNCH BOARD GAME</Text>
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
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 2,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: '#475569',
    marginBottom: 28,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 28,
  },
  optionCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#CBD5E1',
  },
  selectedOptionCard: {
    borderColor: '#D97706',
    backgroundColor: '#FEF3C7',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#334155',
  },
  selectedOptionText: {
    color: '#D97706',
  },
  previewBox: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    marginBottom: 32,
    elevation: 2,
  },
  previewTitle: {
    fontSize: 11,
    fontWeight: '900',
    color: '#475569',
    letterSpacing: 1,
    marginBottom: 12,
  },
  playersList: {
    gap: 10,
  },
  playerPreviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  playerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  playerPreviewName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0F172A',
  },
  playerPreviewCash: {
    fontSize: 14,
    fontWeight: '900',
    color: '#059669',
  },
  launchButton: {
    width: '100%',
    maxWidth: 340,
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
  launchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
