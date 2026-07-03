import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../shared/components/Logo';
import { User, Heart, MessageCircle, BookOpen, LogOut, Bell, Home } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const TABS = [
  { path: '/app', icon: Home, label: 'Accueil' },
  { path: '/app/matches', icon: Heart, label: 'Rencontres' },
  { path: '/app/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/app/notifications', icon: Bell, label: 'Notifications' },
  { path: '/app/academy', icon: BookOpen, label: 'Académie' },
  { path: '/app/profile', icon: User, label: 'Profil' },
];

export default function DashboardLayout() {
  const { logout, user } = useAuthStore();
  const location = useLocation();
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('up');
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

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

  const isActive = (path: string) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  // Scroll detection for Mobile Bottom Bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      setLastScrollY(currentScrollY);
    };

    // Note: If scrolling happens inside the main container, we should attach to that instead.
    const scrollContainer = document.getElementById('scroll-container');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', () => {
        const currentScrollY = scrollContainer.scrollTop;
        if (currentScrollY > lastScrollY && currentScrollY > 50) {
          setScrollDirection('down');
        } else {
          setScrollDirection('up');
        }
        setLastScrollY(currentScrollY);
      });
    }
    
    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [lastScrollY]);

  return (
    <div className="flex h-screen bg-[#FDFBF7] overflow-hidden w-full font-sans">
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex z-40 w-72 h-screen bg-[#FCFBF9] border-r border-[#E8ECE9] flex-col">
         <div className="p-8 pb-4">
            <Logo theme="light" className="scale-90 origin-left" />
         </div>

         <div className="p-4 flex-1 flex flex-col gap-2 overflow-y-auto mt-4">
            {TABS.map((tab) => (
              <Link 
                key={tab.path}
                to={tab.path} 
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all ${
                  isActive(tab.path) 
                    ? 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] text-gray-900 font-medium' 
                    : 'text-gray-500 hover:bg-white hover:shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:text-gray-900'
                }`}
              >
                <div className={`${isActive(tab.path) ? 'text-[#8C9B90]' : 'text-gray-400'}`}>
                  <tab.icon size={22} strokeWidth={isActive(tab.path) ? 2.5 : 2} />
                </div>
                <span className="text-sm">{tab.label}</span>
              </Link>
            ))}
         </div>

         <div className="p-6 pt-4 border-t border-[#E8ECE9]">
            <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl bg-white border border-[#E8ECE9] shadow-sm">
               <div className="w-10 h-10 rounded-full bg-[#8C9B90] flex items-center justify-center text-white font-medium">
                 {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
               </div>
               <div className="flex flex-col flex-1 min-w-0">
                 <span className="text-sm font-medium text-gray-900 truncate">
                   {user?.first_name ? `${user.first_name} ${user.last_name}` : 'Utilisateur'}
                 </span>
                 <span className="text-xs text-gray-500 truncate">{user?.email}</span>
               </div>
            </div>
            <button onClick={logout} className="flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 w-full px-4 py-2.5 rounded-xl transition-colors text-sm font-medium">
               <LogOut size={18} /> Déconnexion
            </button>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
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

      {/* MOBILE BOTTOM NAVIGATION */}
      <AnimatePresence>
        {scrollDirection === 'up' && (
          <motion.nav 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-[#E8ECE9] shadow-[0_-4px_20px_rgba(0,0,0,0.02)] pb-safe"
          >
            <div className="flex items-center justify-around px-2 py-3">
              {TABS.map((tab) => (
                <Link 
                  key={tab.path}
                  to={tab.path}
                  className="flex flex-col items-center justify-center w-16 h-12 gap-1 relative"
                >
                  <div className={`transition-all duration-200 ${isActive(tab.path) ? 'text-[#8C9B90] scale-110' : 'text-gray-400'}`}>
                    <tab.icon size={24} strokeWidth={isActive(tab.path) ? 2.5 : 2} />
                    {/* Badge logic placeholder */}
                    {tab.path === '/app/matches' && (
                      <span className="absolute top-0 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <span className={`text-[10px] font-medium transition-colors ${isActive(tab.path) ? 'text-gray-900' : 'text-gray-400'}`}>
                    {tab.label}
                  </span>
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
