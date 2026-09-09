import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PLAYER_CONFIGS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import { SoundManager } from '../utils/soundManager';
import PlayerToken from './PlayerToken';

export default function PlayerPanel({ players, currentPlayerIndex, onOpenDetails }) {
  return (
    <View style={styles.container}>
      {players.map((player, index) => {
        const isCurrent = index === currentPlayerIndex;
        const config =
          PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];
        const ownedCount = (player.citiesOwned || []).length;

        return (
          <TouchableOpacity
            key={player.id}
            activeOpacity={0.85}
            onPress={() => {
              SoundManager.playButtonClick();
              if (onOpenDetails) onOpenDetails(player.id);
            }}
            style={[
              styles.playerCard,
              {
                borderColor: isCurrent ? '#F59E0B' : 'rgba(255, 255, 255, 0.25)',
                borderWidth: isCurrent ? 3 : 1.5,
                backgroundColor: isCurrent
                  ? 'rgba(30, 41, 59, 0.98)'
                  : 'rgba(15, 23, 42, 0.92)',
              },
              isCurrent && styles.activeCardGlow,
            ]}
          >
            {/* Header: Token, Name & Active Turn Badge */}
            <View style={styles.headerRow}>
              <PlayerToken player={player} size={20} isCurrentTurn={isCurrent} />
              <Text
                style={[
                  styles.playerName,
                  { color: isCurrent ? '#F59E0B' : '#F8FAFC' },
                ]}
                numberOfLines={1}
              >
                {player.name}
              </Text>

              {isCurrent ? (
                <View style={styles.activeBadge}>
                  <FontAwesome5 name="crown" size={9} color="#0F172A" style={{ marginRight: 3 }} />
                  <Text style={styles.activeBadgeText}>ACTIVE TURN</Text>
                </View>
              ) : (
                <View style={styles.detailsBadge}>
                  <FontAwesome5 name="chart-pie" size={9} color="#FCD34D" style={{ marginRight: 3 }} />
                  <Text style={styles.detailsBadgeText}>DETAILS</Text>
                </View>
              )}
            </View>

            {/* Financial Stats Grid */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <FontAwesome5 name="coins" size={8} color="#34D399" />
                  <Text style={styles.statLabel}>CASH</Text>
                </View>
                <Text style={styles.cashValue}>
                  {formatCurrency(player.cash)}
                </Text>
              </View>

              {player.loan > 0 && (
                <View style={styles.statItem}>
                  <View style={styles.statLabelRow}>
                    <FontAwesome5 name="university" size={8} color="#F87171" />
                    <Text style={styles.statLabel}>LOAN</Text>
                  </View>
                  <Text style={styles.loanValue}>
                    {formatCurrency(player.loan)}
                  </Text>
                </View>
              )}

              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <FontAwesome5 name="building" size={8} color="#F59E0B" />
                  <Text style={styles.statLabel}>CITIES</Text>
                </View>
                <Text style={styles.propValue}>
                  {ownedCount}
                </Text>
              </View>

              <View style={styles.statItem}>
                <View style={styles.statLabelRow}>
                  <FontAwesome5 name="map-marker-alt" size={8} color="#60A5FA" />
                  <Text style={styles.statLabel}>TILE</Text>
                </View>
                <Text style={styles.statValue}>#{player.position}</Text>
              </View>
            </View>

            {/* Interactive Details Strip */}
            <View style={styles.viewDetailsStrip}>
              <FontAwesome5 name="city" size={10} color="#FCD34D" style={{ marginRight: 6 }} />
              <Text style={styles.viewDetailsStripText}>Full Property & Financial Breakdown ➔</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 10,
    paddingVertical: 4,
  },
  playerCard: {
    width: '100%',
    borderRadius: 14,
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  activeCardGlow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.85,
    shadowRadius: 12,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  playerName: {
    fontSize: 14,
    fontWeight: '900',
    flex: 1,
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  activeBadgeText: {
    color: '#0F172A',
    fontSize: 8.5,
    fontWeight: '900',
  },
  detailsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.25)',
    borderColor: 'rgba(245, 158, 11, 0.6)',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  detailsBadgeText: {
    color: '#FCD34D',
    fontSize: 8.5,
    fontWeight: '900',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 7.5,
    color: '#94A3B8',
    fontWeight: '900',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  propValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F59E0B',
  },
  cashValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#34D399',
  },
  loanValue: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F87171',
  },
  viewDetailsStrip: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.18)',
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.4)',
  },
  viewDetailsStripText: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
