/**
 * Root Layout
 * Provides app-wide configuration and theme
 */

import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { COLORS } from '../src/utils/constants';

// Custom theme for react-native-paper
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    secondary: COLORS.accent,
    background: COLORS.background,
    surface: COLORS.surface,
    error: COLORS.error,
  },
};

export default function RootLayout() {
  return (
    <PaperProvider theme={theme}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="create" />
        <Stack.Screen name="join" />
        <Stack.Screen name="waiting" />
        <Stack.Screen name="preferences" />
        <Stack.Screen name="recommendations" />
        <Stack.Screen name="voting" />
      </Stack>
    </PaperProvider>
  );
}
