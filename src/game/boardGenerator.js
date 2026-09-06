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
 * Generates a fresh randomized rectangular board of 28 perimeter spaces.
 */
export const generateBoard = () => {
  const shuffledCities = shuffleArray(INDIAN_CITIES);
  let cityIndex = 0;

  // Helper to create city space
  const createCitySpace = (id) => {
    const cityInfo = shuffledCities[cityIndex++];
    const price = getRandomCityPrice();
    return {
      id,
      type: SPACE_TYPES.CITY.type,
      name: cityInfo.name,
      cityId: cityInfo.id,
      purchasePrice: price,
      ownerId: null,
      houseLevel: 0,
      baseRent: 500,
    };
  };

  // Build Side 1 (Top Edge - 5 spaces): 4 Cities + 1 Fine
  const side1Types = shuffleArray(['CITY', 'CITY', 'CITY', 'CITY', 'FINE']);
  const side1 = side1Types.map((type, idx) => {
    const id = idx + 1;
    if (type === 'FINE') {
      return { id, type: 'FINE', name: 'Fine', fineAmount: 1000 };
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
      return { id, type: 'FINE', name: 'Fine', fineAmount: 1000 };
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
    { id: 0, type: 'ORIGIN', name: 'ORIGIN', bonusAmount: 1500 }, // Corner 0: Top-Left
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
