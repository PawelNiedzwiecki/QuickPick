/**
 * CreateSessionScreen
 * Screen for creating a new session and waiting for participants
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Share,
  Alert,
} from 'react-native';
import { Text, TextInput, Snackbar } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import {
  PrimaryButton,
  RoomCodeDisplay,
  ParticipantList,
  LoadingOverlay,
} from '../components/ui';
import { useSessionStore } from '../store/sessionStore';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SESSION_CONFIG } from '../utils/constants';

export function CreateSessionScreen() {
  const router = useRouter();
  const [hostName, setHostName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [showCopySnackbar, setShowCopySnackbar] = useState(false);

  const {
    session,
    currentParticipant,
    loadingState,
    createSession,
    reset,
  } = useSessionStore();

  // Handle session creation
  const handleCreateSession = async () => {
    if (!hostName.trim()) {
      Alert.alert('Name Required', 'Please enter your name to continue.');
      return;
    }

    setIsCreating(true);
    try {
      await createSession(hostName.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to create session. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  // Handle sharing the room code
  const handleShare = async () => {
    if (!session) return;

    try {
      await Share.share({
        message: `Join my QuickPick session!\n\nRoom Code: ${session.roomCode}\n\nLet's decide what to watch together!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  // Handle starting the preference selection
  const handleStartPicking = () => {
    if (!session) return;

    if (session.participants.length < SESSION_CONFIG.MIN_PARTICIPANTS) {
      Alert.alert(
        'Need More Friends',
        `You need at least ${SESSION_CONFIG.MIN_PARTICIPANTS} people to start. Share the room code!`
      );
      return;
    }

    // Navigate to preferences screen
    router.push('/preferences');
  };

  // Handle going back
  const handleBack = () => {
    if (session) {
      Alert.alert(
        'Leave Session?',
        'This will end the session for everyone.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => {
              reset();
              router.back();
            },
          },
        ]
      );
    } else {
      router.back();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Cleanup if needed
    };
  }, []);

  // If session not created yet, show name input
  if (!session) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={COLORS.text}
              onPress={handleBack}
            />
            <Text style={styles.headerTitle}>Start New Pick</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.nameInputContainer}>
            <Text style={styles.inputLabel}>What's your name?</Text>
            <TextInput
              style={styles.nameInput}
              value={hostName}
              onChangeText={setHostName}
              placeholder="Enter your name"
              placeholderTextColor={COLORS.textLight}
              autoFocus
              maxLength={20}
              mode="outlined"
              outlineColor={COLORS.textLight}
              activeOutlineColor={COLORS.primary}
            />
            <PrimaryButton
              title="Create Room"
              onPress={handleCreateSession}
              disabled={!hostName.trim() || isCreating}
              variant="filled"
              size="large"
              style={styles.createButton}
              textStyle={{ color: COLORS.secondary }}
            />
          </View>
        </SafeAreaView>

        <LoadingOverlay
          visible={isCreating}
          message="Creating room..."
        />
      </View>
    );
  }

  // Session created - show room code and participants
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={28}
            color={COLORS.text}
            onPress={handleBack}
          />
          <Text style={styles.headerTitle}>Your Room</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Room Code Section */}
          <View style={styles.codeSection}>
            <RoomCodeDisplay
              code={session.roomCode}
              onCopy={() => setShowCopySnackbar(true)}
            />
          </View>

          {/* QR Code Section */}
          <View style={styles.qrSection}>
            <View style={styles.qrContainer}>
              <QRCode
                value={`quickpick://join/${session.roomCode}`}
                size={120}
                color={COLORS.primary}
                backgroundColor={COLORS.secondary}
              />
            </View>
            <Text style={styles.qrLabel}>Scan to join</Text>
          </View>

          {/* Share Button */}
          <PrimaryButton
            title="Share Room Code"
            onPress={handleShare}
            variant="outline"
            size="medium"
            style={styles.shareButton}
            textStyle={{ color: COLORS.primary }}
          />

          {/* Participants Section */}
          <View style={styles.participantsSection}>
            <ParticipantList
              participants={session.participants}
              currentUserId={currentParticipant?.id}
            />
          </View>

          {/* Waiting Message */}
          {session.participants.length < SESSION_CONFIG.MIN_PARTICIPANTS && (
            <View style={styles.waitingMessage}>
              <MaterialCommunityIcons
                name="account-clock"
                size={24}
                color={COLORS.textSecondary}
              />
              <Text style={styles.waitingText}>
                Waiting for friends to join...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Start Button */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title={
              session.participants.length >= SESSION_CONFIG.MIN_PARTICIPANTS
                ? 'Start Picking!'
                : `Need ${SESSION_CONFIG.MIN_PARTICIPANTS - session.participants.length} more`
            }
            onPress={handleStartPicking}
            disabled={session.participants.length < SESSION_CONFIG.MIN_PARTICIPANTS}
            variant="filled"
            size="large"
            style={[
              styles.startButton,
              session.participants.length >= SESSION_CONFIG.MIN_PARTICIPANTS &&
                styles.startButtonActive,
            ]}
            textStyle={{ color: COLORS.secondary }}
          />
        </View>
      </SafeAreaView>

      <Snackbar
        visible={showCopySnackbar}
        onDismiss={() => setShowCopySnackbar(false)}
        duration={2000}
        style={styles.snackbar}
      >
        Room code copied!
      </Snackbar>
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
  nameInputContainer: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.xxl,
    alignItems: 'center',
  },
  inputLabel: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.lg,
  },
  nameInput: {
    width: '100%',
    maxWidth: 320,
    fontSize: FONT_SIZES.lg,
    backgroundColor: COLORS.surface,
  },
  createButton: {
    marginTop: SPACING.xl,
    backgroundColor: COLORS.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  codeSection: {
    alignItems: 'center',
    paddingVertical: SPACING.lg,
  },
  qrSection: {
    alignItems: 'center',
    marginTop: SPACING.md,
  },
  qrContainer: {
    padding: SPACING.md,
    backgroundColor: COLORS.secondary,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  qrLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  shareButton: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
    borderColor: COLORS.primary,
  },
  participantsSection: {
    marginTop: SPACING.xl,
  },
  waitingMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
  },
  waitingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  startButton: {
    backgroundColor: COLORS.textLight,
  },
  startButtonActive: {
    backgroundColor: COLORS.primary,
  },
  snackbar: {
    backgroundColor: COLORS.primary,
  },
});
