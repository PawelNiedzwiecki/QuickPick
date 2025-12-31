/**
 * Unit tests for Session Service
 */

import {
  createSession,
  getSessionByCode,
  joinSession,
  leaveSession,
  updateSessionStatus,
  submitPreferences,
  allPreferencesSubmitted,
  setRecommendations,
  submitVotes,
  setWinner,
  subscribeToSession,
} from './sessionService';
import type { Recommendation, UserPreferences, Vote } from '../types';

describe('Session Service', () => {
  beforeEach(() => {
    // Clear any existing sessions before each test
    jest.clearAllMocks();
  });

  describe('createSession', () => {
    it('should create a new session with host', async () => {
      const hostName = 'Alice';
      const session = await createSession(hostName);

      expect(session).toBeDefined();
      expect(session.roomCode).toHaveLength(4);
      expect(session.status).toBe('waiting');
      expect(session.participants).toHaveLength(1);
      expect(session.participants[0].name).toBe(hostName);
      expect(session.participants[0].isHost).toBe(true);
      expect(session.hostId).toBe(session.participants[0].id);
    });

    it('should set expiration time', async () => {
      const session = await createSession('Alice');
      expect(session.expiresAt).toBeGreaterThan(Date.now());
    });

    it('should generate unique session IDs', async () => {
      const session1 = await createSession('Alice');
      const session2 = await createSession('Bob');
      expect(session1.id).not.toBe(session2.id);
    });
  });

  describe('getSessionByCode', () => {
    it('should retrieve an existing session', async () => {
      const created = await createSession('Alice');
      const retrieved = await getSessionByCode(created.roomCode);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.roomCode).toBe(created.roomCode);
    });

    it('should return null for non-existent session', async () => {
      const session = await getSessionByCode('XXXX');
      expect(session).toBeNull();
    });

    it('should be case-insensitive', async () => {
      const created = await createSession('Alice');
      const retrieved = await getSessionByCode(created.roomCode.toLowerCase());
      expect(retrieved?.id).toBe(created.id);
    });
  });

  describe('joinSession', () => {
    it('should add participant to existing session', async () => {
      const created = await createSession('Alice');
      const { session, participant } = await joinSession(created.roomCode, 'Bob');

      expect(session.participants).toHaveLength(2);
      expect(participant.name).toBe('Bob');
      expect(participant.isHost).toBe(false);
      expect(session.participants.find((p) => p.id === participant.id)).toBeDefined();
    });

    it('should throw error for non-existent session', async () => {
      await expect(joinSession('XXXX', 'Bob')).rejects.toThrow('Session not found');
    });

    it('should throw error if session has already started', async () => {
      const created = await createSession('Alice');
      await updateSessionStatus(created.roomCode, 'voting');

      await expect(joinSession(created.roomCode, 'Bob')).rejects.toThrow(
        'Session has already started'
      );
    });

    it('should throw error if session is full', async () => {
      const created = await createSession('Alice');

      // Add 7 more participants to reach the limit of 8
      for (let i = 0; i < 7; i++) {
        await joinSession(created.roomCode, `User${i}`);
      }

      await expect(joinSession(created.roomCode, 'ExtraUser')).rejects.toThrow(
        'Session is full'
      );
    });
  });

  describe('leaveSession', () => {
    it('should remove participant from session', async () => {
      const created = await createSession('Alice');
      const { participant } = await joinSession(created.roomCode, 'Bob');

      await leaveSession(created.roomCode, participant.id);

      const session = await getSessionByCode(created.roomCode);
      expect(session?.participants).toHaveLength(1);
      expect(session?.participants.find((p) => p.id === participant.id)).toBeUndefined();
    });

    it('should delete session if host leaves', async () => {
      const created = await createSession('Alice');
      await leaveSession(created.roomCode, created.hostId);

      const session = await getSessionByCode(created.roomCode);
      expect(session).toBeNull();
    });

    it('should handle non-existent session gracefully', async () => {
      await expect(leaveSession('XXXX', 'participant-id')).resolves.not.toThrow();
    });

    it('should handle non-existent participant gracefully', async () => {
      const created = await createSession('Alice');
      await expect(
        leaveSession(created.roomCode, 'non-existent-id')
      ).resolves.not.toThrow();
    });
  });

  describe('updateSessionStatus', () => {
    it('should update session status', async () => {
      const created = await createSession('Alice');
      const updated = await updateSessionStatus(created.roomCode, 'voting');

      expect(updated.status).toBe('voting');
    });

    it('should throw error for non-existent session', async () => {
      await expect(updateSessionStatus('XXXX', 'voting')).rejects.toThrow(
        'Session not found'
      );
    });
  });

  describe('submitPreferences', () => {
    it('should submit preferences for participant', async () => {
      const created = await createSession('Alice');
      const preferences: UserPreferences = {
        mood: 'happy',
        energy: 'chill',
        runtime: 'short',
        contentType: 'movie',
      };

      await submitPreferences(created.roomCode, created.hostId, preferences);

      const session = await getSessionByCode(created.roomCode);
      const host = session?.participants.find((p) => p.id === created.hostId);

      expect(host?.preferences).toEqual(preferences);
      expect(host?.hasSubmittedPreferences).toBe(true);
    });

    it('should throw error for non-existent session', async () => {
      const preferences: UserPreferences = {
        mood: 'happy',
        energy: 'chill',
        runtime: 'short',
        contentType: 'movie',
      };

      await expect(
        submitPreferences('XXXX', 'participant-id', preferences)
      ).rejects.toThrow('Session not found');
    });

    it('should throw error for non-existent participant', async () => {
      const created = await createSession('Alice');
      const preferences: UserPreferences = {
        mood: 'happy',
        energy: 'chill',
        runtime: 'short',
        contentType: 'movie',
      };

      await expect(
        submitPreferences(created.roomCode, 'non-existent-id', preferences)
      ).rejects.toThrow('Participant not found');
    });
  });

  describe('allPreferencesSubmitted', () => {
    it('should return true when all participants submitted', async () => {
      const created = await createSession('Alice');
      const preferences: UserPreferences = {
        mood: 'happy',
        energy: 'chill',
        runtime: 'short',
        contentType: 'movie',
      };

      await submitPreferences(created.roomCode, created.hostId, preferences);

      const allSubmitted = await allPreferencesSubmitted(created.roomCode);
      expect(allSubmitted).toBe(true);
    });

    it('should return false when not all participants submitted', async () => {
      const created = await createSession('Alice');
      await joinSession(created.roomCode, 'Bob');

      const allSubmitted = await allPreferencesSubmitted(created.roomCode);
      expect(allSubmitted).toBe(false);
    });

    it('should return false for non-existent session', async () => {
      const allSubmitted = await allPreferencesSubmitted('XXXX');
      expect(allSubmitted).toBe(false);
    });
  });

  describe('setRecommendations', () => {
    it('should set recommendations and update status', async () => {
      const created = await createSession('Alice');
      const recommendations: Recommendation[] = [
        {
          id: 'movie_1',
          tmdbId: 1,
          title: 'Test Movie',
          overview: 'A test movie',
          posterPath: null,
          backdropPath: null,
          releaseDate: '2024-01-01',
          voteAverage: 8.0,
          genres: [],
          runtime: 120,
          contentType: 'movie',
          matchScore: 90,
          matchReason: 'Test match',
        },
      ];

      await setRecommendations(created.roomCode, recommendations);

      const session = await getSessionByCode(created.roomCode);
      expect(session?.recommendations).toEqual(recommendations);
      expect(session?.status).toBe('voting');
    });

    it('should throw error for non-existent session', async () => {
      await expect(setRecommendations('XXXX', [])).rejects.toThrow('Session not found');
    });
  });

  describe('submitVotes', () => {
    it('should add votes to session', async () => {
      const created = await createSession('Alice');
      const votes: Vote[] = [
        {
          participantId: created.hostId,
          recommendationId: 'movie_1',
          rank: 1,
        },
      ];

      await submitVotes(created.roomCode, votes);

      const session = await getSessionByCode(created.roomCode);
      expect(session?.votes).toEqual(votes);
    });

    it('should append new votes to existing votes', async () => {
      const created = await createSession('Alice');
      const votes1: Vote[] = [
        { participantId: 'p1', recommendationId: 'r1', rank: 1 },
      ];
      const votes2: Vote[] = [
        { participantId: 'p2', recommendationId: 'r2', rank: 1 },
      ];

      await submitVotes(created.roomCode, votes1);
      await submitVotes(created.roomCode, votes2);

      const session = await getSessionByCode(created.roomCode);
      expect(session?.votes).toHaveLength(2);
    });

    it('should throw error for non-existent session', async () => {
      await expect(submitVotes('XXXX', [])).rejects.toThrow('Session not found');
    });
  });

  describe('setWinner', () => {
    it('should set winner and update status to complete', async () => {
      const created = await createSession('Alice');
      const winner: Recommendation = {
        id: 'movie_1',
        tmdbId: 1,
        title: 'Winning Movie',
        overview: 'The winner',
        posterPath: null,
        backdropPath: null,
        releaseDate: '2024-01-01',
        voteAverage: 9.0,
        genres: [],
        runtime: 120,
        contentType: 'movie',
        matchScore: 95,
        matchReason: 'Most votes',
      };

      await setWinner(created.roomCode, winner);

      const session = await getSessionByCode(created.roomCode);
      expect(session?.winner).toEqual(winner);
      expect(session?.status).toBe('complete');
    });

    it('should throw error for non-existent session', async () => {
      const winner: Recommendation = {
        id: 'movie_1',
        tmdbId: 1,
        title: 'Winning Movie',
        overview: 'The winner',
        posterPath: null,
        backdropPath: null,
        releaseDate: '2024-01-01',
        voteAverage: 9.0,
        genres: [],
        runtime: 120,
        contentType: 'movie',
        matchScore: 95,
        matchReason: 'Most votes',
      };

      await expect(setWinner('XXXX', winner)).rejects.toThrow('Session not found');
    });
  });

  describe('subscribeToSession', () => {
    it('should call callback with session data', async () => {
      const created = await createSession('Alice');
      const callback = jest.fn();

      const unsubscribe = subscribeToSession(created.roomCode, callback);

      // Wait for at least one callback
      await new Promise((resolve) => setTimeout(resolve, 1100));

      expect(callback).toHaveBeenCalled();
      expect(callback.mock.calls[0][0]?.id).toBe(created.id);

      unsubscribe();
    });

    it('should stop calling callback after unsubscribe', async () => {
      const created = await createSession('Alice');
      const callback = jest.fn();

      const unsubscribe = subscribeToSession(created.roomCode, callback);

      await new Promise((resolve) => setTimeout(resolve, 1100));
      const callCountBeforeUnsubscribe = callback.mock.calls.length;

      unsubscribe();

      await new Promise((resolve) => setTimeout(resolve, 1100));
      const callCountAfterUnsubscribe = callback.mock.calls.length;

      expect(callCountAfterUnsubscribe).toBe(callCountBeforeUnsubscribe);
    });
  });
});
