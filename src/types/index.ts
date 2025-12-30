/**
 * QuickPick TypeScript Types
 * All interfaces and types used throughout the application
 */

// ============================================
// Session Types
// ============================================

/** Unique 4-digit room code for session identification */
export type RoomCode = string;

/** Session status lifecycle */
export type SessionStatus =
  | 'waiting'      // Waiting for participants to join
  | 'preferences'  // Collecting user preferences
  | 'processing'   // AI generating recommendations
  | 'voting'       // Users voting on recommendations
  | 'complete';    // Session finished

/** Participant in a session */
export interface Participant {
  id: string;
  name: string;
  isHost: boolean;
  hasSubmittedPreferences: boolean;
  joinedAt: number;
  preferences?: UserPreferences;
}

/** Session data structure */
export interface Session {
  id: string;
  roomCode: RoomCode;
  hostId: string;
  status: SessionStatus;
  participants: Participant[];
  recommendations?: Recommendation[];
  votes?: Vote[];
  winner?: Recommendation;
  createdAt: number;
  expiresAt: number;
}

// ============================================
// Preference Types
// ============================================

/** Mood options for content selection */
export type Mood =
  | 'happy'        // Feel-good, uplifting
  | 'thrilling'    // Action, suspense
  | 'thoughtful'   // Drama, documentary
  | 'funny'        // Comedy, lighthearted
  | 'scary'        // Horror, thriller
  | 'romantic';    // Romance, love stories

/** Energy level for content */
export type EnergyLevel =
  | 'chill'        // Relaxed, easy watching
  | 'moderate'     // Balanced engagement
  | 'intense';     // High energy, gripping

/** Runtime preference */
export type RuntimePreference =
  | 'short'        // < 90 mins / single episode
  | 'medium'       // 90-120 mins / few episodes
  | 'long';        // > 120 mins / binge-worthy

/** Content type preference */
export type ContentType = 'movie' | 'tv' | 'both';

/** User's preference selections */
export interface UserPreferences {
  mood: Mood;
  energy: EnergyLevel;
  runtime: RuntimePreference;
  contentType: ContentType;
}

// ============================================
// Recommendation Types
// ============================================

/** Genre information from TMDB */
export interface Genre {
  id: number;
  name: string;
}

/** Recommendation from AI/TMDB */
export interface Recommendation {
  id: string;
  tmdbId: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  genres: Genre[];
  runtime: number | null;    // For movies (in minutes)
  numberOfSeasons?: number;  // For TV shows
  contentType: 'movie' | 'tv';
  matchScore: number;        // AI-calculated match percentage
  matchReason: string;       // Why this was recommended
}

// ============================================
// Voting Types
// ============================================

/** Individual vote */
export interface Vote {
  oderId: string;
  participantId: string;
  recommendationId: string;
  rank: number;  // 1 = first choice, 2 = second, 3 = third
  timestamp: number;
}

/** Voting results for a recommendation */
export interface VotingResult {
  recommendationId: string;
  totalPoints: number;
  voteCount: number;
  firstPlaceVotes: number;
}

// ============================================
// UI Types
// ============================================

/** Loading states for async operations */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

/** Error information */
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

/** Navigation route params */
export interface RouteParams {
  roomCode?: RoomCode;
  isHost?: boolean;
}

// ============================================
// Store Types
// ============================================

/** Session store state */
export interface SessionStoreState {
  session: Session | null;
  currentParticipant: Participant | null;
  loadingState: LoadingState;
  error: AppError | null;
}

/** Session store actions */
export interface SessionStoreActions {
  createSession: (hostName: string) => Promise<Session>;
  joinSession: (roomCode: RoomCode, participantName: string) => Promise<void>;
  leaveSession: () => void;
  startPreferences: () => void;
  submitPreferences: (preferences: UserPreferences) => Promise<void>;
  startVoting: () => void;
  submitVote: (votes: Vote[]) => Promise<void>;
  reset: () => void;
}

/** Preference store state */
export interface PreferenceStoreState {
  mood: Mood | null;
  energy: EnergyLevel | null;
  runtime: RuntimePreference | null;
  contentType: ContentType;
  step: number;
}

/** Preference store actions */
export interface PreferenceStoreActions {
  setMood: (mood: Mood) => void;
  setEnergy: (energy: EnergyLevel) => void;
  setRuntime: (runtime: RuntimePreference) => void;
  setContentType: (contentType: ContentType) => void;
  nextStep: () => void;
  prevStep: () => void;
  reset: () => void;
  getPreferences: () => UserPreferences | null;
}

// ============================================
// API Response Types
// ============================================

/** TMDB Movie response */
export interface TMDBMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
  runtime?: number;
}

/** TMDB TV Show response */
export interface TMDBTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  genre_ids: number[];
  number_of_seasons?: number;
}

/** TMDB API list response */
export interface TMDBListResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}
