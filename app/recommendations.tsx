/**
 * Recommendations Screen Route
 * Displays AI-generated movie/TV recommendations
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
import { Text, ActivityIndicator } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../src/components/ui';
import { useSessionStore } from '../src/store/sessionStore';
import { generateRecommendations } from '../src/services/recommendationService';
import { getImageUrl, formatRuntime, formatRating, getYear } from '../src/utils/helpers';
import { Recommendation } from '../src/types';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../src/utils/constants';

export default function RecommendationsScreen() {
  const router = useRouter();
  const { session, setRecommendations } = useSessionStore();
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setLocalRecommendations] = useState<Recommendation[]>([]);

  // Generate recommendations on mount
  useEffect(() => {
    const loadRecommendations = async () => {
      if (!session) return;

      setIsLoading(true);
      try {
        const recs = await generateRecommendations(session.participants);
        setLocalRecommendations(recs);
        setRecommendations(recs);
      } catch (error) {
        console.error('Error generating recommendations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [session]);

  const handleStartVoting = () => {
    router.push('/voting');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingTitle}>Finding perfect matches...</Text>
            <Text style={styles.loadingSubtitle}>
              Analyzing everyone's preferences
            </Text>
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
          <Text style={styles.headerTitle}>Top Picks</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.sectionTitle}>
            Based on your group's preferences
          </Text>

          {/* Recommendation Cards */}
          {recommendations.map((rec, index) => (
            <View key={rec.id} style={styles.card}>
              {/* Rank Badge */}
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>#{index + 1}</Text>
              </View>

              {/* Poster */}
              <View style={styles.posterContainer}>
                {rec.posterPath ? (
                  <Image
                    source={{ uri: getImageUrl(rec.posterPath, 'w342') || '' }}
                    style={styles.poster}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.posterPlaceholder}>
                    <MaterialCommunityIcons
                      name="movie"
                      size={48}
                      color={COLORS.textLight}
                    />
                  </View>
                )}
              </View>

              {/* Info */}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {rec.title}
                </Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>
                    {getYear(rec.releaseDate)}
                  </Text>
                  <Text style={styles.metaDot}>•</Text>
                  <Text style={styles.metaText}>
                    {rec.contentType === 'movie'
                      ? formatRuntime(rec.runtime)
                      : `${rec.numberOfSeasons} Season${rec.numberOfSeasons !== 1 ? 's' : ''}`}
                  </Text>
                  <Text style={styles.metaDot}>•</Text>
                  <View style={styles.ratingBadge}>
                    <MaterialCommunityIcons
                      name="star"
                      size={14}
                      color={COLORS.accent}
                    />
                    <Text style={styles.ratingText}>
                      {formatRating(rec.voteAverage)}
                    </Text>
                  </View>
                </View>

                {/* Genres */}
                <View style={styles.genresRow}>
                  {rec.genres.slice(0, 3).map((genre) => (
                    <View key={genre.id} style={styles.genreBadge}>
                      <Text style={styles.genreText}>{genre.name}</Text>
                    </View>
                  ))}
                </View>

                {/* Match Score */}
                <View style={styles.matchRow}>
                  <View style={styles.matchBar}>
                    <View
                      style={[
                        styles.matchProgress,
                        { width: `${rec.matchScore}%` },
                      ]}
                    />
                  </View>
                  <Text style={styles.matchScore}>{rec.matchScore}% match</Text>
                </View>

                {/* Match Reason */}
                <Text style={styles.matchReason}>{rec.matchReason}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Vote Button */}
        <View style={styles.bottomSection}>
          <PrimaryButton
            title="Vote for Your Favorite!"
            onPress={handleStartVoting}
            variant="filled"
            size="large"
            style={styles.voteButton}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  loadingTitle: {
    fontSize: FONT_SIZES.xl,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: SPACING.lg,
  },
  loadingSubtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    zIndex: 1,
  },
  rankText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: 'bold',
    color: COLORS.secondary,
  },
  posterContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: COLORS.textLight,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
  },
  cardInfo: {
    padding: SPACING.md,
  },
  cardTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  metaText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
  },
  metaDot: {
    marginHorizontal: SPACING.xs,
    color: COLORS.textLight,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.accent,
    fontWeight: '600',
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  genreBadge: {
    backgroundColor: `${COLORS.primary}20`,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  genreText: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.primary,
  },
  matchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  matchBar: {
    flex: 1,
    height: 6,
    backgroundColor: COLORS.textLight,
    borderRadius: 3,
    overflow: 'hidden',
  },
  matchProgress: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 3,
  },
  matchScore: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.primary,
    minWidth: 70,
    textAlign: 'right',
  },
  matchReason: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  bottomSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.surface,
  },
  voteButton: {
    backgroundColor: COLORS.primary,
  },
});
