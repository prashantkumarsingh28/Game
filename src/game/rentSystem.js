/**
 * Calculates current rent for a city based on its house level.
 * Level 0: ₹500
 * Level 1: ₹1,500
 * Level 2: ₹2,000
 * Level 3: ₹3,000
 */
export const getRentAmount = (houseLevel) => {
  switch (houseLevel) {
    case 1:
      return 1500;
    case 2:
      return 2000;
    case 3:
      return 3000;
    case 0:
    default:
      return 500;
  }
};
