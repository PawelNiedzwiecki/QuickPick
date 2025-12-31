/**
 * Unit tests for helper functions
 */

import {
  generateRoomCode,
  isValidRoomCode,
  formatRoomCode,
  generateParticipantId,
  generateSessionId,
  calculateExpirationTime,
  isSessionExpired,
  formatTimeRemaining,
  getTMDBImageUrl,
  formatRuntime,
  formatRating,
  getYear,
  truncateText,
  delay,
  calculateVotingResults,
} from './helpers';
import { SESSION_CONFIG } from './constants';

describe('Room Code Functions', () => {
  describe('generateRoomCode', () => {
    it('should generate a code of the correct length', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(SESSION_CONFIG.CODE_LENGTH);
    });

    it('should only contain valid characters', () => {
      const code = generateRoomCode();
      const validChars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
      for (const char of code) {
        expect(validChars).toContain(char);
      }
    });

    it('should generate different codes on multiple calls', () => {
      const codes = new Set();
      for (let i = 0; i < 100; i++) {
        codes.add(generateRoomCode());
      }
      expect(codes.size).toBeGreaterThan(90); // Allow for some collisions
    });
  });

  describe('isValidRoomCode', () => {
    it('should return true for valid codes', () => {
      expect(isValidRoomCode('ABCD')).toBe(true);
      expect(isValidRoomCode('2345')).toBe(true);
      expect(isValidRoomCode('XYZW')).toBe(true);
    });

    it('should return false for codes with invalid length', () => {
      expect(isValidRoomCode('ABC')).toBe(false);
      expect(isValidRoomCode('ABCDE')).toBe(false);
      expect(isValidRoomCode('')).toBe(false);
    });

    it('should return false for codes with invalid characters', () => {
      expect(isValidRoomCode('ABC0')).toBe(false); // 0 not allowed
      expect(isValidRoomCode('ABCI')).toBe(false); // I not allowed
      expect(isValidRoomCode('ABCL')).toBe(false); // L not allowed
      expect(isValidRoomCode('ABC1')).toBe(false); // 1 not allowed
    });

    it('should handle lowercase codes', () => {
      expect(isValidRoomCode('abcd')).toBe(true);
    });

    it('should return false for null or undefined', () => {
      expect(isValidRoomCode(null as any)).toBe(false);
      expect(isValidRoomCode(undefined as any)).toBe(false);
    });
  });

  describe('formatRoomCode', () => {
    it('should format code with spaces between characters', () => {
      expect(formatRoomCode('ABCD')).toBe('A B C D');
    });

    it('should convert lowercase to uppercase', () => {
      expect(formatRoomCode('abcd')).toBe('A B C D');
    });
  });
});

describe('ID Generation Functions', () => {
  describe('generateParticipantId', () => {
    it('should generate ID with correct prefix', () => {
      const id = generateParticipantId();
      expect(id).toMatch(/^p_/);
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateParticipantId());
      }
      expect(ids.size).toBe(100);
    });
  });

  describe('generateSessionId', () => {
    it('should generate ID with correct prefix', () => {
      const id = generateSessionId();
      expect(id).toMatch(/^s_/);
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      for (let i = 0; i < 100; i++) {
        ids.add(generateSessionId());
      }
      expect(ids.size).toBe(100);
    });
  });
});

describe('Session Time Functions', () => {
  describe('calculateExpirationTime', () => {
    it('should return a timestamp in the future', () => {
      const now = Date.now();
      const expiresAt = calculateExpirationTime();
      expect(expiresAt).toBeGreaterThan(now);
    });

    it('should be SESSION_CONFIG.TIMEOUT_MINUTES in the future', () => {
      const now = Date.now();
      const expiresAt = calculateExpirationTime();
      const expectedDuration = SESSION_CONFIG.TIMEOUT_MINUTES * 60 * 1000;
      const actualDuration = expiresAt - now;
      expect(actualDuration).toBeGreaterThanOrEqual(expectedDuration - 100); // Allow small variance
      expect(actualDuration).toBeLessThanOrEqual(expectedDuration + 100);
    });
  });

  describe('isSessionExpired', () => {
    it('should return true for past timestamps', () => {
      const pastTime = Date.now() - 1000;
      expect(isSessionExpired(pastTime)).toBe(true);
    });

    it('should return false for future timestamps', () => {
      const futureTime = Date.now() + 1000;
      expect(isSessionExpired(futureTime)).toBe(false);
    });
  });

  describe('formatTimeRemaining', () => {
    it('should format seconds into mm:ss format', () => {
      expect(formatTimeRemaining(0)).toBe('0:00');
      expect(formatTimeRemaining(30)).toBe('0:30');
      expect(formatTimeRemaining(60)).toBe('1:00');
      expect(formatTimeRemaining(90)).toBe('1:30');
      expect(formatTimeRemaining(125)).toBe('2:05');
    });

    it('should pad single digit seconds with zero', () => {
      expect(formatTimeRemaining(65)).toBe('1:05');
      expect(formatTimeRemaining(5)).toBe('0:05');
    });
  });
});

