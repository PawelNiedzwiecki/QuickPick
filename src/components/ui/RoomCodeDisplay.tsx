/**
 * RoomCodeDisplay Component
 * Large display for the 4-digit room code
 */

import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import * as Clipboard from 'expo-clipboard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../../utils/constants';

interface RoomCodeDisplayProps {
  code: string;
  onCopy?: () => void;
}

export function RoomCodeDisplay({ code, onCopy }: RoomCodeDisplayProps) {
  const handleCopy = async () => {
    await Clipboard.setStringAsync(code);
    onCopy?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Room Code</Text>
      <View style={styles.codeContainer}>
        {code.split('').map((char, index) => (
          <View key={index} style={styles.charBox}>
            <Text style={styles.char}>{char}</Text>
          </View>
        ))}
      </View>
      <Pressable
        style={({ pressed }) => [
          styles.copyButton,
          pressed && styles.copyButtonPressed,
        ]}
        onPress={handleCopy}
      >
        <MaterialCommunityIcons
          name="content-copy"
          size={20}
          color={COLORS.primary}
        />
        <Text style={styles.copyText}>Tap to copy</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  label: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: SPACING.sm,
  },
  charBox: {
    width: 64,
    height: 80,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  char: {
    fontSize: FONT_SIZES.xxxl,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.round,
  },
  copyButtonPressed: {
    opacity: 0.7,
  },
  copyText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
  },
});
