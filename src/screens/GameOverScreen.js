import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../utils/currency';
import { PLAYER_CONFIGS, GAME_COLORS } from '../styles/theme';
import { SoundManager } from '../utils/soundManager';
import { ASSETS, getAssetSource } from '../assets';
import PlayerToken from '../components/PlayerToken';

export default function GameOverScreen({ players = [], board = [], onPlayAgain }) {
  useEffect(() => {
    SoundManager.playVictory();
  }, []);

  const safePlayers = Array.isArray(players) ? players : [];
  const safeBoard = Array.isArray(board) ? board : [];

  // Calculate net worth for each player
  const playerStats = safePlayers.map((player) => {
    const ownedCityObjects = safeBoard.filter((s) => s && (s.ownerId === player.id || (player.citiesOwned || []).includes(s.id)));
    const citiesValue = ownedCityObjects.reduce(
      (sum, c) => sum + (c.purchasePrice || 0),
      0
    );
    const houseValue = ownedCityObjects.reduce((sum, c) => {
      let cost = 0;
      if (c.houseLevel >= 1) cost += 1500;
      if (c.houseLevel >= 2) cost += 1500;
      if (c.houseLevel >= 3) cost += 1500;
      if (c.houseLevel >= 4) cost += 2000;
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

  const handlePlayAgain = () => {
    SoundManager.playButtonClick();
    if (onPlayAgain) onPlayAgain();
  };

  return (
    <ImageBackground
      source={getAssetSource(ASSETS.images.luxuryGameWallpaper || ASSETS.images.backgroundWallpaper)}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        <ScrollView contentContainerStyle={styles.container}>
          <FontAwesome5 name="trophy" size={56} color="#F59E0B" style={styles.trophyIcon} />

          <Text style={styles.title}>GAME OVER</Text>
          <Text style={styles.subtitle}>FINAL LEADERBOARD</Text>

          {/* Winner Hero Banner */}
          <View style={[styles.winnerBanner, { borderColor: winnerConfig.color }]}>
            <View style={[styles.crownBadge, { backgroundColor: winnerConfig.color }]}>
              <FontAwesome5 name="crown" size={16} color="#FFFFFF" />
            </View>

            <Text style={styles.winnerLabel}>VICTORIOUS TYCOON</Text>
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
                      <Text style={[styles.statValue, player.loan > 0 && { color: '#F87171' }]}>
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
            activeOpacity={0.85}
            style={styles.playAgainButton}
            onPress={handlePlayAgain}
          >
            <FontAwesome5 name="redo" size={16} color="#FFFFFF" style={{ marginRight: 8 }} />
            <Text style={styles.playAgainText}>PLAY AGAIN</Text>
          </TouchableOpacity>
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
    padding: 24,
  },
  trophyIcon: {
    marginBottom: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 13,
    color: '#F59E0B',
    letterSpacing: 1.2,
    marginBottom: 24,
    fontWeight: '800',
  },
  winnerBanner: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(15, 23, 42, 0.95)',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    alignItems: 'center',
    marginBottom: 24,
    position: 'relative',
    elevation: 8,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  crownBadge: {
    position: 'absolute',
    top: -16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
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
    color: '#34D399',
  },
  statsContainer: {
    width: '100%',
    maxWidth: 420,
    gap: 12,
    marginBottom: 32,
  },
  playerCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1.5,
    borderColor: '#334155',
    elevation: 4,
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
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  statCol: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 7.5,
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
    color: '#34D399',
    marginTop: 2,
  },
  playAgainButton: {
    width: '100%',
    maxWidth: 420,
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
  playAgainText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
