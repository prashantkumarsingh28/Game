import { getRentAmount } from './rentSystem';
import { processDeficitLoan, processOriginLoanRepayment } from './loanSystem';
import { getHouseUpgradeCost } from './houseSystem';

export const BOARD_SIZE = 28;
export const MAX_CITIES_PER_ROUND = 4;
export const MIN_REMAINING_CASH_AFTER_PURCHASE = 500;

/**
 * Checks if a player can buy a given city.
 */
export const canBuyCity = (player, city) => {
  if (!player || !city) return false;
  if (city.ownerId !== null) return false;
  if (player.citiesPurchasedThisRound >= MAX_CITIES_PER_ROUND) return false;
  
  // Rule: Player Balance - City Price MUST BE > ₹500
  const remainingCash = player.cash - city.purchasePrice;
  return remainingCash > MIN_REMAINING_CASH_AFTER_PURCHASE;
};

/**
 * Returns a human-friendly error message if city purchase is invalid.
 */
export const getCityBuyError = (player, city) => {
  if (!player || !city) return null;
  if (city.ownerId !== null) return 'This city is already owned.';
  if (player.citiesPurchasedThisRound >= MAX_CITIES_PER_ROUND) {
    return 'City purchase limit reached for this round (Max 4 cities).';
  }
  const remainingCash = player.cash - city.purchasePrice;
  if (remainingCash <= MIN_REMAINING_CASH_AFTER_PURCHASE) {
    return 'You must have more than ₹500 remaining after purchasing a city.';
  }
  return null;
};

/**
 * Determines if player passed or landed on Origin during a move.
 */
export const checkPassedOrigin = (startPosition, steps) => {
  return startPosition + steps >= BOARD_SIZE;
};
