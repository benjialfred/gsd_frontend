import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../shared/components/Logo';
import { 
  User, Heart, MessageCircle, BookOpen, LogOut, Bell, Home, 
  HeartHandshake, Sparkles, Crown, MoreHorizontal, X, ChevronRight, KeyRound, Shield
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { getMediaUrl } from '../services/profile';
import { motion, AnimatePresence } from 'framer-motion';

// Toutes les sections disponibles dans la barre latérale Desktop
const DESKTOP_TABS = [
  { path: '/app', icon: Home, label: 'Accueil' },
  { path: '/app/matches', icon: Heart, label: 'Rencontres' },
  { path: '/app/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/app/academy', icon: BookOpen, label: 'Académie' },
  { path: '/app/coaching', icon: HeartHandshake, label: 'Conseillers' },
  { path: '/app/events', icon: Sparkles, label: 'Événements' },
  { path: '/app/subscriptions', icon: Crown, label: 'Abonnement' },
  { path: '/app/profile', icon: User, label: 'Profil' },
];

// 4 Onglets principaux sur la barre mobile du bas
const MOBILE_PRIMARY_TABS = [
  { path: '/app', icon: Home, label: 'Accueil' },
  { path: '/app/matches', icon: Heart, label: 'Rencontres' },
  { path: '/app/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/app/profile', icon: User, label: 'Profil' },
];

// Onglets complémentaires regroupés dans le menu "Plus" (3 petits points)
const MOBILE_MORE_SERVICES = [
  { 
    path: '/app/academy', 
    icon: BookOpen, 
    label: 'Académie Matrimoniale', 
    badge: 'Formations',
    description: 'Cours, guides bibliques et masterclasses certifiées pour le couple' 
  },
  { 
    path: '/app/coaching', 
    icon: HeartHandshake, 
    label: 'Conseillers & Pasteurs', 
    badge: '1-to-1',
    description: 'Séances de discernement et préparation au mariage avec des thérapeutes chrétiens' 
  },
  { 
    path: '/app/events', 
    icon: Sparkles, 
    label: 'Galas & Événements', 
    badge: 'Billetterie',
    description: 'Sommets internationaux, retraites spirituelles et dîners de gala chrétiens' 
  },
  { 
    path: '/app/subscriptions', 
    icon: Crown, 
    label: 'Abonnement & Privilèges', 
    badge: 'Pass Alliance',
    description: 'Débloquez les appels vidéo, likes illimités et remises exclusives' 
  },
];

export default function DashboardLayout() {
  const { logout, user } = useAuthStore();
  const location = useLocation();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fermer le menu "Plus" quand la route change
  useEffect(() => {
    setIsMoreMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  const isMoreServiceActive = MOBILE_MORE_SERVICES.some(s => location.pathname.startsWith(s.path));

  // Scroll detection for Mobile Bottom Bar
  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      const handleScroll = () => {
        const currentScrollY = scrollContainer.scrollTop;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
        setLastScrollY(currentScrollY);
      };

      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden w-full font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex z-40 w-72 h-screen bg-[#FCFBF9] border-r border-[#E8ECE9] flex-col">
         <div className="p-8 pb-4">
            <Logo theme="light" className="scale-90 origin-left" />
         </div>

         <div className="p-4 flex-1 flex flex-col gap-2 overflow-y-auto mt-4">
            {DESKTOP_TABS.map((tab) => (
              <Link 
                key={tab.path}
                to={tab.path} 
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  isActive(tab.path) 
                    ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-900 font-medium border border-gray-100' 
                    : 'text-gray-500 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:text-gray-900'
                }`}
              >
                <div className={`${isActive(tab.path) ? 'text-[#C9A84C]' : 'text-gray-400'}`}>
                  <tab.icon size={22} strokeWidth={isActive(tab.path) ? 2.5 : 2} />
                </div>
                <span className="text-sm">{tab.label}</span>
              </Link>
            ))}
         </div>

         <div className="p-6 pt-4 border-t border-[#E8ECE9]">
            <Link 
              to="/app/profile" 
              className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-white border border-[#E8ECE9] shadow-sm hover:border-[#C9A84C]/50 transition-all group"
            >
               <div className="w-10 h-10 rounded-full bg-[#1A3A5C] flex items-center justify-center text-white font-medium overflow-hidden border border-[#C9A84C]/30 shrink-0">
                 {user?.profile?.avatar ? (
                   <img
                     src={getMediaUrl(user.profile.avatar)}
                     alt={user?.first_name || 'Avatar'}
                     className="w-full h-full object-cover"
                     onError={(e: any) => {
                       e.target.style.display = 'none';
                     }}
                   />
                 ) : (
                   <span>{user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}</span>
                 )}
               </div>
               <div className="flex flex-col flex-1 min-w-0">
                 <div className="flex items-center gap-1.5">
                   <span className="text-sm font-bold text-gray-900 group-hover:text-[#1A3A5C] truncate transition-colors">
                     {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : 'Utilisateur'}
                   </span>
                   {user?.role === 'FORMATEUR' && (
                     <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#C9A84C]/20 text-[#A0802A] rounded border border-[#C9A84C]/40 shrink-0">
                       FORMATEUR
                     </span>
                   )}
                 </div>
                 <span className="text-xs text-gray-400 truncate">{user?.email}</span>
               </div>
            </Link>
            <button onClick={logout} className="flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 w-full px-4 py-2.5 rounded-xl transition-colors text-sm font-medium">
               <LogOut size={18} /> Déconnexion
            </button>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        {/* Mobile Top Header */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-[#E8ECE9] shrink-0 z-30">
          <Logo theme="light" className="scale-75 origin-left" />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center border border-gray-200/80"
              aria-label="Menu des services"
            >
              <MoreHorizontal size={20} className={isMoreServiceActive ? 'text-[#C9A84C]' : 'text-[#1A3A5C]'} />
            </button>

            <Link to="/app/profile" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1A3A5C] flex items-center justify-center text-white text-xs font-bold overflow-hidden border border-[#C9A84C]/40 shadow-sm">
                {user?.profile?.avatar ? (
                  <img
                    src={getMediaUrl(user.profile.avatar)}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span>{user?.first_name?.charAt(0) || 'U'}</span>
                )}
              </div>
            </Link>
          </div>
        </header>

        {isOffline && (
          <div className="bg-amber-500 text-white text-xs font-bold uppercase tracking-widest text-center py-2 z-50 relative shadow-sm">
            Vous naviguez hors connexion
          </div>
        )}

        <div id="scroll-container" className="flex-1 overflow-x-hidden overflow-y-auto w-full relative bg-[#FDFBF7] pb-24 md:pb-0">
           <AnimatePresence mode="popLayout">
             <motion.div
               key={location.pathname}
               initial={{ opacity: 0, y: 5 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -5 }}
               transition={{ duration: 0.15 }}
               className="h-full"
             >
               <Outlet />
             </motion.div>
           </AnimatePresence>
        </div>
      </main>

      {/* TIROIR MODAL "PLUS" / 3 PETITS POINTS SUR MOBILE */}
      <AnimatePresence>
        {isMoreMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex flex-col justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMoreMenuOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />

            {/* Bottom Sheet Modal */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative z-10 bg-white rounded-t-3xl border-t border-[#E8ECE9] shadow-2xl p-6 space-y-5 max-h-[85vh] overflow-y-auto"
            >
              {/* Barre de glissement */}
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-serif font-bold text-[#1A3A5C]">
                    Services & Sanctuaire GSD
                  </h3>
                  <p className="text-xs text-[#1A3A5C]/60 font-light">
                    Formation, accompagnement et événements chrétiens
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="p-2 rounded-full text-gray-400 hover:text-gray-700 bg-gray-50 border border-gray-100"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Liste des modules additionnels */}
              <div className="space-y-2.5">
                {MOBILE_MORE_SERVICES.map((service) => {
                  const serviceActive = location.pathname.startsWith(service.path);
                  return (
                    <Link
                      key={service.path}
                      to={service.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-start gap-4 p-3.5 rounded-2xl border transition-all ${
                        serviceActive
                          ? 'bg-[#FAF9F6] border-[#C9A84C] shadow-sm'
                          : 'bg-white border-gray-100 hover:border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)]'
                      }`}
                    >
                      <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${
                        serviceActive
                          ? 'bg-[#1A3A5C] text-[#C9A84C] border-[#C9A84C]/40'
                          : 'bg-[#FAF9F6] text-[#1A3A5C] border-gray-200/80'
                      }`}>
                        <service.icon size={22} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-semibold truncate ${
                            serviceActive ? 'text-[#1A3A5C]' : 'text-gray-900'
                          }`}>
                            {service.label}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A84C]/15 text-[#8C6D1F] border border-[#C9A84C]/30 shrink-0">
                            {service.badge}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 font-light line-clamp-2 mt-0.5 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      <ChevronRight size={16} className="text-gray-400 shrink-0 mt-3" />
                    </Link>
                  );
                })}
              </div>

              {/* Raccourci Déconnexion */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-4">
                <Link
                  to="/app/profile"
                  onClick={() => setIsMoreMenuOpen(false)}
                  className="flex items-center gap-2 text-xs text-[#1A3A5C] font-semibold hover:text-[#C9A84C] transition-colors"
                >
                  <KeyRound size={15} className="text-[#C9A84C]" />
                  <span>Sécurité & Code PIN</span>
                </Link>

                <button
                  type="button"
                  onClick={() => { setIsMoreMenuOpen(false); logout(); }}
                  className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 font-semibold"
                >
                  <LogOut size={15} />
                  <span>Déconnexion</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MOBILE BOTTOM NAVIGATION (Aérée, élégante, 5 éléments équilibrés) */}
      <AnimatePresence>
        {scrollDirection === 'up' && (
          <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8ECE9] shadow-[0_-4px_25px_rgba(0,0,0,0.04)] pb-safe"
          >
            <div className="grid grid-cols-5 items-center px-1 py-2">
              {/* 1. Accueil */}
              <Link 
                to="/app"
                className="flex flex-col items-center justify-center py-1 gap-1 relative"
              >
                <div className={`transition-all duration-200 ${isActive('/app') ? 'text-[#1A3A5C] scale-110' : 'text-gray-400'}`}>
                  <Home size={22} strokeWidth={isActive('/app') ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium tracking-tight ${isActive('/app') ? 'text-[#1A3A5C] font-bold' : 'text-gray-400'}`}>
                  Accueil
                </span>
                {isActive('/app') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute -bottom-1" />
                )}
              </Link>

              {/* 2. Rencontres */}
              <Link 
                to="/app/matches"
                className="flex flex-col items-center justify-center py-1 gap-1 relative"
              >
                <div className={`transition-all duration-200 ${isActive('/app/matches') ? 'text-[#1A3A5C] scale-110' : 'text-gray-400'}`}>
                  <Heart size={22} strokeWidth={isActive('/app/matches') ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium tracking-tight ${isActive('/app/matches') ? 'text-[#1A3A5C] font-bold' : 'text-gray-400'}`}>
                  Rencontres
                </span>
                {isActive('/app/matches') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute -bottom-1" />
                )}
              </Link>

              {/* 3. Messages */}
              <Link 
                to="/app/messages"
                className="flex flex-col items-center justify-center py-1 gap-1 relative"
              >
                <div className={`transition-all duration-200 ${isActive('/app/messages') ? 'text-[#1A3A5C] scale-110' : 'text-gray-400'}`}>
                  <MessageCircle size={22} strokeWidth={isActive('/app/messages') ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium tracking-tight ${isActive('/app/messages') ? 'text-[#1A3A5C] font-bold' : 'text-gray-400'}`}>
                  Messages
                </span>
                {isActive('/app/messages') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute -bottom-1" />
                )}
              </Link>

              {/* 4. Profil */}
              <Link 
                to="/app/profile"
                className="flex flex-col items-center justify-center py-1 gap-1 relative"
              >
                <div className={`transition-all duration-200 ${isActive('/app/profile') ? 'text-[#1A3A5C] scale-110' : 'text-gray-400'}`}>
                  <User size={22} strokeWidth={isActive('/app/profile') ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium tracking-tight ${isActive('/app/profile') ? 'text-[#1A3A5C] font-bold' : 'text-gray-400'}`}>
                  Profil
                </span>
                {isActive('/app/profile') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute -bottom-1" />
                )}
              </Link>

              {/* 5. Le Menu Hamburger / 3 Petits Points "Plus" */}
              <button 
                type="button"
                onClick={() => setIsMoreMenuOpen(true)}
                className="flex flex-col items-center justify-center py-1 gap-1 relative"
              >
                <div className={`transition-all duration-200 ${
                  isMoreMenuOpen || isMoreServiceActive 
                    ? 'text-[#C9A84C] scale-110' 
                    : 'text-gray-400 hover:text-gray-600'
                }`}>
                  <MoreHorizontal size={22} strokeWidth={2.5} />
                </div>
                <span className={`text-[10px] font-medium tracking-tight ${
                  isMoreMenuOpen || isMoreServiceActive 
                    ? 'text-[#C9A84C] font-bold' 
                    : 'text-gray-400'
                }`}>
                  Plus
                </span>
                {isMoreServiceActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] absolute -bottom-1" />
                )}
              </button>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}

