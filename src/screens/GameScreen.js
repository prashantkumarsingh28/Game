import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { generateBoard } from '../game/boardGenerator';
import { BOARD_SIZE } from '../game/gameRules';
import { getRentAmount } from '../game/rentSystem';
import { processDeficitLoan, processOriginLoanRepayment } from '../game/loanSystem';
import { getHouseUpgradeCost } from '../game/houseSystem';
import { PLAYER_CONFIGS, GAME_COLORS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';
import { SoundManager } from '../utils/soundManager';

import Board from '../components/Board';
import Dice from '../components/Dice';
import PlayerPanel from '../components/PlayerPanel';
import PlayerToken from '../components/PlayerToken';
import BuyCityModal from '../components/ActionModals/BuyCityModal';
import MarketModal from '../components/ActionModals/MarketModal';
import TransactionModal from '../components/ActionModals/TransactionModal';

export default function GameScreen({ initialPlayers, timerMinutes = 0, onGameOver }) {
  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [activeSpace, setActiveSpace] = useState(null);
  const [isMuted, setIsMuted] = useState(false);

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
    color: '#3B82F6',
  });

  // Floating Popup Effect
  const [floatingPopup, setFloatingPopup] = useState(null);

  const triggerPopup = (text, sub, color = '#10B981', icon = 'coins') => {
    setFloatingPopup({ text, sub, color, icon });
    setTimeout(() => {
      setFloatingPopup(null);
    }, 2200);
  };

  // Initialize board & background music
  useEffect(() => {
    const newBoard = generateBoard();
    setBoard(newBoard);
    SoundManager.startBackgroundMusic();
    return () => {
      SoundManager.stopBackgroundMusic();
    };
  }, []);

  // Timer Countdown Effect
  useEffect(() => {
    if (timerMinutes <= 0 || secondsLeft <= 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Time is UP -> Trigger Game Over
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

  const safePlayers = Array.isArray(players) && players.length > 0 ? players : initialPlayers || [];
  const currentPlayer = safePlayers[currentPlayerIndex] || safePlayers[0] || {
    id: 1,
    name: 'Player 1',
    color: '#FF3B30',
    cash: 10000,
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

  const notify = (title, message, icon = 'info-circle', color = '#3B82F6') => {
    setTransactionModal({
      visible: true,
      title,
      message,
      icon,
      color,
    });
  };

  const handleToggleMute = () => {
    const muted = SoundManager.toggleMute();
    setIsMuted(muted);
  };

  // Accelerated, smooth step movement handler (80ms interval)
  const handleRollDice = (rolledVal) => {
    if (isMoving || !currentPlayer) return;

    SoundManager.playDiceRoll();
    setDiceValue(rolledVal);
    setIsMoving(true);

    let stepsRemaining = rolledVal;
    let currPos = currentPlayer.position;
    let activePlayerState = { ...currentPlayer };

    const interval = setInterval(() => {
      currPos = (currPos + 1) % BOARD_SIZE;
      const passedOrigin = currPos === 0;

      // Play step tick sound
      SoundManager.playStep();

      if (passedOrigin) {
        SoundManager.playOrigin();
        triggerPopup('+₹1,500', 'ORIGIN BONUS', '#10B981', 'coins');
        const bonusResult = processOriginLoanRepayment(
          activePlayerState.cash,
          activePlayerState.loan,
          1500
        );

        activePlayerState.cash = bonusResult.newCash;
        activePlayerState.loan = bonusResult.newLoan;
        activePlayerState.roundCount += 1;
        activePlayerState.citiesPurchasedThisRound = 0;

        setTimeout(() => {
          if (bonusResult.amountRepaid > 0) {
            notify(
              'ROUND BONUS & LOAN REPAYMENT',
              `Round ${activePlayerState.roundCount} completed! ₹1,500 bonus used toward bank loan.\nRepaid: ${formatCurrency(bonusResult.amountRepaid)}\nRemaining Loan: ${formatCurrency(bonusResult.newLoan)}`,
              'hand-holding-usd',
              '#34C759'
            );
          } else {
            notify(
              'ROUND COMPLETED',
              `Round ${activePlayerState.roundCount} completed! ₹1,500 bonus added to your cash.`,
              'coins',
              '#34C759'
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
        processDestinationSpace(currPos, stepPlayerObj);
      }
    }, 80); // Fast 80ms step speed for maximum smoothness
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
        SoundManager.playOrigin();
        notify(
          'LANDED ON ORIGIN',
          'You landed directly on Origin! Round completed and ₹1,500 bonus collected.',
          'flag-checkered',
          '#34C759'
        );
        break;
      case 'SAFE':
      case 'EMPTY':
      default:
        notify(
          'SAFE POINT',
          'Nothing happens. Take a rest and enjoy safe space!',
          'shield-alt',
          '#C084FC'
        );
        break;
    }
  };

  const handleCitySpace = (space, actingPlayer = currentPlayer) => {
    if (space.ownerId === null) {
      setBuyModalVisible(true);
    } else if (space.ownerId === actingPlayer.id) {
      notify(
        'YOUR CITY',
        `Welcome back to ${space.name}! You own this property.`,
        'building',
        '#007AFF'
      );
    } else {
      const owner = players.find((p) => p.id === space.ownerId);
      const rentAmount = getRentAmount(space.houseLevel);

      const loanResult = processDeficitLoan(
        actingPlayer.cash,
        actingPlayer.loan,
        rentAmount
      );

      SoundManager.playCash();
      triggerPopup(`-${formatCurrency(rentAmount)}`, 'RENT PAID', '#EF4444', 'hand-holding-usd');

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
        SoundManager.playFine();
        notify(
          'RENT PAID (BANK LOAN ISSUED)',
          `${actingPlayer.name} paid ${formatCurrency(rentAmount)} rent to ${owner.name} (Level ${space.houseLevel} house).\n\nInsufficient cash! Bank issued a loan of ${formatCurrency(loanResult.loanTaken)}.`,
          'university',
          '#FF3B30'
        );
      } else {
        notify(
          'RENT PAID',
          `${actingPlayer.name} paid ${formatCurrency(rentAmount)} rent to ${owner.name} for landing on ${space.name}.`,
          'file-invoice-dollar',
          '#FF9500'
        );
      }
    }
  };

  const handleBuyCity = () => {
    if (!activeSpace || !currentPlayer) return;

    SoundManager.playCash();
    triggerPopup(`-${formatCurrency(activeSpace.purchasePrice)}`, `${activeSpace.name} BOUGHT`, '#34C759', 'shopping-cart');

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
      'CITY PURCHASED!',
      `Congratulations! ${currentPlayer.name} purchased ${activeSpace.name} for ${formatCurrency(activeSpace.purchasePrice)}.`,
      'shopping-cart',
      '#34C759'
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
    const cost = getHouseUpgradeCost(selectedCity.houseLevel);
    if (!cost || currentPlayer.cash < cost) return;

    SoundManager.playBuild();
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
      'HOUSE BUILT!',
      `House level on ${selectedCity.name} upgraded to Level ${selectedCity.houseLevel + 1} for ${formatCurrency(cost)}! Rent is now ${formatCurrency(getRentAmount(selectedCity.houseLevel + 1))}.`,
      'home',
      '#FF9500'
    );
  };

  const handleSkipMarket = () => {
    setMarketModalVisible(false);
    nextTurn();
  };

  const handleFineSpace = (space, actingPlayer = currentPlayer) => {
    const fineAmount = space.fineAmount || 1000;
    SoundManager.playFine();
    triggerPopup(`-${formatCurrency(fineAmount)}`, 'FINE PENALTY', '#EF4444', 'gavel');

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
        '#FF3B30'
      );
    } else {
      notify(
        'FINE DEDUCTED',
        `Fine of ${formatCurrency(fineAmount)} has been deducted from ${actingPlayer.name}'s balance.`,
        'gavel',
        '#FF3B30'
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
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.logoRow}>
          <FontAwesome5 name="city" size={16} color="#FF9500" />
          <Text style={styles.headerTitle}>BUSINESS MONOPOLY</Text>
        </View>

        <View style={styles.headerRightRow}>
          {/* Timer Display */}
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
                color={secondsLeft <= 60 ? '#FF3B30' : '#FF9500'}
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

          {/* Sound Toggle */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.iconBtn}
            onPress={handleToggleMute}
          >
            <FontAwesome5
              name={isMuted ? 'volume-mute' : 'volume-up'}
              size={14}
              color={isMuted ? '#94A3B8' : '#34C759'}
            />
          </TouchableOpacity>

          {/* End Game */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.endGameBtn}
            onPress={() => {
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
            <FontAwesome5 name="flag-checkered" size={11} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Board View */}
      <Board
        board={board}
        players={players}
        onSpacePress={(space) => {
          if (space.type === 'CITY') {
            const owner = players.find((p) => p.id === space.ownerId);
            Alert.alert(
              space.name,
              `Price: ${formatCurrency(space.purchasePrice)}\nOwner: ${owner ? owner.name : 'Available'}\nHouse Level: ${space.houseLevel}\nRent: ${formatCurrency(getRentAmount(space.houseLevel))}`
            );
          }
        }}
        centerContent={
          <View style={styles.centerControlContainer}>
            {/* Floating Visual Effect Badge */}
            {floatingPopup && (
              <View style={[styles.floatingBadge, { backgroundColor: floatingPopup.color }]}>
                <FontAwesome5 name={floatingPopup.icon} size={14} color="#FFFFFF" />
                <View style={{ marginLeft: 6 }}>
                  <Text style={styles.floatingBadgeText}>{floatingPopup.text}</Text>
                  <Text style={styles.floatingBadgeSub}>{floatingPopup.sub}</Text>
                </View>
              </View>
            )}

            {/* Current Turn Banner */}
            <View style={[styles.turnBanner, { backgroundColor: playerConfig.color }]}>
              <PlayerToken player={currentPlayer} size={16} />
              <Text style={styles.turnBannerText}>
                {currentPlayer.name}'s Turn
              </Text>
            </View>

            {/* Interactive Dice */}
            <Dice
              value={diceValue}
              disabled={isMoving || buyModalVisible || marketModalVisible || transactionModal.visible}
              onRoll={(val) => {
                SoundManager.unlockAudio();
                handleRollDice(val);
              }}
            />

            <Text style={styles.roundTrackerText}>
              Round {currentPlayer.roundCount} • Purchases: {currentPlayer.citiesPurchasedThisRound}/4
            </Text>
          </View>
        }
      />

      {/* Player Stats Panel */}
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: GAME_COLORS.background,
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
    marginBottom: 4,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: 1,
  },
  headerRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderColor: '#D97706',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    gap: 4,
  },
  lowTimerBadge: {
    borderColor: '#EF4444',
    backgroundColor: '#FEE2E2',
  },
  timerText: {
    color: '#D97706',
    fontSize: 11,
    fontWeight: '900',
  },
  lowTimerText: {
    color: '#EF4444',
  },
  iconBtn: {
    backgroundColor: '#FFFFFF',
    borderColor: '#CBD5E1',
    borderWidth: 1,
    padding: 6,
    borderRadius: 10,
    elevation: 1,
  },
  endGameBtn: {
    backgroundColor: '#FEE2E2',
    borderColor: '#EF4444',
    borderWidth: 1,
    padding: 6,
    borderRadius: 10,
    elevation: 1,
  },
  centerControlContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  turnBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    gap: 6,
    marginBottom: 4,
    elevation: 3,
  },
  turnBannerText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  roundTrackerText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: '800',
    marginTop: 2,
  },
  floatingBadge: {
    position: 'absolute',
    top: -30,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    elevation: 8,
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
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
