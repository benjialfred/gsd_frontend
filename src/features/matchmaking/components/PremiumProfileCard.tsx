import React, { useState } from 'react';
import { User, MapPin, Heart, Info, X, Award } from 'lucide-react';
import type { MatchCandidate } from '../types';
import Button from '../../../shared/components/Button';
import ProfileDetailsDrawer from './ProfileDetailsDrawer';

interface PremiumProfileCardProps {
  candidate: MatchCandidate;
  onLike: () => void;
  onPass: () => void;
}

const PremiumProfileCard: React.FC<PremiumProfileCardProps> = ({ candidate, onLike, onPass }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const { profile, compatibility_explanation, compatibility } = candidate;

  // Placeholder blur URL (small generic blur) ou fallback gris
  const placeholderStyle = {
    backgroundColor: '#1a1a1a',
    backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%"><rect width="100%" height="100%" fill="%23222"/></svg>')`
  };

  return (
    <>
      <div className="relative w-full h-[600px] max-w-md mx-auto bg-gsd-surface rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Hero Image Container */}
        <div className="absolute inset-0 w-full h-full" style={placeholderStyle}>
          {profile.primary_photo ? (
            <img 
              src={profile.primary_photo} 
              alt={profile.first_name} 
              className={`w-full h-full object-cover transition-opacity duration-700 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoad={() => setImageLoaded(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gsd-surface-light">
              <User size={64} className="text-gsd-text-secondary" />
            </div>
          )}
        </div>

        {/* Gradient Overlay pour lisibilité */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

        {/* Top Floating Badge - Certifié Alliance GSD */}
        {profile.is_academy_certified && (
          <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#1A3A5C]/95 via-[#234A75]/95 to-[#1A3A5C]/95 border border-[#C9A84C]/80 backdrop-blur-md shadow-lg shadow-[#C9A84C]/25 text-[#FAF9F6]">
            <Award size={15} className="text-[#C9A84C] fill-[#C9A84C]/30 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-[#EAD8A4]">Certifié Alliance GSD</span>
          </div>
        )}

        {/* Top Floating Actions (ex: Voir Profil Complet) */}
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={() => setIsDrawerOpen(true)}
            className="bg-black/50 backdrop-blur-md text-white p-2 rounded-full hover:bg-black/70 transition-colors"
            aria-label="Voir le profil complet"
          >
            <Info size={24} />
          </button>
        </div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col justify-end z-10">
          {/* Compatibility Floating Badge */}
          <div className="mb-4 bg-gsd-surface/80 backdrop-blur-lg border border-white/10 rounded-xl p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="text-gsd-primary fill-gsd-primary" size={18} />
              <span className="text-white font-semibold">{compatibility}% compatibles</span>
            </div>
            {compatibility_explanation && (
              <div>
                <p className="text-sm font-medium text-gsd-primary-light mb-1">
                  {compatibility_explanation.strongest_factor}
                </p>
                <p className="text-sm text-gsd-text-secondary leading-relaxed">
                  {compatibility_explanation.summary}
                </p>
              </div>
            )}
          </div>

          {/* Profile Basic Info */}
          <div className="mb-6">
            {profile.is_academy_certified && profile.certifications && profile.certifications.length > 0 && (
              <div className="flex items-center gap-1.5 mb-2 text-xs font-medium text-[#EAD8A4] bg-[#1A3A5C]/90 border border-[#C9A84C]/50 px-2.5 py-1 rounded-lg w-fit backdrop-blur-md shadow-sm">
                <Award size={13} className="text-[#C9A84C]" />
                <span className="truncate max-w-[260px]">{profile.certifications[0].course_title}</span>
              </div>
            )}
            <h2 className="text-3xl font-bold text-white flex items-end gap-2">
              {profile.first_name}
              {profile.age && <span className="text-2xl font-normal text-white/80">{profile.age} ans</span>}
            </h2>
            <div className="flex items-center gap-1 text-white/80 mt-1">
              <MapPin size={16} />
              <span className="text-sm">{profile.city || 'Ville non renseignée'}</span>
            </div>
          </div>

          {/* CTAs */}
          <div className="flex justify-between items-center gap-4">
            <Button 
              variant="outline" 
              className="flex-1 h-14 rounded-xl border-white/20 text-white hover:bg-white/10 hover:border-white/40"
              onClick={onPass}
            >
              <X className="mr-2" size={20} />
              Passer
            </Button>
            <Button 
              variant="primary" 
              className="flex-1 h-14 rounded-xl bg-gsd-primary hover:bg-gsd-primary-dark text-white shadow-lg shadow-gsd-primary/30"
              onClick={onLike}
            >
              <Heart className="mr-2" size={20} />
              Découvrir
            </Button>
          </div>
        </div>
      </div>

      {/* Profile Details Drawer */}
      <ProfileDetailsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        candidate={candidate} 
      />
    </>
  );
};

export default PremiumProfileCard;
