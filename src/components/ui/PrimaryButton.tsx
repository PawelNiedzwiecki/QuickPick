/**
 * PrimaryButton Component
 * Large, prominent button for main actions
 */

import React from 'react';
import { StyleSheet, Pressable, ViewStyle, TextStyle } from 'react-native';
import { Text } from 'react-native-paper';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../utils/constants';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'filled' | 'outline';
  size?: 'large' | 'medium';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  variant = 'filled',
  size = 'large',
  style,
  textStyle,
}: PrimaryButtonProps) {
  const buttonStyles = [
    styles.button,
    size === 'large' ? styles.large : styles.medium,
    variant === 'filled' ? styles.filled : styles.outline,
    disabled && styles.disabled,
    style,
  ];

  const textStyles = [
    styles.text,
    size === 'large' ? styles.textLarge : styles.textMedium,
    variant === 'filled' ? styles.textFilled : styles.textOutline,
    disabled && styles.textDisabled,
    textStyle,
  ];

  return (
    <Pressable
      style={({ pressed }) => [
        ...buttonStyles,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={textStyles}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS.lg,
  },
  large: {
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    minWidth: 280,
  },
  medium: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    minWidth: 200,
  },
  filled: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.secondary,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontWeight: '600',
  },
  textLarge: {
    fontSize: FONT_SIZES.lg,
  },
  textMedium: {
    fontSize: FONT_SIZES.md,
  },
  textFilled: {
    color: COLORS.primary,
  },
  textOutline: {
    color: COLORS.secondary,
  },
  textDisabled: {
    color: COLORS.textLight,
  },
});
