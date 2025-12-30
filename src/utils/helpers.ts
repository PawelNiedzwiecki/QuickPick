/**
 * QuickPick Helper Functions
 * Utility functions used throughout the application
 */

import { SESSION_CONFIG } from './constants';

/**
 * Generate a random 4-digit room code
 * Avoids ambiguous characters (0, O, 1, I, L)
 */
export function generateRoomCode(): string {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < SESSION_CONFIG.CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Validate a room code format
 */
export function isValidRoomCode(code: string): boolean {
  if (!code || code.length !== SESSION_CONFIG.CODE_LENGTH) {
    return false;
  }
  return /^[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/.test(code.toUpperCase());
}

/**
 * Format room code for display (with spaces)
 */
export function formatRoomCode(code: string): string {
  return code.toUpperCase().split('').join(' ');
}

/**
 * Generate a unique participant ID
 */
export function generateParticipantId(): string {
  return `p_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `s_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Calculate session expiration timestamp
 */
export function calculateExpirationTime(): number {
  return Date.now() + SESSION_CONFIG.TIMEOUT_MINUTES * 60 * 1000;
}

/**
 * Check if a session has expired
 */
export function isSessionExpired(expiresAt: number): boolean {
  return Date.now() > expiresAt;
}

/**
 * Format time remaining in mm:ss format
 */
export function formatTimeRemaining(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get TMDB image URL
 */
export function getTMDBImageUrl(
  path: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null;
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

/**
 * Format runtime in hours and minutes
 */
export function formatRuntime(minutes: number | null): string {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format vote average to percentage
 */
export function formatRating(voteAverage: number): string {
  return `${Math.round(voteAverage * 10)}%`;
}

/**
 * Get year from date string
 */
export function getYear(dateString: string): string {
  if (!dateString) return 'N/A';
  return dateString.split('-')[0];
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength - 3)}...`;
}

/**
 * Delay helper for async operations
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate voting results from votes
 */
export function calculateVotingResults(
  votes: { participantId: string; recommendationId: string; rank: number }[],
  recommendationIds: string[]
): { recommendationId: string; totalPoints: number; voteCount: number }[] {
  const results = recommendationIds.map((id) => ({
    recommendationId: id,
    totalPoints: 0,
    voteCount: 0,
  }));

  // Points: 1st place = 3, 2nd = 2, 3rd = 1
  const pointsMap: Record<number, number> = { 1: 3, 2: 2, 3: 1 };

  votes.forEach((vote) => {
    const result = results.find((r) => r.recommendationId === vote.recommendationId);
    if (result) {
      result.totalPoints += pointsMap[vote.rank] || 0;
      result.voteCount++;
    }
  });

  return results.sort((a, b) => b.totalPoints - a.totalPoints);
}
