/**
 * TMDB Service
 * Handles movie and TV show data fetching from The Movie Database API
 */

import axios from 'axios';
import { ENV } from '../config/env';
import {
  TMDBMovie,
  TMDBTVShow,
  TMDBListResponse,
  Recommendation,
  Genre,
} from '../types';

const tmdbApi = axios.create({
  baseURL: ENV.TMDB_BASE_URL,
  params: {
    api_key: ENV.TMDB_API_KEY,
  },
});

// Genre mappings from TMDB
const MOVIE_GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
};

/**
 * Convert genre IDs to Genre objects
 */
function mapGenres(genreIds: number[], isTV: boolean): Genre[] {
  const genreMap = isTV ? TV_GENRES : MOVIE_GENRES;
  return genreIds
    .filter((id) => genreMap[id])
    .map((id) => ({ id, name: genreMap[id] }));
}

/**
 * Get popular movies
 */
export async function getPopularMovies(page = 1): Promise<TMDBListResponse<TMDBMovie>> {
  const response = await tmdbApi.get<TMDBListResponse<TMDBMovie>>('/movie/popular', {
    params: { page },
  });
  return response.data;
}

/**
 * Get popular TV shows
 */
export async function getPopularTVShows(page = 1): Promise<TMDBListResponse<TMDBTVShow>> {
  const response = await tmdbApi.get<TMDBListResponse<TMDBTVShow>>('/tv/popular', {
    params: { page },
  });
  return response.data;
}

/**
 * Get movie details
 */
export async function getMovieDetails(movieId: number): Promise<TMDBMovie> {
  const response = await tmdbApi.get<TMDBMovie>(`/movie/${movieId}`);
  return response.data;
}

/**
 * Get TV show details
 */
export async function getTVShowDetails(tvId: number): Promise<TMDBTVShow> {
  const response = await tmdbApi.get<TMDBTVShow>(`/tv/${tvId}`);
  return response.data;
}

/**
 * Discover movies with filters
 */
export async function discoverMovies(params: {
  with_genres?: string;
  sort_by?: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  page?: number;
}): Promise<TMDBListResponse<TMDBMovie>> {
  const response = await tmdbApi.get<TMDBListResponse<TMDBMovie>>('/discover/movie', {
    params: {
      ...params,
      include_adult: false,
    },
  });
  return response.data;
}

/**
 * Discover TV shows with filters
 */
export async function discoverTVShows(params: {
  with_genres?: string;
  sort_by?: string;
  'vote_average.gte'?: number;
  'vote_count.gte'?: number;
  page?: number;
}): Promise<TMDBListResponse<TMDBTVShow>> {
  const response = await tmdbApi.get<TMDBListResponse<TMDBTVShow>>('/discover/tv', {
    params: {
      ...params,
      include_adult: false,
    },
  });
  return response.data;
}

/**
 * Search for movies
 */
export async function searchMovies(
  query: string,
  page = 1
): Promise<TMDBListResponse<TMDBMovie>> {
  const response = await tmdbApi.get<TMDBListResponse<TMDBMovie>>('/search/movie', {
    params: { query, page },
  });
  return response.data;
}

/**
 * Search for TV shows
 */
export async function searchTVShows(
  query: string,
  page = 1
): Promise<TMDBListResponse<TMDBTVShow>> {
  const response = await tmdbApi.get<TMDBListResponse<TMDBTVShow>>('/search/tv', {
    params: { query, page },
  });
  return response.data;
}

/**
 * Convert TMDB movie to Recommendation format
 */
export function movieToRecommendation(
  movie: TMDBMovie,
  matchScore: number,
  matchReason: string
): Recommendation {
  return {
    id: `movie_${movie.id}`,
    tmdbId: movie.id,
    title: movie.title,
    overview: movie.overview,
    posterPath: movie.poster_path,
    backdropPath: movie.backdrop_path,
    releaseDate: movie.release_date,
    voteAverage: movie.vote_average,
    genres: mapGenres(movie.genre_ids, false),
    runtime: movie.runtime || null,
    contentType: 'movie',
    matchScore,
    matchReason,
  };
}

/**
 * Convert TMDB TV show to Recommendation format
 */
export function tvShowToRecommendation(
  show: TMDBTVShow,
  matchScore: number,
  matchReason: string
): Recommendation {
  return {
    id: `tv_${show.id}`,
    tmdbId: show.id,
    title: show.name,
    overview: show.overview,
    posterPath: show.poster_path,
    backdropPath: show.backdrop_path,
    releaseDate: show.first_air_date,
    voteAverage: show.vote_average,
    genres: mapGenres(show.genre_ids, true),
    runtime: null,
    numberOfSeasons: show.number_of_seasons,
    contentType: 'tv',
    matchScore,
    matchReason,
  };
}

/**
 * Get image URL for a TMDB image path
 */
export function getImageUrl(
  path: string | null,
  size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500'
): string | null {
  if (!path) return null;
  return `${ENV.TMDB_IMAGE_BASE_URL}/${size}${path}`;
}
