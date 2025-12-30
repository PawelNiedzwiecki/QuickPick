/**
 * Voting Screen Route
 * Screen for voting on recommendations
 */

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Pressable,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../src/components/ui';
import { useSessionStore } from '../src/store/sessionStore';
import { getImageUrl } from '../src/utils/helpers';
import { Recommendation, Vote } from '../src/types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES, SESSION_CONFIG } from '../src/utils/constants';

export default function VotingScreen() {
  const router = useRouter();
  const { session, currentParticipant, submitVotes, setWinner } = useSessionStore();
  const [selectedRanks, setSelectedRanks] = useState<Record<string, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(SESSION_CONFIG.VOTING_TIME_SECONDS);

  const recommendations = session?.recommendations || [];

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitVotes();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle selecting a rank for a recommendation
  const handleSelectRank = (recId: string, rank: number) => {
    setSelectedRanks((prev) => {
      const newRanks = { ...prev };

      // Remove this rank from any other recommendation
      Object.keys(newRanks).forEach((key) => {
        if (newRanks[key] === rank) {
          delete newRanks[key];
        }
      });

      // Set the new rank (or toggle off if already selected)
      if (prev[recId] === rank) {
        delete newRanks[recId];
      } else {
        newRanks[recId] = rank;
      }

      return newRanks;
    });
  };

  // Handle submitting votes
  const handleSubmitVotes = () => {
    if (!session || !currentParticipant) return;

    const votes: Vote[] = Object.entries(selectedRanks).map(([recId, rank]) => ({
      oderId: `vote_${Date.now()}`,
      participantId: currentParticipant.id,
      recommendationId: recId,
      rank,
      timestamp: Date.now(),
    }));

    submitVotes(votes);

    // For demo: immediately determine winner (in production, wait for all votes)
    const topRec = recommendations.find((r) => selectedRanks[r.id] === 1) || recommendations[0];
    if (topRec) {
      setWinner(topRec);
    }

    router.replace('/result');
  };

  // Check if all ranks are assigned
  const allRanksAssigned = Object.keys(selectedRanks).length === recommendations.length;

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header with Timer */}
        <View style={styles.header}>
          <View style={styles.headerSpacer} />
          <View style={styles.timerContainer}>
            <MaterialCommunityIcons
              name="timer-outline"
              size={20}
              color={timeRemaining < 10 ? COLORS.error : COLORS.text}
            />
            <Text
              style={[
                styles.timerText,
                timeRemaining < 10 && styles.timerTextUrgent,
              ]}
            >
              {formatTime(timeRemaining)}
            </Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Rank Your Top 3</Text>
          <Text style={styles.subtitle}>
            Tap the numbers to assign your rankings
          </Text>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {recommendations.map((rec) => (
              <View key={rec.id} style={styles.voteCard}>
                {/* Poster thumbnail */}
                <View style={styles.thumbnailContainer}>
                  {rec.posterPath ? (
                    <Image
                      source={{ uri: getImageUrl(rec.posterPath, 'w154') || '' }}
                      style={styles.thumbnail}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={styles.thumbnailPlaceholder}>
                      <MaterialCommunityIcons
                        name="movie"
                        size={24}
                        color={COLORS.textLight}
                      />
                    </View>
                  )}
                </View>

                {/* Info */}
                <View style={styles.voteCardInfo}>
                  <Text style={styles.voteCardTitle} numberOfLines={1}>
                    {rec.title}
                  </Text>
                  <Text style={styles.voteCardMeta}>
                    {rec.matchScore}% match
                  </Text>
                </View>

                {/* Rank buttons */}
                <View style={styles.rankButtons}>
                  {[1, 2, 3].map((rank) => (
                    <Pressable
                      key={rank}
                      style={[
                        styles.rankButton,
                        selectedRanks[rec.id] === rank && styles.rankButtonSelected,
                      ]}
                      onPress={() => handleSelectRank(rec.id, rank)}
                    >
                      <Text
                        style={[
                          styles.rankButtonText,
                          selectedRanks[rec.id] === rank &&
                            styles.rankButtonTextSelected,
                        ]}
                      >
                        {rank}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Submit Button */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title={allRanksAssigned ? 'Submit Votes' : 'Rank All 3 to Continue'}
            onPress={handleSubmitVotes}
            disabled={!allRanksAssigned}
            variant="filled"
            size="large"
            style={[
              styles.submitButton,
              allRanksAssigned && styles.submitButtonActive,
            ]}
            textStyle={{ color: COLORS.secondary }}
          />
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
  headerSpacer: {
    width: 28,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.round,
  },
  timerText: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  timerTextUrgent: {
    color: COLORS.error,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
  },
  title: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.text,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
    marginBottom: SPACING.xl,
  },
  scrollView: {
    flex: 1,
  },
  voteCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  thumbnailContainer: {
    width: 60,
    height: 80,
    borderRadius: BORDER_RADIUS.sm,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  thumbnailPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voteCardInfo: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  voteCardTitle: {
    fontSize: FONT_SIZES.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  voteCardMeta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.primary,
    marginTop: 4,
  },
  rankButtons: {
    flexDirection: 'row',
    gap: SPACING.xs,
  },
  rankButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.textLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  rankButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: 'bold',
    color: COLORS.textLight,
  },
  rankButtonTextSelected: {
    color: COLORS.secondary,
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  submitButton: {
    backgroundColor: COLORS.textLight,
  },
  submitButtonActive: {
    backgroundColor: COLORS.primary,
  },
});
