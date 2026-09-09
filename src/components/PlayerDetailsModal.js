import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { PLAYER_CONFIGS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import { getRentAmount } from '../game/rentSystem';
import { getHouseUpgradeCost } from '../game/houseSystem';
import PlayerToken from './PlayerToken';

export default function PlayerDetailsModal({
  visible,
  players = [],
  board = [],
  initialSelectedPlayerId = null,
  onClose,
}) {
  const safePlayers = Array.isArray(players) ? players : [];

  const [selectedPlayerId, setSelectedPlayerId] = useState(
    initialSelectedPlayerId || safePlayers[0]?.id || 1
  );

  // Sync selected player if initialSelectedPlayerId changes
  React.useEffect(() => {
    if (initialSelectedPlayerId) {
      setSelectedPlayerId(initialSelectedPlayerId);
    } else if (safePlayers.length > 0 && !safePlayers.some((p) => p.id === selectedPlayerId)) {
      setSelectedPlayerId(safePlayers[0].id);
    }
  }, [initialSelectedPlayerId, safePlayers]);

  // Calculate net worth ranking for each player
  const rankedPlayers = [...safePlayers].map((p) => {
    const ownedIds = p.citiesOwned || [];
    const ownedCitiesList = board.filter(
      (space) => space.type === 'CITY' && (space.ownerId === p.id || ownedIds.includes(space.id))
    );
    const propValue = ownedCitiesList.reduce((acc, c) => {
      const basePrice = c.purchasePrice || 0;
      const houseCost = getHouseUpgradeCost(c.baseRent || 200);
      return acc + basePrice + (c.houseLevel || 0) * houseCost;
    }, 0);
    const nw = p.cash + propValue - (p.loan || 0);
    return { ...p, netWorth: nw, ownedCitiesList };
  }).sort((a, b) => b.netWorth - a.netWorth);

  const activePlayer =
    safePlayers.find((p) => p.id === selectedPlayerId) || safePlayers[0] || {
      id: 1,
      name: 'Player 1',
      cash: 10000,
      loan: 0,
      color: '#EF4444',
      citiesOwned: [],
    };

  const activeRankIndex = rankedPlayers.findIndex((p) => p.id === activePlayer.id);
  const activeRank = activeRankIndex !== -1 ? activeRankIndex + 1 : 1;

  const activePlayerConfig =
    PLAYER_CONFIGS.find((p) => p.id === activePlayer.id) || PLAYER_CONFIGS[0];

  const activePlayerData = rankedPlayers.find((p) => p.id === activePlayer.id) || {
    netWorth: activePlayer.cash,
    ownedCitiesList: [],
  };

  const ownedCities = activePlayerData.ownedCitiesList || [];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Title */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <FontAwesome5 name="building" size={22} color="#F59E0B" />
              <Text style={styles.title}>PLAYER PROPERTY & FINANCIAL PORTFOLIO</Text>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={styles.closeIconBtn} onPress={onClose}>
              <FontAwesome5 name="times" size={18} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Player Selection Tabs */}
          <View style={styles.tabContainer}>
            {safePlayers.map((player) => {
              const isSelected = player.id === activePlayer.id;
              return (
                <TouchableOpacity
                  key={player.id}
                  activeOpacity={0.85}
                  onPress={() => setSelectedPlayerId(player.id)}
                  style={[
                    styles.tabButton,
                    {
                      borderColor: player.color,
                      backgroundColor: isSelected
                        ? player.color
                        : 'rgba(15, 23, 42, 0.85)',
                    },
                  ]}
                >
                  <PlayerToken player={player} size={16} isCurrentTurn={isSelected} />
                  <Text
                    style={[
                      styles.tabText,
                      { color: isSelected ? '#FFFFFF' : '#CBD5E1' },
                    ]}
                    numberOfLines={1}
                  >
                    {player.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Detailed Player Financial Summary Box */}
          <View style={[styles.playerSummaryBox, { borderColor: activePlayerConfig.color }]}>
            <View style={styles.rankBadge}>
              <FontAwesome5 name="crown" size={12} color="#F59E0B" />
              <Text style={styles.rankBadgeText}>RANK #{activeRank}</Text>
            </View>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>LIQUID CASH</Text>
                <Text style={styles.cashText}>{formatCurrency(activePlayer.cash)}</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>BANK LOAN</Text>
                <Text style={[styles.summaryVal, activePlayer.loan > 0 && styles.loanText]}>
                  {activePlayer.loan > 0 ? formatCurrency(activePlayer.loan) : '$0'}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>CITIES OWNED</Text>
                <Text style={styles.summaryVal}>{ownedCities.length} Cities</Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.summaryItem}>
                <Text style={styles.summaryLabel}>TOTAL NET WORTH</Text>
                <Text style={styles.netWorthText}>{formatCurrency(activePlayerData.netWorth)}</Text>
              </View>
            </View>
          </View>

          {/* City Details Breakdown List */}
          <Text style={styles.sectionHeading}>OWNED REAL ESTATE & RENT YIELD BREAKDOWN</Text>

          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.scrollContent}>
            {ownedCities.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="city" size={42} color="rgba(245, 158, 11, 0.35)" />
                <Text style={styles.emptyTitle}>No Real-Estate Properties Owned Yet</Text>
                <Text style={styles.emptySub}>
                  {activePlayer.name} has not acquired any city properties yet. Land on city tiles during turns to purchase real estate and collect rent from rivals!
                </Text>
              </View>
            ) : (
              ownedCities.map((city) => {
                const houseLevel = city.houseLevel || 0;
                const currentRent = getRentAmount(houseLevel, city.baseRent);
                const upgradeCost = getHouseUpgradeCost(city.baseRent);

                return (
                  <View key={city.id} style={styles.cityCard}>
                    {/* City Header Strip */}
                    <View style={styles.cityCardHeader}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                        <View style={[styles.cityColorPill, { backgroundColor: city.color || '#3B82F6' }]} />
                        <Text style={styles.cityName}>{city.name}</Text>
                      </View>

                      {/* House Level Display */}
                      <View style={styles.houseBadge}>
                        {houseLevel === 0 && <Text style={styles.houseText}>Plot Only (0 Houses)</Text>}
                        {houseLevel > 0 && houseLevel < 4 && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                            {Array.from({ length: houseLevel }).map((_, idx) => (
                              <FontAwesome5 key={idx} name="home" size={12} color="#34D399" />
                            ))}
                            <Text style={styles.houseText}>({houseLevel} House{houseLevel === 1 ? '' : 's'})</Text>
                          </View>
                        )}
                        {houseLevel === 4 && (
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <FontAwesome5 name="hotel" size={14} color="#F59E0B" />
                            <Text style={styles.hotelText}>HOTEL UPGRADED</Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Stats Grid for City */}
                    <View style={styles.cityStatsGrid}>
                      <View style={styles.cityStatCol}>
                        <Text style={styles.cityStatLabel}>PURCHASE PRICE</Text>
                        <Text style={styles.cityStatVal}>{formatCurrency(city.purchasePrice)}</Text>
                      </View>

                      <View style={styles.cityStatCol}>
                        <Text style={styles.cityStatLabel}>BASE RENT</Text>
                        <Text style={styles.cityStatVal}>{formatCurrency(city.baseRent)}</Text>
                      </View>

                      <View style={styles.cityStatCol}>
                        <Text style={styles.cityStatLabel}>CURRENT RENT</Text>
                        <Text style={styles.rentVal}>{formatCurrency(currentRent)}</Text>
                      </View>

                      <View style={styles.cityStatCol}>
                        <Text style={styles.cityStatLabel}>NEXT UPGRADE</Text>
                        <Text style={styles.cityStatVal}>
                          {houseLevel >= 4 ? 'MAXED OUT' : formatCurrency(upgradeCost)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })
            )}
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity activeOpacity={0.85} style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>CLOSE PORTFOLIO</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(7, 11, 25, 0.88)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 14,
  },
  card: {
    width: '100%',
    maxWidth: 620,
    maxHeight: '92%',
    backgroundColor: '#0F172A',
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#D97706',
    padding: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.85,
    shadowRadius: 20,
    elevation: 14,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  closeIconBtn: {
    padding: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 8,
  },
  tabText: {
    fontSize: 12.5,
    fontWeight: '900',
  },
  playerSummaryBox: {
    backgroundColor: 'rgba(30, 41, 59, 0.9)',
    borderRadius: 14,
    borderWidth: 2,
    padding: 12,
    marginBottom: 16,
    position: 'relative',
  },
  rankBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#F59E0B',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  rankBadgeText: {
    color: '#FCD34D',
    fontSize: 10,
    fontWeight: '900',
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
  },
  summaryDivider: {
    width: 1,
    height: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  summaryLabel: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#94A3B8',
    marginBottom: 3,
  },
  cashText: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#34D399',
  },
  loanText: {
    color: '#F87171',
  },
  summaryVal: {
    fontSize: 13.5,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  netWorthText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#F59E0B',
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1,
    marginBottom: 10,
  },
  scrollArea: {
    maxHeight: 380,
    marginBottom: 16,
  },
  scrollContent: {
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 36,
    backgroundColor: 'rgba(30, 41, 59, 0.5)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  emptyTitle: {
    color: '#CBD5E1',
    fontSize: 15,
    fontWeight: '900',
    marginTop: 12,
  },
  emptySub: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
  },
  cityCard: {
    backgroundColor: 'rgba(30, 41, 59, 0.95)',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(245, 158, 11, 0.35)',
    padding: 14,
  },
  cityCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cityColorPill: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  cityName: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  houseBadge: {
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  houseText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '800',
  },
  hotelText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '900',
  },
  cityStatsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    borderRadius: 10,
    padding: 10,
  },
  cityStatCol: {
    alignItems: 'center',
  },
  cityStatLabel: {
    fontSize: 8,
    fontWeight: '900',
    color: '#94A3B8',
    marginBottom: 3,
  },
  cityStatVal: {
    fontSize: 12,
    fontWeight: '900',
    color: '#F8FAFC',
  },
  rentVal: {
    fontSize: 12.5,
    fontWeight: '900',
    color: '#F59E0B',
  },
  closeBtn: {
    backgroundColor: '#D97706',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#FCD34D',
    elevation: 6,
  },
  closeBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
});
