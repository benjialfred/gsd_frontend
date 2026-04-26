import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-gsd-blue/95 backdrop-blur-md border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-serif font-bold text-white tracking-widest flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-gsd-gold flex items-center justify-center text-gsd-blue-dark font-black">G</span>
              Le Grand Salon Divin
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-sm font-medium text-white hover:text-gsd-gold transition-colors">Accueil</Link>
            <Link to="/academy" className="text-sm font-medium text-white/80 hover:text-gsd-gold transition-colors">Académie</Link>
            <Link to="/matchmaking" className="text-sm font-medium text-white/80 hover:text-gsd-gold transition-colors">Connexions</Link>
            <Link to="/resources" className="text-sm font-medium text-white/80 hover:text-gsd-gold transition-colors">Ressources</Link>
            <Link to="/partners" className="text-sm font-medium text-white/80 hover:text-gsd-gold transition-colors">Partenaires</Link>
            <a href="#event" className="text-sm font-bold text-gsd-red hover:text-red-400 uppercase tracking-widest transition-colors animate-pulse">
              Événement SICI 2026
            </a>
            <Link to="/login" className="bg-gradient-to-r from-gsd-gold to-gsd-gold-light text-gsd-blue-dark px-6 py-2.5 rounded-full font-bold text-sm shadow-[0_0_15px_rgba(220,165,74,0.4)] hover:shadow-[0_0_25px_rgba(220,165,74,0.6)] hover:scale-105 transition-all duration-300">
              SE CONNECTER
            </Link>
          </div>
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-300 hover:text-white p-2">
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-gsd-blue-dark">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className="block px-3 py-2 rounded-md text-base font-medium text-white hover:bg-gsd-blue hover:text-gsd-gold">Accueil</Link>
            <Link to="/academy" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gsd-blue hover:text-gsd-gold">Académie</Link>
            <Link to="/login" className="block mt-4 text-center bg-gradient-to-r from-gsd-gold to-gsd-gold-light text-gsd-blue-dark px-4 py-3 rounded-md font-bold">SE CONNECTER</Link>
          </div>
        </div>
      )}
    </nav>
  );
}
