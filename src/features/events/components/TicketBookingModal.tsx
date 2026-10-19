import React, { useState, useEffect } from 'react';
import type { EventItem, TicketTier, EventRegistration } from '../types/events';
import { eventsService } from '../services/eventsService';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from '../../../stores/useToastStore';
import { 
  X, Ticket, Calendar, MapPin, CheckCircle2, 
  ChevronRight, Loader2, Sparkles, User, Mail, Phone, Lock 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface TicketBookingModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (registration: EventRegistration) => void;
}

export const TicketBookingModal: React.FC<TicketBookingModalProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();

  const [selectedTierId, setSelectedTierId] = useState<number>(0);
  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    if (event && event.ticket_tiers && event.ticket_tiers.length > 0) {
      const defaultTier = event.ticket_tiers.find((t) => t.is_active && t.available_quantity > 0) || event.ticket_tiers[0];
      if (defaultTier) {
        setSelectedTierId(defaultTier.id);
      }
    }
    if (user) {
      setGuestName(`${user.first_name || ''} ${user.last_name || ''}`.trim() || user.username || '');
      setGuestEmail(user.email || '');
    }
  }, [event, user, isOpen]);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTierId) {
      toast.error("Veuillez sélectionner un type de billet.");
      return;
    }

    setIsSubmitting(true);
    try {
      const registration = await eventsService.registerForEvent(event.id, {
        ticket_tier_id: selectedTierId,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_phone: guestPhone,
        notes: notes,
      });

      toast.success("Billet réservé avec succès ! Votre pass officiel avec QR Code est prêt.");
      onClose();
      onSuccess(registration);
    } catch (err: any) {
      console.error("Erreur réservation billet:", err);
      const msg = err.response?.data?.error || "Échec de la réservation du billet.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedTier = event.ticket_tiers.find((t) => t.id === selectedTierId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#E8ECE9] w-full max-w-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-[#1A3A5C] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#C9A84C] text-[#1A3A5C]">
              {event.event_type_display}
            </span>
            <span className="text-xs text-white/70">{event.city}</span>
          </div>

          <h2 className="text-xl font-bold text-white font-serif">{event.title}</h2>
          <div className="flex items-center gap-4 text-xs text-white/70 mt-2">
            <span className="flex items-center gap-1.5">
              <Calendar size={13} className="text-[#C9A84C]" />
              {new Date(event.start_date).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <MapPin size={13} className="text-[#C9A84C]" />
              {event.location_name}
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Étape 1 : Choix de la catégorie de billet */}
          <div>
            <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2.5">
              1. Sélectionnez votre Catégorie de Billet
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {event.ticket_tiers.map((tier) => {
                const isSelected = selectedTierId === tier.id;
                const isSoldOut = tier.available_quantity <= 0;
                const formattedPrice = typeof tier.price === 'number'
                  ? `${tier.price.toLocaleString()} FCFA`
                  : `${parseInt(tier.price || '0', 10).toLocaleString()} FCFA`;

                return (
                  <button
                    key={tier.id}
                    type="button"
                    disabled={isSoldOut}
                    onClick={() => setSelectedTierId(tier.id)}
                    className={`p-4 rounded-2xl border text-left transition-all relative ${
                      isSoldOut
                        ? 'opacity-40 cursor-not-allowed bg-gray-50 border-gray-200'
                        : isSelected
                        ? 'border-[#C9A84C] bg-[#FAF9F6] shadow-sm ring-2 ring-[#C9A84C]/50'
                        : 'border-[#E8ECE9] hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <span className="text-xs font-bold text-[#1A3A5C]">{tier.name}</span>
                      {isSelected && <CheckCircle2 size={14} className="text-[#C9A84C] shrink-0" />}
                    </div>

                    <div className="text-base font-extrabold text-[#1A3A5C] mb-1.5">
                      {formattedPrice}
                    </div>

                    {tier.description && (
                      <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed mb-2">
                        {tier.description}
                      </p>
                    )}

                    <div className="text-[10px] font-semibold text-emerald-600">
                      {tier.available_quantity} places restantes
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Étape 2 : Coordonnées de l'invité */}
          <div>
            <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2.5">
              2. Informations du Titulaire du Pass
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Nom Complet</label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] focus:outline-none focus:border-[#1A3A5C]"
                    placeholder="Prénom et Nom"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Email pour réception du Pass</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] focus:outline-none focus:border-[#1A3A5C]"
                    placeholder="email@domaine.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Numéro WhatsApp / Téléphone</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] focus:outline-none focus:border-[#1A3A5C]"
                    placeholder="+237 6XX XX XX XX"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">Notes / Régime particulier</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] focus:outline-none focus:border-[#1A3A5C]"
                  placeholder="Végétarien, accompagnant..."
                />
              </div>
            </div>
          </div>

          {/* Récapitulatif et CTA */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9] flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500 block">Total à régler :</span>
              <span className="text-lg font-extrabold text-[#1A3A5C]">
                {selectedTier
                  ? typeof selectedTier.price === 'number'
                    ? `${selectedTier.price.toLocaleString()} FCFA`
                    : `${parseInt(selectedTier.price || '0', 10).toLocaleString()} FCFA`
                  : '0 FCFA'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Génération du Pass...
                  </>
                ) : (
                  <>
                    Valider ma Réservation
                    <ChevronRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
