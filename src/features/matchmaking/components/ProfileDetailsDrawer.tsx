import React from 'react';
import { X, Heart, ShieldCheck, MapPin, Award, CheckCircle, GraduationCap, Sparkles } from 'lucide-react';
import type { MatchCandidate } from '../types';

interface ProfileDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: MatchCandidate;
}

const ProgressBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gsd-text-secondary">{label}</span>
        <span className="font-medium text-white">{value}%</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden flex">
        <div 
          className="h-full bg-gsd-primary transition-all duration-1000 ease-out rounded-full"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

const ProfileDetailsDrawer: React.FC<ProfileDetailsDrawerProps> = ({ isOpen, onClose, candidate }) => {
  if (!isOpen) return null;

  const { profile, compatibility_breakdown, compatibility_explanation, compatibility } = candidate;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed bottom-0 left-0 right-0 w-full max-w-2xl mx-auto h-[85vh] bg-gsd-surface rounded-t-3xl z-50 flex flex-col overflow-hidden animate-slide-up shadow-2xl border-t border-white/10">
        
        {/* Header (sticky) */}
        <div className="flex justify-between items-center p-4 border-b border-white/5 bg-gsd-surface sticky top-0 z-10">
          <h3 className="text-lg font-semibold text-white">Profil détaillé</h3>
          <button 
            onClick={onClose}
            className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-gsd-text-secondary hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
          
          {/* Header Info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden flex-shrink-0 border-2 border-white/10">
               {profile.primary_photo ? (
                 <img src={profile.primary_photo} alt={profile.first_name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gsd-surface-light flex items-center justify-center text-2xl font-bold text-white">
                   {profile.first_name.charAt(0)}
                 </div>
               )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 flex-wrap">
                {profile.first_name}, {profile.age} ans
                {profile.kyc_verified && <ShieldCheck size={20} className="text-gsd-success" />}
              </h2>
              <div className="flex items-center gap-1 text-gsd-text-secondary mt-1 text-sm">
                <MapPin size={14} />
                <span>{profile.city || 'Ville non renseignée'}</span>
              </div>
              {profile.is_academy_certified && (
                <div className="mt-2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/40 text-[#EAD8A4] text-xs font-semibold w-fit">
                  <Award size={14} className="text-[#C9A84C]" />
                  <span>Certifié Préparation au Mariage GSD</span>
                </div>
              )}
            </div>
          </div>

          {/* Compatibility Details */}
          <div className="bg-white/5 rounded-2xl p-5 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-gsd-primary fill-gsd-primary" size={20} />
              <h3 className="text-lg font-semibold text-white">{compatibility}% de compatibilité</h3>
            </div>
            
            {compatibility_explanation && (
              <div className="mb-6 bg-gsd-primary/10 border border-gsd-primary/20 rounded-xl p-4">
                <h4 className="font-medium text-gsd-primary-light mb-1">{compatibility_explanation.strongest_factor}</h4>
                <p className="text-sm text-gsd-text-secondary">{compatibility_explanation.summary}</p>
              </div>
            )}

            <div className="space-y-4">
              <ProgressBar label="Foi & Spiritualité" value={compatibility_breakdown?.faith || 0} />
              <ProgressBar label="Valeurs & Vision familiale" value={compatibility_breakdown?.values || 0} />
              <ProgressBar label="Mode de vie" value={compatibility_breakdown?.lifestyle || 0} />
              <ProgressBar label="Localisation" value={compatibility_breakdown?.location || 0} />
            </div>
          </div>

          {/* Section Certifications Académie de l'Alliance */}
          {profile.certifications && profile.certifications.length > 0 && (
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#1A3A5C]/40 via-[#1A2535]/50 to-[#0F1E2F]/70 border border-[#C9A84C]/40 p-5 shadow-xl">
              <div className="absolute top-0 right-0 w-36 h-36 bg-[#C9A84C]/10 rounded-full blur-2xl pointer-events-none" />
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#C9A84C] flex-shrink-0">
                  <Award size={22} className="fill-[#C9A84C]/20" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Formations & Certifications Validées</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A84C] text-[#1A3A5C] uppercase tracking-wider">
                      Officiel
                    </span>
                  </div>
                  <p className="text-xs text-[#FAF9F6]/60">Ce candidat s'est engagé dans la sanctification et la préparation de son alliance.</p>
                </div>
              </div>

              <div className="space-y-2.5">
                {profile.certifications.map((cert) => (
                  <div key={cert.course_id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-[#C9A84C]/40 transition-colors flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#C9A84C]/15 border border-[#C9A84C]/25 flex items-center justify-center flex-shrink-0 text-[#C9A84C]">
                      <CheckCircle size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{cert.course_title}</h4>
                      <div className="flex items-center gap-2 text-xs text-[#EAD8A4] mt-0.5 flex-wrap">
                        <span>{cert.category_display}</span>
                        {cert.completed_at && (
                          <>
                            <span className="text-white/30">•</span>
                            <span className="text-white/60">
                              Validé en {new Date(cert.completed_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio & Vision du Mariage */}
          {(profile.bio || profile.marriage_objectives) && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Vision & Valeurs</h3>
              {profile.bio && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1 font-semibold">Présentation</p>
                  <p className="text-white/90 text-sm leading-relaxed">{profile.bio}</p>
                </div>
              )}
              {profile.marriage_objectives && (
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                  <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1 font-semibold">Vision du foyer & Alliance</p>
                  <p className="text-white/90 text-sm leading-relaxed">{profile.marriage_objectives}</p>
                </div>
              )}
            </div>
          )}

          {/* Informations complémentaires */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informations complémentaires</h3>
            <div className="grid grid-cols-2 gap-4">
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1">Dénomination</p>
                 <p className="text-white font-medium">{profile.denomination || 'Chrétienne'}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1">Profession</p>
                 <p className="text-white font-medium">{profile.profession || 'Non renseignée'}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1">Assiduité à l'église</p>
                 <p className="text-white font-medium">{profile.church_attendance || 'Régulière'}</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                 <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1">Statut marital</p>
                 <p className="text-white font-medium">{profile.marital_status || 'Célibataire'}</p>
               </div>
            </div>
          </div>
          
        </div>

      </div>
    </>
  );
};

export default ProfileDetailsDrawer;
