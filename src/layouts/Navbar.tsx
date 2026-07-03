import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../shared/components/Logo';
import { useAuthStore } from '../stores/authStore';
import { User } from 'lucide-react';

export default function Navbar() {
  const { user } = useAuthStore();

  return (
    <header className="absolute top-0 left-0 w-full z-50 pt-6 px-4">
      {/* Container with background image and diagonals */}
      <div 
        className="mx-auto max-w-7xl relative bg-[#082a5e]/95 backdrop-blur-md overflow-hidden flex justify-between items-center h-24 px-12 shadow-[0_20px_50px_rgba(8,42,94,0.5)] border border-[#e5b75a]/20"
        style={{
          clipPath: "polygon(40px 0%, calc(100% - 40px) 0%, 100% 50%, calc(100% - 40px) 100%, 40px 100%, 0% 50%)"
        }}
      >
        {/* Background Image */}
        <div 
          className="absolute inset-0 opacity-30 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518599904199-0ca897819ddb?auto=format&fit=crop&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        {/* LOGO */}
        <div className="relative z-10 flex-shrink-0">
          <Link to="/">
             <Logo theme="dark" />
          </Link>
        </div>
        
        {/* LINKS */}
        <nav className="relative z-10 hidden lg:flex items-center space-x-8">
          <Link to="/" className="text-sm font-bold text-white hover:text-[#e5b75a] tracking-wider transition-colors">ACCUEIL</Link>
          <Link to="/academy" className="text-sm font-bold text-white hover:text-[#e5b75a] tracking-wider transition-colors">ACADÉMIE</Link>
          <Link to="/matchmaking" className="text-sm font-bold text-white hover:text-[#e5b75a] tracking-wider transition-colors">CONNEXIONS</Link>
          <Link to="/resources" className="text-sm font-bold text-white hover:text-[#e5b75a] tracking-wider transition-colors">RESSOURCES</Link>
          <a href="#event" className="text-sm font-extrabold text-[#e5b75a] hover:text-white tracking-widest transition-colors flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            SOMMET 2026
          </a>
          
          {/* CTA BUTTON OR PROFILE */}
          {user ? (
            <Link to="/app" className="flex items-center gap-3 ml-4 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full border border-white/20">
              <div className="w-8 h-8 rounded-full bg-[#e5b75a] flex items-center justify-center text-[#082a5e]">
                <User size={16} />
              </div>
              <span className="text-white font-bold text-sm tracking-wider">MON DASHBOARD</span>
            </Link>
          ) : (
            <Link to="/login" className="bg-gradient-to-r from-[#e5b75a] to-[#c1913c] text-[#082a5e] px-8 py-3 rounded-full shadow-lg hover:shadow-[0_0_20px_rgba(229,183,90,0.5)] hover:scale-105 transition-all font-extrabold text-sm ml-4 border border-[#ebd18b]/50">
              SE CONNECTER
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
