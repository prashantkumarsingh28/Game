import React from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { formatCurrency } from '../../utils/currency';
import { canBuyCity, getCityBuyError } from '../../game/gameRules';
import { PLAYER_CONFIGS } from '../../styles/theme';
import { SoundManager } from '../../utils/soundManager';

export default function BuyCityModal({ visible, city, player, onBuy, onSkip }) {
  if (!visible || !city || !player) return null;

  const playerConfig =
    PLAYER_CONFIGS.find((p) => p.id === player.id) || PLAYER_CONFIGS[0];
  const isEligible = canBuyCity(player, city);
  const errorMessage = getCityBuyError(player, city);
  const remainingCash = player.cash - city.purchasePrice;

  const handleBuy = () => {
    SoundManager.playButtonClick();
    SoundManager.playPurchase();
    if (onBuy) onBuy();
  };

  const handleSkip = () => {
    SoundManager.playButtonClick();
    if (onSkip) onSkip();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card}>
          {/* Header Banner */}
          <View style={[styles.header, { backgroundColor: playerConfig.color }]}>
            <FontAwesome5 name="building" size={20} color="#FFFFFF" />
            <Text style={styles.headerTitle}>PROPERTY FOR SALE</Text>
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
                    { color: remainingCash >= 0 ? '#34D399' : '#F87171' },
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

            {/* Error / Limit Warning Notice */}
            {!isEligible && errorMessage && (
              <View style={styles.errorContainer}>
                <FontAwesome5 name="exclamation-circle" size={14} color="#F87171" />
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            {/* Tactile Actions */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.skipButton}
                onPress={handleSkip}
              >
                <Text style={styles.skipButtonText}>PASS</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={!isEligible}
                style={[
                  styles.buyButton,
                  !isEligible && styles.disabledBuyButton,
                ]}
                onPress={handleBuy}
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
    backgroundColor: 'rgba(11, 19, 43, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: '#0F172A',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#D97706',
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
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
    letterSpacing: 1.2,
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
    textAlign: 'center',
  },
  infoBox: {
    width: '100%',
    backgroundColor: 'rgba(30, 41, 59, 0.8)',
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
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
    fontWeight: '700',
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
    backgroundColor: 'rgba(127, 29, 29, 0.6)',
    padding: 10,
    borderRadius: 8,
    marginBottom: 14,
    width: '100%',
    gap: 8,
    borderWidth: 1,
    borderColor: '#EF4444',
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
    backgroundColor: '#334155',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#475569',
  },
  skipButtonText: {
    color: '#CBD5E1',
    fontWeight: '800',
    fontSize: 14,
  },
  buyButton: {
    flex: 1.5,
    backgroundColor: '#059669',
    paddingVertical: 12,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#34D399',
  },
  disabledBuyButton: {
    backgroundColor: '#1E293B',
    borderColor: '#334155',
    opacity: 0.6,
  },
  buyButtonText: {
    color: '#FFFFFF',
    fontWeight: '900',
    fontSize: 14,
  },
});
