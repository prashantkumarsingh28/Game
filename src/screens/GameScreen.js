import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { generateBoard } from '../game/boardGenerator';
import { BOARD_SIZE, checkPassedOrigin } from '../game/gameRules';
import { getRentAmount } from '../game/rentSystem';
import { processDeficitLoan, processOriginLoanRepayment } from '../game/loanSystem';
import { getHouseUpgradeCost } from '../game/houseSystem';
import { PLAYER_CONFIGS, GAME_COLORS } from '../styles/theme';
import { formatCurrency } from '../utils/currency';

import Board from '../components/Board';
import Dice from '../components/Dice';
import PlayerPanel from '../components/PlayerPanel';
import PlayerToken from '../components/PlayerToken';
import BuyCityModal from '../components/ActionModals/BuyCityModal';
import MarketModal from '../components/ActionModals/MarketModal';
import TransactionModal from '../components/ActionModals/TransactionModal';

export default function GameScreen({ initialPlayers, onGameOver }) {
  const [board, setBoard] = useState([]);
  const [players, setPlayers] = useState(initialPlayers);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [diceValue, setDiceValue] = useState(1);
  const [isMoving, setIsMoving] = useState(false);
  const [activeSpace, setActiveSpace] = useState(null);

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

  // Initialize randomized board on game start
  useEffect(() => {
    const newBoard = generateBoard();
    setBoard(newBoard);
  }, []);

  const currentPlayer = players[currentPlayerIndex];
  const playerConfig = currentPlayer
    ? PLAYER_CONFIGS.find((p) => p.id === currentPlayer.id) || PLAYER_CONFIGS[0]
    : PLAYER_CONFIGS[0];

  // Advance to next player turn
  const nextTurn = () => {
    setActiveSpace(null);
    setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
  };

  // Helper to update specific player state
  const updatePlayer = (playerId, updateFn) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((p) => (p.id === playerId ? updateFn(p) : p))
    );
  };

  // Helper to update specific board space
  const updateBoardSpace = (spaceId, updateFn) => {
    setBoard((prevBoard) =>
      prevBoard.map((s) => (s.id === spaceId ? updateFn(s) : s))
    );
  };

  // Show notification modal
  const notify = (title, message, icon = 'info-circle', color = '#3B82F6') => {
    setTransactionModal({
      visible: true,
      title,
      message,
      icon,
      color,
    });
  };

  // Handle step-by-step movement animation
  const handleRollDice = (rolledVal) => {
    if (isMoving || !currentPlayer) return;

    setDiceValue(rolledVal);
    setIsMoving(true);

    let stepsRemaining = rolledVal;
    let currPos = currentPlayer.position;

    const interval = setInterval(() => {
      currPos = (currPos + 1) % BOARD_SIZE;
      const passedOrigin = currPos === 0;

      // Update current player position
      updatePlayer(currentPlayer.id, (p) => {
        let updatedPlayer = { ...p, position: currPos };

        // Handle Origin Crossing Bonus & Loan Repayment
        if (passedOrigin) {
          const bonusResult = processOriginLoanRepayment(
            updatedPlayer.cash,
            updatedPlayer.loan,
            1500
          );

          updatedPlayer.cash = bonusResult.newCash;
          updatedPlayer.loan = bonusResult.newLoan;
          updatedPlayer.roundCount += 1;
          updatedPlayer.citiesPurchasedThisRound = 0; // Reset city buy limit per round

          setTimeout(() => {
            if (bonusResult.amountRepaid > 0) {
              notify(
                'ROUND BONUS & LOAN REPAYMENT',
                `Round ${updatedPlayer.roundCount} completed! ₹1,500 bonus used toward bank loan. Repaid: ${formatCurrency(bonusResult.amountRepaid)}. Remaining Loan: ${formatCurrency(bonusResult.newLoan)}.`,
                'hand-holding-usd',
                '#10B981'
              );
            } else {
              notify(
                'ROUND COMPLETED',
                `Round ${updatedPlayer.roundCount} completed! ₹1,500 bonus added to your cash balance.`,
                'coins',
                '#10B981'
              );
            }
          }, 300);
        }

        return updatedPlayer;
      });

      stepsRemaining--;

      if (stepsRemaining === 0) {
        clearInterval(interval);
        setIsMoving(false);
        // Process final destination box action
        processDestinationSpace(currPos);
      }
    }, 180);
  };

  // Process landed space action
  const processDestinationSpace = (position) => {
    const space = board.find((s) => s.id === position);
    if (!space) return;
    setActiveSpace(space);

    switch (space.type) {
      case 'CITY':
        handleCitySpace(space);
        break;
      case 'MARKET':
        handleMarketSpace();
        break;
      case 'FINE':
        handleFineSpace(space);
        break;
      case 'ORIGIN':
        // Origin landing handled by pass check, notify if not already shown
        notify(
          'LANDED ON ORIGIN',
          'You landed directly on Origin! Round completed and ₹1,500 bonus collected.',
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
          '#8B5CF6'
        );
        break;
    }
  };

  // City space action
  const handleCitySpace = (space) => {
    if (space.ownerId === null) {
      // Unowned city -> trigger Buy Modal
      setBuyModalVisible(true);
    } else if (space.ownerId === currentPlayer.id) {
      // Own city
      notify(
        'YOUR CITY',
        `Welcome back to ${space.name}! You own this property.`,
        'building',
        '#3B82F6'
      );
    } else {
      // Rival city -> Pay Rent
      const owner = players.find((p) => p.id === space.ownerId);
      const rentAmount = getRentAmount(space.houseLevel);

      const loanResult = processDeficitLoan(
        currentPlayer.cash,
        currentPlayer.loan,
        rentAmount
      );

      // Deduct from visitor
      updatePlayer(currentPlayer.id, (p) => ({
        ...p,
        cash: loanResult.newCash,
        loan: loanResult.newLoan,
      }));

      // Credit to owner
      if (owner) {
        updatePlayer(owner.id, (p) => ({
          ...p,
          cash: p.cash + rentAmount,
        }));
      }

      if (loanResult.loanTaken > 0) {
        notify(
          'RENT PAID (BANK LOAN ISSUED)',
          `${currentPlayer.name} paid ${formatCurrency(rentAmount)} rent to ${owner.name} (Level ${space.houseLevel} house).\n\nInsufficient cash! Bank issued a loan of ${formatCurrency(loanResult.loanTaken)}.`,
          'university',
          '#EF4444'
        );
      } else {
        notify(
          'RENT PAID',
          `${currentPlayer.name} paid ${formatCurrency(rentAmount)} rent to ${owner.name} for landing on ${space.name}.`,
          'file-invoice-dollar',
          '#F97316'
        );
      }
    }
  };

  // City Purchase Handler
  const handleBuyCity = () => {
    if (!activeSpace || !currentPlayer) return;

    // Deduct price & add city to player
    updatePlayer(currentPlayer.id, (p) => ({
      ...p,
      cash: p.cash - activeSpace.purchasePrice,
      citiesOwned: [...p.citiesOwned, activeSpace.id],
      citiesPurchasedThisRound: p.citiesPurchasedThisRound + 1,
    }));

    // Update board space owner
    updateBoardSpace(activeSpace.id, (s) => ({
      ...s,
      ownerId: currentPlayer.id,
    }));

    setBuyModalVisible(false);

    notify(
      'CITY PURCHASED!',
      `Congratulations! ${currentPlayer.name} purchased ${activeSpace.name} for ${formatCurrency(activeSpace.purchasePrice)}.`,
      'shopping-cart',
      '#10B981'
    );
  };

  const handleSkipBuy = () => {
    setBuyModalVisible(false);
    nextTurn();
  };

  // Market Space Action
  const handleMarketSpace = () => {
    setMarketModalVisible(true);
  };

  // Build House Handler
  const handleBuildHouse = (selectedCity) => {
    const cost = getHouseUpgradeCost(selectedCity.houseLevel);
    if (!cost || currentPlayer.cash < cost) return;

    // Deduct cost from player
    updatePlayer(currentPlayer.id, (p) => ({
      ...p,
      cash: p.cash - cost,
    }));

    // Upgrade house level on city
    updateBoardSpace(selectedCity.id, (s) => ({
      ...s,
      houseLevel: s.houseLevel + 1,
    }));

    setMarketModalVisible(false);

    notify(
      'HOUSE BUILT!',
      `House level on ${selectedCity.name} upgraded to Level ${selectedCity.houseLevel + 1} for ${formatCurrency(cost)}! Rent is now ${formatCurrency(getRentAmount(selectedCity.houseLevel + 1))}.`,
      'home',
      '#F59E0B'
    );
  };

  const handleSkipMarket = () => {
    setMarketModalVisible(false);
    nextTurn();
  };

  // Fine Space Action
  const handleFineSpace = (space) => {
    const fineAmount = space.fineAmount || 1000;

    const loanResult = processDeficitLoan(
      currentPlayer.cash,
      currentPlayer.loan,
      fineAmount
    );

    updatePlayer(currentPlayer.id, (p) => ({
      ...p,
      cash: loanResult.newCash,
      loan: loanResult.newLoan,
    }));

    if (loanResult.loanTaken > 0) {
      notify(
        'FINE PAID (BANK LOAN ISSUED)',
        `Fine of ${formatCurrency(fineAmount)} incurred!\n\nInsufficient cash balance. Bank issued a loan of ${formatCurrency(loanResult.loanTaken)}.`,
        'gavel',
        '#EF4444'
      );
    } else {
      notify(
        'FINE DEDUCTED',
        `Fine of ${formatCurrency(fineAmount)} has been deducted from ${currentPlayer.name}'s balance.`,
        'gavel',
        '#EF4444'
      );
    }
  };

  const handleCloseTransactionModal = () => {
    setTransactionModal((prev) => ({ ...prev, visible: false }));
    nextTurn();
  };

  const ownedCitiesForCurrentPlayer = board.filter(
    (s) => s.type === 'CITY' && s.ownerId === currentPlayer?.id
  );

  return (
    <View style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <View style={styles.logoRow}>
          <FontAwesome5 name="city" size={16} color="#F59E0B" />
          <Text style={styles.headerTitle}>BUSINESS MONOPOLY</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.endGameBtn}
          onPress={() => {
            Alert.alert(
              'End Game',
              'Are you sure you want to finish the game and see the winner?',
              [
                { text: 'Cancel', style: 'cancel' },
                { text: 'End Game', style: 'destructive', onPress: () => onGameOver(players, board) },
              ]
            );
          }}
        >
          <FontAwesome5 name="flag-checkered" size={12} color="#EF4444" />
          <Text style={styles.endGameText}>END GAME</Text>
        </TouchableOpacity>
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
              onRoll={handleRollDice}
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
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 8,
  },
  headerBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 6,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  endGameBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#331B1B',
    borderColor: '#EF4444',
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  endGameText: {
    color: '#F87171',
    fontSize: 10,
    fontWeight: '800',
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
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
});
