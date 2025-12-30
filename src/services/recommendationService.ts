/**
 * Recommendation Service
 * AI-powered recommendation engine (mock implementation for now)
 */

import {
  UserPreferences,
  Recommendation,
  Participant,
  Mood,
  EnergyLevel,
} from '../types';

// Mock movie data for demonstration
const MOCK_MOVIES: Recommendation[] = [
  {
    id: 'movie_550',
    tmdbId: 550,
    title: 'Fight Club',
    overview: 'A ticking-Loss bomb of a movie that will leave you questioning reality.',
    posterPath: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
    backdropPath: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
    releaseDate: '1999-10-15',
    voteAverage: 8.4,
    genres: [{ id: 18, name: 'Drama' }, { id: 53, name: 'Thriller' }],
    runtime: 139,
    contentType: 'movie',
    matchScore: 95,
    matchReason: 'Perfect for your intense, thoughtful mood',
  },
  {
    id: 'movie_238',
    tmdbId: 238,
    title: 'The Godfather',
    overview: 'The aging patriarch of an organized crime dynasty transfers control to his son.',
    posterPath: '/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
    backdropPath: '/tmU7GeKVybMWFButWEGl2M4GeiP.jpg',
    releaseDate: '1972-03-14',
    voteAverage: 8.7,
    genres: [{ id: 18, name: 'Drama' }, { id: 80, name: 'Crime' }],
    runtime: 175,
    contentType: 'movie',
    matchScore: 92,
    matchReason: 'An epic masterpiece for a long watch session',
  },
  {
    id: 'movie_27205',
    tmdbId: 27205,
    title: 'Inception',
    overview: 'A mind-bending thriller about dreams within dreams.',
    posterPath: '/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
    backdropPath: '/s3TBrRGB1iav7gFOCNx3H31MoES.jpg',
    releaseDate: '2010-07-15',
    voteAverage: 8.4,
    genres: [{ id: 28, name: 'Action' }, { id: 878, name: 'Science Fiction' }],
    runtime: 148,
    contentType: 'movie',
    matchScore: 88,
    matchReason: 'Thrilling and thought-provoking',
  },
  {
    id: 'movie_680',
    tmdbId: 680,
    title: 'Pulp Fiction',
    overview: 'Intersecting stories of crime and redemption in Los Angeles.',
    posterPath: '/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
    backdropPath: '/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg',
    releaseDate: '1994-09-10',
    voteAverage: 8.5,
    genres: [{ id: 53, name: 'Thriller' }, { id: 80, name: 'Crime' }],
    runtime: 154,
    contentType: 'movie',
    matchScore: 90,
    matchReason: 'A cult classic with intense energy',
  },
  {
    id: 'movie_155',
    tmdbId: 155,
    title: 'The Dark Knight',
    overview: 'Batman faces the Joker in a battle for Gotham\'s soul.',
    posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: '/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg',
    releaseDate: '2008-07-16',
    voteAverage: 8.5,
    genres: [{ id: 28, name: 'Action' }, { id: 80, name: 'Crime' }, { id: 18, name: 'Drama' }],
    runtime: 152,
    contentType: 'movie',
    matchScore: 94,
    matchReason: 'Intense action with deep themes',
  },
  {
    id: 'movie_13',
    tmdbId: 13,
    title: 'Forrest Gump',
    overview: 'Life is like a box of chocolates...',
    posterPath: '/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg',
    backdropPath: '/3h1JZGDhZ8nzxdgvkxha0qBqi05.jpg',
    releaseDate: '1994-06-23',
    voteAverage: 8.5,
    genres: [{ id: 18, name: 'Drama' }, { id: 35, name: 'Comedy' }, { id: 10749, name: 'Romance' }],
    runtime: 142,
    contentType: 'movie',
    matchScore: 89,
    matchReason: 'Heartwarming and feel-good',
  },
  {
    id: 'movie_120',
    tmdbId: 120,
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    overview: 'A hobbit embarks on an epic quest to destroy a powerful ring.',
    posterPath: '/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg',
    backdropPath: '/pIUvQ9Ed35wlWhY2oU6OmwEsmzG.jpg',
    releaseDate: '2001-12-18',
    voteAverage: 8.4,
    genres: [{ id: 12, name: 'Adventure' }, { id: 14, name: 'Fantasy' }, { id: 28, name: 'Action' }],
    runtime: 178,
    contentType: 'movie',
    matchScore: 91,
    matchReason: 'Epic adventure for a long watch',
  },
  {
    id: 'movie_496243',
    tmdbId: 496243,
    title: 'Parasite',
    overview: 'Greed and class discrimination threaten the symbiosis between two families.',
    posterPath: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdropPath: '/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg',
    releaseDate: '2019-05-30',
    voteAverage: 8.5,
    genres: [{ id: 35, name: 'Comedy' }, { id: 53, name: 'Thriller' }, { id: 18, name: 'Drama' }],
    runtime: 132,
    contentType: 'movie',
    matchScore: 93,
    matchReason: 'Gripping thriller with dark humor',
  },
];

