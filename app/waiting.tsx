/**
 * Waiting Screen Route
 * Shown to participants after joining, waiting for host to start
 */

import React from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton, ParticipantList } from '../src/components/ui';
import { useSessionStore } from '../src/store/sessionStore';
import { COLORS, SPACING, FONT_SIZES } from '../src/utils/constants';

export default function WaitingScreen() {
  const router = useRouter();
  const { session, currentParticipant, leaveSession } = useSessionStore();

  const handleLeave = () => {
    leaveSession();
    router.replace('/');
  };

  if (!session) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centered}>
            <Text style={styles.errorText}>Session not found</Text>
            <PrimaryButton
              title="Go Home"
              onPress={() => router.replace('/')}
              variant="filled"
              size="medium"
              style={styles.homeButton}
              textStyle={{ color: COLORS.secondary }}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <Text style={styles.headerTitle}>Room {session.roomCode}</Text>
          <MaterialCommunityIcons
            name="exit-to-app"
            size={28}
            color={COLORS.error}
            onPress={handleLeave}
          />
        </View>

        <View style={styles.content}>
          {/* Waiting indicator */}
          <View style={styles.waitingSection}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.waitingTitle}>Waiting for host to start...</Text>
            <Text style={styles.waitingSubtitle}>
              Get ready to pick what to watch!
            </Text>
          </View>

          {/* Participants */}
          <View style={styles.participantsSection}>
            <ParticipantList
              participants={session.participants}
              currentUserId={currentParticipant?.id}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
  },
  headerTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '600',
    color: COLORS.text,
  },
  headerSpacer: {
    width: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
  },
  waitingSection: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    gap: SPACING.md,
  },
  waitingTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.md,
  },
  waitingSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  participantsSection: {
    flex: 1,
  },
});
