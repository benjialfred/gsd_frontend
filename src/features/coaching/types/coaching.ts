export interface AvailabilitySlot {
  id: number;
  coach: number;
  day_of_week: number;
  day_name: string;
  start_time: string; // "HH:MM:SS" or "HH:MM"
  end_time: string;
  is_active: boolean;
}

export interface CoachUser {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface CoachProfile {
  id: number;
  user: number;
  user_details: CoachUser;
  full_name: string;
  title: string;
  bio: string;
  specialties: string;
  years_of_experience: number;
  denomination: string;
  hourly_rate: string | number;
  languages: string;
  avatar_url?: string;
  is_verified: boolean;
  rating: number;
  reviews_count: number;
  meeting_link?: string;
  availability_description: string;
  availability_slots?: AvailabilitySlot[];
}

export type SessionType = 
  | 'PRE_MARITAL'
  | 'COUPLE_CRISIS'
  | 'SINGLENESS_VISION'
  | 'SPIRITUAL_DELIVERANCE';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Appointment {
  id: number;
  coach: number;
  coach_title: string;
  coach_name: string;
  coach_avatar?: string;
  user: number;
  user_name: string;
  appointment_date: string; // ISO datetime
  duration_minutes: number;
  session_type: SessionType;
  session_type_display: string;
  status: AppointmentStatus;
  status_display: string;
  meeting_link?: string;
  user_notes?: string;
  pastoral_notes?: string;
  created_at: string;
  updated_at: string;
}

export interface DaySlotInfo {
  slot_id: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
}

export interface AvailableSlotsResponse {
  coach_id: number;
  date: string;
  day_name: string;
  slots: DaySlotInfo[];
}

export interface CoachStats {
  total_sessions: number;
  upcoming_sessions: number;
  completed_sessions: number;
  total_earnings_fcfa: number;
  hourly_rate: string | number;
  rating: number;
  reviews_count: number;
}