describe('TMDB Helper Functions', () => {
  describe('getTMDBImageUrl', () => {
    it('should return null for null path', () => {
      expect(getTMDBImageUrl(null)).toBe(null);
    });

    it('should construct correct URL with default size', () => {
      const url = getTMDBImageUrl('/path/to/image.jpg');
      expect(url).toBe('https://image.tmdb.org/t/p/w500/path/to/image.jpg');
    });

    it('should construct correct URL with custom size', () => {
      const url = getTMDBImageUrl('/path/to/image.jpg', 'w780');
      expect(url).toBe('https://image.tmdb.org/t/p/w780/path/to/image.jpg');
    });
  });

  describe('formatRuntime', () => {
    it('should return N/A for null runtime', () => {
      expect(formatRuntime(null)).toBe('N/A');
    });

    it('should format runtime less than 60 minutes', () => {
      expect(formatRuntime(45)).toBe('45m');
    });

    it('should format runtime exactly 60 minutes', () => {
      expect(formatRuntime(60)).toBe('1h');
    });

    it('should format runtime with hours and minutes', () => {
      expect(formatRuntime(90)).toBe('1h 30m');
      expect(formatRuntime(125)).toBe('2h 5m');
      expect(formatRuntime(180)).toBe('3h');
    });
  });

  describe('formatRating', () => {
    it('should convert vote average to percentage', () => {
      expect(formatRating(8.5)).toBe('85%');
      expect(formatRating(7.0)).toBe('70%');
      expect(formatRating(9.2)).toBe('92%');
    });

    it('should round to nearest integer', () => {
      expect(formatRating(8.54)).toBe('85%');
      expect(formatRating(8.55)).toBe('86%');
    });
  });

  describe('getYear', () => {
    it('should extract year from date string', () => {
      expect(getYear('2024-05-15')).toBe('2024');
      expect(getYear('1999-12-31')).toBe('1999');
    });

    it('should return N/A for empty string', () => {
      expect(getYear('')).toBe('N/A');
    });
  });
});

describe('Text Utilities', () => {
  describe('truncateText', () => {
    it('should not truncate text shorter than maxLength', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should truncate text longer than maxLength', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
      expect(truncateText('This is a long sentence', 10)).toBe('This is...');
    });

    it('should handle exact maxLength', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });
  });
});

describe('Async Utilities', () => {
  describe('delay', () => {
    it('should delay execution by specified milliseconds', async () => {
      const start = Date.now();
      await delay(100);
      const end = Date.now();
      const duration = end - start;
      expect(duration).toBeGreaterThanOrEqual(95); // Allow small variance
      expect(duration).toBeLessThan(150);
    });
  });
});

describe('Voting Functions', () => {
  describe('calculateVotingResults', () => {
    it('should calculate correct points for votes', () => {
      const votes = [
        { participantId: 'p1', recommendationId: 'r1', rank: 1 },
        { participantId: 'p2', recommendationId: 'r1', rank: 2 },
        { participantId: 'p3', recommendationId: 'r2', rank: 1 },
      ];
      const recommendationIds = ['r1', 'r2', 'r3'];

      const results = calculateVotingResults(votes, recommendationIds);

      expect(results).toHaveLength(3);
      expect(results[0].recommendationId).toBe('r1'); // 3 + 2 = 5 points
      expect(results[0].totalPoints).toBe(5);
      expect(results[0].voteCount).toBe(2);
      expect(results[1].recommendationId).toBe('r2'); // 3 points
      expect(results[1].totalPoints).toBe(3);
      expect(results[1].voteCount).toBe(1);
      expect(results[2].recommendationId).toBe('r3'); // 0 points
      expect(results[2].totalPoints).toBe(0);
      expect(results[2].voteCount).toBe(0);
    });

    it('should sort results by total points descending', () => {
      const votes = [
        { participantId: 'p1', recommendationId: 'r1', rank: 2 },
        { participantId: 'p2', recommendationId: 'r2', rank: 1 },
        { participantId: 'p3', recommendationId: 'r3', rank: 3 },
      ];
      const recommendationIds = ['r1', 'r2', 'r3'];

      const results = calculateVotingResults(votes, recommendationIds);

      expect(results[0].totalPoints).toBeGreaterThanOrEqual(results[1].totalPoints);
      expect(results[1].totalPoints).toBeGreaterThanOrEqual(results[2].totalPoints);
    });

    it('should handle empty votes', () => {
      const votes: any[] = [];
      const recommendationIds = ['r1', 'r2'];

      const results = calculateVotingResults(votes, recommendationIds);

      expect(results).toHaveLength(2);
      expect(results[0].totalPoints).toBe(0);
      expect(results[1].totalPoints).toBe(0);
    });

    it('should correctly assign points for all ranks', () => {
      const votes = [
        { participantId: 'p1', recommendationId: 'r1', rank: 1 }, // 3 points
        { participantId: 'p2', recommendationId: 'r2', rank: 2 }, // 2 points
        { participantId: 'p3', recommendationId: 'r3', rank: 3 }, // 1 point
      ];
      const recommendationIds = ['r1', 'r2', 'r3'];

      const results = calculateVotingResults(votes, recommendationIds);

      expect(results[0].totalPoints).toBe(3);
      expect(results[1].totalPoints).toBe(2);
      expect(results[2].totalPoints).toBe(1);
    });
  });
});
