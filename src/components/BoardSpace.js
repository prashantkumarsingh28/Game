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
  const ownerPlayer = space.ownerId !== null && space.ownerId !== undefined
    ? (players || []).find((p) => p.id === space.ownerId)
    : null;
  const ownerConfig = ownerPlayer
    ? PLAYER_CONFIGS.find((p) => p.id === ownerPlayer.id)
    : null;

  const handlePress = () => {
    SoundManager.playButtonClick();
    if (onPress) onPress(space);
  };

  const renderContent = () => {
    switch (space.type) {
      case 'CITY':
        const tileColor = space.color || spaceConfig.accentColor || '#3B82F6';
        return (
          <View style={styles.cityContentWrapper}>
            {/* Top Vibrant City Color Bar */}
            <View style={[styles.cityColorBar, { backgroundColor: tileColor }]} />

            <View style={styles.cityHeader}>
              <Text style={styles.cityName} numberOfLines={1}>
                {space.name}
              </Text>
            </View>

            {/* Owner Tag Badge (If owned) */}
            {ownerConfig ? (
              <View style={[styles.ownerBadge, { backgroundColor: ownerConfig.color }]}>
                <Text style={styles.ownerBadgeText}>P{ownerPlayer.id}</Text>
              </View>
            ) : null}

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
            <View style={styles.iconCircleEmerald}>
              <FontAwesome5 name="flag-checkered" size={13} color="#34D399" />
            </View>
            <Text style={styles.cornerTitle}>START</Text>
            <Text style={styles.cornerSub}>+{formatCurrency(space.bonusAmount || 1500)}</Text>
          </View>
        );

      case 'SAFE':
        return (
          <View style={styles.specialContent}>
            <View style={styles.iconCirclePurple}>
              <FontAwesome5 name="shield-alt" size={13} color="#C084FC" />
            </View>
            <Text style={styles.cornerTitle}>SAFE</Text>
          </View>
        );

      case 'MARKET':
        return (
          <View style={styles.specialContent}>
            <View style={styles.iconCircleOrange}>
              <FontAwesome5 name="store" size={12} color="#FB923C" />
            </View>
            <Text style={styles.specialTitle}>MARKET</Text>
          </View>
        );

      case 'FINE':
        return (
          <View style={styles.specialContent}>
            <View style={styles.iconCircleRed}>
              <FontAwesome5 name="gavel" size={12} color="#F87171" />
            </View>
            <Text style={styles.specialTitle}>FINE</Text>
            <Text style={styles.specialSub}>-{formatCurrency(space.fineAmount || 1000)}</Text>
          </View>
        );

      case 'EMPTY':
      default:
        return (
          <View style={styles.specialContent}>
            <View style={styles.iconCircleCyan}>
              <FontAwesome5 name="coffee" size={11} color="#2DD4BF" />
            </View>
            <Text style={styles.specialTitle}>REST</Text>
          </View>
        );
    }
  };

  const getTileBgStyle = () => {
    switch (space.type) {
      case 'ORIGIN':
        return { backgroundColor: 'rgba(6, 78, 59, 0.95)', borderColor: '#10B981' };
      case 'SAFE':
        return { backgroundColor: 'rgba(88, 28, 135, 0.95)', borderColor: '#A855F7' };
      case 'MARKET':
        return { backgroundColor: 'rgba(124, 45, 18, 0.95)', borderColor: '#F97316' };
      case 'FINE':
        return { backgroundColor: 'rgba(127, 29, 29, 0.95)', borderColor: '#EF4444' };
      case 'EMPTY':
        return { backgroundColor: 'rgba(19, 78, 74, 0.92)', borderColor: '#0D9488' };
      case 'CITY':
      default:
        return {
          backgroundColor: 'rgba(15, 23, 42, 0.94)',
          borderColor: ownerConfig ? ownerConfig.color : space.color || 'rgba(245, 158, 11, 0.35)',
        };
    }
  };

  const tileBgStyle = getTileBgStyle();

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={handlePress}
      style={[
        styles.container,
        tileBgStyle,
        ownerConfig && { borderWidth: 1.8, borderColor: ownerConfig.color },
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
    margin: 1,
    borderRadius: 7,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 1,
    paddingHorizontal: 1,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 3,
    elevation: 4,
    borderWidth: 1.2,
  },
  highlightedTile: {
    borderColor: '#F59E0B',
    borderWidth: 2.5,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.95,
    shadowRadius: 10,
    elevation: 10,
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
    height: 5,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  cityHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 1,
    marginTop: 1,
  },
  cityName: {
    fontSize: 9.5,
    fontWeight: '900',
    color: '#F8FAFC',
    textAlign: 'center',
    letterSpacing: 0.2,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  ownerBadge: {
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: 1,
  },
  ownerBadgeText: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '900',
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
  iconCircleEmerald: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(52, 211, 153, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCirclePurple: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(192, 132, 252, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleOrange: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(251, 146, 60, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleRed: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(248, 113, 113, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconCircleCyan: {
    width: 19,
    height: 19,
    borderRadius: 9.5,
    backgroundColor: 'rgba(45, 212, 191, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
    fontSize: 8.5,
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
