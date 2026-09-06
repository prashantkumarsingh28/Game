/**
 * Formats a numeric amount to Indian Rupee standard format (e.g., ₹5,000)
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return `₹${Math.round(amount).toLocaleString('en-IN')}`;
};

/**
 * Returns a random integer between min and max inclusive.
 */
export const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Returns a random city purchase price between ₹1,000 and ₹5,000 in steps of 500.
 */
export const getRandomCityPrice = () => {
  const steps = [1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
  const index = getRandomInt(0, steps.length - 1);
  return steps[index];
};
