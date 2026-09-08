import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SPACE_TYPES, PLAYER_CONFIGS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import { getRentAmount } from '../game/rentSystem';
import { SoundManager } from '../utils/soundManager';
import PlayerToken from './PlayerToken';

export default function BoardSpace({ space, playersOnSpace, players, onPress, isCurrentTurnPlayerPos }) {
  const spaceConfig = SPACE_TYPES[space.type] || SPACE_TYPES.EMPTY;
  const owner = space.ownerId
    ? players.find((p) => p.id === space.ownerId)
    : null;
  const ownerConfig = owner
    ? PLAYER_CONFIGS.find((p) => p.id === owner.id)
    : null;

  const handlePress = () => {
    SoundManager.playButtonClick();
    if (onPress) onPress(space);
  };

  const renderContent = () => {
    switch (space.type) {
      case 'CITY':
        return (
          <>
            <View style={styles.cityHeader}>
              <FontAwesome5 name="building" size={8} color={spaceConfig.accentColor} />
              <Text style={styles.cityName} numberOfLines={1}>
                {space.name}
              </Text>
            </View>

            {/* House Level Indicators */}
            {space.houseLevel > 0 && (
              <View style={styles.houseRow}>
                {Array.from({ length: space.houseLevel }).map((_, i) => (
                  <FontAwesome5 key={i} name="home" size={7} color="#F59E0B" style={styles.houseIcon} />
                ))}
              </View>
            )}

            {/* Price or Rent Info */}
            <Text style={[styles.cityPrice, ownerConfig && { color: ownerConfig.color }]}>
              {owner
                ? `R:${formatCurrency(getRentAmount(space.houseLevel, space.baseRent))}`
                : formatCurrency(space.purchasePrice)}
            </Text>
          </>
        );

      case 'ORIGIN':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="flag-checkered" size={12} color="#34D399" />
            <Text style={styles.cornerTitle}>START</Text>
            <Text style={styles.cornerSub}>+{formatCurrency(space.bonusAmount || 1500)}</Text>
          </View>
        );

      case 'SAFE':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="shield-alt" size={12} color="#C084FC" />
            <Text style={styles.cornerTitle}>SAFE</Text>
          </View>
        );

      case 'MARKET':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="store" size={11} color="#FB923C" />
            <Text style={styles.specialTitle}>MARKET</Text>
          </View>
        );

      case 'FINE':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="gavel" size={11} color="#F87171" />
            <Text style={styles.specialTitle}>FINE</Text>
            <Text style={styles.specialSub}>-{formatCurrency(space.fineAmount || 1000)}</Text>
          </View>
        );

      case 'EMPTY':
      default:
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="coffee" size={10} color="#94A3B8" />
            <Text style={styles.specialTitle}>REST</Text>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.container,
        {
          backgroundColor: spaceConfig.bgColor,
          borderColor: ownerConfig ? ownerConfig.color : spaceConfig.borderColor,
          borderWidth: ownerConfig ? 2 : 1,
        },
        isCurrentTurnPlayerPos && styles.highlightedTile,
      ]}
    >
      {/* Glossy top bevel reflection */}
      <View style={styles.topReflect} />

      {/* Owner Badge Header */}
      {ownerConfig && (
        <View style={[styles.ownerBadge, { backgroundColor: ownerConfig.color }]}>
          <Text style={styles.ownerBadgeText}>P{owner.id}</Text>
        </View>
      )}

      {/* Main Space Content */}
      <View style={styles.contentWrapper}>{renderContent()}</View>

      {/* Players Tokens Container */}
      {playersOnSpace.length > 0 && (
        <View style={styles.tokensContainer}>
          {playersOnSpace.map((p) => (
            <PlayerToken key={p.id} player={p} size={15} isCurrentTurn={p.isCurrentTurn} />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 0.8,
    borderRadius: 5,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 2,
    elevation: 3,
  },
  topReflect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  highlightedTile: {
    borderColor: '#F59E0B',
    borderWidth: 2,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 6,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  cityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  cityName: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  houseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  houseIcon: {
    marginHorizontal: 0.5,
  },
  cityPrice: {
    fontSize: 7.5,
    fontWeight: '800',
    color: '#CBD5E1',
    marginTop: 0.5,
  },
  specialContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTitle: {
    fontSize: 8.5,
    fontWeight: '900',
    color: '#F8FAFC',
    marginTop: 1,
  },
  cornerSub: {
    fontSize: 7,
    color: '#34D399',
    fontWeight: '800',
  },
  specialTitle: {
    fontSize: 8,
    fontWeight: '900',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  specialSub: {
    fontSize: 7,
    color: '#F87171',
    fontWeight: '800',
  },
  ownerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 2.5,
    paddingVertical: 0.5,
    zIndex: 2,
  },
  ownerBadgeText: {
    color: '#FFFFFF',
    fontSize: 6.5,
    fontWeight: '900',
  },
  tokensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
});
