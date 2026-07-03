import React, { useEffect } from 'react';
import { Heart, MessageCircle, X } from 'lucide-react';
import { MatchCandidate } from '../types';
import Button from '@/shared/components/Button';

// Mock Analytics for this component
const AnalyticsService = {
  track: (event: string, properties?: any) => {
    console.log(`[Analytics] ${event}`, properties);
  }
};

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: MatchCandidate;
  onStartChat: () => void;
}

const MatchModal: React.FC<MatchModalProps> = ({ isOpen, onClose, candidate, onStartChat }) => {
  useEffect(() => {
    if (isOpen) {
      AnalyticsService.track('MATCH_MODAL_VIEWED', {
        candidate_id: candidate.candidate_id,
        compatibility: candidate.compatibility
      });
    }
  }, [isOpen, candidate]);

  if (!isOpen) return null;

  const { profile } = candidate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark premium backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-md bg-gsd-surface/90 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center animate-scale-in shadow-2xl">
        
        {/* Subtle decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gsd-primary/20 blur-[60px] rounded-full pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div className="flex items-center justify-center mb-6 relative">
            <div className="w-24 h-24 rounded-full border-4 border-gsd-surface overflow-hidden relative z-10">
              {/* Fake user avatar for demo, in reality we'd need current user's avatar too */}
              <div className="w-full h-full bg-gsd-surface-light flex items-center justify-center text-2xl font-bold text-white">
                M
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full bg-gsd-primary text-white flex items-center justify-center absolute z-20 border-4 border-gsd-surface shadow-xl">
              <Heart size={16} className="fill-current" />
            </div>

            <div className="w-24 h-24 rounded-full border-4 border-gsd-surface overflow-hidden relative z-10 -ml-4">
               {profile.primary_photo ? (
                 <img src={profile.primary_photo} alt={profile.first_name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-gsd-surface-light flex items-center justify-center text-2xl font-bold text-white">
                   {profile.first_name.charAt(0)}
                 </div>
               )}
            </div>
          </div>

          <h2 className="text-3xl font-light text-white mb-3 font-serif">Une nouvelle connexion</h2>
          <p className="text-gsd-text-secondary mb-8 text-lg">
            Vous partagez des valeurs prometteuses avec {profile.first_name}.
          </p>

          <div className="w-full space-y-3">
            <Button 
              variant="primary" 
              className="w-full rounded-xl h-14 bg-white text-black hover:bg-gray-100"
              onClick={() => {
                AnalyticsService.track('CHAT_STARTED', { candidate_id: candidate.candidate_id });
                onStartChat();
              }}
            >
              <MessageCircle className="mr-2" size={20} />
              Démarrer une conversation
            </Button>
            <Button 
              variant="outline" 
              className="w-full rounded-xl h-14 border-white/10 text-white hover:bg-white/5"
              onClick={onClose}
            >
              Continuer la découverte
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default MatchModal;
