import React, { useState } from 'react';
import { ArrowRight, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../../shared/components/Logo';

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setApiError('Remplissez tous les champs.');
      return;
    }
    setIsLoading(true);
    setApiError('');
    setIsAlreadyRegistered(false);
    setSuccessMessage('');
    try {
      const res = await api.post('/api/users/register/', { email: email.trim().toLowerCase(), password });
      if (res.data?.resend) {
        navigate('/check-email', { state: { email: email.trim().toLowerCase(), resend: true, message: res.data.message } });
      } else {
        navigate('/check-email', { state: { email: email.trim().toLowerCase() } });
      }
    } catch (err: any) {
      console.error("Erreur Inscription: ", err, err.response);
      const data = err.response?.data;
      if (data?.already_registered) {
        setIsAlreadyRegistered(true);
      }
      const msg = data?.email?.[0] || data?.username?.[0] || data?.error || data?.detail || err.message || 'Erreur réseau ou serveur inaccessible.';
      setApiError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const googleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/api/users/google/', { access_token: tokenResponse.access_token });
        login(res.data.access, res.data.refresh, res.data.user);
        setTimeout(() => navigate('/app'), 1000);
      } catch (err) {
        setIsLoading(false);
        setApiError('Échec Google.');
      }
    },
    onError: () => { setIsLoading(false); setApiError('Erreur Google.'); }
  });

  return (
    <div className="min-h-screen w-full bg-white flex flex-col justify-center items-center relative overflow-hidden font-sans">
      <AnimatePresence>
        {isLoading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
            <motion.div animate={{ scale: [1, 1.05, 1], opacity: [0.7, 1, 0.7] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Logo theme="light" className="scale-150 drop-shadow-sm" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md px-8 py-12 flex flex-col items-center"
      >
        <Logo theme="light" className="mb-10 scale-125" />
        
        <h1 className="text-4xl font-serif text-[#1A3A5C] mb-10 tracking-wide font-normal">S'inscrire</h1>

        {apiError && (
          <div className="w-full bg-red-50 border border-red-100 text-red-600 text-xs p-3.5 mb-6 text-center rounded-lg leading-relaxed space-y-1.5">
            <p>{apiError}</p>
            {isAlreadyRegistered && (
              <p className="pt-1 font-medium">
                <Link to="/login" className="underline text-[#1A3A5C] hover:text-[#C9A84C] transition-colors">
                  Cliquez ici pour vous connecter directement
                </Link>
              </p>
            )}
          </div>
        )}
        {successMessage && <div className="w-full bg-[#fcf9f2] border border-[#C9A84C]/30 text-[#C9A84C] text-xs p-3 mb-6 text-center leading-relaxed">{successMessage}</div>}

        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="relative border-b border-gray-200 focus-within:border-[#C9A84C] transition-colors pb-2">
            <Mail className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
            <input 
              required 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-transparent text-[#1A3A5C] pl-10 pr-4 outline-none placeholder:text-gray-300 text-sm font-light"
              placeholder="Adresse e-mail"
            />
          </div>
          
          <div className="relative border-b border-gray-200 focus-within:border-[#C9A84C] transition-colors pb-2">
            <Lock className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
            <input 
              required 
              type={showPassword ? "text" : "password"}
              value={password} 
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-transparent text-[#1A3A5C] pl-10 pr-10 outline-none placeholder:text-gray-300 text-sm font-light"
              placeholder="Mot de passe"
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A84C] transition-colors"
            >
              {showPassword ? <EyeOff size={18} strokeWidth={1.5} /> : <Eye size={18} strokeWidth={1.5} />}
            </button>
          </div>

          <button type="submit" className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-4 mt-8 text-xs font-semibold uppercase tracking-[0.2em] transition-colors flex items-center justify-center gap-3 group">
            Créer mon compte
            <ArrowRight size={16} strokeWidth={1.5} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="w-full mt-10 relative flex items-center justify-center">
          <div className="absolute inset-0 border-t border-gray-100 w-full top-1/2"></div>
          <span className="relative bg-white px-4 text-[10px] text-gray-400 uppercase tracking-widest">Ou</span>
        </div>

        <button onClick={() => googleRegister()} type="button" className="w-full mt-8 border border-gray-200 text-gray-600 hover:bg-gray-50 py-3.5 text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors">
          <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="w-4 h-4" />
          S'inscrire avec Google
        </button>

        <p className="mt-12 text-center text-xs text-gray-400 font-light">
          Déjà membre ?{' '}
          <Link to="/login" className="text-[#1A3A5C] font-semibold hover:text-[#C9A84C] transition-colors uppercase tracking-wider ml-1">Se connecter</Link>
        </p>
      </motion.div>
    </div>
  );
}
