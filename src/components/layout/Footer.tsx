import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-[#051833] text-white py-4 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-300">
        <p>© 2026 Le Grand Salon Divin. Tous droits réservés.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 items-center">
          <a href="#" className="hover:text-white transition-colors">Mentions Légales</a>
          <a href="#" className="hover:text-white transition-colors">Politique de Confidentialité</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
          <div className="flex space-x-3 ml-4">
             {/* Simuler les icônes sociales circulaires */}
             <span className="w-5 h-5 flex items-center justify-center border border-white rounded-full text-[10px]">f</span>
             <span className="w-5 h-5 flex items-center justify-center border border-white rounded-full text-[10px]">in</span>
             <span className="w-5 h-5 flex items-center justify-center border border-white rounded-full text-[10px]">yt</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
