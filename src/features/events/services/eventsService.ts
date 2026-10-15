import api from '../../../services/api';
import type { 
  EventItem, 
  EventRegistration, 
  CheckInResult, 
  EventStats 
} from '../types/events';

export const eventsService = {
  // Liste des événements publics
  async getEvents(params?: {
    type?: string;
    city?: string;
    search?: string;
    featured?: boolean;
  }): Promise<EventItem[]> {
    const res = await api.get('/api/events/', { params });
    return res.data;
  },

  // Détails d'un événement
  async getEventDetails(eventId: number): Promise<EventItem> {
    const res = await api.get(`/api/events/${eventId}/`);
    return res.data;
  },

  // Réservation d'un billet / inscription à un gala
  async registerForEvent(
    eventId: number,
    payload: {
      ticket_tier_id: number;
      guest_name?: string;
      guest_email?: string;
      guest_phone?: string;
      notes?: string;
    }
  ): Promise<EventRegistration> {
    const res = await api.post(`/api/events/${eventId}/register/`, payload);
    return res.data;
  },

  // Liste des billets de l'utilisateur connecté
  async getMyTickets(): Promise<EventRegistration[]> {
    const res = await api.get('/api/events/my_tickets/');
    return res.data;
  },

  // Scan & Émargement par QR code à l'entrée du gala
  async checkInTicket(qr_code_hash: string): Promise<CheckInResult> {
    const res = await api.post('/api/events/check_in/', { qr_code_hash });
    return res.data;
  },

  // Statistiques de présence et billetterie (organisateur)
  async getEventStats(eventId: number): Promise<EventStats> {
    const res = await api.get(`/api/events/${eventId}/stats/`);
    return res.data;
  }
};
