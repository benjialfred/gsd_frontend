import React from 'react';
import type { CoachProfile } from '../types/coaching';
import { ShieldCheck, Star, Calendar, Clock, MapPin, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface CoachCardProps {
  coach: CoachProfile;
  onBook: (coach: CoachProfile) => void;
}

export const CoachCard: React.FC<CoachCardProps> = ({ coach, onBook }) => {
  const specialtiesList = coach.specialties
    ? coach.specialties.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

  const formattedRate = typeof coach.hourly_rate === 'number' 
    ? `${coach.hourly_rate.toLocaleString()} FCFA`
    : `${parseInt(coach.hourly_rate || '0', 10).toLocaleString()} FCFA`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-3xl border border-[#E8ECE9] shadow-[0_4px_24px_rgba(26,58,92,0.04)] hover:shadow-[0_12px_32px_rgba(26,58,92,0.08)] transition-all overflow-hidden flex flex-col justify-between"
    >
      <div className="p-6">
        {/* Top Header: Avatar & Main Info */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-[#1A3A5C] text-white flex items-center justify-center font-bold text-xl overflow-hidden border-2 border-[#C9A84C]/40 shadow-sm">
              {coach.avatar_url ? (
                <img
                  src={coach.avatar_url}
                  alt={coach.full_name}
                  className="w-full h-full object-cover"
                  onError={(e: any) => {
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <span>{coach.full_name?.charAt(0) || 'P'}</span>
              )}
            </div>
            {coach.is_verified && (
              <div 
                className="absolute -bottom-1.5 -right-1.5 bg-[#C9A84C] text-[#1A3A5C] p-1 rounded-full shadow-md"
                title="Conseiller Pastoral Certifié GSD"
              >
                <ShieldCheck size={14} strokeWidth={2.5} />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="text-lg font-bold text-[#1A3A5C] truncate">{coach.full_name}</h3>
              {coach.is_verified && (
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider bg-[#C9A84C]/15 text-[#9E7D2B] rounded-full border border-[#C9A84C]/30">
                  Certifié
                </span>
              )}
            </div>

            <p className="text-xs font-semibold text-[#8C9B90] mb-2">{coach.title}</p>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-bold text-amber-500">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                {Number(coach.rating) > 0 ? Number(coach.rating).toFixed(1) : '5.0'}
                <span className="text-gray-400 font-normal">({coach.reviews_count || 12} avis)</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center gap-1 text-gray-600">
                <Award size={13} className="text-[#C9A84C]" />
                {coach.years_of_experience || 5} ans d'expérience
              </span>
            </div>
          </div>
        </div>

        {/* Denomination & Bio */}
        <div className="mb-4">
          <div className="text-[11px] font-semibold text-[#1A3A5C]/70 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]"></span>
            Dénomination : <span className="text-gray-700">{coach.denomination || 'Évangélique'}</span>
          </div>
          <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">
            {coach.bio || "Accompagnement spirituel, discernement matrimonial et consolidation du couple chrétien selon la Parole de Dieu."}
          </p>
        </div>

        {/* Specialties Tags */}
        <div className="flex flex-wrap gap-1.5 mb-2">
          {specialtiesList.slice(0, 3).map((spec, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-[11px] font-medium bg-[#FAF9F6] text-[#1A3A5C] rounded-lg border border-[#E8ECE9]"
            >
              {spec}
            </span>
          ))}
          {specialtiesList.length > 3 && (
            <span className="px-2 py-1 text-[10px] text-gray-400 font-medium">
              +{specialtiesList.length - 3} autres
            </span>
          )}
        </div>
      </div>

      {/* Footer: Rate & Action CTA */}
      <div className="p-5 pt-3 bg-[#FCFBF9] border-t border-[#E8ECE9] flex items-center justify-between gap-3">
        <div>
          <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Séance 60 min
          </span>
          <span className="text-base font-extrabold text-[#1A3A5C]">
            {formattedRate}
          </span>
        </div>

        <button
          onClick={() => onBook(coach)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] hover:from-[#132A42] hover:to-[#1A3A5C] text-white text-xs font-bold tracking-wide shadow-md hover:shadow-lg transition-all active:scale-95"
        >
          <Calendar size={14} className="text-[#C9A84C]" />
          Prendre RDV
        </button>
      </div>
    </motion.div>
  );
};
