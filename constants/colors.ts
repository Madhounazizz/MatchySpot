export const colors = {
  // Primary brand colors - Modern coral/salmon
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#E55555',
  primaryGradient: ['#FF6B6B', '#FF8E8E'],
  
  // Accent colors - Soft peach
  accent: '#FFF0F0',
  accentDark: '#FFE0E0',
  accentBorder: '#FFD0D0',
  
  // Secondary colors - Deep blue
  secondary: '#4ECDC4',
  secondaryLight: '#7ED7D1',
  secondaryDark: '#3BA99F',
  secondaryGradient: ['#4ECDC4', '#7ED7D1'],
  
  // Text colors - Enhanced hierarchy
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textLight: '#6B7280',
  textExtraLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Background colors - Layered system
  background: '#FFFFFF',
  backgroundSecondary: '#FAFAFA',
  backgroundTertiary: '#F5F5F5',
  backgroundOverlay: 'rgba(0, 0, 0, 0.6)',
  backgroundOverlayLight: 'rgba(0, 0, 0, 0.3)',
  
  // Surface colors
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfacePressed: '#F8F9FA',
  
  // Status colors - Modern palette
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',
  
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',
  
  // Neutral colors
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  
  // Border colors
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  borderDark: '#D1D5DB',
  
  // Interactive states
  interactive: '#FF6B6B',
  interactiveHover: '#FF8E8E',
  interactivePressed: '#E55555',
  interactiveDisabled: '#D1D5DB',
};

export const shadows = {
  // Subtle shadows for modern look
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  
  xlarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  
  // Colored shadows for interactive elements
  primary: {
    shadowColor: '#FF6B6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  
  secondary: {
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  
  // Card specific shadows
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  
  cardHover: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
};

// Typography system
export const typography = {
  // Font sizes
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
  },
  
  // Font weights
  weights: {
    light: '300' as const,
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  
  // Line heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.6,
    loose: 1.8,
  },
};

// Spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border radius system
export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};