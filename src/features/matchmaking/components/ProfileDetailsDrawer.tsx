import React from 'react';
import { X, Heart, ShieldCheck, MapPin } from 'lucide-react';
import { MatchCandidate } from '../types';
import Button from '@/shared/components/Button';

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
            <div className="w-20 h-20 rounded-full bg-white/10 overflow-hidden flex-shrink-0">
               {profile.primary_photo ? (
                 <img src={profile.primary_photo} alt={profile.first_name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gsd-surface-light flex items-center justify-center text-2xl font-bold text-white">
                   {profile.first_name.charAt(0)}
                 </div>
               )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {profile.first_name}, {profile.age}
                {profile.kyc_verified && <ShieldCheck size={20} className="text-gsd-success" />}
              </h2>
              <div className="flex items-center gap-1 text-gsd-text-secondary mt-1 text-sm">
                <MapPin size={14} />
                <span>{profile.city || 'Ville non renseignée'}</span>
              </div>
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

          {/* More sections could be added here (Hobbies, Goals...) */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Informations complémentaires</h3>
            <div className="grid grid-cols-2 gap-4">
               {/* Placeholders for future data */}
               <div className="bg-white/5 p-4 rounded-xl">
                 <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1">Dénomination</p>
                 <p className="text-white font-medium">Chrétienne</p>
               </div>
               <div className="bg-white/5 p-4 rounded-xl">
                 <p className="text-xs text-gsd-text-secondary uppercase tracking-wider mb-1">Langues</p>
                 <p className="text-white font-medium">Français, Anglais</p>
               </div>
            </div>
          </div>
          
        </div>

      </div>
    </>
  );
};

export default ProfileDetailsDrawer;
