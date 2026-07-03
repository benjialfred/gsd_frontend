export interface CompatibilityExplanation {
  strongest_factor: string;
  summary: string;
}

export interface CompatibilityBreakdown {
  faith: number;
  values: number;
  lifestyle: number;
  location: number;
}

export interface ProfileData {
  first_name: string;
  age: number | null;
  city: string;
  kyc_verified: boolean;
  primary_photo: string | null;
  photos_count: number;
}

export interface MatchCandidate {
  id: number;
  candidate_id: number;
  feed_version: string;
  compatibility: number;
  compatibility_explanation: CompatibilityExplanation;
  compatibility_breakdown: CompatibilityBreakdown;
  highlights: string[];
  profile: ProfileData;
}

export interface SuggestionsResponse {
  status: string;
  suggestions: MatchCandidate[];
}

export interface LimitReachedResponse {
  limit_reached: boolean;
  remaining: number;
  reset_at: string;
}

export interface MatchActionResponse {
  status: string;
  match_id?: number;
}
