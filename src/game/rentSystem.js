/**
 * Calculates current rent for a city space based on its house level and base rent.
 * Base Rent is dynamically scaled according to starting money.
 * Level 0: baseRent x 1
 * Level 1: baseRent x 3
 * Level 2: baseRent x 4
 * Level 3: baseRent x 6
 */
export const getRentAmount = (houseLevel, baseRent = 500) => {
  switch (houseLevel) {
    case 1:
      return baseRent * 3;
    case 2:
      return baseRent * 4;
    case 3:
      return baseRent * 6;
    case 0:
    default:
      return baseRent;
  }
};
