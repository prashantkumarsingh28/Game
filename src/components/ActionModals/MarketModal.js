import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/currency';
import { getHouseUpgradeCost, canUpgradeHouse } from '../../game/houseSystem';
import { getRentAmount } from '../../game/rentSystem';
import { PLAYER_CONFIGS } from '../../styles/theme';
import { SoundManager } from '../../utils/soundManager';

export default function MarketModal({
  visible,
  player,
  ownedCities,
  onBuild,
  onSkip,
}) {
  const [selectedCityId, setSelectedCityId] = useState(null);

  React.useEffect(() => {
    if (!visible) {
      setSelectedCityId(null);
    }
  }, [visible]);

  if (!visible || !player) return null;

  const playerConfig =
    PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];

  const selectedCity = ownedCities.find((c) => c.id === selectedCityId);
  const cost = selectedCity ? getHouseUpgradeCost(selectedCity.houseLevel) : null;
  const canAfford = selectedCity && canUpgradeHouse(player, selectedCity);

  const handleBuild = () => {
    SoundManager.playButtonClick();
    SoundManager.playBuild();
    if (selectedCity && onBuild) onBuild(selectedCity);
  };

  const handleSkip = () => {
    SoundManager.playButtonClick();
    if (onSkip) onSkip();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Banner */}
          <View style={[styles.header, { backgroundColor: '#D97706' }]}>
            <FontAwesome5 name="store" size={20} color="#FFFFFF" />
            <Text style={styles.headerTitle}>REAL ESTATE MARKETPLACE</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.subtitle}>
              Upgrade property houses to increase rent collection
            </Text>

            {ownedCities.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="city" size={32} color="#64748B" />
                <Text style={styles.emptyText}>
                  You do not own any properties yet. Land on city tiles to acquire real estate first!
                </Text>
              </View>
            ) : (
              <ScrollView style={styles.cityList} nestedScrollEnabled>
                {ownedCities.map((city) => {
                  const isSelected = city.id === selectedCityId;
                  const upgradeCost = getHouseUpgradeCost(city.houseLevel);
                  const isMax = city.houseLevel >= 3;
                  const nextRent = !isMax
                    ? getRentAmount(city.houseLevel + 1)
                    : getRentAmount(3);

                  return (
                    <TouchableOpacity
                      key={city.id}
                      activeOpacity={0.8}
                      onPress={() => {
                        SoundManager.playButtonClick();
                        if (!isMax) setSelectedCityId(city.id);
                      }}
                      style={[
                        styles.cityItem,
                        isSelected && styles.selectedCityItem,
                        isMax && styles.maxCityItem,
                      ]}
                    >
                      <View style={styles.cityItemHeader}>
                        <Text style={styles.cityItemName}>{city.name}</Text>
                        <View style={styles.levelBadge}>
                          <Text style={styles.levelText}>
                            Level {city.houseLevel}/3
                          </Text>
                        </View>
                      </View>

                      <View style={styles.cityItemDetails}>
                        <Text style={styles.detailText}>
                          Current Rent: {formatCurrency(getRentAmount(city.houseLevel))}
                        </Text>
                        {!isMax ? (
                          <Text style={styles.upgradeCostText}>
                            Upgrade: {formatCurrency(upgradeCost)} (Rent → {formatCurrency(nextRent)})
                          </Text>
                        ) : (
                          <Text style={styles.maxText}>
                            Max house level reached
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Tactile Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>
                  {ownedCities.length === 0 ? 'CONTINUE' : 'SKIP'}
                </Text>
              </TouchableOpacity>

              {ownedCities.length > 0 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={!selectedCity || !canAfford}
                  style={[
                    styles.buildButton,
                    (!selectedCity || !canAfford) && styles.disabledBuildButton,
                  ]}
                  onPress={handleBuild}
                >
                  <FontAwesome5 name="hammer" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.buildButtonText}>
                    UPGRADE ({cost ? formatCurrency(cost) : 'SELECT'})
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D97706',
    overflow: 'hidden',
    maxHeight: 520,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  body: {
    padding: 16,
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  emptyText: {
    color: '#CBD5E1',
    textAlign: 'center',
    fontSize: 13,
    paddingHorizontal: 16,
  },
  cityList: {
    maxHeight: 270,
    marginBottom: 12,
  },
  cityItem: {
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  selectedCityItem: {
    borderColor: '#F59E0B',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  maxCityItem: {
    opacity: 0.5,
  },
  cityItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cityItemName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '800',
  },
  levelBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  levelText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '800',
  },
  cityItemDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailText: {
    color: '#94A3B8',
    fontSize: 11,
  },
  upgradeCostText: {
    color: '#34D399',
    fontSize: 11,
    fontWeight: '700',
  },
  maxText: {
    color: '#F87171',
    fontSize: 11,
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 4,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },
  buildButton: {
    flex: 2,
    backgroundColor: '#D97706',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBuildButton: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    opacity: 0.6,
  },
  buildButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
});
