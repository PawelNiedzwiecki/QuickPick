/**
 * LoadingOverlay Component
 * Full-screen loading indicator
 */

import React from 'react';
import { StyleSheet, View, Modal } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { COLORS, FONT_SIZES, SPACING } from '../../utils/constants';

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export function LoadingOverlay({
  visible,
  message = 'Loading...',
}: LoadingOverlayProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
          />
          <Text style={styles.message}>{message}</Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.xl,
    borderRadius: 16,
    alignItems: 'center',
    gap: SPACING.md,
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
  },
});
