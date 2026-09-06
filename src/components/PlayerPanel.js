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
                borderColor: isCurrent ? config.color : '#334155',
                borderWidth: isCurrent ? 2 : 1,
                backgroundColor: isCurrent ? '#1E293B' : '#0F172A',
              },
            ]}
          >
            {/* Header: Token & Name */}
            <View style={styles.headerRow}>
              <PlayerToken player={player} size={16} />
              <Text
                style={[
                  styles.playerName,
                  { color: isCurrent ? '#F8FAFC' : '#94A3B8' },
                ]}
                numberOfLines={1}
              >
                {player.name}
              </Text>
            </View>

            {/* Stats Row */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Cash</Text>
                <Text style={styles.cashValue}>
                  {formatCurrency(player.cash)}
                </Text>
              </View>

              {player.loan > 0 && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Loan</Text>
                  <Text style={styles.loanValue}>
                    {formatCurrency(player.loan)}
                  </Text>
                </View>
              )}

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Cities</Text>
                <Text style={styles.statValue}>
                  {(player.citiesOwned || []).length}
                </Text>
              </View>

              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Round</Text>
                <Text style={styles.statValue}>{player.roundCount}</Text>
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#0F172A',
  },
  playerCard: {
    width: '48.5%',
    borderRadius: 8,
    padding: 6,
    marginBottom: 6,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 4,
  },
  playerName: {
    fontSize: 11,
    fontWeight: '800',
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 3,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 7,
    color: '#94A3B8',
    textTransform: 'uppercase',
    fontWeight: '700',
  },
  statValue: {
    fontSize: 10,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  cashValue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#10B981',
  },
  loanValue: {
    fontSize: 10,
    fontWeight: '900',
    color: '#EF4444',
  },
});
