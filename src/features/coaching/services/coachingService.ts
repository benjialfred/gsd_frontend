import api from '../../../services/api';
import type { 
  CoachProfile, 
  Appointment, 
  AvailableSlotsResponse, 
  CoachStats, 
  AvailabilitySlot,
  SessionType,
  AppointmentStatus 
} from '../types/coaching';

export const coachingService = {
  // Liste des conseillers & pasteurs
  async getCoaches(params?: { search?: string; specialty?: string }): Promise<CoachProfile[]> {
    const res = await api.get('/api/coaching/profiles/', { params });
    return res.data;
  },

  // Détails d'un coach
  async getCoachDetails(coachId: number): Promise<CoachProfile> {
    const res = await api.get(`/api/coaching/profiles/${coachId}/`);
    return res.data;
  },

  // Espace personnel coach (pour les utilisateurs au rôle COACH)
  async getMyCoachProfile(): Promise<CoachProfile> {
    const res = await api.get('/api/coaching/profiles/me/');
    return res.data;
  },

  async updateMyCoachProfile(data: Partial<CoachProfile>): Promise<CoachProfile> {
    const res = await api.patch('/api/coaching/profiles/me/', data);
    return res.data;
  },

  // Créneaux horaires d'un coach pour une date donnée (YYYY-MM-DD)
  async getAvailableSlots(coachId: number, date: string): Promise<AvailableSlotsResponse> {
    const res = await api.get(`/api/coaching/profiles/${coachId}/available_slots/`, {
      params: { date }
    });
    return res.data;
  },

  // Prise de rendez-vous (Côté Célibataire / Utilisateur)
  async bookAppointment(payload: {
    coach: number;
    appointment_date: string; // ISO string e.g. "2026-10-15T14:00:00Z"
    duration_minutes?: number;
    session_type: SessionType;
    user_notes?: string;
  }): Promise<Appointment> {
    const res = await api.post('/api/coaching/appointments/', payload);
    return res.data;
  },

  // Historique des rendez-vous
  async getMyAppointments(scope: 'upcoming' | 'past' | 'all' = 'all', asCoach: boolean = false): Promise<Appointment[]> {
    const res = await api.get('/api/coaching/appointments/', {
      params: { scope, as_coach: asCoach ? 'true' : 'false' }
    });
    return res.data;
  },

  // Mettre à jour le statut d'un rendez-vous (Confirmer, Clore, Annuler)
  async updateAppointmentStatus(
    id: number, 
    status: AppointmentStatus, 
    meeting_link?: string
  ): Promise<Appointment> {
    const res = await api.patch(`/api/coaching/appointments/${id}/update_status/`, {
      status,
      meeting_link
    });
    return res.data;
  },

  // Enregistrer des notes confidentielles pastorales (Coach uniquement)
  async savePastoralNotes(id: number, pastoral_notes: string): Promise<{ status: string; pastoral_notes: string }> {
    const res = await api.patch(`/api/coaching/appointments/${id}/pastoral_notes/`, {
      pastoral_notes
    });
    return res.data;
  },

  // Statistiques coach (revenus, séances accomplies, moyenne)
  async getCoachStats(): Promise<CoachStats> {
    const res = await api.get('/api/coaching/appointments/coach_stats/');
    return res.data;
  },

  // Gestion des créneaux hebdomadaires du coach
  async getMyAvailabilitySlots(): Promise<AvailabilitySlot[]> {
    const res = await api.get('/api/coaching/slots/');
    return res.data;
  },

  async createAvailabilitySlot(data: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    is_active?: boolean;
  }): Promise<AvailabilitySlot> {
    const res = await api.post('/api/coaching/slots/', data);
    return res.data;
  },

  async deleteAvailabilitySlot(id: number): Promise<void> {
    await api.delete(`/api/coaching/slots/${id}/`);
  }
};
