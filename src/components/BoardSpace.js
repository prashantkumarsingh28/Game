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

  const handlePress = () => {
    SoundManager.playButtonClick();
    if (onPress) onPress(space);
  };

  const renderContent = () => {
    switch (space.type) {
      case 'CITY':
        return (
          <View style={styles.cityContentWrapper}>
            {/* Top City Color Banner */}
            <View style={[styles.cityColorBar, { backgroundColor: space.color || spaceConfig.accentColor || '#3B82F6' }]} />

            <View style={styles.cityHeader}>
              <Text style={styles.cityName} numberOfLines={1}>
                {space.name}
              </Text>
            </View>

            {/* House Level Indicators */}
            {space.houseLevel > 0 && (
              <View style={styles.houseRow}>
                {Array.from({ length: space.houseLevel }).map((_, i) => (
                  <FontAwesome5 key={i} name="home" size={8} color="#F59E0B" style={styles.houseIcon} />
                ))}
              </View>
            )}

            {/* Clean Price Info */}
            <Text style={styles.cityPrice}>
              {formatCurrency(space.purchasePrice)}
            </Text>
          </View>
        );

      case 'ORIGIN':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="flag-checkered" size={16} color="#34D399" />
            <Text style={styles.cornerTitle}>START</Text>
            <Text style={styles.cornerSub}>+{formatCurrency(space.bonusAmount || 1500)}</Text>
          </View>
        );

      case 'SAFE':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="shield-alt" size={16} color="#C084FC" />
            <Text style={styles.cornerTitle}>SAFE</Text>
          </View>
        );

      case 'MARKET':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="store" size={15} color="#FB923C" />
            <Text style={styles.specialTitle}>MARKET</Text>
          </View>
        );

      case 'FINE':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="gavel" size={15} color="#F87171" />
            <Text style={styles.specialTitle}>FINE</Text>
            <Text style={styles.specialSub}>-{formatCurrency(space.fineAmount || 1000)}</Text>
          </View>
        );

      case 'EMPTY':
      default:
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="coffee" size={14} color="#94A3B8" />
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
          backgroundColor: 'rgba(15, 23, 42, 0.92)',
          borderColor: spaceConfig.borderColor,
          borderWidth: 1,
        },
        isCurrentTurnPlayerPos && styles.highlightedTile,
      ]}
    >
      {/* Main Space Content */}
      <View style={styles.contentWrapper}>{renderContent()}</View>

      {/* Players Tokens Container (When player lands on space) */}
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
    borderRadius: 6,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 4,
  },
  highlightedTile: {
    borderColor: '#F59E0B',
    borderWidth: 2.5,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 8,
  },
  contentWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    flex: 1,
  },
  cityContentWrapper: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    paddingBottom: 2,
  },
  cityColorBar: {
    width: '100%',
    height: 4,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  cityHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginTop: 1,
  },
  cityName: {
    fontSize: 10,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
    fontSize: 8.5,
    fontWeight: '900',
    color: '#34D399',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  specialContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
  },
  cornerTitle: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  cornerSub: {
    fontSize: 7.5,
    color: '#34D399',
    fontWeight: '900',
  },
  specialTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 2,
  },
  specialSub: {
    fontSize: 7.5,
    color: '#F87171',
    fontWeight: '900',
  },
  tokensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
    gap: 2,
  },
});
