import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { Camera, Settings, Eye, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import { useQuery } from '@tanstack/react-query';
import { getReferenceData } from '../../../services/reference';

// --- Subcomponents Placeholders ---
const PublicView = ({ user }: any) => {
  const profile = user?.profile || {};
  
  const { data: referenceData } = useQuery({
    queryKey: ['referenceData'],
    queryFn: getReferenceData
  });
  
  // Calcul de l'âge
  const getAge = (birthDate: string) => {
    if (!birthDate) return '';
    const diff = Date.now() - new Date(birthDate).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const age = getAge(profile.birth_date);
  
  // Mapping IDs to Names
  const languageNames = (profile.languages || []).map((id: number) => {
    const lang = referenceData?.languages?.find((l: any) => l.id === id);
    return lang ? lang.name : null;
  }).filter(Boolean);
  
  const interestNames = (profile.interests || []).map((id: number) => {
    const int = referenceData?.interests?.find((i: any) => i.id === id);
    return int ? int.name : null;
  }).filter(Boolean);

  return (
    <div className="relative w-full min-h-screen bg-[#FDFBF7]">
      {/* Cover Image Parallax Effect */}
      <div className="sticky top-0 w-full h-[60vh] z-0 overflow-hidden bg-gray-100">
        {profile.avatar ? (
          <img 
            src={getMediaUrl(profile.avatar)} 
            alt="Cover"
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
             <Camera size={48} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/20 to-transparent"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 bg-[#FDFBF7] min-h-screen -mt-32 rounded-t-[3rem] px-6 py-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-900 leading-tight">
              {user?.first_name || 'Utilisateur'}{age ? `, ${age}` : ''}
            </h1>
            <p className="text-gray-500 uppercase tracking-widest text-xs font-semibold mt-1">
              {profile.city || 'Ville inconnue'}, {profile.country_code || 'Pays inconnu'}
            </p>
          </div>
          {profile.kyc_status === 'APPROVED' && (
            <div className="bg-[#fcf9f2] text-[#C9A84C] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-[#C9A84C]/30 shadow-sm flex items-center gap-1">
              <CheckCircle size={10} /> Certifié
            </div>
          )}
        </div>

        {/* Compatibility Preview (Sprint 4/5) */}
        <div className="bg-white border border-[#E8ECE9] border-dashed rounded-2xl p-6 mb-8 text-center flex flex-col items-center justify-center">
           <div className="w-12 h-12 bg-rose-50 text-rose-300 rounded-full flex items-center justify-center mb-3">
              <Heart size={20} />
           </div>
           <h3 className="text-gray-400 font-medium text-sm">Compatibilité disponible après les premières suggestions</h3>
        </div>

        {/* Pills */}
        <div className="mb-10">
          <h3 className="text-xs uppercase tracking-widest text-[#1A3A5C]/60 font-bold mb-4">Informations</h3>
          <div className="flex flex-wrap gap-2">
            {profile.denomination && (
              <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-[#1A3A5C] shadow-sm">
                {profile.denomination.replace('_', ' ')}
              </span>
            )}
            {profile.profession && (
              <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-[#1A3A5C] shadow-sm">
                {profile.profession}
              </span>
            )}
            {profile.education_level && (
              <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-[#1A3A5C] shadow-sm">
                {profile.education_level}
              </span>
            )}
            {profile.marital_status && (
              <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-[#1A3A5C] shadow-sm">
                {profile.marital_status.replace('_', ' ')}
              </span>
            )}
            {languageNames.length > 0 && (
              <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-[#1A3A5C] shadow-sm">
                🗣️ {languageNames.join(', ')}
              </span>
            )}
          </div>
        </div>

        {/* Interests */}
        {interestNames.length > 0 && (
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest text-[#1A3A5C]/60 font-bold mb-4">Centres d'intérêt</h3>
            <div className="flex flex-wrap gap-2">
              {interestNames.map((name: string, i: number) => (
                <span key={i} className="bg-[#fcf9f2] text-[#C9A84C] border border-[#C9A84C]/30 px-4 py-2 rounded-xl text-sm shadow-sm">
                  {name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Vision */}
        {profile.marriage_vision && (
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest text-[#1A3A5C]/60 font-bold mb-4">Vision du mariage</h3>
            <p className="font-serif text-lg text-[#1A3A5C] leading-relaxed italic border-l-2 border-[#C9A84C] pl-4">
              "{profile.marriage_vision}"
            </p>
          </div>
        )}
        
        {/* Bio */}
        {profile.bio && (
          <div className="mb-10">
            <h3 className="text-xs uppercase tracking-widest text-[#1A3A5C]/60 font-bold mb-4">À propos de moi</h3>
            <p className="text-sm font-light text-[#1A3A5C]/80 leading-relaxed whitespace-pre-line">
              {profile.bio}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
import { PrivateEditor } from './PrivateEditor';


import { getMediaUrl } from '../../../services/profile';
import { Heart, CheckCircle } from 'lucide-react';

export default function PremiumProfile() {
  const { user, checkAuth } = useAuthStore();
  const [viewMode, setViewMode] = useState<'public' | 'private'>('public');

  useEffect(() => {
    checkAuth();
  }, []);


  return (
    <div className="min-h-screen bg-[#FDFBF7] relative w-full overflow-hidden flex flex-col">
      
      {/* Floating View Toggle */}
      <div className="fixed top-20 right-6 z-50 bg-white/80 backdrop-blur-md p-1 rounded-full border border-[#E8ECE9] shadow-lg flex">
        <button 
          onClick={() => setViewMode('private')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'private' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Settings size={14} /> Éditer
        </button>
        <button 
          onClick={() => setViewMode('public')}
          className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${viewMode === 'public' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'}`}
        >
          <Eye size={14} /> Aperçu
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {viewMode === 'public' ? (
            <motion.div key="public" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PublicView user={user} />
            </motion.div>
          ) : (
            <motion.div key="private" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PrivateEditor user={user} onProfileUpdate={checkAuth} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