const MOCK_TV_SHOWS: Recommendation[] = [
  {
    id: 'tv_1396',
    tmdbId: 1396,
    title: 'Breaking Bad',
    overview: 'A high school chemistry teacher turned methamphetamine manufacturer.',
    posterPath: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
    backdropPath: '/tsRy63Mu5cu8etL1X7ZLyf7UwLN.jpg',
    releaseDate: '2008-01-20',
    voteAverage: 8.9,
    genres: [{ id: 18, name: 'Drama' }],
    runtime: null,
    numberOfSeasons: 5,
    contentType: 'tv',
    matchScore: 96,
    matchReason: 'Intense drama with incredible character development',
  },
  {
    id: 'tv_1399',
    tmdbId: 1399,
    title: 'Game of Thrones',
    overview: 'Noble families fight for control of the Iron Throne.',
    posterPath: '/u3bZgnGQ9T01sWNhyveQz0wH0Hl.jpg',
    backdropPath: '/suopoADq0k8YZr4dQXcU6pToj6s.jpg',
    releaseDate: '2011-04-17',
    voteAverage: 8.4,
    genres: [{ id: 10765, name: 'Sci-Fi & Fantasy' }, { id: 18, name: 'Drama' }],
    runtime: null,
    numberOfSeasons: 8,
    contentType: 'tv',
    matchScore: 90,
    matchReason: 'Epic fantasy for binge-watching',
  },
  {
    id: 'tv_66732',
    tmdbId: 66732,
    title: 'Stranger Things',
    overview: 'Supernatural forces haunt a small town in the 1980s.',
    posterPath: '/49WJfeN0moxb9IPfGn8AIqMGskD.jpg',
    backdropPath: '/56v2KjBlU4XaOv9rVYEQypROD7P.jpg',
    releaseDate: '2016-07-15',
    voteAverage: 8.6,
    genres: [{ id: 18, name: 'Drama' }, { id: 9648, name: 'Mystery' }, { id: 10765, name: 'Sci-Fi & Fantasy' }],
    runtime: null,
    numberOfSeasons: 4,
    contentType: 'tv',
    matchScore: 88,
    matchReason: 'Nostalgic thrills and supernatural mystery',
  },
  {
    id: 'tv_2316',
    tmdbId: 2316,
    title: 'The Office',
    overview: 'A mockumentary about the everyday lives of office employees.',
    posterPath: '/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg',
    backdropPath: '/vNpuAxGTl9HsUbHqam3E9CzqCvX.jpg',
    releaseDate: '2005-03-24',
    voteAverage: 8.6,
    genres: [{ id: 35, name: 'Comedy' }],
    runtime: null,
    numberOfSeasons: 9,
    contentType: 'tv',
    matchScore: 94,
    matchReason: 'Perfect comfort show for laughs',
  },
];

/**
 * Map mood to genre preferences
 */
