import React, { useState, useEffect } from 'react';
import type { 
  CoachProfile, 
  SessionType, 
  DaySlotInfo 
} from '../types/coaching';
import { coachingService } from '../services/coachingService';
import { toast } from '../../../stores/useToastStore';
import { 
  X, Calendar, Clock, Lock, Sparkles, CheckCircle2, 
  ChevronRight, Loader2, HeartHandshake, ShieldAlert, Compass 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BookingModalProps {
  coach: CoachProfile | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SESSION_TYPES: { id: SessionType; label: string; desc: string; icon: any }[] = [
  {
    id: 'PRE_MARITAL',
    label: 'Préparation au Mariage',
    desc: 'Alignement spirituel, vision du foyer et communication bienveillante.',
    icon: HeartHandshake,
  },
  {
    id: 'COUPLE_CRISIS',
    label: 'Médiation & Crise de Couple',
    desc: 'Résolution des différends, restauration de la confiance et prière ciblée.',
    icon: ShieldAlert,
  },
  {
    id: 'SINGLENESS_VISION',
    label: 'Célibat & Discernement',
    desc: 'Clarté dans vos choix matrimoniaux et sanctification du parcours.',
    icon: Compass,
  },
  {
    id: 'SPIRITUAL_DELIVERANCE',
    label: 'Guérison Intérieure & Paix',
    desc: 'Délivrance des blessures émotionnelles et renouvellement de l’esprit.',
    icon: Sparkles,
  },
];

export const BookingModal: React.FC<BookingModalProps> = ({
  coach,
  isOpen,
  onClose,
  onSuccess,
}) => {
  if (!isOpen || !coach) return null;

  // Calcul d'une date par défaut (demain)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split('T')[0];

  const [selectedSessionType, setSelectedSessionType] = useState<SessionType>('PRE_MARITAL');
  const [selectedDate, setSelectedDate] = useState<string>(defaultDateStr);
  const [availableSlots, setAvailableSlots] = useState<DaySlotInfo[]>([]);
  const [selectedSlotTime, setSelectedSlotTime] = useState<string>('');
  const [userNotes, setUserNotes] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Charger les créneaux disponibles pour la date sélectionnée
  useEffect(() => {
    if (!coach || !selectedDate) return;

    let isMounted = true;
    const fetchSlots = async () => {
      setIsLoadingSlots(true);
      setSelectedSlotTime('');
      try {
        const res = await coachingService.getAvailableSlots(coach.id, selectedDate);
        if (isMounted) {
          setAvailableSlots(res.slots || []);
        }
      } catch (err: any) {
        console.error("Erreur créneaux:", err);
        if (isMounted) {
          setAvailableSlots([]);
        }
      } finally {
        if (isMounted) setIsLoadingSlots(false);
      }
    };

    fetchSlots();

    return () => {
      isMounted = false;
    };
  }, [coach, selectedDate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotTime) {
      toast.error("Veuillez sélectionner un horaire de rendez-vous.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Format ISO: YYYY-MM-DDTHH:MM:00Z
      const appointmentDateTime = `${selectedDate}T${selectedSlotTime}:00Z`;

      await coachingService.bookAppointment({
        coach: coach.id,
        appointment_date: appointmentDateTime,
        duration_minutes: 60,
        session_type: selectedSessionType,
        user_notes: userNotes,
      });

      toast.success("Rendez-vous planifié avec succès ! Le conseiller pastoral vous contactera.");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Erreur réservation:", err);
      const msg = err.response?.data?.error || err.response?.data?.detail || "Échec de la réservation.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formattedRate = typeof coach.hourly_rate === 'number' 
    ? `${coach.hourly_rate.toLocaleString()} FCFA`
    : `${parseInt(coach.hourly_rate || '0', 10).toLocaleString()} FCFA`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#E8ECE9] w-full max-w-2xl overflow-hidden my-8"
      >
        {/* Header */}
        <div className="bg-[#1A3A5C] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 overflow-hidden border border-[#C9A84C]/40 shrink-0 flex items-center justify-center font-bold text-lg">
              {coach.avatar_url ? (
                <img src={coach.avatar_url} alt={coach.full_name} className="w-full h-full object-cover" />
              ) : (
                <span>{coach.full_name?.charAt(0) || 'P'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C9A84C] text-[#1A3A5C] px-2 py-0.5 rounded-full">
                  Accompagnement Pastoral
                </span>
                <span className="text-xs text-white/80">{formattedRate} / 60 min</span>
              </div>
              <h2 className="text-xl font-bold text-white mt-1">{coach.full_name}</h2>
              <p className="text-xs text-white/70">{coach.title}</p>
            </div>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Étape 1 : Type de séance */}
          <div>
            <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2.5">
              1. Type d'entretien & Orientation
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {SESSION_TYPES.map((st) => {
                const IconComponent = st.icon;
                const isSelected = selectedSessionType === st.id;
                return (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setSelectedSessionType(st.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'border-[#C9A84C] bg-[#FAF9F6] shadow-sm'
                        : 'border-[#E8ECE9] hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${
                        isSelected
                          ? 'bg-[#1A3A5C] text-[#C9A84C]'
                          : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      <IconComponent size={18} />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-[#1A3A5C] flex items-center gap-1.5">
                        {st.label}
                        {isSelected && <CheckCircle2 size={13} className="text-[#C9A84C]" />}
                      </div>
                      <div className="text-[11px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">
                        {st.desc}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Étape 2 : Date & Créneau */}
          <div>
            <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2.5">
              2. Date et Créneau Horaire
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div className="sm:col-span-1">
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8ECE9] text-xs font-semibold text-gray-800 focus:outline-none focus:border-[#1A3A5C] bg-[#FAF9F6]"
                    required
                  />
                </div>
              </div>

              {/* Raccourcis pratiques de dates */}
              <div className="sm:col-span-2 flex items-center gap-2 overflow-x-auto pb-1">
                {[1, 2, 3, 4].map((offset) => {
                  const d = new Date();
                  d.setDate(d.getDate() + offset);
                  const dStr = d.toISOString().split('T')[0];
                  const isDaySelected = selectedDate === dStr;
                  const dayName = d.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
                  return (
                    <button
                      key={offset}
                      type="button"
                      onClick={() => setSelectedDate(dStr)}
                      className={`px-3 py-2 rounded-xl text-xs font-medium shrink-0 transition-colors ${
                        isDaySelected
                          ? 'bg-[#1A3A5C] text-white shadow-sm'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {dayName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Créneaux pour ce jour */}
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9]">
              <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center justify-between">
                <span>Créneaux disponibles le {new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} :</span>
                {isLoadingSlots && <Loader2 size={14} className="animate-spin text-[#1A3A5C]" />}
              </div>

              {isLoadingSlots ? (
                <div className="py-6 flex items-center justify-center text-xs text-gray-400 gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Vérification des disponibilités pastorales...
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500">
                  Aucun créneau configuré pour ce jour ({new Date(selectedDate).toLocaleDateString('fr-FR', { weekday: 'long' })}). Veuillez choisir un autre jour de la semaine.
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {availableSlots.map((slot) => {
                    const isSelected = selectedSlotTime === slot.start_time;
                    return (
                      <button
                        key={slot.slot_id}
                        type="button"
                        disabled={!slot.is_available}
                        onClick={() => setSelectedSlotTime(slot.start_time)}
                        className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                          !slot.is_available
                            ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through'
                            : isSelected
                            ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-md ring-2 ring-[#C9A84C]'
                            : 'bg-white hover:bg-gray-50 text-gray-800 border border-[#E8ECE9]'
                        }`}
                      >
                        <Clock size={12} />
                        {slot.start_time} - {slot.end_time}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Étape 3 : Notes confidentielles */}
          <div>
            <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock size={12} className="text-[#C9A84C]" />
              3. Note confidentielle pastorale (Optionnel)
            </label>
            <p className="text-[11px] text-gray-500 mb-2">
              Partagez brièvement vos attentes ou vos sujets de prière. Ces informations ne seront visibles que par le conseiller.
            </p>
            <textarea
              rows={3}
              value={userNotes}
              onChange={(e) => setUserNotes(e.target.value)}
              placeholder="Ex: Nous souhaitons aborder la gestion de nos familles respectives et la prière de sanctification avant notre union..."
              className="w-full p-3 text-xs rounded-xl border border-[#E8ECE9] focus:outline-none focus:border-[#1A3A5C] bg-[#FAF9F6] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8ECE9]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !selectedSlotTime}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Confirmation en cours...
                </>
              ) : (
                <>
                  Confirmer le Rendez-vous
                  <ChevronRight size={14} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
