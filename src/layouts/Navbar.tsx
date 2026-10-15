import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../shared/components/Logo';
import { useAuthStore } from '../stores/authStore';
import { User, Menu, X, Sparkles, Compass, GraduationCap, Users, Calendar, Crown, ArrowRight, Shield } from 'lucide-react';
import { getMediaUrl } from '../services/profile';

export default function Navbar() {
  const { user } = useAuthStore();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile au changement de page
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Rencontres & Radar', path: '/matchmaking', icon: Compass },
    { name: 'Académie', path: '/academy', icon: GraduationCap },
    { name: 'Conseillers & Pasteurs', path: '/coaching', icon: Users },
    { name: 'Galas & Sommets', path: '/events', icon: Calendar, highlight: true },
    { name: 'Privilèges & Tarifs', path: '/subscriptions', icon: Crown },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0A192F]/95 backdrop-blur-xl border-b border-[#C9A84C]/25 shadow-2xl py-3' 
        : 'bg-gradient-to-b from-[#0A192F]/90 via-[#0A192F]/60 to-transparent backdrop-blur-md border-b border-white/5 py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* LOGO DE PRESTIGE */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#C9A84C]/40 to-[#DFB76C]/10 blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
            <Logo theme="dark" className="relative h-12 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="font-serif tracking-widest text-xs font-bold uppercase text-[#FAF9F6] group-hover:text-[#C9A84C] transition-colors">
              Le Grand Salon Divin
            </span>
            <span className="text-[9px] tracking-wider uppercase text-[#C9A84C]/80 font-medium">
              Sanctuaire d'Alliance & d'Excellence
            </span>
          </div>
        </Link>

        {/* LIENS DE NAVIGATION BUREAU */}
        <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`relative px-3.5 py-2 rounded-full text-xs font-semibold tracking-wider uppercase transition-all duration-300 flex items-center gap-1.5 ${
                  active
                    ? 'text-[#FAF9F6] bg-white/10 shadow-inner border border-[#C9A84C]/40'
                    : link.highlight
                    ? 'text-[#C9A84C] hover:text-white hover:bg-white/5'
                    : 'text-gray-300 hover:text-[#FAF9F6] hover:bg-white/5'
                }`}
              >
                {Icon && <Icon size={14} className={active ? 'text-[#C9A84C]' : link.highlight ? 'text-[#C9A84C] animate-pulse' : 'text-gray-400'} />}
                <span>{link.name}</span>
                {link.highlight && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping ml-0.5" />
                )}
                {active && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#C9A84C] rounded-full shadow-[0_0_8px_#C9A84C]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* CTA ET AUTH DROITE */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-2">
              {(user.role === 'ADMIN' || user.is_staff || user.is_superuser) && (
                <Link
                  to="/admin"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 to-amber-500/20 hover:from-red-500/30 hover:to-amber-500/30 border border-[#C9A84C]/50 text-[#C9A84C] text-[11px] font-bold uppercase tracking-wider shadow-md transition"
                >
                  <Shield size={13} className="text-[#C9A84C]" />
                  <span>Admin</span>
                </Link>
              )}
              <Link
                to="/app"
                className="flex items-center gap-2.5 bg-gradient-to-r from-white/10 to-white/5 hover:from-white/20 hover:to-white/10 px-4 py-2 rounded-full border border-[#C9A84C]/30 shadow-md transition-all group"
              >
                <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-[#C9A84C] to-amber-200 overflow-hidden shadow">
                  {user.profile?.avatar ? (
                    <img
                      src={getMediaUrl(user.profile.avatar)}
                      alt="Mon Profil"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#1A3A5C] text-[#C9A84C] flex items-center justify-center font-bold text-xs rounded-full">
                      {user.first_name ? user.first_name.charAt(0) : <User size={14} />}
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <span className="block text-xs font-serif font-bold text-[#FAF9F6] group-hover:text-[#C9A84C] transition-colors leading-tight">
                    Mon Sanctuaire
                  </span>
                  <span className="block text-[9px] text-[#C9A84C] uppercase tracking-wider">
                    Accès Privilégié
                  </span>
                </div>
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-wider text-gray-200 hover:text-[#C9A84C] px-4 py-2.5 rounded-full transition-colors"
              >
                Connexion
              </Link>
              <Link
                to="/register"
                className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-widest text-[#0A192F] bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] hover:brightness-110 shadow-[0_4px_20px_rgba(201,168,76,0.35)] hover:shadow-[0_6px_25px_rgba(201,168,76,0.5)] transition-all duration-300 transform hover:-translate-y-0.5"
              >
                <Sparkles size={14} className="text-[#0A192F]" />
                <span>Entrer dans l'Alliance</span>
              </Link>
            </div>
          )}
        </div>

        {/* BOUTON MENU MOBILE */}
        <div className="flex lg:hidden items-center gap-2">
          {user ? (
            <Link
              to="/app"
              className="p-1.5 rounded-full border border-[#C9A84C]/40 bg-white/10"
              title="Mon Sanctuaire"
            >
              <div className="w-7 h-7 rounded-full overflow-hidden bg-[#1A3A5C] text-[#C9A84C] flex items-center justify-center font-bold text-xs">
                {user.profile?.avatar ? (
                  <img src={getMediaUrl(user.profile.avatar)} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={14} />
                )}
              </div>
            </Link>
          ) : null}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-[#FAF9F6] border border-white/10 transition-colors"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* DRAWER MENU MOBILE ÉLÉGANT */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0A192F]/98 backdrop-blur-2xl border-b border-[#C9A84C]/30 px-6 py-6 shadow-2xl animate-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const Icon = link.icon;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold tracking-wide transition-all ${
                    active
                      ? 'bg-white/10 text-[#C9A84C] border border-[#C9A84C]/30'
                      : 'text-gray-200 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {Icon && <Icon size={18} className={active ? 'text-[#C9A84C]' : 'text-gray-400'} />}
                    <span>{link.name}</span>
                  </div>
                  {link.highlight && (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                      Sommet 2026
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Actions Auth Mobile */}
            <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
              {user ? (
                <>
                  {(user.role === 'ADMIN' || user.is_staff || user.is_superuser) && (
                    <Link
                      to="/admin"
                      className="w-full py-3 rounded-2xl text-center text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-red-500/20 to-amber-500/20 text-[#C9A84C] border border-[#C9A84C]/50 flex items-center justify-center gap-2 shadow-md"
                    >
                      <Shield size={16} />
                      <span>Console Administrateur</span>
                    </Link>
                  )}
                  <Link
                    to="/app"
                    className="w-full py-3 rounded-2xl text-center text-xs font-bold uppercase tracking-wider bg-white/10 text-[#FAF9F6] border border-[#C9A84C]/40 flex items-center justify-center gap-2"
                  >
                    <span>Accéder à Mon Dashboard</span>
                    <ArrowRight size={14} />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full py-3.5 rounded-2xl text-center text-xs font-black uppercase tracking-widest text-[#0A192F] bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] shadow-lg flex items-center justify-center gap-2"
                  >
                    <Sparkles size={16} />
                    <span>Créer Mon Alliance</span>
                  </Link>
                  <Link
                    to="/login"
                    className="w-full py-3 rounded-2xl text-center text-xs font-semibold uppercase tracking-wider text-gray-300 hover:text-white bg-white/5 border border-white/10"
                  >
                    Se Connecter
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

