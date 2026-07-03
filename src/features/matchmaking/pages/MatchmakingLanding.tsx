import React from 'react';
import { Heart, Star } from 'lucide-react';

export default function Matchmaking() {
  return (
    <div className="w-full bg-gsd-blue-dark min-h-screen pt-20">
      <div className="text-center text-white py-16">
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 mt-8">Connexions Divines</h1>
        <p className="text-gsd-gold italic text-lg">Trouvez la personne que Dieu a prévue pour vous.</p>
      </div>
      
      <div className="max-w-md mx-auto px-4 pb-20">
        {/* Swipe Card Example */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.6)] transform hover:scale-[1.02] transition-all duration-300 relative border border-white/10">
          <div className="h-[500px] bg-gray-200 relative">
             <img src="https://images.unsplash.com/photo-1531123897727-8f129e1bfa82?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Profil" className="w-full h-full object-cover" />
             <div className="absolute bottom-0 w-full bg-gradient-to-t from-gsd-blue-dark/95 via-gsd-blue-dark/60 to-transparent p-8 pt-32">
               <h3 className="text-3xl font-serif font-bold text-white mb-2">Sarah, 28</h3>
               <p className="text-gsd-gold flex items-center gap-2 mb-2 font-medium"><Star size={16} fill="currentColor" /> Évangélique - Très pratiquante</p>
               <p className="text-gray-300 text-sm">"Cherche un partenaire qui craint Dieu et aime servir."</p>
             </div>
          </div>
          <div className="p-8 text-center flex justify-center gap-12 bg-gsd-blue">
            <button className="w-16 h-16 rounded-full bg-white/10 text-white hover:bg-white hover:text-gsd-red flex items-center justify-center transition-all">
              <span className="text-2xl font-bold">X</span>
            </button>
            <button className="w-16 h-16 rounded-full bg-gradient-to-r from-gsd-gold to-gsd-gold-light text-gsd-blue-dark shadow-[0_0_15px_rgba(220,165,74,0.4)] hover:shadow-[0_0_30px_rgba(220,165,74,0.8)] flex items-center justify-center transition-all hover:scale-110">
              <Heart size={28} fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
