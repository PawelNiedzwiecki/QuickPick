/**
 * HomeScreen
 * Main landing screen with options to create or join a session
 */

import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Logo, PrimaryButton } from '../components/ui';
import { COLORS, SPACING } from '../utils/constants';

export function HomeScreen() {
  const router = useRouter();

  const handleStartNewPick = () => {
    router.push('/create');
  };

  const handleJoinPick = () => {
    router.push('/join');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.gradientStart, COLORS.gradientEnd]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <Logo size="large" color={COLORS.secondary} />
          </View>

          {/* Buttons Section */}
          <View style={styles.buttonSection}>
            <PrimaryButton
              title="Start New Pick"
              onPress={handleStartNewPick}
              variant="filled"
              size="large"
            />
            <PrimaryButton
              title="Join Pick"
              onPress={handleJoinPick}
              variant="outline"
              size="large"
            />
          </View>

          {/* Footer */}
          <View style={styles.footer} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xl,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonSection: {
    gap: SPACING.md,
    alignItems: 'center',
    paddingBottom: SPACING.xxl,
  },
  footer: {
    height: SPACING.xl,
  },
});
