/**
 * Root Layout
 * Provides app-wide configuration with NativeWind
 */

import "../global.css";

import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
          contentStyle: {
            backgroundColor: "#FFFFFF",
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
        <Stack.Screen name="result" />
      </Stack>
    </>
  );
}
