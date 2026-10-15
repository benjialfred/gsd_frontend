import React from 'react';
import type { EventItem } from '../types/events';
import { 
  Calendar, MapPin, Sparkles, Users, 
  Ticket, ArrowRight, Video, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: EventItem;
  onBook: (event: EventItem) => void;
  onDetails?: (event: EventItem) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onBook, onDetails }) => {
  const startDate = new Date(event.start_date);
  const formattedDate = startDate.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  const formattedTime = startDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const formattedMinPrice = event.min_price > 0
    ? `${event.min_price.toLocaleString('fr-FR')} FCFA`
    : "Entrée Libre";

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'GALA':
        return {
          label: 'Dîner de Gala',
          bg: 'bg-gradient-to-r from-[#C9A84C] to-[#E5C77A] text-[#1A3A5C]',
        };
      case 'CONFERENCE':
        return {
          label: 'Sommet & Conférence',
          bg: 'bg-blue-600 text-white',
        };
      case 'RETREAT':
        return {
          label: 'Retraite Spirituelle',
          bg: 'bg-emerald-600 text-white',
        };
      default:
        return {
          label: 'Atelier & Rencontre',
          bg: 'bg-purple-600 text-white',
        };
    }
  };

  const badgeInfo = getTypeBadge(event.event_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-[#E8ECE9] shadow-[0_4px_24px_rgba(26,58,92,0.04)] hover:shadow-[0_12px_32px_rgba(26,58,92,0.1)] transition-all overflow-hidden flex flex-col justify-between group cursor-pointer"
      onClick={() => onDetails && onDetails(event)}
    >
      <div>
        {/* Banner Image */}
        <div className="relative h-48 w-full overflow-hidden bg-[#1A3A5C]">
          {event.banner_image ? (
            <img
              src={event.banner_image}
              alt={event.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#1A3A5C] to-[#244A72] flex items-center justify-center text-white">
              <Sparkles size={36} className="text-[#C9A84C]" />
            </div>
          )}

          {/* Type Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-md ${badgeInfo.bg}`}>
              {badgeInfo.label}
            </span>
          </div>

          {/* Featured Badge */}
          {event.is_featured && (
            <div className="absolute top-4 right-4 bg-[#1A3A5C]/80 backdrop-blur-md border border-[#C9A84C]/50 text-[#C9A84C] px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center gap-1 shadow-md">
              <Sparkles size={11} />
              Édition 2026
            </div>
          )}

          {/* City Pill */}
          <div className="absolute bottom-3 left-4 bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-xs font-semibold flex items-center gap-1.5">
            <MapPin size={12} className="text-[#C9A84C]" />
            <span>{event.city}</span>
            {event.is_online && (
              <span className="text-[10px] text-emerald-400 font-bold ml-1 flex items-center gap-1">
                <Video size={10} /> + Live HD
              </span>
            )}
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8C9B90] mb-2 uppercase tracking-wider">
            <Calendar size={13} className="text-[#C9A84C]" />
            <span className="capitalize">{formattedDate}</span> à <span>{formattedTime}</span>
          </div>

          <h3 className="text-lg font-bold text-[#1A3A5C] leading-snug mb-2 group-hover:text-[#244A72] transition-colors line-clamp-2">
            {event.title}
          </h3>

          {event.theme_verse && (
            <p className="text-xs italic text-[#C9A84C] font-serif mb-3 line-clamp-1">
              "{event.theme_verse}"
            </p>
          )}

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {event.description}
          </p>

          {/* Location & Dress code details */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9] text-xs text-gray-600 mb-2">
            <div className="flex items-center gap-2 truncate">
              <MapPin size={12} className="text-[#1A3A5C] shrink-0" />
              <span className="truncate font-medium">{event.location_name}</span>
            </div>
            {event.dress_code && (
              <div className="text-[11px] text-gray-500 truncate">
                <strong className="text-[#1A3A5C]">Dress Code :</strong> {event.dress_code}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer avec En Savoir Plus et Réserver */}
      <div 
        className="p-5 pt-3 bg-[#FCFBF9] border-t border-[#E8ECE9] flex flex-wrap items-center justify-between gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Billetterie
          </span>
          <span className="text-sm font-extrabold text-[#1A3A5C]">
            {formattedMinPrice}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onDetails && (
            <button
              onClick={() => onDetails(event)}
              className="px-3.5 py-2 rounded-xl border border-[#1A3A5C]/20 hover:border-[#C9A84C] hover:bg-white text-[#1A3A5C] text-xs font-bold tracking-wide transition-all shadow-sm"
              title="Voir les détails, le programme et les formules"
            >
              En savoir plus
            </button>
          )}

          <button
            onClick={() => onBook(event)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] hover:from-[#132A42] hover:to-[#1A3A5C] text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95"
          >
            <Ticket size={14} className="text-[#C9A84C]" />
            <span>Réserver</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
