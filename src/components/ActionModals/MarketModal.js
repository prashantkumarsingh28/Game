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

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: '#F97316' }]}>
            <FontAwesome5 name="store" size={20} color="#FFFFFF" />
            <Text style={styles.headerTitle}>MARKETPLACE</Text>
          </View>

          <View style={styles.body}>
            <Text style={styles.subtitle}>
              Build or Upgrade a House (Max 1 upgrade per visit)
            </Text>

            {ownedCities.length === 0 ? (
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="city" size={32} color="#64748B" />
                <Text style={styles.emptyText}>
                  You do not own any cities yet. Buy cities first to build houses!
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
                      onPress={() => !isMax && setSelectedCityId(city.id)}
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
                            Maximum level reached
                          </Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.skipButton}
                onPress={onSkip}
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
                  onPress={() => selectedCity && onBuild(selectedCity)}
                >
                  <FontAwesome5 name="hammer" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                  <Text style={styles.buildButtonText}>
                    BUILD HOUSE ({cost ? formatCurrency(cost) : 'SELECT'})
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
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    maxHeight: 520,
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
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
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
    maxHeight: 280,
    marginBottom: 12,
  },
  cityItem: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: '#334155',
  },
  selectedCityItem: {
    borderColor: '#F97316',
    backgroundColor: '#271911',
  },
  maxCityItem: {
    opacity: 0.6,
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
    backgroundColor: '#334155',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
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
    color: '#10B981',
    fontSize: 11,
    fontWeight: '700',
  },
  maxText: {
    color: '#EF4444',
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
    backgroundColor: '#475569',
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
    backgroundColor: '#F97316',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBuildButton: {
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  buildButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 12,
  },
});
