export type PlanCode = 'FREE' | 'ALLIANCE' | 'AMBASSADOR';
export type SubscriptionStatus = 'ACTIVE' | 'PENDING' | 'EXPIRED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export interface SubscriptionPlan {
  id: number;
  name: string;
  code: PlanCode;
  billing_cycle: string;
  price: number | string;
  duration_days: number;
  badge_name: string;
  badge_color: string;
  description: string;
  features: string[];
  daily_likes_limit: number;
  can_see_likes: boolean;
  can_call: boolean;
  can_use_audio_notes: boolean;
  has_academy_access: boolean;
  discount_percentage: number;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

export interface UserSubscription {
  id: number;
  user: number;
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  start_date: string;
  end_date?: string;
  auto_renew: boolean;
  is_valid: boolean;
  days_remaining: number;
  last_payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentTransaction {
  id: number;
  reference: string;
  nelsius_transaction_id?: string;
  amount: number | string;
  currency: string;
  payment_method: string;
  purpose: string;
  purpose_display: string;
  related_id: number;
  status: PaymentStatus;
  status_display: string;
  checkout_url?: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  payment_metadata: Record<string, any>;
  paid_at?: string;
  created_at: string;
}

export interface CheckoutResponse {
  success: boolean;
  payment_reference?: string;
  checkout_url?: string;
  amount?: number;
  currency?: string;
  plan_name?: string;
  message?: string;
  notice?: string;
  subscription?: UserSubscription;
}
