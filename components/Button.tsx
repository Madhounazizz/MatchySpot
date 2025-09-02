import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, shadows, typography, borderRadius, spacing } from '@/constants/colors';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  style?: object;
};

export default function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  style,
}: ButtonProps) {
  const getButtonStyle = () => {
    let buttonStyle = {};
    
    // Variant styles
    switch (variant) {
      case 'primary':
        buttonStyle = styles.primaryButton;
        break;
      case 'secondary':
        buttonStyle = styles.secondaryButton;
        break;
      case 'outline':
        buttonStyle = styles.outlineButton;
        break;
      case 'ghost':
        buttonStyle = styles.ghostButton;
        break;
      case 'gradient':
        buttonStyle = styles.gradientButton;
        break;
    }
    
    // Size styles
    switch (size) {
      case 'small':
        buttonStyle = { ...buttonStyle, ...styles.smallButton };
        break;
      case 'large':
        buttonStyle = { ...buttonStyle, ...styles.largeButton };
        break;
    }
    
    // Width style
    if (fullWidth) {
      buttonStyle = { ...buttonStyle, ...styles.fullWidthButton };
    }
    
    // Disabled style
    if (disabled || loading) {
      buttonStyle = { ...buttonStyle, ...styles.disabledButton };
    }
    
    return buttonStyle;
  };
  
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return styles.primaryText;
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'gradient':
        return styles.gradientText;
    }
  };
  
  const getTextSize = () => {
    switch (size) {
      case 'small':
        return styles.smallText;
      case 'large':
        return styles.largeText;
      default:
        return {};
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? colors.primary : colors.white}
          size="small"
        />
      );
    }

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && (
          <View style={[styles.iconContainer, styles.iconLeft]}>
            {icon}
          </View>
        )}
        <Text style={[styles.text, getTextStyle(), getTextSize()]}>{title}</Text>
        {icon && iconPosition === 'right' && (
          <View style={[styles.iconContainer, styles.iconRight]}>
            {icon}
          </View>
        )}
      </View>
    );
  };

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        style={[styles.button, getButtonStyle(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientBackground}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm + 6,
    paddingHorizontal: spacing.lg,
    overflow: 'hidden',
  },
  
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  iconLeft: {
    marginRight: spacing.sm,
  },
  
  iconRight: {
    marginLeft: spacing.sm,
  },
  
  text: {
    fontWeight: typography.weights.semibold,
    textAlign: 'center',
    fontSize: typography.sizes.base,
    letterSpacing: 0.5,
    lineHeight: typography.sizes.base * typography.lineHeights.tight,
  },
  
  // Variant styles
  primaryButton: {
    backgroundColor: colors.primary,
    ...shadows.primary,
  },
  
  secondaryButton: {
    backgroundColor: colors.secondary,
    ...shadows.secondary,
  },
  
  outlineButton: {
    backgroundColor: colors.transparent,
    borderWidth: 2,
    borderColor: colors.primary,
    ...shadows.none,
  },
  
  ghostButton: {
    backgroundColor: colors.transparent,
    ...shadows.none,
  },
  
  gradientButton: {
    backgroundColor: colors.transparent,
    ...shadows.primary,
  },
  
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm + 6,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.xl,
  },
  
  // Text styles
  primaryText: {
    color: colors.textInverse,
  },
  
  secondaryText: {
    color: colors.textInverse,
  },
  
  outlineText: {
    color: colors.primary,
  },
  
  ghostText: {
    color: colors.primary,
  },
  
  gradientText: {
    color: colors.textInverse,
  },
  
  // Size styles
  smallButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.lg,
  },
  
  largeButton: {
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius['2xl'],
  },
  
  smallText: {
    fontSize: typography.sizes.sm,
  },
  
  largeText: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  
  // Width style
  fullWidthButton: {
    width: '100%',
  },
  
  // Disabled style
  disabledButton: {
    opacity: 0.5,
    backgroundColor: colors.interactiveDisabled,
  },
});