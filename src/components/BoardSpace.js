import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { SPACE_TYPES, PLAYER_CONFIGS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import PlayerToken from './PlayerToken';

export default function BoardSpace({ space, playersOnSpace, players, onPress }) {
  const spaceConfig = SPACE_TYPES[space.type] || SPACE_TYPES.EMPTY;
  const owner = space.ownerId
    ? players.find((p) => p.id === space.ownerId)
    : null;
  const ownerConfig = owner
    ? PLAYER_CONFIGS.find((p) => p.id === owner.id)
    : null;

  const renderContent = () => {
    switch (space.type) {
      case 'CITY':
        return (
          <>
            <View style={styles.cityHeader}>
              <FontAwesome5 name="building" size={9} color={spaceConfig.accentColor} />
              <Text style={styles.cityName} numberOfLines={1}>
                {space.name}
              </Text>
            </View>

            {/* House Levels */}
            {space.houseLevel > 0 && (
              <View style={styles.houseRow}>
                {Array.from({ length: space.houseLevel }).map((_, i) => (
                  <FontAwesome5 key={i} name="home" size={8} color="#F59E0B" style={styles.houseIcon} />
                ))}
              </View>
            )}

            {/* Price / Owner Info */}
            <Text style={styles.cityPrice}>
              {owner ? `R:${formatCurrency(space.baseRent * (space.houseLevel > 0 ? (space.houseLevel === 1 ? 3 : space.houseLevel === 2 ? 4 : 6) : 1))}` : formatCurrency(space.purchasePrice)}
            </Text>
          </>
        );

      case 'ORIGIN':
        return (
          <View style={styles.cornerContent}>
            <FontAwesome5 name="flag-checkered" size={12} color="#10B981" />
            <Text style={styles.cornerTitle}>START</Text>
            <Text style={styles.cornerSub}>+₹1.5k</Text>
          </View>
        );

      case 'SAFE':
        return (
          <View style={styles.cornerContent}>
            <FontAwesome5 name="shield-alt" size={12} color="#8B5CF6" />
            <Text style={styles.cornerTitle}>SAFE</Text>
          </View>
        );

      case 'MARKET':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="store" size={11} color="#F97316" />
            <Text style={styles.specialTitle}>MARKET</Text>
          </View>
        );

      case 'FINE':
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="gavel" size={11} color="#EF4444" />
            <Text style={styles.specialTitle}>FINE</Text>
            <Text style={styles.specialSub}>-₹1,000</Text>
          </View>
        );

      case 'EMPTY':
      default:
        return (
          <View style={styles.specialContent}>
            <FontAwesome5 name="coffee" size={10} color="#94A3B8" />
            <Text style={styles.specialTitle}>SAFE</Text>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress && onPress(space)}
      style={[
        styles.container,
        {
          backgroundColor: spaceConfig.bgColor,
          borderColor: ownerConfig ? ownerConfig.color : spaceConfig.borderColor,
          borderWidth: ownerConfig ? 2 : 1,
        },
      ]}
    >
      {/* Owner Badge Indicator */}
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
            <PlayerToken key={p.id} player={p} size={14} />
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
    borderRadius: 4,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 1,
    position: 'relative',
    overflow: 'hidden',
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
    fontSize: 9,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },
  houseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 1,
  },
  houseIcon: {
    marginHorizontal: 1,
  },
  cityPrice: {
    fontSize: 8,
    fontWeight: '700',
    color: '#475569',
    marginTop: 1,
  },
  cornerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerTitle: {
    fontSize: 9,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 1,
  },
  cornerSub: {
    fontSize: 7,
    color: '#ECFDF5',
    fontWeight: '700',
  },
  specialContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  specialTitle: {
    fontSize: 8,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
  },
  specialSub: {
    fontSize: 7,
    color: '#DC2626',
    fontWeight: '700',
  },
  ownerBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    borderBottomLeftRadius: 4,
    paddingHorizontal: 2,
    paddingVertical: 1,
  },
  ownerBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: 'bold',
  },
  tokensContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 1,
  },
});
