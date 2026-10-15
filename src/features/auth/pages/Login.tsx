import React, { useState, useEffect } from 'react';
import { ArrowRight, Mail, Lock, Eye, EyeOff, KeyRound, Shield, AlertCircle } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../../../shared/components/Logo';
import { PinInput } from '../../../shared/components/PinInput';
import { toast } from '../../../stores/useToastStore';

export default function Login() {
  const [searchParams] = useSearchParams();
  const [authMode, setAuthMode] = useState<'PASSWORD' | 'PIN'>('PASSWORD');
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [successMsg, setSuccessMsg] = useState(searchParams.get('verified') === 'true' ? 'Vérification réussie.' : '');
  
  // Champs formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isPinError, setIsPinError] = useState(false);

  const { login } = useAuthStore();
  const navigate = useNavigate();

  // Mémorisation de la dernière adresse email utilisée
  useEffect(() => {
    const savedEmail = localStorage.getItem('gsd_last_email');
    if (savedEmail) {
      setEmail(savedEmail);
      // Si l'utilisateur avait déjà un email mémorisé, on peut suggérer la connexion PIN par défaut
      const preferredMode = localStorage.getItem('gsd_auth_mode');
      if (preferredMode === 'PIN') {
        setAuthMode('PIN');
      }
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setApiError('Veuillez remplir tous les champs.');
      return;
    }
    setIsLoading(true);
    setApiError('');
    setSuccessMsg('');
    try {
      const res = await api.post('/api/auth/token/', { username: email.trim().toLowerCase(), password });
      const { access, refresh } = res.data;
      const profileRes = await api.get('/api/users/me/', { headers: { Authorization: `Bearer ${access}` } });
      
      localStorage.setItem('gsd_last_email', email.trim().toLowerCase());
      localStorage.setItem('gsd_auth_mode', 'PASSWORD');
      
      login(access, refresh, profileRes.data);
      toast.success(`Bienvenue, ${profileRes.data.first_name || profileRes.data.username} !`);
      setTimeout(() => navigate('/app'), 800);
    } catch (err: any) {
      console.error("Erreur Connexion: ", err, err.response);
      setIsLoading(false);
      setApiError(err.response?.data?.detail || err.message || 'Identifiants invalides ou serveur inaccessible.');
    }
  };

  const handlePinSubmit = async (pinValue?: string) => {
    const currentPin = pinValue || pin;
    if (!email || currentPin.length < 4) {
      setApiError('Veuillez renseigner votre e-mail et votre code PIN complet.');
      return;
    }

    setIsLoading(true);
    setApiError('');
    setIsPinError(false);

    try {
      const res = await api.post('/api/users/pin-login/', {
        identifier: email.trim().toLowerCase(),
        pin: currentPin
      });

      const { access, refresh, user } = res.data;
      localStorage.setItem('gsd_last_email', email.trim().toLowerCase());
      localStorage.setItem('gsd_auth_mode', 'PIN');

      login(access, refresh, user);
      toast.success(res.data.message || "Reconnexion réussie !");
      setTimeout(() => navigate('/app'), 600);
    } catch (err: any) {
      console.error("Erreur Reconnexion PIN:", err);
      setIsLoading(false);
      setIsPinError(true);
      const errMsg = err.response?.data?.error || "Code PIN incorrect.";
      setApiError(errMsg);
      toast.error(errMsg);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await api.post('/api/users/google/', { access_token: tokenResponse.access_token });
        login(res.data.access, res.data.refresh, res.data.user);
        setTimeout(() => navigate('/app'), 800);
      } catch (err) {
        setIsLoading(false);
        setApiError('Échec de la connexion Google.');
      }
    },
    onError: () => { setIsLoading(false); setApiError('Erreur de communication avec Google.'); }
  });

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] flex flex-col justify-center items-center relative overflow-hidden font-sans px-4 py-8">
      {/* Texture de fond subtile */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1A3A5C 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

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
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E8ECE9] shadow-xl p-8 sm:p-10 flex flex-col items-center relative z-10"
      >
        <Link to="/" className="mb-6 hover:opacity-90 transition-opacity">
          <Logo theme="light" className="scale-110" />
        </Link>
        
        <h1 className="text-3xl font-serif text-[#1A3A5C] mb-2 tracking-wide font-normal">Connexion</h1>
        <p className="text-xs text-[#1A3A5C]/60 mb-6 font-light">Accédez à votre sanctuaire matrimonial</p>

        {/* Sélecteur de mode de connexion (Mot de passe vs Code PIN) */}
        <div className="w-full bg-[#FAF9F6] p-1 rounded-2xl border border-gray-200/80 flex items-center mb-6">
          <button
            type="button"
            onClick={() => { setAuthMode('PASSWORD'); setApiError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'PASSWORD'
                ? 'bg-white text-[#1A3A5C] shadow-sm border border-gray-200/60'
                : 'text-gray-400 hover:text-[#1A3A5C]'
            }`}
          >
            <Lock size={13} />
            <span>Mot de passe</span>
          </button>

          <button
            type="button"
            onClick={() => { setAuthMode('PIN'); setAuthMode('PIN'); setApiError(''); }}
            className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              authMode === 'PIN'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-400 hover:text-[#1A3A5C]'
            }`}
          >
            <KeyRound size={13} />
            <span>Code PIN Rapide</span>
          </button>
        </div>

        {apiError && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs p-3 rounded-xl mb-6 text-center leading-relaxed">
            {apiError}
          </div>
        )}
        {successMsg && (
          <div className="w-full bg-[#fcf9f2] border border-[#C9A84C]/30 text-[#C9A84C] text-xs p-3 rounded-xl mb-6 text-center font-medium">
            {successMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {authMode === 'PASSWORD' ? (
            /* =================== FORMULAIRE MOT DE PASSE CLASSIQUE =================== */
            <motion.form 
              key="password-mode"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handlePasswordSubmit} 
              className="w-full space-y-5"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">Adresse e-mail</label>
                <div className="relative border border-gray-200 rounded-xl focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all bg-white">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} strokeWidth={1.5} />
                  <input 
                    required 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[#1A3A5C] pl-10 pr-4 py-3 outline-none placeholder:text-gray-300 text-sm font-light"
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">Mot de passe</label>
                <div className="relative border border-gray-200 rounded-xl focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all bg-white">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} strokeWidth={1.5} />
                  <input 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={password} 
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-transparent text-[#1A3A5C] pl-10 pr-10 py-3 outline-none placeholder:text-gray-300 text-sm font-light"
                    placeholder="Votre mot de passe"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A84C] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} strokeWidth={1.5} /> : <Eye size={16} strokeWidth={1.5} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('PIN')}
                  className="text-xs text-[#C9A84C] hover:underline font-light flex items-center gap-1"
                >
                  <KeyRound size={12} />
                  <span>Utiliser mon code PIN</span>
                </button>

                <Link to="/password-reset" className="text-[#1A3A5C]/60 text-xs hover:text-[#C9A84C] transition-colors font-light">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-md disabled:opacity-50"
              >
                <span>Se Connecter</span>
                <ArrowRight size={15} strokeWidth={1.5} className="text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.form>
          ) : (
            /* =================== FORMULAIRE CODE PIN RAPIDE =================== */
            <motion.div 
              key="pin-mode"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="w-full space-y-5"
            >
              <div className="space-y-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">Adresse e-mail</label>
                <div className="relative border border-gray-200 rounded-xl focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all bg-white">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={17} strokeWidth={1.5} />
                  <input 
                    required 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[#1A3A5C] pl-10 pr-4 py-3 outline-none placeholder:text-gray-300 text-sm font-light"
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>

              <div className="space-y-2 text-center py-1">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70 block">
                  Code PIN de Sécurité (4 chiffres)
                </label>
                
                <PinInput
                  length={4}
                  value={pin}
                  onChange={setPin}
                  onComplete={(completedPin) => handlePinSubmit(completedPin)}
                  isError={isPinError}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setAuthMode('PASSWORD')}
                  className="text-xs text-[#1A3A5C]/70 hover:text-[#C9A84C] font-light flex items-center gap-1"
                >
                  <Lock size={12} />
                  <span>Code PIN oublié ? Mot de passe</span>
                </button>

                <Link to="/password-reset" className="text-[#1A3A5C]/60 text-xs hover:text-[#C9A84C] transition-colors font-light">
                  Aide & Récupération
                </Link>
              </div>

              <button 
                type="button"
                onClick={() => handlePinSubmit()}
                disabled={isLoading || pin.length < 4}
                className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 group shadow-md disabled:opacity-40"
              >
                <span>Déverrouiller la Session</span>
                <ArrowRight size={15} strokeWidth={1.5} className="text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full mt-8 relative flex items-center justify-center">
          <div className="absolute inset-0 border-t border-gray-100 w-full top-1/2"></div>
          <span className="relative bg-white px-4 text-[10px] text-gray-400 uppercase tracking-widest">Ou</span>
        </div>

        <button 
          onClick={() => googleLogin()} 
          type="button" 
          className="w-full mt-6 border border-gray-200 text-gray-700 hover:bg-gray-50 py-3 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-3 transition-colors shadow-sm"
        >
          <img src="https://img.icons8.com/color/48/google-logo.png" alt="Google" className="w-4 h-4" />
          Continuer avec Google
        </button>

        <p className="mt-8 text-center text-xs text-gray-400 font-light">
          Vous n'avez pas de compte ?{' '}
          <Link to="/register" className="text-[#1A3A5C] font-semibold hover:text-[#C9A84C] transition-colors uppercase tracking-wider ml-1">S'inscrire</Link>
        </p>
      </motion.div>
    </div>
  );
}

