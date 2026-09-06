import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/currency';
import { canBuyCity, getCityBuyError } from '../../game/gameRules';
import { PLAYER_CONFIGS } from '../../styles/theme';

export default function BuyCityModal({ visible, city, player, onBuy, onSkip }) {
  if (!visible || !city || !player) return null;

  const playerConfig =
    PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];
  const isEligible = canBuyCity(player, city);
  const errorMessage = getCityBuyError(player, city);
  const remainingCash = player.cash - city.purchasePrice;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: playerConfig.color }]}>
            <FontAwesome5 name="building" size={20} color="#FFFFFF" />
            <Text style={styles.headerTitle}>CITY FOR SALE</Text>
          </View>

          {/* Body */}
          <View style={styles.body}>
            <Text style={styles.cityName}>{city.name}</Text>
            
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Purchase Price:</Text>
                <Text style={styles.priceValue}>{formatCurrency(city.purchasePrice)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Your Cash:</Text>
                <Text style={styles.infoValue}>{formatCurrency(player.cash)}</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Remaining Cash:</Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: remainingCash > 500 ? '#10B981' : '#EF4444' },
                  ]}
                >
                  {formatCurrency(remainingCash)}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Round Purchases:</Text>
                <Text style={styles.infoValue}>
                  {player.citiesPurchasedThisRound}/4
                </Text>
              </View>
            </View>

            {/* Error / Warning Notice */}
            {!isEligible && errorMessage && (
              <View style={styles.errorContainer}>
                <FontAwesome5 name="exclamation-circle" size={14} color="#EF4444" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.skipButton}
                onPress={onSkip}
              >
                <Text style={styles.skipButtonText}>SKIP</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isEligible}
                style={[
                  styles.buyButton,
                  !isEligible && styles.disabledBuyButton,
                ]}
                onPress={onBuy}
              >
                <FontAwesome5 name="shopping-cart" size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
                <Text style={styles.buyButtonText}>BUY CITY</Text>
              </TouchableOpacity>
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
    maxWidth: 340,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
    elevation: 10,
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
    padding: 20,
    alignItems: 'center',
  },
  cityName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  infoLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  infoValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '800',
  },
  priceValue: {
    color: '#F59E0B',
    fontSize: 15,
    fontWeight: '900',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#451A1A',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    width: '100%',
    gap: 8,
  },
  errorText: {
    color: '#F87171',
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    backgroundColor: '#475569',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#CBD5E1',
    fontWeight: '800',
    fontSize: 14,
  },
  buyButton: {
    flex: 1.5,
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledBuyButton: {
    backgroundColor: '#334155',
    opacity: 0.6,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
