import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { generateBoard } from '../game/boardGenerator';
import { BOARD_SIZE } from '../game/gameRules';
import { getRentAmount } from '../game/rentSystem';
import { processDeficitLoan, processOriginLoanRepayment } from '../game/loanSystem';
import { getHouseUpgradeCost } from '../game/houseSystem';
import { PLAYER_CONFIGS, GAME_COLORS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import { SoundManager } from '../utils/soundManager';
import { ASSETS } from '../assets';

import Board from '../components/Board';
import Dice from '../components/Dice';
import PlayerPanel from '../components/PlayerPanel';
import PlayerToken from '../components/PlayerToken';
import BuyCityModal from '../components/ActionModals/BuyCityModal';
import MarketModal from '../components/ActionModals/MarketModal';
import TransactionModal from '../components/ActionModals/TransactionModal';

export default function GameScreen({ initialPlayers, timerMinutes = 0, onGameOver }) {
  const safePlayers = Array.isArray(initialPlayers) && initialPlayers.length > 0 ? initialPlayers : [];
  const initialCashAmount = safePlayers[0]?.cash || 10000;

  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [activeSpace, setActiveSpace] = useState(null);
  const [isSfxMuted, setIsSfxMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);

  // Countdown timer state (in seconds)
  const [secondsLeft, setSecondsLeft] = useState(timerMinutes * 60);

  // Modals state
  const [buyModalVisible, setBuyModalVisible] = useState(false);
  const [marketModalVisible, setMarketModalVisible] = useState(false);
  const [transactionModal, setTransactionModal] = useState({
    visible: false,
    title: '',
    message: '',
    icon: 'info-circle',
    color: '#D97706',
  });

  // Floating Popup Effect
  const [floatingPopup, setFloatingPopup] = useState(null);

  const triggerPopup = (text, sub, color = '#10B981', icon = 'coins') => {
    setFloatingPopup({ text, sub, color, icon });
    setTimeout(() => {
      setFloatingPopup(null);
    }, 2200);
  };

  // Initialize board scaled according to selected starting money
  useEffect(() => {
    const newBoard = generateBoard(initialCashAmount);
    setBoard(newBoard);
    SoundManager.startBackgroundMusic();
    return () => {
      SoundManager.stopBackgroundMusic();
    };
  }, [initialCashAmount]);

  // Timer Countdown Effect
  useEffect(() => {
    if (timerMinutes <= 0 || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            SoundManager.playVictory();
            onGameOver(players, board);
          }, 500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timerMinutes, secondsLeft, players, board]);

  const activePlayersList = Array.isArray(players) && players.length > 0 ? players : safePlayers;
  const currentPlayer = activePlayersList[currentPlayerIndex] || activePlayersList[0] || {
    id: 1,
    name: 'Player 1',
    color: '#EF4444',
    cash: initialCashAmount,
    loan: 0,
    position: 0,
    citiesOwned: [],
    citiesPurchasedThisRound: 0,
    roundCount: 1,
  };
  const playerConfig =
    PLAYER_CONFIGS.find((p) => p.id === currentPlayer.id) || PLAYER_CONFIGS[0];

  const nextTurn = () => {
    setActiveSpace(null);
    SoundManager.playTurnChange();
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  const updatePlayer = (playerId, updateFn) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === playerId ? updateFn(p) : p))
    );
  };

  const updateBoardSpace = (spaceId, updateFn) => {
    setBoard((prevBoard) =>
      prevBoard.map((s) => (s.id === spaceId ? updateFn(s) : s))
    );
  };

  const notify = (title, message, icon = 'info-circle', color = '#D97706') => {
    SoundManager.playNotification();
    setTransactionModal({
      visible: true,
      title,
      message,
      icon,
      color,
    });
  };

  const handleToggleSfx = () => {
    const muted = SoundManager.toggleSfx();
    setIsSfxMuted(muted);
  };

  const handleToggleMusic = () => {
    const muted = SoundManager.toggleMusic();
    setIsMusicMuted(muted);
  };

  // Step-by-step movement handler with step tick audio
  const handleRollDice = (rolledVal) => {
    if (isMoving || !currentPlayer) return;

    setDiceValue(rolledVal);
    setIsMoving(true);

    let stepsRemaining = rolledVal;
    let currPos = currentPlayer.position;
    let activePlayerState = { ...currentPlayer };

    const interval = setInterval(() => {
      currPos = (currPos + 1) % BOARD_SIZE;
      const passedOrigin = currPos === 0;

      // Play step audio
      SoundManager.playStep();

      if (passedOrigin) {
        const bonusAmount = 1500 * Math.max(1, Math.round(initialCashAmount / 5000));
        SoundManager.playMoneyReceived();
        triggerPopup(`+${formatCurrency(bonusAmount)}`, 'ORIGIN BONUS', '#34D399', 'coins');
        const bonusResult = processOriginLoanRepayment(
          activePlayerState.cash,
          activePlayerState.loan,
          bonusAmount
        );

        activePlayerState.cash = bonusResult.newCash;
        activePlayerState.loan = bonusResult.newLoan;
        activePlayerState.roundCount += 1;
        activePlayerState.citiesPurchasedThisRound = 0;

        setTimeout(() => {
          if (bonusResult.amountRepaid > 0) {
            notify(
              'ROUND BONUS & LOAN REPAYMENT',
              `Round ${activePlayerState.roundCount} completed! ${formatCurrency(bonusAmount)} bonus used toward bank loan.\nRepaid: ${formatCurrency(bonusResult.amountRepaid)}\nRemaining Loan: ${formatCurrency(bonusResult.newLoan)}`,
              'hand-holding-usd',
              '#10B981'
            );
          } else {
            notify(
              'ROUND COMPLETED',
              `Round ${activePlayerState.roundCount} completed! ${formatCurrency(bonusAmount)} bonus added to your cash.`,
              'coins',
              '#10B981'
            );
          }
        }, 200);
      }

      activePlayerState.position = currPos;
      const stepPlayerObj = { ...activePlayerState };

      updatePlayer(currentPlayer.id, () => stepPlayerObj);

      stepsRemaining--;

      if (stepsRemaining === 0) {
        clearInterval(interval);
        setIsMoving(false);
        SoundManager.playTokenLanding();
        processDestinationSpace(currPos, stepPlayerObj);
      }
    }, 90);
  };

  const processDestinationSpace = (position, actingPlayer = currentPlayer) => {
    const space = board.find((s) => s.id === position);
    if (!space) return;
    setActiveSpace(space);

    switch (space.type) {
      case 'CITY':
        handleCitySpace(space, actingPlayer);
        break;
      case 'MARKET':
        handleMarketSpace();
        break;
      case 'FINE':
        handleFineSpace(space, actingPlayer);
        break;
      case 'ORIGIN':
        const bonusAmount = space.bonusAmount || 1500;
        SoundManager.playMoneyReceived();
        notify(
          'LANDED ON ORIGIN',
          `You landed directly on Origin! Round completed and ${formatCurrency(bonusAmount)} bonus collected.`,
          'flag-checkered',
          '#10B981'
        );
        break;
      case 'SAFE':
      case 'EMPTY':
      default:
        notify(
          'SAFE POINT',
          'Nothing happens. Take a rest and enjoy safe space!',
          'shield-alt',
          '#A855F7'
        );
        break;
    }
  };

  const handleCitySpace = (space, actingPlayer = currentPlayer) => {
    if (space.ownerId === null) {
      setBuyModalVisible(true);
    } else if (space.ownerId === actingPlayer.id) {
      notify(
        'YOUR PROPERTY',
        `Welcome back to ${space.name}! You own this property.`,
        'building',
        '#3B82F6'
      );
    } else {
      const owner = players.find((p) => p.id === space.ownerId);
      const rentAmount = getRentAmount(space.houseLevel, space.baseRent);

      const loanResult = processDeficitLoan(
        actingPlayer.cash,
        actingPlayer.loan,
        rentAmount
      );

      SoundManager.playMoneySpent();
      triggerPopup(`-${formatCurrency(rentAmount)}`, 'RENT PAID', '#F87171', 'hand-holding-usd');

      updatePlayer(actingPlayer.id, (p) => ({
        ...p,
        cash: loanResult.newCash,
        loan: loanResult.newLoan,
      }));

      if (owner) {
        updatePlayer(owner.id, (p) => ({
          ...p,
          cash: p.cash + rentAmount,
        }));
      }

      if (loanResult.loanTaken > 0) {
        notify(
          'RENT PAID (BANK LOAN ISSUED)',
          `${actingPlayer.name} paid ${formatCurrency(rentAmount)} rent to ${owner.name} (Level ${space.houseLevel} house).\n\nInsufficient cash! Bank issued a loan of ${formatCurrency(loanResult.loanTaken)}.`,
          'university',
          '#EF4444'
        );
      } else {
        notify(
          'RENT PAID',
          `${actingPlayer.name} paid ${formatCurrency(rentAmount)} rent to ${owner.name} for landing on ${space.name}.`,
          'file-invoice-dollar',
          '#F59E0B'
        );
      }
    }
  };

  const handleBuyCity = () => {
    if (!activeSpace || !currentPlayer) return;

    SoundManager.playPurchase();
    triggerPopup(`-${formatCurrency(activeSpace.purchasePrice)}`, `${activeSpace.name} BOUGHT`, '#34D399', 'shopping-cart');

    updatePlayer(currentPlayer.id, (p) => ({
      ...p,
      cash: p.cash - activeSpace.purchasePrice,
      citiesOwned: [...p.citiesOwned, activeSpace.id],
      citiesPurchasedThisRound: p.citiesPurchasedThisRound + 1,
    }));

    updateBoardSpace(activeSpace.id, (s) => ({
      ...s,
      ownerId: currentPlayer.id,
    }));

    setBuyModalVisible(false);

    notify(
      'PROPERTY PURCHASED!',
      `Congratulations! ${currentPlayer.name} acquired ${activeSpace.name} for ${formatCurrency(activeSpace.purchasePrice)}.`,
      'shopping-cart',
      '#10B981'
    );
  };

  const handleSkipBuy = () => {
    setBuyModalVisible(false);
    nextTurn();
  };

  const handleMarketSpace = () => {
    setMarketModalVisible(true);
  };

  const handleBuildHouse = (selectedCity) => {
    const cost = getHouseUpgradeCost(selectedCity.houseLevel, initialCashAmount);
    if (!cost || currentPlayer.cash < cost) return;

    SoundManager.playPurchase();
    triggerPopup(`-${formatCurrency(cost)}`, `${selectedCity.name} UPGRADED`, '#F97316', 'home');

    updatePlayer(currentPlayer.id, (p) => ({
      ...p,
      cash: p.cash - cost,
    }));

    updateBoardSpace(selectedCity.id, (s) => ({
      ...s,
      houseLevel: s.houseLevel + 1,
    }));

    setMarketModalVisible(false);

    notify(
      'HOUSE UPGRADED!',
      `House level on ${selectedCity.name} upgraded to Level ${selectedCity.houseLevel + 1} for ${formatCurrency(cost)}! Rent is now ${formatCurrency(getRentAmount(selectedCity.houseLevel + 1, selectedCity.baseRent))}.`,
      'home',
      '#F59E0B'
    );
  };

  const handleSkipMarket = () => {
    setMarketModalVisible(false);
    nextTurn();
  };

  const handleFineSpace = (space, actingPlayer = currentPlayer) => {
    const fineAmount = space.fineAmount || 1000;
    SoundManager.playMoneySpent();
    triggerPopup(`-${formatCurrency(fineAmount)}`, 'FINE PENALTY', '#F87171', 'gavel');

    const loanResult = processDeficitLoan(
      actingPlayer.cash,
      actingPlayer.loan,
      fineAmount
    );

    updatePlayer(actingPlayer.id, (p) => ({
      ...p,
      cash: loanResult.newCash,
      loan: loanResult.newLoan,
    }));

    if (loanResult.loanTaken > 0) {
      notify(
        'FINE PAID (BANK LOAN ISSUED)',
        `Fine of ${formatCurrency(fineAmount)} incurred!\n\nInsufficient cash. Bank issued a loan of ${formatCurrency(loanResult.loanTaken)}.`,
        'gavel',
        '#EF4444'
      );
    } else {
      notify(
        'FINE DEDUCTED',
        `Fine of ${formatCurrency(fineAmount)} has been deducted from ${actingPlayer.name}'s balance.`,
        'gavel',
        '#EF4444'
      );
    }
  };

  const handleCloseTransactionModal = () => {
    setTransactionModal((prev) => ({ ...prev, visible: false }));
    nextTurn();
  };

  const formatTimer = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const ownedCitiesForCurrentPlayer = board.filter(
    (s) => s.type === 'CITY' && s.ownerId === currentPlayer?.id
  );

  return (
    <ImageBackground
      source={ASSETS.images.backgroundWallpaper}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={styles.darkOverlay}>
        <View style={styles.container}>
          {/* Header Bar */}
          <View style={styles.headerBar}>
            <View style={styles.logoRow}>
              <FontAwesome5 name="city" size={15} color="#F59E0B" />
              <Text style={styles.headerTitle}>LUXURY MONOPOLY</Text>
            </View>

            <View style={styles.headerRightRow}>
              {/* Timer Badge */}
              {timerMinutes > 0 && (
                <View
                  style={[
                    styles.timerBadge,
                    secondsLeft <= 60 && styles.lowTimerBadge,
                  ]}
                >
                  <FontAwesome5
                    name="clock"
                    size={11}
                    color={secondsLeft <= 60 ? '#EF4444' : '#F59E0B'}
                  />
                  <Text
                    style={[
                      styles.timerText,
                      secondsLeft <= 60 && styles.lowTimerText,
                    ]}
                  >
                    {formatTimer(secondsLeft)}
                  </Text>
                </View>
              )}

              {/* SFX Toggle Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.iconBtn}
                onPress={handleToggleSfx}
              >
                <FontAwesome5
                  name={isSfxMuted ? 'volume-mute' : 'volume-up'}
                  size={13}
                  color={isSfxMuted ? '#94A3B8' : '#34D399'}
                />
              </TouchableOpacity>

              {/* Music Toggle Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.iconBtn}
                onPress={handleToggleMusic}
              >
                <FontAwesome5
                  name={isMusicMuted ? 'music' : 'play-circle'}
                  size={13}
                  color={isMusicMuted ? '#94A3B8' : '#F59E0B'}
                />
              </TouchableOpacity>

              {/* End Game Button */}
              <TouchableOpacity
                activeOpacity={0.7}
                style={styles.endGameBtn}
                onPress={() => {
                  SoundManager.playButtonClick();
                  Alert.alert(
                    'End Game',
                    'Finish game and calculate winner now?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'End Game',
                        style: 'destructive',
                        onPress: () => {
                          SoundManager.playVictory();
                          onGameOver(players, board);
                        },
                      },
                    ]
                  );
                }}
              >
                <FontAwesome5 name="flag-checkered" size={11} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Main Board Centerpiece - Background wallpaper visible behind board */}
          <Board
            board={board}
            players={players}
            currentPlayerIndex={currentPlayerIndex}
            onSpacePress={(space) => {
              if (space.type === 'CITY') {
                const owner = players.find((p) => p.id === space.ownerId);
                const rent = getRentAmount(space.houseLevel, space.baseRent);
                Alert.alert(
                  space.name,
                  `Price: ${formatCurrency(space.purchasePrice)}\nOwner: ${owner ? owner.name : 'Available'}\nHouse Level: ${space.houseLevel}\nCurrent Rent: ${formatCurrency(rent)}`
                );
              }
            }}
            centerContent={
              <View style={styles.centerControlContainer}>
                {/* Floating Notification Badge */}
                {floatingPopup && (
                  <View style={[styles.floatingBadge, { backgroundColor: floatingPopup.color }]}>
                    <FontAwesome5 name={floatingPopup.icon} size={14} color="#FFFFFF" />
                    <View style={{ marginLeft: 6 }}>
                      <Text style={styles.floatingBadgeText}>{floatingPopup.text}</Text>
                      <Text style={styles.floatingBadgeSub}>{floatingPopup.sub}</Text>
                    </View>
                  </View>
                )}

                {/* Active Turn Banner */}
                <View style={[styles.turnBanner, { backgroundColor: playerConfig.color }]}>
                  <PlayerToken player={currentPlayer} size={16} isCurrentTurn={true} />
                  <Text style={styles.turnBannerText}>
                    {currentPlayer.name}'s Turn
                  </Text>
                </View>

                {/* Interactive Physical Dice */}
                <Dice
                  value={diceValue}
                  disabled={isMoving || buyModalVisible || marketModalVisible || transactionModal.visible}
                  onRoll={(val) => {
                    handleRollDice(val);
                  }}
                />

                <Text style={styles.roundTrackerText}>
                  Round {currentPlayer.roundCount} • Purchases: {currentPlayer.citiesPurchasedThisRound}/4
                </Text>
              </View>
            }
          />

          {/* Player Stats HUD Panel */}
          <PlayerPanel players={players} currentPlayerIndex={currentPlayerIndex} />

          {/* Action Modals */}
          <BuyCityModal
            visible={buyModalVisible}
            city={activeSpace}
            player={currentPlayer}
            onBuy={handleBuyCity}
            onSkip={handleSkipBuy}
          />

          <MarketModal
            visible={marketModalVisible}
            player={currentPlayer}
            ownedCities={ownedCitiesForCurrentPlayer}
            startingMoney={initialCashAmount}
            onBuild={handleBuildHouse}
            onSkip={handleSkipMarket}
          />

          <TransactionModal
            visible={transactionModal.visible}
            title={transactionModal.title}
            message={transactionModal.message}
            icon={transactionModal.icon}
            color={transactionModal.color}
            onClose={handleCloseTransactionModal}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  darkOverlay: {
    flex: 1,
    backgroundColor: 'rgba(11, 19, 43, 0.45)', // Semi-transparent dark overlay allowing wallpaper to shine behind board
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 36,
    paddingBottom: 8,
    paddingHorizontal: 6,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#F59E0B',
    letterSpacing: 1.2,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    borderColor: '#F59E0B',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  lowTimerBadge: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
  },
  timerText: {
    color: '#F59E0B',
    fontSize: 11,
    fontWeight: '900',
  },
  lowTimerText: {
    color: '#EF4444',
  },
  iconBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderWidth: 1,
    padding: 6,
    borderRadius: 10,
    elevation: 2,
  },
  endGameBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.25)',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 6,
    borderRadius: 10,
    elevation: 2,
  },
  centerControlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  turnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 18,
    gap: 6,
    marginBottom: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  turnBannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  roundTrackerText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  floatingBadge: {
    position: 'absolute',
    top: -32,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 10,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  floatingBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  floatingBadgeSub: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    opacity: 0.9,
  },
});
