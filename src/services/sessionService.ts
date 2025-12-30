/**
 * Session Service
 * Handles session management with Firebase (mock implementation for now)
 */

import {
  Session,
  Participant,
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
  isSessionExpired,
} from '../utils/helpers';

// Mock session storage (will be replaced with Firebase)
const mockSessions = new Map<string, Session>();

/**
 * Create a new session
 */
export async function createSession(hostName: string): Promise<Session> {
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

  // Store in mock storage
  mockSessions.set(roomCode, session);

  return session;
}

/**
 * Get session by room code
 */
export async function getSessionByCode(roomCode: RoomCode): Promise<Session | null> {
  const session = mockSessions.get(roomCode.toUpperCase());

  if (!session) {
    return null;
  }

  // Check if session has expired
  if (isSessionExpired(session.expiresAt)) {
    mockSessions.delete(roomCode.toUpperCase());
    return null;
  }

  return session;
}

/**
 * Join an existing session
 */
export async function joinSession(
  roomCode: RoomCode,
  participantName: string
): Promise<{ session: Session; participant: Participant }> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    throw new Error('Session not found');
  }

  if (session.status !== 'waiting') {
    throw new Error('Session has already started');
  }

  if (session.participants.length >= 8) {
    throw new Error('Session is full');
  }

  const participant: Participant = {
    id: generateParticipantId(),
    name: participantName,
    isHost: false,
    hasSubmittedPreferences: false,
    joinedAt: Date.now(),
  };

  session.participants.push(participant);
  mockSessions.set(roomCode.toUpperCase(), session);

  return { session, participant };
}

/**
 * Leave a session
 */
export async function leaveSession(
  roomCode: RoomCode,
  participantId: string
): Promise<void> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    return;
  }

  const participant = session.participants.find((p) => p.id === participantId);

  if (!participant) {
    return;
  }

  // If host leaves, delete the session
  if (participant.isHost) {
    mockSessions.delete(roomCode.toUpperCase());
    return;
  }

  // Remove participant
  session.participants = session.participants.filter((p) => p.id !== participantId);
  mockSessions.set(roomCode.toUpperCase(), session);
}

/**
 * Update session status
 */
export async function updateSessionStatus(
  roomCode: RoomCode,
  status: Session['status']
): Promise<Session> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    throw new Error('Session not found');
  }

  session.status = status;
  mockSessions.set(roomCode.toUpperCase(), session);

  return session;
}

/**
 * Submit preferences for a participant
 */
export async function submitPreferences(
  roomCode: RoomCode,
  participantId: string,
  preferences: UserPreferences
): Promise<void> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    throw new Error('Session not found');
  }

  const participant = session.participants.find((p) => p.id === participantId);

  if (!participant) {
    throw new Error('Participant not found');
  }

  participant.preferences = preferences;
  participant.hasSubmittedPreferences = true;
  mockSessions.set(roomCode.toUpperCase(), session);
}

/**
 * Check if all participants have submitted preferences
 */
export async function allPreferencesSubmitted(roomCode: RoomCode): Promise<boolean> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    return false;
  }

  return session.participants.every((p) => p.hasSubmittedPreferences);
}

/**
 * Set recommendations for a session
 */
export async function setRecommendations(
  roomCode: RoomCode,
  recommendations: Recommendation[]
): Promise<void> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    throw new Error('Session not found');
  }

  session.recommendations = recommendations;
  session.status = 'voting';
  mockSessions.set(roomCode.toUpperCase(), session);
}

/**
 * Submit votes for a session
 */
export async function submitVotes(
  roomCode: RoomCode,
  votes: Vote[]
): Promise<void> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    throw new Error('Session not found');
  }

  session.votes = [...(session.votes || []), ...votes];
  mockSessions.set(roomCode.toUpperCase(), session);
}

/**
 * Set the winning recommendation
 */
export async function setWinner(
  roomCode: RoomCode,
  winner: Recommendation
): Promise<void> {
  const session = await getSessionByCode(roomCode);

  if (!session) {
    throw new Error('Session not found');
  }

  session.winner = winner;
  session.status = 'complete';
  mockSessions.set(roomCode.toUpperCase(), session);
}

/**
 * Subscribe to session updates (mock implementation)
 * In production, this would use Firebase real-time listeners
 */
export function subscribeToSession(
  roomCode: RoomCode,
  callback: (session: Session | null) => void
): () => void {
  // Mock: poll every second
  const interval = setInterval(async () => {
    const session = await getSessionByCode(roomCode);
    callback(session);
  }, 1000);

  // Return unsubscribe function
  return () => clearInterval(interval);
}
