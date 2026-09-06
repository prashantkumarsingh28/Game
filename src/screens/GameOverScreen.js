import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../utils/currency';
import { PLAYER_CONFIGS, GAME_COLORS } from '../styles/theme';
import PlayerToken from '../components/PlayerToken';

export default function GameOverScreen({ players = [], board = [], onPlayAgain }) {
  const safePlayers = Array.isArray(players) ? players : [];
  const safeBoard = Array.isArray(board) ? board : [];

  // Calculate net worth for each player
  const playerStats = safePlayers.map((player) => {
    const ownedCityObjects = safeBoard.filter((s) => s && s.ownerId === player.id);
    const citiesValue = ownedCityObjects.reduce(
      (sum, c) => sum + (c.purchasePrice || 0),
      0
    );
    const houseValue = ownedCityObjects.reduce((sum, c) => {
      let cost = 0;
      if (c.houseLevel >= 1) cost += 3000;
      if (c.houseLevel >= 2) cost += 2000;
      if (c.houseLevel >= 3) cost += 5000;
      return sum + cost;
    }, 0);

    const netWorth = (player.cash || 0) + citiesValue + houseValue - (player.loan || 0);

    return {
      ...player,
      citiesCount: ownedCityObjects.length,
      houseCount: ownedCityObjects.reduce((sum, c) => sum + (c.houseLevel || 0), 0),
      netWorth,
    };
  });

  // Sort by net worth descending
  playerStats.sort((a, b) => b.netWorth - a.netWorth);

  const winner = playerStats[0] || {
    id: 1,
    name: 'Player 1',
    netWorth: 0,
    cash: 0,
    loan: 0,
    citiesCount: 0,
    houseCount: 0,
  };
  const winnerConfig =
    PLAYER_CONFIGS.find((p) => p.id === winner.id) || PLAYER_CONFIGS[0];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <FontAwesome5 name="trophy" size={56} color="#F59E0B" style={{ marginBottom: 12 }} />

      <Text style={styles.title}>GAME OVER</Text>
      <Text style={styles.subtitle}>FINAL LEADERBOARD</Text>

      {/* Winner Hero Banner */}
      <View style={[styles.winnerBanner, { borderColor: winnerConfig.color }]}>
        <View style={[styles.crownBadge, { backgroundColor: winnerConfig.color }]}>
          <FontAwesome5 name="crown" size={16} color="#FFFFFF" />
        </View>

        <Text style={styles.winnerLabel}>WINNER</Text>
        <Text style={styles.winnerName}>{winner.name}</Text>
        <Text style={styles.winnerNetWorth}>
          Net Worth: {formatCurrency(winner.netWorth)}
        </Text>
      </View>

      {/* All Players Stats List */}
      <View style={styles.statsContainer}>
        {playerStats.map((player, rank) => {
          const config =
            PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];

          return (
            <View key={player.id} style={styles.playerCard}>
              <View style={styles.rankRow}>
                <Text style={styles.rankText}>#{rank + 1}</Text>
                <PlayerToken player={player} size={20} />
                <Text style={styles.playerName}>{player.name}</Text>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Net Worth</Text>
                  <Text style={styles.netWorthValue}>
                    {formatCurrency(player.netWorth)}
                  </Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Cash</Text>
                  <Text style={styles.statValue}>
                    {formatCurrency(player.cash)}
                  </Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Cities / Houses</Text>
                  <Text style={styles.statValue}>
                    {player.citiesCount} / {player.houseCount}
                  </Text>
                </View>

                <View style={styles.statCol}>
                  <Text style={styles.statLabel}>Loan</Text>
                  <Text style={[styles.statValue, player.loan > 0 && { color: '#EF4444' }]}>
                    {formatCurrency(player.loan)}
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* Play Again Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.playAgainButton}
        onPress={onPlayAgain}
      >
        <FontAwesome5 name="redo" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
        <Text style={styles.playAgainText}>PLAY AGAIN</Text>
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
  },
  subtitle: {
    fontSize: 13,
    color: '#94A3B8',
    letterSpacing: 1,
    marginBottom: 24,
  },
  winnerBanner: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    elevation: 6,
  },
  crownBadge: {
    position: 'absolute',
    top: -16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 2,
    marginTop: 6,
  },
  winnerName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#F8FAFC',
    marginVertical: 4,
  },
  winnerNetWorth: {
    fontSize: 15,
    fontWeight: '800',
    color: '#10B981',
  },
  statsContainer: {
    width: '100%',
    maxWidth: 340,
    gap: 12,
    marginBottom: 32,
  },
  playerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F59E0B',
  },
  playerName: {
    fontSize: 15,
    fontWeight: '800',
    color: '#F8FAFC',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#0F172A',
    borderRadius: 8,
    padding: 8,
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 8,
    color: '#94A3B8',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  statValue: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F8FAFC',
    marginTop: 2,
  },
  netWorthValue: {
    fontSize: 11,
    fontWeight: '900',
    color: '#10B981',
    marginTop: 2,
  },
  playAgainButton: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
  },
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
