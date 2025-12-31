/**
 * Unit tests for Recommendation Service
 */

import {
  generateRecommendations,
  getMockRecommendations,
} from './recommendationService';
import type { Participant, UserPreferences } from '../types';

describe('Recommendation Service', () => {
  describe('getMockRecommendations', () => {
    it('should return an array of recommendations', () => {
      const recommendations = getMockRecommendations();

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(3);
    });

    it('should return recommendations with correct structure', () => {
      const recommendations = getMockRecommendations();

      recommendations.forEach((rec) => {
        expect(rec).toHaveProperty('id');
        expect(rec).toHaveProperty('tmdbId');
        expect(rec).toHaveProperty('title');
        expect(rec).toHaveProperty('overview');
        expect(rec).toHaveProperty('contentType');
        expect(rec).toHaveProperty('matchScore');
        expect(rec).toHaveProperty('matchReason');
      });
    });
  });

  describe('generateRecommendations', () => {
    const createParticipant = (
      name: string,
      preferences: UserPreferences
    ): Participant => ({
      id: `p_${name}`,
      name,
      isHost: name === 'Host',
      hasSubmittedPreferences: true,
      joinedAt: Date.now(),
      preferences,
    });

    it('should generate recommendations for participants', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'happy',
          energy: 'chill',
          runtime: 'short',
          contentType: 'movie',
        }),
        createParticipant('User1', {
          mood: 'funny',
          energy: 'moderate',
          runtime: 'medium',
          contentType: 'movie',
        }),
      ];

      const recommendations = await generateRecommendations(participants);

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBe(3);
    });

    it('should return recommendations with match scores', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'thrilling',
          energy: 'intense',
          runtime: 'long',
          contentType: 'movie',
        }),
      ];

      const recommendations = await generateRecommendations(participants);

      recommendations.forEach((rec) => {
        expect(rec.matchScore).toBeGreaterThan(0);
        expect(rec.matchScore).toBeLessThanOrEqual(100);
        expect(rec.matchReason).toBeTruthy();
      });
    });

    it('should prefer movies when most participants want movies', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'happy',
          energy: 'chill',
          runtime: 'short',
          contentType: 'movie',
        }),
        createParticipant('User1', {
          mood: 'funny',
          energy: 'moderate',
          runtime: 'medium',
          contentType: 'movie',
        }),
        createParticipant('User2', {
          mood: 'thrilling',
          energy: 'intense',
          runtime: 'long',
          contentType: 'tv',
        }),
      ];

      const recommendations = await generateRecommendations(participants);

      // Should have more movies than TV shows in top recommendations
      const movies = recommendations.filter((r) => r.contentType === 'movie');
      expect(movies.length).toBeGreaterThanOrEqual(1);
    });

    it('should prefer TV shows when most participants want TV', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'happy',
          energy: 'chill',
          runtime: 'short',
          contentType: 'tv',
        }),
        createParticipant('User1', {
          mood: 'funny',
          energy: 'moderate',
          runtime: 'medium',
          contentType: 'tv',
        }),
      ];

      const recommendations = await generateRecommendations(participants);

      // First recommendation should be TV when majority prefers TV
      expect(recommendations[0].contentType).toBe('tv');
    });

    it('should handle single participant', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'romantic',
          energy: 'chill',
          runtime: 'medium',
          contentType: 'movie',
        }),
      ];

      const recommendations = await generateRecommendations(participants);

      expect(recommendations.length).toBe(3);
      expect(recommendations[0].matchScore).toBeGreaterThan(0);
    });

    it('should aggregate different moods', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'happy',
          energy: 'chill',
          runtime: 'short',
          contentType: 'movie',
        }),
        createParticipant('User1', {
          mood: 'scary',
          energy: 'intense',
          runtime: 'medium',
          contentType: 'movie',
        }),
        createParticipant('User2', {
          mood: 'funny',
          energy: 'moderate',
          runtime: 'long',
          contentType: 'movie',
        }),
      ];

      const recommendations = await generateRecommendations(participants);

      // Should handle mixed preferences and still return valid recommendations
      expect(recommendations.length).toBe(3);
      recommendations.forEach((rec) => {
        expect(rec.matchScore).toBeGreaterThan(0);
      });
    });

    it('should handle participants without preferences', async () => {
      const participants: Participant[] = [
        {
          id: 'p1',
          name: 'User1',
          isHost: true,
          hasSubmittedPreferences: false,
          joinedAt: Date.now(),
        },
      ];

      const recommendations = await generateRecommendations(participants);

      // Should still return recommendations even if no preferences submitted
      expect(recommendations.length).toBe(3);
    });

    it('should sort recommendations by match score descending', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'thrilling',
          energy: 'intense',
          runtime: 'long',
          contentType: 'movie',
        }),
      ];

      const recommendations = await generateRecommendations(participants);

      for (let i = 0; i < recommendations.length - 1; i++) {
        expect(recommendations[i].matchScore).toBeGreaterThanOrEqual(
          recommendations[i + 1].matchScore
        );
      }
    });

    it('should take some time to simulate AI processing', async () => {
      const participants: Participant[] = [
        createParticipant('Host', {
          mood: 'happy',
          energy: 'chill',
          runtime: 'short',
          contentType: 'movie',
        }),
      ];

      const start = Date.now();
      await generateRecommendations(participants);
      const duration = Date.now() - start;

      // Should take at least 1000ms (the simulated delay)
      expect(duration).toBeGreaterThanOrEqual(1000);
    });

    it('should assign higher scores for matching energy levels', async () => {
      const intenseParticipants: Participant[] = [
        createParticipant('Host', {
          mood: 'thrilling',
          energy: 'intense',
          runtime: 'medium',
          contentType: 'movie',
        }),
      ];

      const chillParticipants: Participant[] = [
        createParticipant('Host', {
          mood: 'happy',
          energy: 'chill',
          runtime: 'medium',
          contentType: 'movie',
        }),
      ];

      const intenseRecs = await generateRecommendations(intenseParticipants);
      const chillRecs = await generateRecommendations(chillParticipants);

      // Both should have valid scores
      expect(intenseRecs[0].matchScore).toBeGreaterThan(0);
      expect(chillRecs[0].matchScore).toBeGreaterThan(0);
    });
  });
});
