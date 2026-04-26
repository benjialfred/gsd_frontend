import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Navbar() {
  return (
    <nav className="w-full bg-[#082a5e] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* LOGO */}
          <Link to="/">
             <Logo theme="dark" />
          </Link>
          
          {/* LINKS */}
          <div className="hidden lg:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium text-white hover:text-gray-300">Accueil</Link>
            <Link to="/academy" className="text-sm font-medium text-white hover:text-gray-300">Académie</Link>
            <Link to="/matchmaking" className="text-sm font-medium text-white hover:text-gray-300">Connexions</Link>
            <Link to="/resources" className="text-sm font-medium text-white hover:text-gray-300">Ressources</Link>
            <Link to="/partners" className="text-sm font-medium text-white hover:text-gray-300">Partenaires</Link>
            <a href="#event" className="text-sm font-bold text-[#e5b75a] hover:text-[#c1913c]">
              ÉVÉNEMENT SICI 2026
            </a>
            
            {/* CTA BUTTON */}
            <Link to="/login" className="bg-gradient-to-b from-[#e5b75a] to-[#c1913c] text-black px-6 py-2 rounded shadow hover:brightness-110 font-bold text-sm ml-4">
              SE CONNECTER
            </Link>
          </div>
          
        </div>
      </div>
    </nav>
  );
}
