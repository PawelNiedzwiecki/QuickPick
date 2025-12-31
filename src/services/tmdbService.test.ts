/**
 * Unit tests for TMDB Service
 */

import axios from 'axios';
import {
  getPopularMovies,
  getPopularTVShows,
  getMovieDetails,
  getTVShowDetails,
  discoverMovies,
  discoverTVShows,
  searchMovies,
  searchTVShows,
  movieToRecommendation,
  tvShowToRecommendation,
  getImageUrl,
} from './tmdbService';
import type { TMDBMovie, TMDBTVShow } from '../types';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('TMDB Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock axios.create to return a mocked instance
    mockedAxios.create = jest.fn(() => ({
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
      patch: jest.fn(),
      request: jest.fn(),
      defaults: {} as any,
      interceptors: {
        request: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
        response: { use: jest.fn(), eject: jest.fn(), clear: jest.fn() },
      } as any,
      getUri: jest.fn(),
      head: jest.fn(),
      options: jest.fn(),
      postForm: jest.fn(),
      putForm: jest.fn(),
      patchForm: jest.fn(),
    })) as any;
  });

  describe('getPopularMovies', () => {
    it('should fetch popular movies', async () => {
      const mockResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 100,
          total_results: 1000,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      (mockedAxios.create as jest.Mock).mockReturnValue({ get: mockGet });

      // Re-import to use the new mock
      const module = await import('./tmdbService');
      const result = await module.getPopularMovies(1);

      expect(mockGet).toHaveBeenCalledWith('/movie/popular', { params: { page: 1 } });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('getPopularTVShows', () => {
    it('should fetch popular TV shows', async () => {
      const mockResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 100,
          total_results: 1000,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      (mockedAxios.create as jest.Mock).mockReturnValue({ get: mockGet });

      const module = await import('./tmdbService');
      const result = await module.getPopularTVShows(2);

      expect(mockGet).toHaveBeenCalledWith('/tv/popular', { params: { page: 2 } });
      expect(result).toEqual(mockResponse.data);
    });
  });

  describe('movieToRecommendation', () => {
    it('should convert TMDB movie to Recommendation format', () => {
      const movie: TMDBMovie = {
        id: 550,
        title: 'Fight Club',
        overview: 'A ticking-time bomb of a movie',
        poster_path: '/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg',
        backdrop_path: '/hZkgoQYus5vegHoetLkCJzb17zJ.jpg',
        release_date: '1999-10-15',
        vote_average: 8.4,
        vote_count: 20000,
        genre_ids: [18, 53],
        adult: false,
        original_language: 'en',
        original_title: 'Fight Club',
        popularity: 100,
        video: false,
      };

      const recommendation = movieToRecommendation(movie, 95, 'Perfect match');

      expect(recommendation.id).toBe('movie_550');
      expect(recommendation.tmdbId).toBe(550);
      expect(recommendation.title).toBe('Fight Club');
      expect(recommendation.contentType).toBe('movie');
      expect(recommendation.matchScore).toBe(95);
      expect(recommendation.matchReason).toBe('Perfect match');
      expect(recommendation.voteAverage).toBe(8.4);
    });

    it('should map genres correctly', () => {
      const movie: TMDBMovie = {
        id: 1,
        title: 'Test',
        overview: 'Test',
        poster_path: null,
        backdrop_path: null,
        release_date: '2024-01-01',
        vote_average: 7.0,
        vote_count: 100,
        genre_ids: [28, 35], // Action, Comedy
        adult: false,
        original_language: 'en',
        original_title: 'Test',
        popularity: 50,
        video: false,
      };

      const recommendation = movieToRecommendation(movie, 80, 'Test');

      expect(recommendation.genres).toHaveLength(2);
      expect(recommendation.genres[0].name).toBe('Action');
      expect(recommendation.genres[1].name).toBe('Comedy');
    });
  });

  describe('tvShowToRecommendation', () => {
    it('should convert TMDB TV show to Recommendation format', () => {
      const tvShow: TMDBTVShow = {
        id: 1396,
        name: 'Breaking Bad',
        overview: 'A high school chemistry teacher',
        poster_path: '/ggFHVNu6YYI5L9pCfOacjizRGt.jpg',
        backdrop_path: '/tsRy63Mu5cu8etL1X7ZLyf7UwLN.jpg',
        first_air_date: '2008-01-20',
        vote_average: 8.9,
        vote_count: 15000,
        genre_ids: [18],
        adult: false,
        original_language: 'en',
        original_name: 'Breaking Bad',
        popularity: 150,
        origin_country: ['US'],
      };

      const recommendation = tvShowToRecommendation(tvShow, 96, 'Highly recommended');

      expect(recommendation.id).toBe('tv_1396');
      expect(recommendation.tmdbId).toBe(1396);
      expect(recommendation.title).toBe('Breaking Bad');
      expect(recommendation.contentType).toBe('tv');
      expect(recommendation.matchScore).toBe(96);
      expect(recommendation.matchReason).toBe('Highly recommended');
      expect(recommendation.runtime).toBeNull();
    });
  });

  describe('getImageUrl', () => {
    it('should return null for null path', () => {
      expect(getImageUrl(null)).toBeNull();
    });

    it('should construct correct URL with default size', () => {
      const url = getImageUrl('/path/to/image.jpg');
      expect(url).toContain('w500');
      expect(url).toContain('/path/to/image.jpg');
    });

    it('should construct correct URL with custom size', () => {
      const url = getImageUrl('/path/to/image.jpg', 'w780');
      expect(url).toContain('w780');
      expect(url).toContain('/path/to/image.jpg');
    });
  });

  describe('discoverMovies', () => {
    it('should pass correct parameters for movie discovery', async () => {
      const mockResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 100,
          total_results: 1000,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      (mockedAxios.create as jest.Mock).mockReturnValue({ get: mockGet });

      const module = await import('./tmdbService');
      await module.discoverMovies({
        with_genres: '28,12',
        sort_by: 'popularity.desc',
        'vote_average.gte': 7,
        page: 1,
      });

      expect(mockGet).toHaveBeenCalledWith('/discover/movie', {
        params: {
          with_genres: '28,12',
          sort_by: 'popularity.desc',
          'vote_average.gte': 7,
          page: 1,
          include_adult: false,
        },
      });
    });

    it('should exclude adult content by default', async () => {
      const mockResponse = { data: { results: [], page: 1, total_pages: 1, total_results: 0 } };
      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      (mockedAxios.create as jest.Mock).mockReturnValue({ get: mockGet });

      const module = await import('./tmdbService');
      await module.discoverMovies({});

      const callParams = mockGet.mock.calls[0][1].params;
      expect(callParams.include_adult).toBe(false);
    });
  });

  describe('discoverTVShows', () => {
    it('should pass correct parameters for TV show discovery', async () => {
      const mockResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 100,
          total_results: 1000,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      (mockedAxios.create as jest.Mock).mockReturnValue({ get: mockGet });

      const module = await import('./tmdbService');
      await module.discoverTVShows({
        with_genres: '18',
        sort_by: 'vote_average.desc',
      });

      expect(mockGet).toHaveBeenCalledWith('/discover/tv', {
        params: {
          with_genres: '18',
          sort_by: 'vote_average.desc',
          include_adult: false,
        },
      });
    });
  });

  describe('searchMovies', () => {
    it('should search for movies with query', async () => {
      const mockResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 10,
          total_results: 100,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      (mockedAxios.create as jest.Mock).mockReturnValue({ get: mockGet });

      const module = await import('./tmdbService');
      await module.searchMovies('inception', 1);

      expect(mockGet).toHaveBeenCalledWith('/search/movie', {
        params: { query: 'inception', page: 1 },
      });
    });
  });

  describe('searchTVShows', () => {
    it('should search for TV shows with query', async () => {
      const mockResponse = {
        data: {
          results: [],
          page: 1,
          total_pages: 10,
          total_results: 100,
        },
      };

      const mockGet = jest.fn().mockResolvedValue(mockResponse);
      (mockedAxios.create as jest.Mock).mockReturnValue({ get: mockGet });

      const module = await import('./tmdbService');
      await module.searchTVShows('breaking bad', 2);

      expect(mockGet).toHaveBeenCalledWith('/search/tv', {
        params: { query: 'breaking bad', page: 2 },
      });
    });
  });
});