function getMoodGenres(mood: Mood): number[] {
  const moodGenreMap: Record<Mood, number[]> = {
    happy: [35, 10751, 16], // Comedy, Family, Animation
    thrilling: [28, 53, 80], // Action, Thriller, Crime
    thoughtful: [18, 99, 36], // Drama, Documentary, History
    funny: [35, 16], // Comedy, Animation
    scary: [27, 53, 9648], // Horror, Thriller, Mystery
    romantic: [10749, 18, 35], // Romance, Drama, Comedy
  };
  return moodGenreMap[mood] || [];
}

/**
 * Calculate match score based on preferences
 */
function calculateMatchScore(
  recommendation: Recommendation,
  aggregatedPreferences: {
    moods: Mood[];
    energies: EnergyLevel[];
  }
): number {
  let score = 70; // Base score

  // Check mood match
  const preferredGenres = aggregatedPreferences.moods.flatMap(getMoodGenres);
  const matchingGenres = recommendation.genres.filter((g) =>
    preferredGenres.includes(g.id)
  );
  score += matchingGenres.length * 5;

  // Check energy match
  if (aggregatedPreferences.energies.includes('intense')) {
    if (recommendation.genres.some((g) => [28, 53, 27].includes(g.id))) {
      score += 10;
    }
  } else if (aggregatedPreferences.energies.includes('chill')) {
    if (recommendation.genres.some((g) => [35, 10751, 10749].includes(g.id))) {
      score += 10;
    }
  }

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Generate match reason based on preferences
 */
function generateMatchReason(
  recommendation: Recommendation,
  aggregatedPreferences: {
    moods: Mood[];
    energies: EnergyLevel[];
  }
): string {
  const reasons: string[] = [];

  // Add mood-based reason
  const genreNames = recommendation.genres.map((g) => g.name);
  if (genreNames.length > 0) {
    reasons.push(`Great ${genreNames[0].toLowerCase()} pick`);
  }

  // Add energy-based reason
  if (aggregatedPreferences.energies.includes('intense')) {
    reasons.push('with intense moments');
  } else if (aggregatedPreferences.energies.includes('chill')) {
    reasons.push('for a relaxed watch');
  }

  return reasons.join(' ') || 'Perfect match for your group';
}

/**
 * Aggregate preferences from all participants
 */
function aggregatePreferences(participants: Participant[]): {
  moods: Mood[];
  energies: EnergyLevel[];
  preferMovies: boolean;
  preferTV: boolean;
} {
  const moods: Mood[] = [];
  const energies: EnergyLevel[] = [];
  let movieCount = 0;
  let tvCount = 0;

  participants.forEach((p) => {
    if (p.preferences) {
      moods.push(p.preferences.mood);
      energies.push(p.preferences.energy);
      if (p.preferences.contentType === 'movie') movieCount++;
      if (p.preferences.contentType === 'tv') tvCount++;
    }
  });

  return {
    moods: [...new Set(moods)],
    energies: [...new Set(energies)],
    preferMovies: movieCount >= tvCount,
    preferTV: tvCount > movieCount,
  };
}

/**
 * Generate recommendations based on group preferences
 * This is a mock implementation - in production, this would use AI/ML
 */
export async function generateRecommendations(
  participants: Participant[]
): Promise<Recommendation[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const aggregated = aggregatePreferences(participants);

  // Combine movies and TV shows based on preferences
  let pool: Recommendation[] = [];

  if (aggregated.preferTV) {
    pool = [...MOCK_TV_SHOWS, ...MOCK_MOVIES];
  } else {
    pool = [...MOCK_MOVIES, ...MOCK_TV_SHOWS];
  }

  // Score and sort recommendations
  const scored = pool.map((rec) => ({
    ...rec,
    matchScore: calculateMatchScore(rec, aggregated),
    matchReason: generateMatchReason(rec, aggregated),
  }));

  scored.sort((a, b) => b.matchScore - a.matchScore);

  // Return top 3
  return scored.slice(0, 3);
}

/**
 * Get mock recommendations for testing
 */
export function getMockRecommendations(): Recommendation[] {
  return MOCK_MOVIES.slice(0, 3);
}
