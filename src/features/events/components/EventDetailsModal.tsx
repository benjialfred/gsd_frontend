import React from 'react';
import type { EventItem } from '../types/events';
import { 
  X, Calendar, MapPin, Sparkles, Users, 
  Ticket, ArrowRight, ShieldCheck, CheckCircle2, Clock, Crown
} from 'lucide-react';
import { getMediaUrl } from '../../../services/profile';

interface EventDetailsModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onBook: (event: EventItem) => void;
}

export const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  isOpen,
  onClose,
  onBook,
}) => {
  if (!isOpen || !event) return null;

  const startDate = new Date(event.start_date);
  const formattedDate = startDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#C9A84C]/40 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOUTON FERMER FLOTTANT */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg border border-white/20"
        >
          <X size={18} />
        </button>

        {/* HERO BANNIÈRE */}
        <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-[#0A192F] shrink-0">
          {event.banner_image ? (
            <img
              src={getMediaUrl(event.banner_image)}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#0A192F] to-[#1A3A5C] flex items-center justify-center">
              <Calendar size={50} className="text-[#C9A84C]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent" />

          {/* Badge Type d'Événement */}
          <div className="absolute top-4 left-4 bg-[#C9A84C] text-[#0A192F] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
            {event.event_type_display || event.event_type}
          </div>

          {/* Titre & Localisation sur l'image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight drop-shadow-md">
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#DFB76C] font-semibold mt-1">
              <span className="flex items-center gap-1">
                <MapPin size={13} />
                {event.city} • {event.location_name}
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <Calendar size={13} />
                {formattedDate} à {formattedTime}
              </span>
            </div>
          </div>
        </div>

        {/* CONTENU DÉTAILLÉ DÉROULANT */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-700">
          
          {/* Thème Biblique */}
          {event.theme_verse && (
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border-l-4 border-[#C9A84C] text-sm text-[#1A3A5C] italic font-serif leading-relaxed">
              « {event.theme_verse} »
            </div>
          )}

          {/* Description complète */}
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#1A3A5C] mb-2">
              À Propos de la Célébration
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-light whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Informations Pratiques (Dress Code, Accès, Capacité) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {event.dress_code && (
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center shrink-0">
                  <Crown size={20} />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                    Dress Code Impérial
                  </div>
                  <div className="text-xs font-semibold text-[#1A3A5C]">
                    {event.dress_code}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center shrink-0">
                <Users size={20} />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-gray-400 font-bold">
                  Places Disponibles
                </div>
                <div className="text-xs font-semibold text-[#1A3A5C]">
                  {event.available_spots > 0 ? `${event.available_spots} places restantes` : 'Complet'}
                </div>
              </div>
            </div>
          </div>

          {/* Grille des Catégories de Billetterie */}
          {event.ticket_tiers && event.ticket_tiers.length > 0 && (
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#1A3A5C] mb-3">
                Formules & Tarifs Officiels
              </h4>
              <div className="space-y-2">
                {event.ticket_tiers.map((tier) => (
                  <div 
                    key={tier.id}
                    className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="text-xs font-serif font-bold text-[#1A3A5C] flex items-center gap-2">
                        <span>{tier.name}</span>
                        {tier.available_quantity > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold">
                            {tier.available_quantity} dispos
                          </span>
                        )}
                      </div>
                      {tier.description && (
                        <p className="text-[11px] text-gray-500 mt-0.5">{tier.description}</p>
                      )}
                    </div>
                    <div className="text-sm font-serif font-bold text-[#C9A84C] shrink-0">
                      {Number(tier.price) > 0 ? `${Number(tier.price).toLocaleString('fr-FR')} FCFA` : 'Gratuit'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reassurance Sécurité */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-3">
            <ShieldCheck size={20} className="text-emerald-600 shrink-0" />
            <span>
              Accès ultra sécurisé sur présentation du Pass Numérique avec QR Code unique. Accueil et modération assurés par le Conseil Pastoral GSD.
            </span>
          </div>

        </div>

        {/* PIED DE PAGE AVEC ACTION DE RÉSERVATION */}
        <div className="p-5 sm:p-6 bg-[#FAF9F6] border-t border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div>
            <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
              Tarif d'Accès
            </span>
            <span className="text-lg font-serif font-bold text-[#1A3A5C]">
              {event.min_price > 0 ? `À partir de ${event.min_price.toLocaleString('fr-FR')} FCFA` : 'Entrée Libre sur Inscription'}
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-5 py-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto"
            >
              Fermer
            </button>
            <button
              onClick={() => {
                onClose();
                onBook(event);
              }}
              className="px-7 py-3 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] hover:brightness-110 text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <Ticket size={15} />
              <span>Réserver Ma Place</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
