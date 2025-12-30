/**
 * Result Screen Route
 * Displays the winning movie/show
 */

import React from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  Image,
} from 'react-native';
import { Text } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PrimaryButton } from '../src/components/ui';
import { useSessionStore } from '../src/store/sessionStore';
import { usePreferenceStore } from '../src/store/preferenceStore';
import { getImageUrl, formatRuntime, formatRating, getYear } from '../src/utils/helpers';
import { COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '../src/utils/constants';

export default function ResultScreen() {
  const router = useRouter();
  const { session, reset: resetSession } = useSessionStore();
  const { reset: resetPreferences } = usePreferenceStore();

  const winner = session?.winner;

  const handleStartOver = () => {
    resetSession();
    resetPreferences();
    router.replace('/');
  };

  if (!winner) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No result available</Text>
            <PrimaryButton
              title="Go Home"
              onPress={handleStartOver}
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
      {/* Background Image */}
      {winner.backdropPath && (
        <Image
          source={{ uri: getImageUrl(winner.backdropPath, 'w780') || '' }}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
      )}
      <LinearGradient
        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.95)']}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          {/* Trophy Icon */}
          <View style={styles.trophyContainer}>
            <MaterialCommunityIcons
              name="trophy"
              size={64}
              color={COLORS.accent}
            />
            <Text style={styles.winnerLabel}>THE GROUP HAS SPOKEN!</Text>
          </View>

          {/* Winner Card */}
          <View style={styles.winnerCard}>
            {/* Poster */}
            <View style={styles.posterContainer}>
              {winner.posterPath ? (
                <Image
                  source={{ uri: getImageUrl(winner.posterPath, 'w342') || '' }}
                  style={styles.poster}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.posterPlaceholder}>
                  <MaterialCommunityIcons
                    name="movie"
                    size={64}
                    color={COLORS.textLight}
                  />
                </View>
              )}
            </View>

            {/* Info */}
            <Text style={styles.winnerTitle}>{winner.title}</Text>

            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{getYear(winner.releaseDate)}</Text>
              <Text style={styles.metaDot}>•</Text>
              <Text style={styles.metaText}>
                {winner.contentType === 'movie'
                  ? formatRuntime(winner.runtime)
                  : `${winner.numberOfSeasons} Season${winner.numberOfSeasons !== 1 ? 's' : ''}`}
              </Text>
              <Text style={styles.metaDot}>•</Text>
              <View style={styles.ratingBadge}>
                <MaterialCommunityIcons
                  name="star"
                  size={16}
                  color={COLORS.accent}
                />
                <Text style={styles.ratingText}>
                  {formatRating(winner.voteAverage)}
                </Text>
              </View>
            </View>

            {/* Genres */}
            <View style={styles.genresRow}>
              {winner.genres.map((genre) => (
                <View key={genre.id} style={styles.genreBadge}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>

            {/* Overview */}
            <Text style={styles.overview} numberOfLines={4}>
              {winner.overview}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <PrimaryButton
              title="Start Watching!"
              onPress={() => {
                // In production: deep link to streaming service
                handleStartOver();
              }}
              variant="filled"
              size="large"
              style={styles.watchButton}
              textStyle={{ color: COLORS.secondary }}
            />
            <PrimaryButton
              title="Pick Again"
              onPress={handleStartOver}
              variant="outline"
              size="medium"
              style={styles.againButton}
              textStyle={{ color: COLORS.secondary }}
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
    backgroundColor: COLORS.text,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
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
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: FONT_SIZES.lg,
    color: COLORS.secondary,
    marginBottom: SPACING.lg,
  },
  homeButton: {
    backgroundColor: COLORS.primary,
  },
  trophyContainer: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  winnerLabel: {
    fontSize: FONT_SIZES.lg,
    fontWeight: 'bold',
    color: COLORS.accent,
    marginTop: SPACING.md,
    letterSpacing: 2,
  },
  winnerCard: {
    alignItems: 'center',
  },
  posterContainer: {
    width: 160,
    height: 240,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  poster: {
    width: '100%',
    height: '100%',
  },
  posterPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  winnerTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: 'bold',
    color: COLORS.secondary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  metaText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
  },
  metaDot: {
    marginHorizontal: SPACING.xs,
    color: COLORS.textLight,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.accent,
    fontWeight: '600',
  },
  genresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  genreBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.round,
  },
  genreText: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.secondary,
  },
  overview: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: SPACING.md,
  },
  actionButtons: {
    alignItems: 'center',
    marginTop: SPACING.xl,
    gap: SPACING.md,
  },
  watchButton: {
    backgroundColor: COLORS.primary,
  },
  againButton: {
    borderColor: COLORS.secondary,
  },
});
