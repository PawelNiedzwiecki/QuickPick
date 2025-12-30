/**
 * Session Store
 * Manages session state using Zustand
 */

import { create } from 'zustand';
import {
  Session,
  Participant,
  LoadingState,
  AppError,
  RoomCode,
  UserPreferences,
  Vote,
  Recommendation,
} from '../types';
import {
  generateRoomCode,
  generateSessionId,
  generateParticipantId,
  calculateExpirationTime,
} from '../utils/helpers';

interface SessionStore {
  // State
  session: Session | null;
  currentParticipant: Participant | null;
  loadingState: LoadingState;
  error: AppError | null;

  // Actions
  createSession: (hostName: string) => Promise<Session>;
  joinSession: (roomCode: RoomCode, participantName: string) => Promise<void>;
  leaveSession: () => void;
  addParticipant: (participant: Participant) => void;
  removeParticipant: (participantId: string) => void;
  updateSessionStatus: (status: Session['status']) => void;
  submitPreferences: (participantId: string, preferences: UserPreferences) => void;
  setRecommendations: (recommendations: Recommendation[]) => void;
  submitVotes: (votes: Vote[]) => void;
  setWinner: (recommendation: Recommendation) => void;
  setError: (error: AppError | null) => void;
  setLoading: (state: LoadingState) => void;
  reset: () => void;
}

const initialState = {
  session: null,
  currentParticipant: null,
  loadingState: 'idle' as LoadingState,
  error: null,
};

export const useSessionStore = create<SessionStore>((set, get) => ({
  ...initialState,

  /**
   * Create a new session as host
   */
  createSession: async (hostName: string): Promise<Session> => {
    set({ loadingState: 'loading', error: null });

    try {
      const sessionId = generateSessionId();
      const roomCode = generateRoomCode();
      const hostId = generateParticipantId();

      const host: Participant = {
        id: hostId,
        name: hostName,
        isHost: true,
        hasSubmittedPreferences: false,
        joinedAt: Date.now(),
      };

      const session: Session = {
        id: sessionId,
        roomCode,
        hostId,
        status: 'waiting',
        participants: [host],
        createdAt: Date.now(),
        expiresAt: calculateExpirationTime(),
      };

      // In production, this would save to Firebase
      // For now, we just set local state
      set({
        session,
        currentParticipant: host,
        loadingState: 'success',
      });

      return session;
    } catch (error) {
      const appError: AppError = {
        code: 'CREATE_SESSION_ERROR',
        message: 'Failed to create session',
        details: error,
      };
      set({ loadingState: 'error', error: appError });
      throw appError;
    }
  },

  /**
   * Join an existing session
   */
  joinSession: async (roomCode: RoomCode, participantName: string): Promise<void> => {
    set({ loadingState: 'loading', error: null });

    try {
      const { session } = get();

      // In production, this would fetch from Firebase
      // For now, we simulate joining the local session
      if (!session || session.roomCode !== roomCode.toUpperCase()) {
        throw new Error('Session not found');
      }

      if (session.status !== 'waiting') {
        throw new Error('Session has already started');
      }

      if (session.participants.length >= 8) {
        throw new Error('Session is full');
      }

      const participantId = generateParticipantId();
      const participant: Participant = {
        id: participantId,
        name: participantName,
        isHost: false,
        hasSubmittedPreferences: false,
        joinedAt: Date.now(),
      };

      set((state) => ({
        session: state.session
          ? {
              ...state.session,
              participants: [...state.session.participants, participant],
            }
          : null,
        currentParticipant: participant,
        loadingState: 'success',
      }));
    } catch (error) {
      const appError: AppError = {
        code: 'JOIN_SESSION_ERROR',
        message: error instanceof Error ? error.message : 'Failed to join session',
        details: error,
      };
      set({ loadingState: 'error', error: appError });
      throw appError;
    }
  },

  /**
   * Leave the current session
   */
  leaveSession: () => {
    const { session, currentParticipant } = get();

    if (session && currentParticipant) {
      // If host leaves, end the session
      if (currentParticipant.isHost) {
        set(initialState);
      } else {
        // Remove participant from session
        set((state) => ({
          session: state.session
            ? {
                ...state.session,
                participants: state.session.participants.filter(
                  (p) => p.id !== currentParticipant.id
                ),
              }
            : null,
          currentParticipant: null,
        }));
      }
    }
  },

  /**
   * Add a participant to the session (for real-time updates)
   */
  addParticipant: (participant: Participant) => {
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            participants: [...state.session.participants, participant],
          }
        : null,
    }));
  },

  /**
   * Remove a participant from the session
   */
  removeParticipant: (participantId: string) => {
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            participants: state.session.participants.filter((p) => p.id !== participantId),
          }
        : null,
    }));
  },

  /**
   * Update session status
   */
  updateSessionStatus: (status: Session['status']) => {
    set((state) => ({
      session: state.session ? { ...state.session, status } : null,
    }));
  },

  /**
   * Submit preferences for a participant
   */
  submitPreferences: (participantId: string, preferences: UserPreferences) => {
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            participants: state.session.participants.map((p) =>
              p.id === participantId
                ? { ...p, preferences, hasSubmittedPreferences: true }
                : p
            ),
          }
        : null,
      currentParticipant:
        state.currentParticipant?.id === participantId
          ? { ...state.currentParticipant, preferences, hasSubmittedPreferences: true }
          : state.currentParticipant,
    }));
  },

  /**
   * Set AI-generated recommendations
   */
  setRecommendations: (recommendations: Recommendation[]) => {
    set((state) => ({
      session: state.session ? { ...state.session, recommendations } : null,
    }));
  },

  /**
   * Submit votes
   */
  submitVotes: (votes: Vote[]) => {
    set((state) => ({
      session: state.session
        ? {
            ...state.session,
            votes: [...(state.session.votes || []), ...votes],
          }
        : null,
    }));
  },

  /**
   * Set the winning recommendation
   */
  setWinner: (recommendation: Recommendation) => {
    set((state) => ({
      session: state.session
        ? { ...state.session, winner: recommendation, status: 'complete' }
        : null,
    }));
  },

  /**
   * Set error state
   */
  setError: (error: AppError | null) => {
    set({ error });
  },

  /**
   * Set loading state
   */
  setLoading: (loadingState: LoadingState) => {
    set({ loadingState });
  },

  /**
   * Reset store to initial state
   */
  reset: () => {
    set(initialState);
  },
}));
