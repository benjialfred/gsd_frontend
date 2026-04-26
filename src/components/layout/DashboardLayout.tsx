import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import Logo from '../common/Logo';
import { User, Heart, MessageCircle, BookOpen, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function DashboardLayout() {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const linkClass = (path: string) => `flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all ${isActive(path) ? 'bg-[#082a5e] text-white shadow-xl shadow-[#082a5e]/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border border-transparent hover:border-gray-100'}`;

  return (
    <div className="flex h-screen bg-[#f8f9fa] overflow-hidden w-full">
      {/* SIDEBAR */}
      <aside className={`${menuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'} md:translate-x-0 absolute md:relative z-40 w-72 h-screen bg-white md:border-r border-gray-100 transition-transform duration-300 flex flex-col`}>
         <div className="p-6 pb-4 border-b border-gray-50 flex justify-between items-center relative z-10 bg-white">
            <Logo theme="light" className="scale-75 origin-left" />
            <button className="md:hidden text-gray-400 hover:text-gray-900 bg-gray-50 p-2 rounded-full" onClick={() => setMenuOpen(false)}>✕</button>
         </div>

         <div className="p-4 flex-1 flex flex-col gap-2 overflow-y-auto">
            <Link to="/dashboard/profile" className={linkClass('/dashboard/profile')} onClick={() => setMenuOpen(false)}>
              <div className={isActive('/dashboard/profile') ? 'text-[#ebd18b]' : 'text-gray-400'}><User size={20} /></div>
              <span className="font-bold text-xs uppercase tracking-widest">Mon Profil</span>
            </Link>
            <Link to="/dashboard" className={linkClass('/dashboard')} onClick={() => setMenuOpen(false)}>
              <div className={isActive('/dashboard') ? 'text-[#ebd18b]' : 'text-gray-400'}><Heart size={20} /></div>
              <span className="font-bold text-xs uppercase tracking-widest">Découvrir</span>
            </Link>
            <Link to="/dashboard/chat" className={linkClass('/dashboard/chat')} onClick={() => setMenuOpen(false)}>
              <div className={isActive('/dashboard/chat') ? 'text-[#ebd18b]' : 'text-gray-400'}><MessageCircle size={20} /></div>
              <span className="font-bold text-xs uppercase tracking-widest">Chat Divin</span>
            </Link>
            <Link to="/dashboard/academy" className={linkClass('/dashboard/academy')} onClick={() => setMenuOpen(false)}>
              <div className={isActive('/dashboard/academy') ? 'text-[#ebd18b]' : 'text-gray-400'}><BookOpen size={20} /></div>
              <span className="font-bold text-xs uppercase tracking-widest">E-Academy</span>
            </Link>
         </div>

         <div className="p-6 pt-4 border-t border-gray-50 bg-white mt-auto">
            <div className="flex items-center gap-3 mb-5 p-3 rounded-2xl border border-gray-100 bg-gray-50">
               <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#dca54a] to-[#ebd18b] flex items-center justify-center text-white font-black text-lg shadow-[0_0_15px_rgba(220,165,74,0.4)]">
                 {user?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
               </div>
               <div className="flex flex-col w-[120px]">
                 <span className="text-xs font-bold text-[#082a5e] leading-tight truncate">{user?.first_name} {user?.last_name}</span>
                 <span className="text-[9px] text-gray-500 truncate">{user?.email}</span>
               </div>
            </div>
            <button onClick={logout} className="flex items-center justify-center gap-3 text-red-500 hover:text-white hover:bg-red-500 w-full px-4 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest">
               <LogOut size={16} /> Déconnexion
            </button>
         </div>
      </aside>

      {/* OVERLAY MOBILE */}
      {menuOpen && <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden" onClick={() => setMenuOpen(false)} />}

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative w-full">
        <header className="md:hidden bg-white border-b border-gray-100 p-4 shrink-0 flex justify-between items-center shadow-sm relative z-20">
           <Logo theme="light" className="scale-[0.6] origin-left -ml-2" />
           <button onClick={() => setMenuOpen(true)} className="p-2 text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg"><Menu size={20} /></button>
        </header>
        <div className="flex-1 overflow-x-hidden overflow-y-auto w-full relative">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
