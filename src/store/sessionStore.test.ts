/**
 * Unit tests for Session Store
 */

import { renderHook, act } from '@testing-library/react-native';
import { useSessionStore } from './sessionStore';
import type { Recommendation, UserPreferences, Vote } from '../types';

describe('Session Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useSessionStore());
    act(() => {
      result.current.reset();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useSessionStore());

      expect(result.current.session).toBeNull();
      expect(result.current.currentParticipant).toBeNull();
      expect(result.current.loadingState).toBe('idle');
      expect(result.current.error).toBeNull();
    });
  });

  describe('createSession', () => {
    it('should create a new session with host', async () => {
      const { result } = renderHook(() => useSessionStore());

      let session;
      await act(async () => {
        session = await result.current.createSession('Alice');
      });

      expect(result.current.session).toBeDefined();
      expect(result.current.session?.participants).toHaveLength(1);
      expect(result.current.session?.participants[0].name).toBe('Alice');
      expect(result.current.session?.participants[0].isHost).toBe(true);
      expect(result.current.currentParticipant?.name).toBe('Alice');
      expect(result.current.loadingState).toBe('success');
    });

    it('should set session status to waiting', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      expect(result.current.session?.status).toBe('waiting');
    });

    it('should generate unique room code and session ID', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      expect(result.current.session?.roomCode).toHaveLength(4);
      expect(result.current.session?.id).toMatch(/^s_/);
    });
  });

  describe('leaveSession', () => {
    it('should reset store when host leaves', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      expect(result.current.session).toBeDefined();

      act(() => {
        result.current.leaveSession();
      });

      expect(result.current.session).toBeNull();
      expect(result.current.currentParticipant).toBeNull();
    });
  });

  describe('addParticipant', () => {
    it('should add participant to session', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const newParticipant = {
        id: 'p_123',
        name: 'Bob',
        isHost: false,
        hasSubmittedPreferences: false,
        joinedAt: Date.now(),
      };

      act(() => {
        result.current.addParticipant(newParticipant);
      });

      expect(result.current.session?.participants).toHaveLength(2);
      expect(result.current.session?.participants[1].name).toBe('Bob');
    });
  });

  describe('removeParticipant', () => {
    it('should remove participant from session', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const newParticipant = {
        id: 'p_123',
        name: 'Bob',
        isHost: false,
        hasSubmittedPreferences: false,
        joinedAt: Date.now(),
      };

      act(() => {
        result.current.addParticipant(newParticipant);
      });

      expect(result.current.session?.participants).toHaveLength(2);

      act(() => {
        result.current.removeParticipant('p_123');
      });

      expect(result.current.session?.participants).toHaveLength(1);
      expect(
        result.current.session?.participants.find((p) => p.id === 'p_123')
      ).toBeUndefined();
    });
  });

  describe('updateSessionStatus', () => {
    it('should update session status', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      act(() => {
        result.current.updateSessionStatus('voting');
      });

      expect(result.current.session?.status).toBe('voting');
    });
  });

  describe('submitPreferences', () => {
    it('should submit preferences for participant', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const preferences: UserPreferences = {
        mood: 'happy',
        energy: 'chill',
        runtime: 'short',
        contentType: 'movie',
      };

      const participantId = result.current.session!.participants[0].id;

      act(() => {
        result.current.submitPreferences(participantId, preferences);
      });

      const participant = result.current.session?.participants.find(
        (p) => p.id === participantId
      );

      expect(participant?.preferences).toEqual(preferences);
      expect(participant?.hasSubmittedPreferences).toBe(true);
    });

    it('should update current participant preferences', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const preferences: UserPreferences = {
        mood: 'thrilling',
        energy: 'intense',
        runtime: 'long',
        contentType: 'movie',
      };

      const participantId = result.current.currentParticipant!.id;

      act(() => {
        result.current.submitPreferences(participantId, preferences);
      });

      expect(result.current.currentParticipant?.preferences).toEqual(preferences);
      expect(result.current.currentParticipant?.hasSubmittedPreferences).toBe(true);
    });
  });

  describe('setRecommendations', () => {
    it('should set recommendations', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const recommendations: Recommendation[] = [
        {
          id: 'movie_1',
          tmdbId: 1,
          title: 'Test Movie',
          overview: 'Test',
          posterPath: null,
          backdropPath: null,
          releaseDate: '2024-01-01',
          voteAverage: 8.0,
          genres: [],
          runtime: 120,
          contentType: 'movie',
          matchScore: 90,
          matchReason: 'Test',
        },
      ];

      act(() => {
        result.current.setRecommendations(recommendations);
      });

      expect(result.current.session?.recommendations).toEqual(recommendations);
    });
  });

  describe('submitVotes', () => {
    it('should add votes to session', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const votes: Vote[] = [
        {
          participantId: 'p1',
          recommendationId: 'r1',
          rank: 1,
        },
      ];

      act(() => {
        result.current.submitVotes(votes);
      });

      expect(result.current.session?.votes).toEqual(votes);
    });

    it('should append new votes to existing votes', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const votes1: Vote[] = [
        { participantId: 'p1', recommendationId: 'r1', rank: 1 },
      ];

      const votes2: Vote[] = [
        { participantId: 'p2', recommendationId: 'r2', rank: 1 },
      ];

      act(() => {
        result.current.submitVotes(votes1);
      });

      act(() => {
        result.current.submitVotes(votes2);
      });

      expect(result.current.session?.votes).toHaveLength(2);
    });
  });

  describe('setWinner', () => {
    it('should set winner and update status', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      const winner: Recommendation = {
        id: 'movie_1',
        tmdbId: 1,
        title: 'Winner',
        overview: 'The winning movie',
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

      act(() => {
        result.current.setWinner(winner);
      });

      expect(result.current.session?.winner).toEqual(winner);
      expect(result.current.session?.status).toBe('complete');
    });
  });

  describe('setError', () => {
    it('should set error state', () => {
      const { result } = renderHook(() => useSessionStore());

      const error = {
        code: 'TEST_ERROR',
        message: 'Test error message',
      };

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toEqual(error);
    });

    it('should clear error when set to null', () => {
      const { result } = renderHook(() => useSessionStore());

      const error = {
        code: 'TEST_ERROR',
        message: 'Test error message',
      };

      act(() => {
        result.current.setError(error);
      });

      expect(result.current.error).toEqual(error);

      act(() => {
        result.current.setError(null);
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('setLoading', () => {
    it('should update loading state', () => {
      const { result } = renderHook(() => useSessionStore());

      act(() => {
        result.current.setLoading('loading');
      });

      expect(result.current.loadingState).toBe('loading');

      act(() => {
        result.current.setLoading('success');
      });

      expect(result.current.loadingState).toBe('success');
    });
  });

  describe('reset', () => {
    it('should reset store to initial state', async () => {
      const { result } = renderHook(() => useSessionStore());

      await act(async () => {
        await result.current.createSession('Alice');
      });

      expect(result.current.session).toBeDefined();

      act(() => {
        result.current.reset();
      });

      expect(result.current.session).toBeNull();
      expect(result.current.currentParticipant).toBeNull();
      expect(result.current.loadingState).toBe('idle');
      expect(result.current.error).toBeNull();
    });
  });
});
