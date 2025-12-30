/**
 * Environment configuration
 * In production, these would come from environment variables
 */

export const ENV = {
  // Firebase Configuration (replace with your actual values)
  FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
  FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
  FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',

  // TMDB API Configuration
  TMDB_API_KEY: process.env.EXPO_PUBLIC_TMDB_API_KEY || '',
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',

  // App Configuration
  SESSION_TIMEOUT_MINUTES: 60,
  MAX_PARTICIPANTS: 8,
  MIN_PARTICIPANTS: 2,
  VOTING_TIME_SECONDS: 60,
} as const;
