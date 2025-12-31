import {
  generateRoomCode,
  isValidRoomCode,
  formatRoomCode,
  generateParticipantId,
  generateSessionId,
  isSessionExpired,
  formatTimeRemaining,
  getTMDBImageUrl,
  formatRuntime,
  formatRating,
  getYear,
  truncateText,
  calculateVotingResults,
} from '../utils/helpers';

describe('Room Code Functions', () => {
  describe('generateRoomCode', () => {
    it('should generate a 4-character code', () => {
      const code = generateRoomCode();
      expect(code).toHaveLength(4);
    });

    it('should only contain valid characters', () => {
      const validChars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
      for (let i = 0; i < 100; i++) {
        const code = generateRoomCode();
        for (const char of code) {
          expect(validChars).toContain(char);
        }
      }
    });

    it('should not contain ambiguous characters', () => {
      const ambiguous = ['0', 'O', '1', 'I', 'L'];
      for (let i = 0; i < 100; i++) {
        const code = generateRoomCode();
        for (const char of ambiguous) {
          expect(code).not.toContain(char);
        }
      }
    });
  });

  describe('isValidRoomCode', () => {
    it('should return true for valid codes', () => {
      expect(isValidRoomCode('AB23')).toBe(true);
      expect(isValidRoomCode('WXYZ')).toBe(true);
      expect(isValidRoomCode('2345')).toBe(true);
    });

    it('should return false for invalid codes', () => {
      expect(isValidRoomCode('')).toBe(false);
      expect(isValidRoomCode('ABC')).toBe(false);
      expect(isValidRoomCode('ABCDE')).toBe(false);
      expect(isValidRoomCode('AB01')).toBe(false); // contains 0 and 1
      expect(isValidRoomCode('OILK')).toBe(false); // contains O, I, L
    });

    it('should be case insensitive', () => {
      expect(isValidRoomCode('ab23')).toBe(true);
      expect(isValidRoomCode('Ab23')).toBe(true);
    });
  });

  describe('formatRoomCode', () => {
    it('should format code with spaces', () => {
      expect(formatRoomCode('AB23')).toBe('A B 2 3');
    });

    it('should uppercase the code', () => {
      expect(formatRoomCode('ab23')).toBe('A B 2 3');
    });
  });
});

describe('ID Generation Functions', () => {
  describe('generateParticipantId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateParticipantId());
      }
      expect(ids.size).toBe(100);
    });

    it('should start with p_ prefix', () => {
      const id = generateParticipantId();
      expect(id.startsWith('p_')).toBe(true);
    });
  });

  describe('generateSessionId', () => {
    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 100; i++) {
        ids.add(generateSessionId());
      }
      expect(ids.size).toBe(100);
    });

    it('should start with s_ prefix', () => {
      const id = generateSessionId();
      expect(id.startsWith('s_')).toBe(true);
    });
  });
});

describe('Session Functions', () => {
  describe('isSessionExpired', () => {
    it('should return true for past timestamps', () => {
      const pastTime = Date.now() - 1000;
      expect(isSessionExpired(pastTime)).toBe(true);
    });

    it('should return false for future timestamps', () => {
      const futureTime = Date.now() + 60000;
      expect(isSessionExpired(futureTime)).toBe(false);
    });
  });
});

describe('Formatting Functions', () => {
  describe('formatTimeRemaining', () => {
    it('should format seconds correctly', () => {
      expect(formatTimeRemaining(0)).toBe('0:00');
      expect(formatTimeRemaining(30)).toBe('0:30');
      expect(formatTimeRemaining(60)).toBe('1:00');
      expect(formatTimeRemaining(90)).toBe('1:30');
      expect(formatTimeRemaining(125)).toBe('2:05');
    });
  });

  describe('formatRuntime', () => {
    it('should format minutes only', () => {
      expect(formatRuntime(45)).toBe('45m');
    });

    it('should format hours only', () => {
      expect(formatRuntime(60)).toBe('1h');
      expect(formatRuntime(120)).toBe('2h');
    });

    it('should format hours and minutes', () => {
      expect(formatRuntime(90)).toBe('1h 30m');
      expect(formatRuntime(135)).toBe('2h 15m');
    });

    it('should return N/A for null', () => {
      expect(formatRuntime(null)).toBe('N/A');
    });
  });

  describe('formatRating', () => {
    it('should convert to percentage', () => {
      expect(formatRating(7.5)).toBe('75%');
      expect(formatRating(8.7)).toBe('87%');
      expect(formatRating(10)).toBe('100%');
    });
  });

  describe('getYear', () => {
    it('should extract year from date string', () => {
      expect(getYear('2024-01-15')).toBe('2024');
      expect(getYear('1999-12-31')).toBe('1999');
    });

    it('should return N/A for empty string', () => {
      expect(getYear('')).toBe('N/A');
    });
  });

  describe('truncateText', () => {
    it('should not truncate short text', () => {
      expect(truncateText('Hello', 10)).toBe('Hello');
    });

    it('should truncate long text with ellipsis', () => {
      expect(truncateText('Hello World', 8)).toBe('Hello...');
    });

    it('should handle exact length', () => {
      expect(truncateText('Hello', 5)).toBe('Hello');
    });
  });
});

describe('TMDB Functions', () => {
  describe('getTMDBImageUrl', () => {
    it('should return correct URL for valid path', () => {
      const url = getTMDBImageUrl('/abc123.jpg');
      expect(url).toBe('https://image.tmdb.org/t/p/w500/abc123.jpg');
    });

    it('should use specified size', () => {
      const url = getTMDBImageUrl('/abc123.jpg', 'w185');
      expect(url).toBe('https://image.tmdb.org/t/p/w185/abc123.jpg');
    });

    it('should return null for null path', () => {
      expect(getTMDBImageUrl(null)).toBeNull();
    });
  });
});

describe('Voting Functions', () => {
  describe('calculateVotingResults', () => {
    it('should calculate points correctly', () => {
      const votes = [
        { participantId: 'p1', recommendationId: 'r1', rank: 1 },
        { participantId: 'p1', recommendationId: 'r2', rank: 2 },
        { participantId: 'p1', recommendationId: 'r3', rank: 3 },
        { participantId: 'p2', recommendationId: 'r1', rank: 1 },
        { participantId: 'p2', recommendationId: 'r3', rank: 2 },
        { participantId: 'p2', recommendationId: 'r2', rank: 3 },
      ];
      const recommendationIds = ['r1', 'r2', 'r3'];

      const results = calculateVotingResults(votes, recommendationIds);

      expect(results[0].recommendationId).toBe('r1'); // 3 + 3 = 6 points
      expect(results[0].totalPoints).toBe(6);
      expect(results[1].recommendationId).toBe('r3'); // 1 + 2 = 3 points
      expect(results[1].totalPoints).toBe(3);
      expect(results[2].recommendationId).toBe('r2'); // 2 + 1 = 3 points
      expect(results[2].totalPoints).toBe(3);
    });

    it('should return empty results for no votes', () => {
      const results = calculateVotingResults([], ['r1', 'r2']);
      expect(results).toHaveLength(2);
      expect(results[0].totalPoints).toBe(0);
      expect(results[1].totalPoints).toBe(0);
    });
  });
});
