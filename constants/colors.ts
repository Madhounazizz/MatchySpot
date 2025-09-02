export const colors = {
  // Primary brand colors - Modern vibrant coral
  primary: '#FF6B6B',
  primaryLight: '#FF8A80',
  primaryDark: '#E53935',
  primaryGradient: ['#FF6B6B', '#FF8A80'],
  
  // Accent colors - Soft warm tones
  accent: '#FFF3E0',
  accentDark: '#FFE0B2',
  accentBorder: '#FFCC02',
  
  // Secondary colors - Modern teal
  secondary: '#26C6DA',
  secondaryLight: '#4DD0E1',
  secondaryDark: '#00ACC1',
  secondaryGradient: ['#26C6DA', '#4DD0E1'],
  
  // Text colors - Enhanced hierarchy
  text: '#1A1A1A',
  textSecondary: '#4A4A4A',
  textLight: '#6B7280',
  textExtraLight: '#9CA3AF',
  textInverse: '#FFFFFF',
  
  // Background colors - Modern layered system
  background: '#FFFFFF',
  backgroundSecondary: '#F8FAFC',
  backgroundTertiary: '#F1F5F9',
  backgroundOverlay: 'rgba(0, 0, 0, 0.7)',
  backgroundOverlayLight: 'rgba(0, 0, 0, 0.4)',
  
  // Surface colors - Enhanced depth
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfacePressed: '#F8F9FA',
  surfaceHover: '#F1F5F9',
  
  // Status colors - Vibrant modern palette
  success: '#00C853',
  successLight: '#69F0AE',
  successDark: '#00A152',
  
  error: '#FF5252',
  errorLight: '#FF8A80',
  errorDark: '#D32F2F',
  
  warning: '#FFB300',
  warningLight: '#FFD54F',
  warningDark: '#FF8F00',
  
  info: '#2196F3',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',
  
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
  // Modern elevated shadows
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 4,
  },
  
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
  
  xlarge: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.20,
    shadowRadius: 32,
    elevation: 12,
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