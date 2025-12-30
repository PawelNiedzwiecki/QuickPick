/**
 * CodeInput Component
 * 4-digit code input with large numeric keypad
 */

import React, { useState } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../utils/constants';

interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
}

export function CodeInput({
  value,
  onChange,
  maxLength = 4,
}: CodeInputProps) {
  const handleKeyPress = (key: string) => {
    if (value.length < maxLength) {
      onChange(value + key);
    }
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  // Keypad layout - alphanumeric for room codes
  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['', '0', 'back'],
  ];

  return (
    <View style={styles.container}>
      {/* Code display boxes */}
      <View style={styles.codeDisplay}>
        {Array.from({ length: maxLength }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.codeBox,
              value[index] && styles.codeBoxFilled,
              index === value.length && styles.codeBoxActive,
            ]}
          >
            <Text style={styles.codeChar}>
              {value[index] || ''}
            </Text>
          </View>
        ))}
      </View>

      {/* Numeric keypad */}
      <View style={styles.keypad}>
        {keys.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.keyRow}>
            {row.map((key, keyIndex) => {
              if (key === '') {
                return <View key={keyIndex} style={styles.keyEmpty} />;
              }

              if (key === 'back') {
                return (
                  <Pressable
                    key={keyIndex}
                    style={({ pressed }) => [
                      styles.key,
                      pressed && styles.keyPressed,
                    ]}
                    onPress={handleBackspace}
                  >
                    <MaterialCommunityIcons
                      name="backspace-outline"
                      size={28}
                      color={COLORS.text}
                    />
                  </Pressable>
                );
              }

              return (
                <Pressable
                  key={keyIndex}
                  style={({ pressed }) => [
                    styles.key,
                    pressed && styles.keyPressed,
                  ]}
                  onPress={() => handleKeyPress(key)}
                >
                  <Text style={styles.keyText}>{key}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  codeDisplay: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  codeBox: {
    width: 60,
    height: 72,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.textLight,
  },
  codeBoxFilled: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.secondaryDark,
  },
  codeBoxActive: {
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  codeChar: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  keypad: {
    gap: SPACING.sm,
  },
  keyRow: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  key: {
    width: 80,
    height: 60,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyPressed: {
    backgroundColor: COLORS.secondaryDark,
    transform: [{ scale: 0.95 }],
  },
  keyEmpty: {
    width: 80,
    height: 60,
  },
  keyText: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
  },
});
