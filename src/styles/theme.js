export const PLAYER_CONFIGS = [
  {
    id: 1,
    defaultName: 'Player 1',
    color: '#FF3B30',
    secondaryColor: '#DC2626',
    lightBg: '#FFE5E5',
    icon: 'user-astronaut',
    label: 'Red Token',
  },
  {
    id: 2,
    defaultName: 'Player 2',
    color: '#007AFF',
    secondaryColor: '#2563EB',
    lightBg: '#E5F2FF',
    icon: 'user-ninja',
    label: 'Blue Token',
  },
  {
    id: 3,
    defaultName: 'Player 3',
    color: '#34C759',
    secondaryColor: '#059669',
    lightBg: '#E8F9ED',
    icon: 'user-secret',
    label: 'Green Token',
  },
  {
    id: 4,
    defaultName: 'Player 4',
    color: '#FF9500',
    secondaryColor: '#D97706',
    lightBg: '#FFF4E5',
    icon: 'user-tie',
    label: 'Yellow Token',
  },
];

export const SPACE_TYPES = {
  ORIGIN: {
    type: 'ORIGIN',
    label: 'ORIGIN',
    subtitle: '+₹1,500 Bonus',
    bgColor: '#064E3B',
    accentColor: '#34D399',
    borderColor: '#10B981',
    iconName: 'flag-checkered',
  },
  SAFE: {
    type: 'SAFE',
    label: 'SAFE POINT',
    subtitle: 'Rest & Relax',
    bgColor: '#4C1D95',
    accentColor: '#C084FC',
    borderColor: '#A78BFA',
    iconName: 'shield-alt',
  },
  CITY: {
    type: 'CITY',
    label: 'CITY',
    bgColor: '#1E293B',
    accentColor: '#38BDF8',
    borderColor: '#475569',
    iconName: 'building',
  },
  MARKET: {
    type: 'MARKET',
    label: 'MARKET',
    subtitle: 'Build House',
    bgColor: '#7C2D12',
    accentColor: '#FB923C',
    borderColor: '#F97316',
    iconName: 'store',
  },
  FINE: {
    type: 'FINE',
    label: 'FINE',
    subtitle: 'Pay ₹1,000',
    bgColor: '#7F1D1D',
    accentColor: '#F87171',
    borderColor: '#EF4444',
    iconName: 'gavel',
  },
  EMPTY: {
    type: 'EMPTY',
    label: 'SAFE SPACE',
    subtitle: 'Nothing Happens',
    bgColor: '#334155',
    accentColor: '#CBD5E1',
    borderColor: '#64748B',
    iconName: 'coffee',
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
  cardBg: '#1C2541',
  surfaceBg: '#0F172A',
  boardCenterBg: '#0B132B',
  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  accentGold: '#FF9500',
  accentEmerald: '#34C759',
  accentRed: '#FF3B30',
  borderDark: '#334155',
};
