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

export interface CourseCertification {
  course_id: number;
  course_title: string;
  category: string;
  category_display: string;
  completed_at: string | null;
  badge_name: string;
  badge_level: string;
}

export interface ProfileData {
  first_name: string;
  last_name?: string;
  gender?: string | null;
  age: number | null;
  city: string;
  country_code?: string;
  denomination?: string;
  church_attendance?: string;
  spiritual_commitment?: string;
  profession?: string;
  education_level?: string;
  marital_status?: string;
  marriage_objectives?: string;
  marriage_values?: string;
  marriage_expectations?: string;
  bio?: string;
  interests?: string[];
  kyc_verified: boolean;
  primary_photo: string | null;
  photos?: string[];
  photos_count: number;
  is_academy_certified?: boolean;
  certifications?: CourseCertification[];
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
  is_match?: boolean;
  match_id?: number;
  partner?: {
    id: number;
    first_name: string;
    city?: string;
    avatar?: string | null;
    compatibility?: number;
  };
  action?: string;
}
