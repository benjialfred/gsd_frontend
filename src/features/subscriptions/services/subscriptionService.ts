import api from '../../../services/api';
import type { 
  SubscriptionPlan, 
  UserSubscription, 
  CheckoutResponse, 
  PaymentTransaction 
} from '../types/subscriptions';

export const subscriptionService = {
  // Liste des formules d'abonnement actives
  async getPlans(): Promise<SubscriptionPlan[]> {
    const res = await api.get('/api/subscriptions/plans/');
    return res.data;
  },

  // Récupération de l'abonnement en cours du membre
  async getMySubscription(): Promise<UserSubscription> {
    const res = await api.get('/api/subscriptions/user/me/');
    return res.data;
  },

  // Souscription à un plan (déclenche NelsiusPay pour les formules payantes)
  async subscribeToPlan(
    planId: number, 
    customerPhone?: string, 
    returnUrl?: string
  ): Promise<CheckoutResponse> {
    const res = await api.post('/api/subscriptions/user/subscribe/', {
      plan_id: planId,
      customer_phone: customerPhone,
      return_url: returnUrl,
    });
    return res.data;
  },

  // Annulation du renouvellement automatique
  async cancelAutoRenew(): Promise<{ success: boolean; message: string }> {
    const res = await api.post('/api/subscriptions/user/cancel/');
    return res.data;
  },

  // Confirmation d'une transaction de paiement
  async confirmPayment(reference: string): Promise<{ success: boolean; message: string; transaction: PaymentTransaction }> {
    const res = await api.post('/api/payments/confirm/', { reference });
    return res.data;
  },

  // Historique des reçus et transactions du membre
  async getMyPaymentHistory(): Promise<PaymentTransaction[]> {
    const res = await api.get('/api/payments/');
    return res.data;
  }
};
