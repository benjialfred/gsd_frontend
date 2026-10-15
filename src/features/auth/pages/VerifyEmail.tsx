import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import Logo from '../../../shared/components/Logo';
import api from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuthStore();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const verifyAccount = async () => {
      const uid = searchParams.get('uid') || '';
      const token = searchParams.get('token') || '';

      if (!token && !uid) {
        setStatus('error');
        setErrorMessage('Aucun paramètre de confirmation valide trouvé dans le lien.');
        return;
      }

      try {
        const queryParams = new URLSearchParams();
        if (uid) queryParams.append('uid', uid);
        if (token) queryParams.append('token', token);
        queryParams.append('format', 'json');

        const res = await api.get(`/api/users/verify/?${queryParams.toString()}`);
        
        if (res.data?.access && res.data?.user) {
          login(res.data.access, res.data.refresh, res.data.user);
          setStatus('success');
          
          setTimeout(() => {
            if (res.data.user?.profile?.onboarding_completed) {
              navigate('/app');
            } else {
              navigate('/onboarding');
            }
          }, 2200);
        } else {
          setStatus('success');
          setTimeout(() => {
            navigate('/login?verified=true');
          }, 2500);
        }
      } catch (err: any) {
        console.error("Verification failed", err);
        setStatus('error');
        setErrorMessage(
          err.response?.data?.error ||
          "Ce lien de confirmation est invalide ou a expiré. Si vous avez déjà validé votre compte, vous pouvez vous connecter directement."
        );
      }
    };

    verifyAccount();
  }, [searchParams, login, navigate]);

  return (
    <div className="min-h-screen w-full bg-[#FCFBF9] flex flex-col justify-center items-center relative overflow-hidden font-sans px-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 md:p-10 shadow-xl border border-[#E8ECE9] flex flex-col items-center text-center"
      >
        <Logo theme="light" className="mb-8 scale-110" />

        {status === 'loading' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-full bg-[#fcf9f2] text-[#C9A84C] flex items-center justify-center mb-6 shadow-inner">
              <Loader2 size={32} className="animate-spin text-[#C9A84C]" />
            </div>
            <h2 className="text-2xl font-serif text-[#1A3A5C] font-bold mb-2">Activation en cours</h2>
            <p className="text-sm text-gray-500 max-w-xs leading-relaxed">
              Veuillez patienter pendant que nous validons votre adresse e-mail...
            </p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 shadow-sm border border-emerald-100">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-2xl font-serif text-[#1A3A5C] font-bold mb-2">Compte validé avec succès !</h2>
            <p className="text-sm text-gray-600 max-w-xs leading-relaxed mb-6">
              Bienvenue au Grand Salon Divin. Vous allez être redirigé automatiquement vers votre espace...
            </p>
            <Link
              to="/onboarding"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1A3A5C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#152e4a] transition-all shadow-md active:scale-95"
            >
              <span>Continuer</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-sm border border-rose-100">
              <AlertCircle size={36} />
            </div>
            <h2 className="text-2xl font-serif text-[#1A3A5C] font-bold mb-2">Lien invalide ou expiré</h2>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed mb-8">
              {errorMessage}
            </p>
            <div className="flex flex-col w-full gap-3">
              <Link
                to="/login"
                className="w-full py-3.5 px-6 rounded-xl bg-[#1A3A5C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#152e4a] transition-all shadow-md text-center"
              >
                Aller à la page de connexion
              </Link>
              <Link
                to="/"
                className="w-full py-3 px-6 rounded-xl bg-transparent border border-[#E8ECE9] text-gray-600 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-all text-center"
              >
                Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
