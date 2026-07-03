import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { Camera, Settings, Eye, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Subcomponents Placeholders ---
const PublicView = ({ user }: any) => {
  return (
    <div className="relative w-full min-h-screen bg-[#FDFBF7]">
      {/* Cover Image Parallax Effect */}
      <div className="sticky top-0 w-full h-[60vh] z-0 overflow-hidden">
        <img 
          src={user?.profile?.avatar || 'https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop'} 
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FDFBF7] via-[#FDFBF7]/20 to-transparent"></div>
      </div>

      {/* Content overlay */}
      <div className="relative z-10 bg-[#FDFBF7] min-h-screen -mt-32 rounded-t-[3rem] px-6 py-10 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-serif text-gray-900 leading-tight">
              {user?.first_name || 'Utilisateur'}, 28
            </h1>
            <p className="text-gray-500">Paris, France</p>
          </div>
          <div className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-amber-200">
            Certifié
          </div>
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
          <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Essentiels</h3>
          <div className="flex flex-wrap gap-2">
            <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-gray-700 shadow-sm">Évangélique</span>
            <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-gray-700 shadow-sm">Français, Anglais</span>
            <span className="bg-white border border-[#E8ECE9] px-4 py-2 rounded-xl text-sm text-gray-700 shadow-sm">Ne fume pas</span>
          </div>
        </div>

        {/* Vision */}
        <div>
          <h3 className="text-xs uppercase tracking-widest text-gray-400 font-bold mb-4">Vision du mariage</h3>
          <p className="font-serif text-lg text-gray-800 leading-relaxed italic">
            "Construire un foyer basé sur la grâce, l'amour inconditionnel et la croissance mutuelle."
          </p>
        </div>

      </div>
    </div>
  );
};

const PrivateEditor = () => {
  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6 pb-32">
      <h2 className="text-2xl font-light text-gray-900 mb-8">Éditer le profil</h2>

      {/* Photo Manager */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8ECE9] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-gray-900">Photos</h3>
          <span className="text-xs text-gray-400">1/6</span>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Main Photo */}
          <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden aspect-square border border-[#E8ECE9]">
            <img src="https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?q=80&w=2070&auto=format&fit=crop" className="w-full h-full object-cover" />
            <div className="absolute top-2 left-2 bg-[#8C9B90] text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">Principale</div>
            <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm text-green-600 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-1">
              <CheckCircle size={10} /> APPROVED
            </div>
          </div>
          
          {/* Empty Slots */}
          <div className="relative rounded-2xl border-2 border-dashed border-[#E8ECE9] bg-[#FDFBF7] aspect-square flex flex-col items-center justify-center text-gray-400 hover:bg-white hover:border-[#8C9B90] transition-colors cursor-pointer">
            <Camera size={24} className="mb-2" />
            <span className="text-[10px] font-medium uppercase tracking-wider">Ajouter</span>
          </div>
          <div className="relative rounded-2xl border-2 border-dashed border-[#E8ECE9] bg-[#FDFBF7] aspect-square flex flex-col items-center justify-center text-gray-400"></div>
        </div>
      </div>

      {/* Accordion List */}
      <div className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-sm divide-y divide-[#E8ECE9]">
        {['Identité & Localisation', 'Parcours Spirituel', 'Centres d\'intérêt & Langues', 'Vision du mariage', 'Préférences de Matching'].map((section, idx) => (
          <button key={idx} className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-[#FDFBF7] transition-colors text-left">
             <span className="font-medium text-gray-900 text-sm">{section}</span>
             <ChevronLeft className="text-gray-400 transform rotate-180" size={18} />
          </button>
        ))}
      </div>
    </div>
  );
};


import { Heart, CheckCircle } from 'lucide-react';

export default function PremiumProfile() {
  const { user } = useAuthStore();
  const [viewMode, setViewMode] = useState<'public' | 'private'>('private');

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
              <PrivateEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
