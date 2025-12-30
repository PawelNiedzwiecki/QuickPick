/**
 * QuickPick Constants
 * Brand colors, theme values, and app-wide constants
 */

// ============================================
// Brand Colors
// ============================================

export const COLORS = {
  // Primary palette
  primary: '#22C55E',        // Green - speed/go
  primaryDark: '#16A34A',    // Darker green for pressed states
  primaryLight: '#4ADE80',   // Lighter green for highlights

  // Secondary palette
  secondary: '#FFFFFF',      // White - clean
  secondaryDark: '#F1F5F9',  // Off-white for backgrounds

  // Accent palette
  accent: '#F59E0B',         // Amber - highlights
  accentDark: '#D97706',     // Darker amber
  accentLight: '#FCD34D',    // Lighter amber

  // Neutral palette
  background: '#FFFFFF',
  surface: '#F8FAFC',
  text: '#1E293B',
  textSecondary: '#64748B',
  textLight: '#94A3B8',

  // Semantic colors
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  info: '#3B82F6',

  // Gradient colors
  gradientStart: '#22C55E',
  gradientEnd: '#16A34A',
} as const;

// ============================================
// Spacing & Layout
// ============================================

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 9999,
} as const;

// ============================================
// Typography
// ============================================

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const FONT_WEIGHTS = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

// ============================================
// Animation
// ============================================

export const ANIMATION = {
  fast: 150,
  normal: 300,
  slow: 500,
} as const;

// ============================================
// Session Configuration
// ============================================

export const SESSION_CONFIG = {
  CODE_LENGTH: 4,
  MIN_PARTICIPANTS: 2,
  MAX_PARTICIPANTS: 8,
  TIMEOUT_MINUTES: 60,
  VOTING_TIME_SECONDS: 60,
  RECOMMENDATIONS_COUNT: 3,
} as const;

// ============================================
// Preference Options
// ============================================

export const MOOD_OPTIONS = [
  { value: 'happy', label: 'Feel Good', emoji: '😊', description: 'Uplifting & heartwarming' },
  { value: 'thrilling', label: 'Thrilling', emoji: '🔥', description: 'Action & suspense' },
  { value: 'thoughtful', label: 'Thoughtful', emoji: '🤔', description: 'Drama & deep stories' },
  { value: 'funny', label: 'Funny', emoji: '😂', description: 'Comedy & laughs' },
  { value: 'scary', label: 'Scary', emoji: '👻', description: 'Horror & thrills' },
  { value: 'romantic', label: 'Romantic', emoji: '💕', description: 'Love stories' },
] as const;

export const ENERGY_OPTIONS = [
  { value: 'chill', label: 'Chill', emoji: '😌', description: 'Relaxed viewing' },
  { value: 'moderate', label: 'Moderate', emoji: '⚡', description: 'Balanced pace' },
  { value: 'intense', label: 'Intense', emoji: '🚀', description: 'Edge of your seat' },
] as const;

export const RUNTIME_OPTIONS = [
  { value: 'short', label: 'Quick', emoji: '⏱️', description: '< 90 min' },
  { value: 'medium', label: 'Standard', emoji: '🎬', description: '90-120 min' },
  { value: 'long', label: 'Epic', emoji: '🍿', description: '2+ hours' },
] as const;

export const CONTENT_TYPE_OPTIONS = [
  { value: 'movie', label: 'Movie', emoji: '🎬' },
  { value: 'tv', label: 'TV Show', emoji: '📺' },
  { value: 'both', label: 'Both', emoji: '🎭' },
] as const;

// ============================================
// Error Messages
// ============================================

export const ERROR_MESSAGES = {
  INVALID_ROOM_CODE: 'Invalid room code. Please check and try again.',
  SESSION_NOT_FOUND: 'Session not found. It may have expired.',
  SESSION_FULL: 'This session is full. Maximum 8 participants allowed.',
  SESSION_EXPIRED: 'This session has expired.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNKNOWN_ERROR: 'Something went wrong. Please try again.',
} as const;
