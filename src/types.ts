export type MediaType = 'movie' | 'book';

export interface MediaItem {
  id: string;
  type: MediaType;
  title: string;
  creator: string; // Director for movies, Author for books
  year: number;
  genre: string[];
  language: string;
  rating: number; // 1 to 5 stars
  voteCount: number;
  posterUrl: string;
  synopsis: string;
  highlights: string[];
  durationOrPages: string; // e.g. "2h 28m" or "328 pages"
  releaseDate: string;
  featured?: boolean;
}

export interface Review {
  id: string;
  mediaId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  favoriteGenres: string[];
  watchlist: string[]; // array of media item IDs
  favorites: string[]; // array of media item IDs
  preferredLanguages: string[];
  reviewsCount: number;
}

export interface AISearchResponse {
  matchedIds: string[];
  aiReasoning: string;
  suggestedFilters?: {
    genre?: string;
    language?: string;
    minRating?: number;
    type?: MediaType;
  };
}

export interface AISummaryResponse {
  overallSentiment: 'Highly Positive' | 'Mostly Positive' | 'Mixed Reviews' | 'Critical';
  summary: string;
  pros: string[];
  cons: string[];
  targetAudience: string;
  aiScore: number;
}

export interface AIRecommendationItem {
  id: string;
  title: string;
  type: MediaType;
  matchPercentage: number;
  aiReasoning: string;
}

export interface AIRecommendationResponse {
  recommendations: AIRecommendationItem[];
  overallInsight: string;
}

export interface AIGeneratedMediaInfo {
  synopsis: string;
  highlights: string[];
  suggestedGenres: string[];
  durationOrPages: string;
  tagline: string;
}
