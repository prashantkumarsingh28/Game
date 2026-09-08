import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PLAYER_CONFIGS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import PlayerToken from './PlayerToken';

export default function PlayerPanel({ players, currentPlayerIndex }) {
  return (
    <View style={styles.container}>
      {players.map((player, index) => {
        const isCurrent = index === currentPlayerIndex;
        const config =
          PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];

        return (
          <View
            key={player.id}
            style={[
              styles.playerCard,
              {
                borderColor: isCurrent ? '#F59E0B' : 'rgba(255, 255, 255, 0.1)',
                borderWidth: isCurrent ? 2 : 1,
                backgroundColor: isCurrent
                  ? 'rgba(30, 41, 59, 0.95)'
                  : 'rgba(15, 23, 42, 0.85)',
              },
              isCurrent && styles.activeCardGlow,
            ]}
          >
            {/* Header: Token, Name & Active Badge */}
            <View style={styles.headerRow}>
              <PlayerToken player={player} size={16} isCurrentTurn={isCurrent} />
              <Text
                style={[
                  styles.playerName,
                  { color: isCurrent ? '#F59E0B' : '#F8FAFC' },
                ]}
                numberOfLines={1}
              >
                {player.name}
              </Text>

              {isCurrent && (
                <View style={styles.activeBadge}>
                  <Text style={styles.activeBadgeText}>TURN</Text>
                </View>
              )}
            </View>

            {/* Financial Stats Grid */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>CASH</Text>
                <Text style={styles.cashValue}>
                  {formatCurrency(player.cash)}
                </Text>
              </View>

              {player.loan > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>LOAN</Text>
                  <Text style={styles.loanValue}>
                    {formatCurrency(player.loan)}
                  </Text>
                </View>
              )}

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>PROPS</Text>
                <Text style={styles.statValue}>
                  {(player.citiesOwned || []).length}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>POS</Text>
                <Text style={styles.statValue}>#{player.position}</Text>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  playerCard: {
    width: '48.8%',
    borderRadius: 10,
    padding: 6,
    marginBottom: 5,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  activeCardGlow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  playerName: {
    fontSize: 11,
    fontWeight: '900',
    flex: 1,
  },
  activeBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  activeBadgeText: {
    color: '#0F172A',
    fontSize: 7,
    fontWeight: '900',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 6.5,
    color: '#94A3B8',
    fontWeight: '800',
  },
  statValue: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  cashValue: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#34D399',
  },
  loanValue: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#F87171',
  },
});
