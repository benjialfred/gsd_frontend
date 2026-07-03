import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Logo from '../../../shared/components/Logo';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [objective, setObjective] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email || !password) {
      setApiError('Veuillez remplir tous les champs obligatoires.');
      return;
    }
    setIsLoading(true);
    setApiError('');
    setSuccessMessage('');
    try {
      const res = await api.post('/api/users/register/', {
        first_name: firstName,
        last_name: lastName,
        email: email,
        password: password
      });
      setSuccessMessage(res.data.message || 'Inscription réussie ! Veuillez vérifier vos e-mails pour activer votre compte.');
      // Reset form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPassword('');
      setObjective('');
    } catch (err: any) {
      const errMsg = err.response?.data?.email?.[0] || err.response?.data?.error || 'Échec de l\'inscription. Veuillez réessayer.';
      setApiError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };


  const googleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/api/users/google/', {
          access_token: tokenResponse.access_token
        });
        
        login(res.data.access, res.data.refresh, res.data.user);
        
        setTimeout(() => {
           navigate('/dashboard');
        }, 1500);
      } catch (err) {
        setIsLoading(false);
        setApiError('Échec de l\'inscription avec Google. Veuillez réessayer.');
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
    googleRegister();
  };

  return (
    <div className="w-full min-h-screen relative flex items-center justify-center bg-[#f8f9fa] pt-20 pb-20 overflow-hidden">
       {/* Background decorative elements */}
       <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-[#082a5e]/5 to-transparent pointer-events-none"></div>
       <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#dca54a]/10 rounded-full blur-[100px] pointer-events-none"></div>
       <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#082a5e]/10 rounded-full blur-[100px] pointer-events-none"></div>

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
                  animate={{ scale: [1, 1.05, 1] }}
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
                  <span>Création de votre alliance</span>
                  <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                  <motion.span animate={{ opacity: [0,1,0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
               </motion.div>
            </motion.div>
         )}
       </AnimatePresence>

       <div className="max-w-xl w-full px-6 relative z-10">
         <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="bg-white rounded-[2.5rem] p-10 md:p-12 shadow-[0_30px_60px_rgba(8,42,94,0.08)] border border-gray-100/50"
         >
           <div className="flex flex-col items-center text-center mb-8">
              <Logo theme="light" className="mb-6 scale-110" />
              <h2 className="text-3xl font-serif font-bold text-[#082a5e]">Rejoignez l'élite</h2>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed max-w-sm">
                Faites le premier pas vers une relation bénie et construisez votre avenir.
              </p>
           </div>
           
           {apiError && (
             <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-xs mb-6 text-center font-medium">
               {apiError}
             </div>
           )}
           {successMessage && (
             <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-xs mb-6 text-center font-bold">
               {successMessage}
             </div>
           )}

           <form onSubmit={handleSubmit} className="space-y-5">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
               <div>
                 <label className="block text-[10px] font-extrabold text-[#082a5e] mb-1.5 uppercase tracking-widest">Prénom</label>
                 <input required value={firstName} onChange={e => setFirstName(e.target.value)} type="text" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="Ex: Grâce" />
               </div>
               <div>
                 <label className="block text-[10px] font-extrabold text-[#082a5e] mb-1.5 uppercase tracking-widest">Nom</label>
                 <input required value={lastName} onChange={e => setLastName(e.target.value)} type="text" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="Ex: Ndiaye" />
               </div>
             </div>

             <div>
               <label className="block text-[10px] font-extrabold text-[#082a5e] mb-1.5 uppercase tracking-widest">Adresse Email</label>
               <input required value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="contact@exemple.com" />
             </div>

             <div>
               <label className="block text-[10px] font-extrabold text-[#082a5e] mb-1.5 uppercase tracking-widest">Mot de passe</label>
               <input required value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all placeholder:text-gray-300 text-sm" placeholder="••••••••" />
             </div>
             
             <div>
               <label className="block text-[10px] font-extrabold text-[#082a5e] mb-1.5 uppercase tracking-widest">Je recherche...</label>
               <select value={objective} onChange={e => setObjective(e.target.value)} className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all text-sm text-gray-700 bg-white cursor-pointer appearance-none">
                 <option value="">Sélectionnez un objectif</option>
                 <option value="mariage">Une relation menant au mariage</option>
                 <option value="formation">Des formations et masterclass</option>
                 <option value="coaching">Un coaching personnalisé</option>
               </select>
             </div>
             
             <button type="submit" className="w-full bg-[#082a5e] hover:bg-[#051833] text-white rounded-xl py-4 font-bold tracking-widest text-[11px] uppercase shadow-lg hover:shadow-[0_10px_30px_rgba(8,42,94,0.3)] transform hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group mt-6">
               Créer mon compte
               <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
             </button>
             
             <div className="relative mt-8 mb-6">
                <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-[10px]">
                   <span className="px-3 bg-white text-gray-400 font-bold uppercase tracking-widest">Ou s'inscrire avec</span>
                </div>
             </div>

             <div className="text-center">
               <button 
                 type="button" 
                 onClick={handleGoogleClick}
                 className="w-full bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 rounded-xl py-3.5 text-xs font-bold flex items-center justify-center gap-3 transition-all shadow-sm transform hover:-translate-y-0.5"
               >
                 <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="w-5 h-5 object-contain" />
                 <span>Inscription avec Google</span>
               </button>
             </div>

             <p className="text-center text-xs text-gray-500 mt-8 font-medium">
                Vous avez déjà un compte ?{' '}
                <Link to="/login" className="text-[#dca54a] font-bold hover:text-[#082a5e] transition-colors underline decoration-[#dca54a]/30 hover:decoration-[#082a5e] underline-offset-4">
                  Se connecter
                </Link>
             </p>
           </form>
         </motion.div>
       </div>
    </div>
  );
}
