/**
 * House Upgrade Constants and Dynamic Helpers
 */

export const BASE_HOUSE_UPGRADE_COSTS = {
  0: 3000, // Level 0 -> Level 1
  1: 2000, // Level 1 -> Level 2
  2: 5000, // Level 2 -> Level 3
};

/**
 * Returns cost to upgrade a city from current house level to next level,
 * scaled according to starting money.
 * Returns null if city is already at max level (3).
 */
export const getHouseUpgradeCost = (currentLevel, startingMoney = 5000) => {
  if (currentLevel >= 3) return null;
  const multiplier = Math.max(1, Math.round(startingMoney / 5000));
  const baseCost = BASE_HOUSE_UPGRADE_COSTS[currentLevel] || null;
  return baseCost ? baseCost * multiplier : null;
};

/**
 * Returns whether a player can upgrade a city:
 * 1. Player owns the city.
 * 2. Current house level < 3.
 * 3. Player cash >= upgrade cost.
 */
export const canUpgradeHouse = (player, city, startingMoney = 5000) => {
  if (!city || city.ownerId !== player.id) return false;
  if (city.houseLevel >= 3) return false;
  const cost = getHouseUpgradeCost(city.houseLevel, startingMoney);
  if (!cost) return false;
  return player.cash >= cost;
};
