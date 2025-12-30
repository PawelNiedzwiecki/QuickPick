/**
 * JoinSessionScreen
 * Screen for joining an existing session with a room code
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton, CodeInput, LoadingOverlay } from '../components/ui';
import { useSessionStore } from '../store/sessionStore';
import { isValidRoomCode } from '../utils/helpers';
import { COLORS, SPACING, FONT_SIZES, ERROR_MESSAGES } from '../utils/constants';

type JoinStep = 'code' | 'name';

export function JoinSessionScreen() {
  const router = useRouter();
  const [step, setStep] = useState<JoinStep>('code');
  const [roomCode, setRoomCode] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [isJoining, setIsJoining] = useState(false);

  const { joinSession, loadingState, error } = useSessionStore();

  // Handle code input change
  const handleCodeChange = (code: string) => {
    // Convert to uppercase and filter valid characters
    const filtered = code.toUpperCase().replace(/[^23456789ABCDEFGHJKMNPQRSTUVWXYZ]/g, '');
    setRoomCode(filtered);

    // Auto-advance when 4 characters entered
    if (filtered.length === 4) {
      setStep('name');
    }
  };

  // Handle joining the session
  const handleJoin = async () => {
    if (!participantName.trim()) {
      Alert.alert('Name Required', 'Please enter your name to join.');
      return;
    }

    if (!isValidRoomCode(roomCode)) {
      Alert.alert('Invalid Code', ERROR_MESSAGES.INVALID_ROOM_CODE);
      return;
    }

    setIsJoining(true);
    try {
      await joinSession(roomCode, participantName.trim());
      // Navigate to waiting/preferences screen
      router.replace('/waiting');
    } catch (err) {
      const message = err instanceof Error ? err.message : ERROR_MESSAGES.UNKNOWN_ERROR;
      Alert.alert('Could Not Join', message);
    } finally {
      setIsJoining(false);
    }
  };

  // Handle going back
  const handleBack = () => {
    if (step === 'name') {
      setStep('code');
      setRoomCode('');
    } else {
      router.back();
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="arrow-left"
              size={28}
              color={COLORS.text}
              onPress={handleBack}
            />
            <Text style={styles.headerTitle}>Join Pick</Text>
            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.content}>
            {step === 'code' ? (
              // Step 1: Enter room code
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Enter Room Code</Text>
                <Text style={styles.stepDescription}>
                  Ask your friend for the 4-character code
                </Text>

                <View style={styles.codeInputWrapper}>
                  <CodeInput
                    value={roomCode}
                    onChange={handleCodeChange}
                    maxLength={4}
                  />
                </View>

                <PrimaryButton
                  title="Continue"
                  onPress={() => setStep('name')}
                  disabled={roomCode.length !== 4}
                  variant="filled"
                  size="large"
                  style={[
                    styles.continueButton,
                    roomCode.length === 4 && styles.continueButtonActive,
                  ]}
                  textStyle={{ color: COLORS.secondary }}
                />
              </View>
            ) : (
              // Step 2: Enter name
              <View style={styles.stepContainer}>
                <View style={styles.codePreview}>
                  <Text style={styles.codePreviewLabel}>Joining room</Text>
                  <Text style={styles.codePreviewCode}>
                    {roomCode.split('').join(' ')}
                  </Text>
                </View>

                <Text style={styles.stepTitle}>What's your name?</Text>

                <TextInput
                  style={styles.nameInput}
                  value={participantName}
                  onChangeText={setParticipantName}
                  placeholder="Enter your name"
                  placeholderTextColor={COLORS.textLight}
                  autoFocus
                  maxLength={20}
                  mode="outlined"
                  outlineColor={COLORS.textLight}
                  activeOutlineColor={COLORS.primary}
                />

                <PrimaryButton
                  title="Join Room"
                  onPress={handleJoin}
                  disabled={!participantName.trim() || isJoining}
                  variant="filled"
                  size="large"
                  style={[
                    styles.joinButton,
                    participantName.trim() && styles.joinButtonActive,
                  ]}
                  textStyle={{ color: COLORS.secondary }}
                />
              </View>
            )}
          </View>

          {/* Step indicator */}
          <View style={styles.stepIndicator}>
            <View
              style={[
                styles.stepDot,
                step === 'code' && styles.stepDotActive,
              ]}
            />
            <View
              style={[
                styles.stepDot,
                step === 'name' && styles.stepDotActive,
              ]}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <LoadingOverlay
        visible={isJoining}
        message="Joining room..."
      />
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
  keyboardView: {
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
  stepContainer: {
    flex: 1,
    alignItems: 'center',
    paddingTop: SPACING.xxl,
  },
  stepTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  codeInputWrapper: {
    marginBottom: SPACING.xl,
  },
  continueButton: {
    backgroundColor: COLORS.textLight,
  },
  continueButtonActive: {
    backgroundColor: COLORS.primary,
  },
  codePreview: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    padding: SPACING.md,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
  },
  codePreviewLabel: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    marginBottom: SPACING.xs,
  },
  codePreviewCode: {
    fontSize: FONT_SIZES.xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    letterSpacing: 4,
  },
  nameInput: {
    width: '100%',
    maxWidth: 320,
    fontSize: FONT_SIZES.lg,
    backgroundColor: COLORS.surface,
    marginBottom: SPACING.xl,
  },
  joinButton: {
    backgroundColor: COLORS.textLight,
  },
  joinButtonActive: {
    backgroundColor: COLORS.primary,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
  },
  stepDotActive: {
    backgroundColor: COLORS.primary,
    width: 24,
  },
});
