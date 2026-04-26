import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Logo from '../components/common/Logo';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.post('http://localhost:8000/api/users/google/', {
          access_token: tokenResponse.access_token
        });
        
        login(res.data.access, res.data.refresh, res.data.user);
        
        // Un léger délai pour profiter de la belle animation avant la redirection
        setTimeout(() => {
           navigate('/academy');
        }, 1500);
      } catch (err) {
        setIsLoading(false);
        setApiError('Échec de la connexion. Veuillez réessayer.');
      }
    },
    onError: () => {
      setIsLoading(false);
      setApiError('Échec de la popup Google.');
    },
    onNonOAuthError: () => {
       setIsLoading(false);
    }
  });

  const handleGoogleClick = () => {
    setIsLoading(true);
    setApiError('');
    googleLogin();
  };

  return (
    <div className="w-full min-h-screen relative flex items-center justify-center bg-[#f8f9fa] pt-20 pb-20 overflow-hidden">
       {/* LUXURIOUS LOADING OVERLAY */}
       <AnimatePresence>
         {isLoading && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1, transition: { duration: 0.5 } }}
               exit={{ opacity: 0, transition: { duration: 0.6 } }}
               className="absolute inset-0 z-50 bg-[#082a5e]/90 backdrop-blur-md flex flex-col items-center justify-center"
            >
               <motion.div
                  animate={{ 
                    scale: [1, 1.05, 1],
                  }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
               >
                  <Logo theme="dark" className="scale-150 mb-8 drop-shadow-[0_0_20px_rgba(235,209,139,0.3)]" />
               </motion.div>
               <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-[#ebd18b] tracking-widest font-mono text-sm uppercase flex gap-1 items-center mt-4"
               >
                  <span>Authentification en cours</span>
                  <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
               </motion.div>
            </motion.div>
         )}
       </AnimatePresence>

       <div className="max-w-md w-full px-6 relative z-10">
         <div className="bg-white rounded-[2rem] p-10 shadow-[0_20px_50px_rgba(8,42,94,0.1)] border border-gray-100/50">
           <div className="flex flex-col items-center text-center mb-8">
              <Logo theme="light" className="mb-8 scale-110" />
              <h2 className="text-3xl font-serif font-bold text-[#082a5e]">Bon retour !</h2>
              <p className="text-gray-500 mt-2 text-sm">Saisissez vos identifiants pour continuer.</p>
           </div>
           
           {apiError && (
             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs mb-6 text-center font-medium">
               {apiError}
             </div>
           )}

           <form className="space-y-5">
             <div>
               <label className="block text-[10px] font-extrabold text-[#082a5e] mb-1.5 uppercase tracking-widest">Adresse Email</label>
               <input type="email" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="contact@exemple.com" />
             </div>
             <div>
               <label className="block text-[10px] font-extrabold text-[#082a5e] mb-1.5 uppercase tracking-widest">Mot de passe</label>
               <input type="password" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="••••••••" />
             </div>
             
             <div className="flex justify-between items-center text-xs">
               <label className="flex items-center gap-2 text-gray-500 font-medium cursor-pointer">
                 <input type="checkbox" className="rounded border-gray-300 text-[#dca54a] focus:ring-[#dca54a]/50" />
                 Mémoriser
               </label>
               <a href="#" className="text-[#dca54a] font-bold hover:text-[#082a5e] transition-colors">Mot de passe oublié ?</a>
             </div>
             
             <button type="button" className="w-full bg-[#082a5e] hover:bg-[#051833] text-white rounded-xl py-4 font-bold tracking-widest text-[11px] uppercase shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group mt-6">
               Se Connecter
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
             
             <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                   <span className="px-3 bg-white text-gray-400 font-bold uppercase tracking-widest">Ou continuer avec</span>
                </div>
             </div>

             <div className="text-center">
               <button 
                 type="button" 
                 onClick={handleGoogleClick}
                 className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl py-3.5 text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-sm"
               >
                 <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="w-5 h-5 object-contain" />
                 <span>S'identifier avec Google</span>
               </button>
             </div>
           </form>
         </div>
       </div>
    </div>
  );
}
