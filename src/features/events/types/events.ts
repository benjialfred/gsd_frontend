export type EventType = 'GALA' | 'CONFERENCE' | 'RETREAT' | 'WORKSHOP';

export type RegistrationStatus = 'CONFIRMED' | 'PENDING' | 'CANCELLED' | 'REFUNDED';

export interface TicketTier {
  id: number;
  event: number;
  name: string;
  description?: string;
  price: number | string;
  capacity: number;
  available_quantity: number;
  is_active: boolean;
}

export interface EventItem {
  id: number;
  title: string;
  slug: string;
  event_type: EventType;
  event_type_display: string;
  description: string;
  theme_verse?: string;
  dress_code?: string;
  banner_image?: string;
  location_name: string;
  city: string;
  address?: string;
  is_online: boolean;
  online_meeting_link?: string;
  start_date: string; // ISO datetime
  end_date: string;
  capacity: number;
  is_published: boolean;
  is_featured: boolean;
  ticket_tiers: TicketTier[];
  min_price: number;
  available_spots: number;
  created_at: string;
  updated_at: string;
}

export interface EventRegistration {
  id: number;
  event: number;
  event_title: string;
  event_banner?: string;
  event_date: string;
  event_location: string;
  event_city: string;
  dress_code?: string;
  ticket_tier: number;
  ticket_name: string;
  ticket_price: number | string;
  user: number;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  qr_code_hash: string;
  status: RegistrationStatus;
  status_display: string;
  is_checked_in: boolean;
  checked_in_at?: string;
  created_at: string;
}

export interface CheckInResult {
  valid: boolean;
  already_scanned?: boolean;
  message?: string;
  error?: string;
  guest_name?: string;
  ticket_name?: string;
  event_title?: string;
  checked_in_at?: string;
}

export interface EventStats {
  event_id: number;
  event_title: string;
  capacity: number;
  total_registered: number;
  checked_in_count: number;
  attendance_rate: string;
  total_revenue_fcfa: number;
}
