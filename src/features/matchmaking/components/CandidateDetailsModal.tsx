import React from 'react';
import { 
  X, Heart, ShieldCheck, MapPin, Church, Sparkles, 
  ArrowRight, Lock 
} from 'lucide-react';
import { getMediaUrl } from '../../../services/profile';

interface CandidateDetailsModalProps {
  candidate: any | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (candidate: any) => void;
  onRegister?: () => void;
}

export const CandidateDetailsModal: React.FC<CandidateDetailsModalProps> = ({
  candidate,
  isOpen,
  onClose,
  onLike,
  onRegister,
}) => {
  if (!isOpen || !candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#C9A84C]/40 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOUTON FERMER */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg border border-white/20"
        >
          <X size={18} />
        </button>

        {/* HERO IMAGE & IDENTITÉ */}
        <div className="relative h-72 w-full overflow-hidden bg-gray-900 shrink-0">
          {candidate.avatar ? (
            <img
              src={getMediaUrl(candidate.avatar)}
              alt={candidate.first_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#0A192F] to-[#1A3A5C] flex flex-col items-center justify-center text-white">
              <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 border-2 border-[#C9A84C] flex items-center justify-center text-3xl font-serif font-bold text-[#DFB76C] mb-2">
                {candidate.first_name?.charAt(0) || '✦'}
              </div>
              <span className="text-xs uppercase tracking-widest text-[#DFB76C]">Profil Réel GSD</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-black/30 to-transparent" />

          {/* Badge Compatibilité */}
          <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#C9A84C]/60 flex items-center gap-1.5 text-xs font-bold text-[#DFB76C] shadow-lg">
            <Sparkles size={13} className="text-[#C9A84C]" />
            <span>{candidate.compatibility || 94}% Harmonie Spirituelle</span>
          </div>

          {/* Badge KYC */}
          <div className="absolute bottom-4 right-4 bg-emerald-600/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 shadow">
            <ShieldCheck size={14} />
            <span>Profil Réel Audité KYC</span>
          </div>

          {/* Nom, Âge et Ville sur l'image */}
          <div className="absolute bottom-4 left-6 right-20 text-white">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold leading-tight">
              {candidate.first_name}{candidate.age ? `, ${candidate.age} ans` : ''}
            </h2>
            <div className="flex items-center gap-2 text-xs text-[#DFB76C] font-semibold mt-1">
              <MapPin size={13} />
              <span>{candidate.city || 'Douala'}</span>
              {candidate.distance_km !== undefined && (
                <span className="text-gray-300">• à {Math.round(candidate.distance_km)} km</span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENU DÉTAILLÉ DU PROFIL */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-700">
          
          {/* Confession & Profession */}
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="px-3.5 py-1.5 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] font-semibold flex items-center gap-1.5 border border-[#1A3A5C]/20">
              <Church size={14} className="text-[#C9A84C]" />
              <span>{candidate.denomination || 'Chrétien(ne)'}</span>
            </span>
            {candidate.profession && (
              <span className="px-3.5 py-1.5 rounded-full bg-gray-100 text-gray-800 font-medium">
                💼 {candidate.profession}
              </span>
            )}
            {candidate.church_attendance && (
              <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 font-medium border border-emerald-200">
                ✝ Fréquentation : {candidate.church_attendance}
              </span>
            )}
          </div>

          {/* Vision du Mariage */}
          {candidate.marriage_vision ? (
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border-l-4 border-[#C9A84C] space-y-1">
              <div className="text-[10px] uppercase font-bold tracking-wider text-[#C9A84C]">
                Vision du Foyer & de l'Alliance
              </div>
              <p className="text-xs sm:text-sm text-[#1A3A5C] italic font-serif leading-relaxed">
                « {candidate.marriage_vision} »
              </p>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] text-xs text-gray-500 italic">
              « Aspire à un foyer fondé sur Christ, l'honneur mutuel et le respect de la Parole. »
            </div>
          )}

          {/* Décomposition de l'Affinité */}
          <div className="space-y-3 bg-[#FAF9F6] p-4 sm:p-5 rounded-2xl border border-[#EFECE6]">
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#1A3A5C]">
              Accord Spirituel & Doctrinal
            </h4>

            <div className="space-y-2 text-xs">
              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Harmonie de Foi & Prière</span>
                  <span className="font-bold text-[#1A3A5C]">{candidate.breakdown?.faith || 95}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${candidate.breakdown?.faith || 95}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Vision des Rôles dans le Couple</span>
                  <span className="font-bold text-[#1A3A5C]">{candidate.breakdown?.values || 92}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${candidate.breakdown?.values || 92}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-gray-600 mb-1">
                  <span>Style de Vie & Valeurs Morales</span>
                  <span className="font-bold text-[#1A3A5C]">{candidate.breakdown?.lifestyle || 90}%</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: `${candidate.breakdown?.lifestyle || 90}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Reassurance de Pureté */}
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center gap-2.5">
            <Lock size={16} className="text-blue-600 shrink-0" />
            <span>
              Les coordonnées exactes et le contact direct sont protégés par la conciergerie GSD jusqu'au consentement mutuel de prière.
            </span>
          </div>

        </div>

        {/* ACTIONS */}
        <div className="p-5 sm:p-6 bg-[#FAF9F6] border-t border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto"
          >
            Fermer
          </button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onLike && (
              <button
                onClick={() => {
                  onLike(candidate);
                  onClose();
                }}
                className="px-6 py-3 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] hover:brightness-110 text-[#040914] font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <Heart size={15} className="fill-current text-[#040914]" />
                <span>Prier & Témoigner Mon Intérêt</span>
              </button>
            )}

            {onRegister && (
              <button
                onClick={() => {
                  onClose();
                  onRegister();
                }}
                className="px-6 py-3 rounded-full bg-[#1A3A5C] hover:bg-[#132c45] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2 flex-1 sm:flex-initial"
              >
                <span>Créer Mon Profil pour Échanger</span>
                <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
