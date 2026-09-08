import { INDIAN_CITIES } from '../data/citiesData';
import { getRandomCityPrice } from '../utils/currency';
import { SPACE_TYPES } from '../styles/theme';

/**
 * Shuffles an array in place using Fisher-Yates algorithm.
 */
const shuffleArray = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Generates a randomized board scaled dynamically according to starting money.
 * Base starting money is ₹5,000 (multiplier = 1).
 * e.g., ₹10,000 -> multiplier = 2 (Prices, Rent, Fines, Bonus scaled x2).
 */
export const generateBoard = (startingMoney = 5000) => {
  const multiplier = Math.max(1, Math.round(startingMoney / 5000));
  const shuffledCities = shuffleArray(INDIAN_CITIES);
  let cityIndex = 0;

  // Helper to create city space
  const createCitySpace = (id) => {
    const cityInfo = shuffledCities[cityIndex++] || {
      id: `city_${id}`,
      name: `City ${id}`,
    };
    const price = getRandomCityPrice() * multiplier;
    const baseRent = Math.round(price * 0.2); // Rent proportional to purchase price

    return {
      id,
      type: SPACE_TYPES.CITY.type,
      name: cityInfo.name,
      cityId: cityInfo.id,
      purchasePrice: price,
      ownerId: null,
      houseLevel: 0,
      baseRent: baseRent,
    };
  };

  const fineAmount = 1000 * multiplier;
  const originBonus = 1500 * multiplier;

  // Build Side 1 (Top Edge - 5 spaces): 4 Cities + 1 Fine
  const side1Types = shuffleArray(['CITY', 'CITY', 'CITY', 'CITY', 'FINE']);
  const side1 = side1Types.map((type, idx) => {
    const id = idx + 1;
    if (type === 'FINE') {
      return { id, type: 'FINE', name: 'Fine', fineAmount };
    }
    return createCitySpace(id);
  });

  // Build Side 2 (Right Edge - 7 spaces): 5 Cities + 1 Market + 1 Empty
  const side2Types = shuffleArray([
    'CITY',
    'CITY',
    'CITY',
    'CITY',
    'CITY',
    'MARKET',
    'EMPTY',
  ]);
  const side2 = side2Types.map((type, idx) => {
    const id = idx + 7;
    if (type === 'MARKET') {
      return { id, type: 'MARKET', name: 'Market' };
    }
    if (type === 'EMPTY') {
      return { id, type: 'EMPTY', name: 'Safe Space' };
    }
    return createCitySpace(id);
  });

  // Build Side 3 (Bottom Edge - 5 spaces): 4 Cities + 1 Fine
  const side3Types = shuffleArray(['CITY', 'CITY', 'CITY', 'CITY', 'FINE']);
  const side3 = side3Types.map((type, idx) => {
    const id = idx + 15;
    if (type === 'FINE') {
      return { id, type: 'FINE', name: 'Fine', fineAmount };
    }
    return createCitySpace(id);
  });

  // Build Side 4 (Left Edge - 7 spaces): 5 Cities + 1 Market + 1 Empty
  const side4Types = shuffleArray([
    'CITY',
    'CITY',
    'CITY',
    'CITY',
    'CITY',
    'MARKET',
    'EMPTY',
  ]);
  const side4 = side4Types.map((type, idx) => {
    const id = idx + 21;
    if (type === 'MARKET') {
      return { id, type: 'MARKET', name: 'Market' };
    }
    if (type === 'EMPTY') {
      return { id, type: 'EMPTY', name: 'Safe Space' };
    }
    return createCitySpace(id);
  });

  // Assemble perimeter in order (Indices 0..27)
  const board = [
    { id: 0, type: 'ORIGIN', name: 'ORIGIN', bonusAmount: originBonus }, // Corner 0: Top-Left
    ...side1, // Indices 1..5
    { id: 6, type: 'SAFE', name: 'SAFE 1' }, // Corner 1: Top-Right
    ...side2, // Indices 7..13
    { id: 14, type: 'SAFE', name: 'SAFE 2' }, // Corner 2: Bottom-Right
    ...side3, // Indices 15..19
    { id: 20, type: 'SAFE', name: 'SAFE 3' }, // Corner 3: Bottom-Left
    ...side4, // Indices 21..27
  ];

  return board;
};
