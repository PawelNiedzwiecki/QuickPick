/**
 * Logo Component
 * QuickPick branding with tagline
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface LogoProps {
  showTagline?: boolean;
  size?: 'large' | 'medium' | 'small';
  color?: string;
}

export function Logo({
  showTagline = true,
  size = 'large',
  color = COLORS.secondary,
}: LogoProps) {
  const iconSize = size === 'large' ? 64 : size === 'medium' ? 48 : 32;
  const titleSize = size === 'large' ? FONT_SIZES.xxxl : size === 'medium' ? FONT_SIZES.xxl : FONT_SIZES.xl;
  const taglineSize = size === 'large' ? FONT_SIZES.md : FONT_SIZES.sm;

  return (
    <View style={styles.container}>
      <View style={styles.logoRow}>
        <MaterialCommunityIcons
          name="movie-open"
          size={iconSize}
          color={color}
        />
        <Text
          style={[
            styles.title,
            { fontSize: titleSize, color },
          ]}
        >
          QuickPick
        </Text>
      </View>
      {showTagline && (
        <Text
          style={[
            styles.tagline,
            { fontSize: taglineSize, color },
          ]}
        >
          What to watch. Decided in 60 seconds.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  title: {
    fontWeight: 'bold',
  },
  tagline: {
    marginTop: SPACING.sm,
    opacity: 0.9,
  },
});
