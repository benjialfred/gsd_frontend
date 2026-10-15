import React, { useState } from 'react';
import { 
  X, Heart, MapPin, Church, Sparkles, Briefcase, 
  GraduationCap, Calendar, ShieldCheck, Eye 
} from 'lucide-react';
import { getMediaUrl } from '../../../services/profile';

interface PartnerProfileDrawerProps {
  partner: any;
  compatibility: number;
  isOpen: boolean;
  onClose: () => void;
  onOpenLightbox?: (url: string) => void;
}

export default function PartnerProfileDrawer({
  partner,
  compatibility,
  isOpen,
  onClose,
  onOpenLightbox
}: PartnerProfileDrawerProps) {
  if (!isOpen || !partner) return null;

  const partnerName = partner.first_name 
    ? `${partner.first_name} ${partner.last_name || ''}`.trim() 
    : 'Partenaire Divin';
  const avatarUrl = partner.avatar ? getMediaUrl(partner.avatar) : null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-[#EFECE6] flex flex-col overflow-y-auto animate-in slide-in-from-right duration-300">
          
          {/* Header du volet */}
          <div className="sticky top-0 z-10 px-6 py-4 bg-white/95 backdrop-blur border-b border-[#EFECE6] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="font-serif font-bold text-base text-[#1A3A5C]">Profil de l'Âme Sœur</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Photo & Nom */}
          <div className="p-6 flex flex-col items-center text-center bg-[#FAF9F6] border-b border-[#EFECE6]">
            <div className="relative mb-3">
              <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#C9A84C]/40 shadow-lg bg-gray-100 flex items-center justify-center">
                {avatarUrl ? (
                  <img 
                    src={avatarUrl} 
                    alt={partnerName} 
                    className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                    onClick={() => onOpenLightbox && onOpenLightbox(avatarUrl)}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-[#C9A84C] to-[#deb958] flex items-center justify-center text-white text-3xl font-serif font-bold">
                    {partnerName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <span className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow-md text-[#C9A84C]">
                <Sparkles size={14} />
              </span>
            </div>

            <h2 className="text-xl font-serif font-bold text-[#1A3A5C]">{partnerName}</h2>
            {partner.age && (
              <p className="text-xs text-gray-500 mt-0.5">{partner.age} ans</p>
            )}

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-bold font-serif">
              <Heart size={13} className="fill-current" />
              <span>{compatibility}% de compatibilité spirituelle</span>
            </div>
          </div>

          {/* Corps de la Fiche Profil */}
          <div className="p-6 space-y-6">
            
            {/* Localisation & Foi */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#EFECE6]">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <MapPin size={13} className="text-[#C9A84C]" />
                  <span>Localisation</span>
                </div>
                <div className="text-xs font-semibold text-[#1A3A5C] truncate">
                  {partner.city || 'Non renseignée'}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#FCFBF9] border border-[#EFECE6]">
                <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
                  <Church size={13} className="text-[#C9A84C]" />
                  <span>Dénomination</span>
                </div>
                <div className="text-xs font-semibold text-[#1A3A5C] truncate">
                  {partner.denomination ? partner.denomination.replace('_', ' ') : 'Chrétien(ne)'}
                </div>
              </div>
            </div>

            {/* Vision du Mariage */}
            {partner.marriage_objectives && (
              <div>
                <h4 className="text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Heart size={13} className="text-[#C9A84C]" /> Vision de l'Alliance Sacrée
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#EFECE6] italic">
                  « {partner.marriage_objectives} »
                </p>
              </div>
            )}

            {/* Valeurs Fondamentales */}
            {partner.marriage_values && (
              <div>
                <h4 className="text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-[#C9A84C]" /> Valeurs Essentielles
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-[#FAF9F6] p-3.5 rounded-2xl border border-[#EFECE6]">
                  {partner.marriage_values}
                </p>
              </div>
            )}

            {/* Profession & Études */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-[#1A3A5C] uppercase tracking-wider">
                Parcours & Engagement
              </h4>
              <div className="space-y-2 text-xs text-gray-700">
                {partner.profession && (
                  <div className="flex items-center gap-2">
                    <Briefcase size={14} className="text-[#C9A84C]" />
                    <span>Profession : <strong>{partner.profession}</strong></span>
                  </div>
                )}
                {partner.education_level && (
                  <div className="flex items-center gap-2">
                    <GraduationCap size={14} className="text-[#C9A84C]" />
                    <span>Niveau d'études : <strong>{partner.education_level}</strong></span>
                  </div>
                )}
                {partner.church_attendance && (
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-[#C9A84C]" />
                    <span>Fréquentation du culte : <strong>{partner.church_attendance}</strong></span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio personnelle */}
            {partner.bio && (
              <div>
                <h4 className="text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2">
                  Témoignage Personnel
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed bg-[#FCFBF9] p-3.5 rounded-2xl border border-[#EFECE6] whitespace-pre-wrap">
                  {partner.bio}
                </p>
              </div>
            )}

            {/* Badge de sécurité */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
              <ShieldCheck size={24} className="text-emerald-600 shrink-0" />
              <div className="text-[11px] text-emerald-800">
                <span className="font-bold block">Sanctuaire Certifié GSD</span>
                Profil authentifié et engagé dans la charte de pureté et d'alliance.
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
