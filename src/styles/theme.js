export const PLAYER_CONFIGS = [
  {
    id: 1,
    defaultName: 'Player 1',
    color: '#EF4444', // Imperial Red
    secondaryColor: '#991B1B',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    lightBg: '#FEE2E2',
    icon: 'user-astronaut',
    label: 'Red Token',
    accentGrad: ['#EF4444', '#B91C1C'],
  },
  {
    id: 2,
    defaultName: 'Player 2',
    color: '#3B82F6', // Royal Blue
    secondaryColor: '#1E40AF',
    glowColor: 'rgba(59, 130, 246, 0.4)',
    lightBg: '#DBEAFE',
    icon: 'user-ninja',
    label: 'Blue Token',
    accentGrad: ['#3B82F6', '#1D4ED8'],
  },
  {
    id: 3,
    defaultName: 'Player 3',
    color: '#10B981', // Emerald Green
    secondaryColor: '#065F46',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    lightBg: '#D1FAE5',
    icon: 'user-secret',
    label: 'Green Token',
    accentGrad: ['#10B981', '#047857'],
  },
  {
    id: 4,
    defaultName: 'Player 4',
    color: '#F59E0B', // Luxury Gold
    secondaryColor: '#92400E',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    lightBg: '#FEF3C7',
    icon: 'user-tie',
    label: 'Gold Token',
    accentGrad: ['#F59E0B', '#B45309'],
  },
];

export const SPACE_TYPES = {
  ORIGIN: {
    type: 'ORIGIN',
    label: 'START / ORIGIN',
    subtitle: '+₹1,500 Bonus',
    bgColor: 'rgba(6, 78, 59, 0.95)',
    accentColor: '#34D399',
    borderColor: '#10B981',
    textColor: '#FFFFFF',
    iconName: 'flag-checkered',
    goldAccent: '#F59E0B',
  },
  SAFE: {
    type: 'SAFE',
    label: 'SAFE POINT',
    subtitle: 'Rest Area',
    bgColor: 'rgba(88, 28, 135, 0.95)',
    accentColor: '#C084FC',
    borderColor: '#A855F7',
    textColor: '#FFFFFF',
    iconName: 'shield-alt',
    goldAccent: '#FCD34D',
  },
  CITY: {
    type: 'CITY',
    label: 'CITY',
    bgColor: 'rgba(15, 23, 42, 0.92)',
    accentColor: '#38BDF8',
    borderColor: 'rgba(203, 213, 225, 0.25)',
    textColor: '#F8FAFC',
    iconName: 'building',
    goldAccent: '#F59E0B',
  },
  MARKET: {
    type: 'MARKET',
    label: 'REAL ESTATE MARKET',
    subtitle: 'Build Property',
    bgColor: 'rgba(124, 45, 18, 0.95)',
    accentColor: '#FB923C',
    borderColor: '#F97316',
    textColor: '#FFF7ED',
    iconName: 'store',
    goldAccent: '#F59E0B',
  },
  FINE: {
    type: 'FINE',
    label: 'TAX / FINE',
    subtitle: 'Pay ₹1,000',
    bgColor: 'rgba(127, 29, 29, 0.95)',
    accentColor: '#F87171',
    borderColor: '#EF4444',
    textColor: '#FEF2F2',
    iconName: 'gavel',
    goldAccent: '#F59E0B',
  },
  EMPTY: {
    type: 'EMPTY',
    label: 'SAFE SPACE',
    subtitle: 'No Event',
    bgColor: 'rgba(30, 41, 59, 0.92)',
    accentColor: '#94A3B8',
    borderColor: '#475569',
    textColor: '#CBD5E1',
    iconName: 'coffee',
    goldAccent: '#F59E0B',
  },
};

export const STARTING_MONEY_OPTIONS = [5000, 10000, 15000, 20000];

export const TIMER_OPTIONS = [
  { label: 'No Limit', minutes: 0 },
  { label: '5 Mins', minutes: 5 },
  { label: '10 Mins', minutes: 10 },
  { label: '15 Mins', minutes: 15 },
  { label: '20 Mins', minutes: 20 },
  { label: '30 Mins', minutes: 30 },
];

export const GAME_COLORS = {
  background: '#0B132B',
  darkOverlay: 'rgba(11, 19, 43, 0.85)',
  cardBg: 'rgba(15, 23, 42, 0.95)',
  surfaceBg: 'rgba(30, 41, 59, 0.9)',
  boardCenterBg: 'rgba(15, 23, 42, 0.96)',
  boardBorder: '#D97706',
  boardOuterFrame: '#1E293B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
  accentGold: '#F59E0B',
  accentGoldLight: '#FCD34D',
  accentEmerald: '#10B981',
  accentRed: '#EF4444',
  borderGold: '#D97706',
  borderDark: '#334155',
  glassBorder: 'rgba(245, 158, 11, 0.3)',
};

export const SHADOWS = {
  goldGlow: {
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  card: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  tabletopBoard: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.7,
    shadowRadius: 16,
    elevation: 12,
  },
};
