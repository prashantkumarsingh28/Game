/**
 * House Upgrade Constants and Helpers
 */

export const HOUSE_UPGRADE_COSTS = {
  0: 3000, // Level 0 -> Level 1
  1: 2000, // Level 1 -> Level 2
  2: 5000, // Level 2 -> Level 3
};

/**
 * Returns cost to upgrade a city from current house level to next level.
 * Returns null if city is already at max level (3).
 */
export const getHouseUpgradeCost = (currentLevel) => {
  if (currentLevel >= 3) return null;
  return HOUSE_UPGRADE_COSTS[currentLevel] || null;
};

/**
 * Returns whether a player can upgrade a city:
 * 1. Player owns the city.
 * 2. Current house level < 3.
 * 3. Player cash >= upgrade cost.
 */
export const canUpgradeHouse = (player, city) => {
  if (!city || city.ownerId !== player.id) return false;
  if (city.houseLevel >= 3) return false;
  const cost = getHouseUpgradeCost(city.houseLevel);
  if (!cost) return false;
  return player.cash >= cost;
};
