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
                borderColor: isCurrent ? config.color : 'rgba(255, 255, 255, 0.18)',
                borderWidth: isCurrent ? 2.5 : 1.5,
                backgroundColor: isCurrent
                  ? 'rgba(30, 41, 59, 0.98)'
                  : 'rgba(15, 23, 42, 0.92)',
              },
              isCurrent && { shadowColor: config.color },
              isCurrent && styles.activeCardGlow,
            ]}
          >
            {/* Header: Token, Name & Active Turn Badge */}
            <View style={styles.headerRow}>
              <PlayerToken player={player} size={22} isCurrentTurn={isCurrent} />
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
                <View style={[styles.activeBadge, { backgroundColor: config.color }]}>
                  <FontAwesome5 name="crown" size={9} color="#FFFFFF" style={{ marginRight: 4 }} />
                  <Text style={styles.activeBadgeText}>ACTIVE TURN</Text>
                </View>
              ) : (
                <View style={styles.detailsBadge}>
                  <FontAwesome5 name="chart-pie" size={9} color="#FCD34D" style={{ marginRight: 4 }} />
                  <Text style={styles.detailsBadgeText}>DETAILS</Text>
                </View>
              )}
            </View>

            {/* Financial Stats Grid with Equal Aligned Boxes */}
            <View style={styles.statsContainer}>
              {/* Cash Box */}
              <View style={styles.statBox}>
                <View style={styles.statLabelRow}>
                  <FontAwesome5 name="coins" size={9} color="#34D399" />
                  <Text style={styles.statLabel}>CASH</Text>
                </View>
                <Text style={styles.cashValue}>
                  {formatCurrency(player.cash)}
                </Text>
              </View>

              {/* Loan Box (If loan active) */}
              {player.loan > 0 && (
                <View style={[styles.statBox, styles.loanStatBox]}>
                  <View style={styles.statLabelRow}>
                    <FontAwesome5 name="university" size={9} color="#F87171" />
                    <Text style={styles.statLabel}>LOAN</Text>
                  </View>
                  <Text style={styles.loanValue}>
                    {formatCurrency(player.loan)}
                  </Text>
                </View>
              )}

              {/* Cities Box */}
              <View style={styles.statBox}>
                <View style={styles.statLabelRow}>
                  <FontAwesome5 name="building" size={9} color="#F59E0B" />
                  <Text style={styles.statLabel}>CITIES</Text>
                </View>
                <Text style={styles.propValue}>
                  {ownedCount}
                </Text>
              </View>

              {/* Tile Location Box */}
              <View style={styles.statBox}>
                <View style={styles.statLabelRow}>
                  <FontAwesome5 name="map-marker-alt" size={9} color="#60A5FA" />
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
    paddingVertical: 2,
  },
  playerCard: {
    width: '100%',
    borderRadius: 16,
    padding: 12,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  activeCardGlow: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
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
    paddingHorizontal: 8,
    paddingVertical: 3.5,
    borderRadius: 8,
  },
  activeBadgeText: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
  detailsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: 'rgba(245, 158, 11, 0.5)',
    borderWidth: 1,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
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
    gap: 6,
    width: '100%',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  loanStatBox: {
    backgroundColor: 'rgba(127, 29, 29, 0.3)',
    borderColor: 'rgba(239, 68, 68, 0.4)',
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
    fontSize: 11.5,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  propValue: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#F59E0B',
  },
  cashValue: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#34D399',
  },
  loanValue: {
    fontSize: 11.5,
    fontWeight: '900',
    color: '#F87171',
  },
  viewDetailsStrip: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.16)',
    borderRadius: 8,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.35)',
  },
  viewDetailsStripText: {
    color: '#FCD34D',
    fontSize: 9.5,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
