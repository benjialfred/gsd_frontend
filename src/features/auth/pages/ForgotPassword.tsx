import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, KeyRound, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import Logo from '../../../shared/components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg("Veuillez saisir votre adresse e-mail.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      await api.post('/api/users/password-reset/', { email: email.trim().toLowerCase() });
      setIsSent(true);
    } catch (err: any) {
      console.error("Erreur réinitialisation:", err);
      setErrorMsg(err.response?.data?.error || "Une erreur est survenue lors de l'envoi de l'e-mail.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FAF9F6] flex flex-col justify-center items-center relative overflow-hidden font-sans px-4 py-12">
      {/* Texture de fond subtile */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#1A3A5C 1px, transparent 1px)",
          backgroundSize: "24px 24px"
        }}
      />

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }} 
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md bg-white rounded-3xl border border-[#E8ECE9] shadow-xl p-8 sm:p-10 flex flex-col items-center relative z-10"
      >
        <Link to="/" className="mb-6 hover:opacity-90 transition-opacity">
          <Logo theme="light" className="scale-110" />
        </Link>

        <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#1A3A5C] flex items-center justify-center mb-4">
          <KeyRound size={22} className="text-[#C9A84C]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-[#1A3A5C] text-center mb-2 font-normal">
          Mot de passe oublié ?
        </h1>

        <p className="text-xs sm:text-sm text-[#1A3A5C]/70 text-center font-light mb-8 max-w-sm leading-relaxed">
          Saisissez votre e-mail pour recevoir un code de sécurité à 6 chiffres et réinitialiser vos accès en toute sérénité.
        </p>

        {errorMsg && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-xl mb-6 text-center">
            {errorMsg}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.form 
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="w-full space-y-6"
            >
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">
                  Votre adresse e-mail
                </label>
                <div className="relative border border-gray-200 rounded-xl focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all bg-white overflow-hidden">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    required 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-transparent text-[#1A3A5C] pl-11 pr-4 py-3.5 outline-none placeholder:text-gray-300 text-sm font-light"
                    placeholder="exemple@email.com"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 group shadow-md disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#C9A84C]" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Recevoir le Code de Sécurité</span>
                    <ArrowRight size={16} className="text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-6 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 size={30} />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-serif text-[#1A3A5C]">
                  Consultez votre boîte de réception
                </h3>
                <p className="text-xs text-[#1A3A5C]/70 leading-relaxed font-light">
                  Si un compte est associé à <strong className="text-[#1A3A5C] font-semibold">{email}</strong>, un code de sécurité à 6 chiffres et un lien d'accès direct vous ont été transmis.
                </p>
              </div>

              <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#C9A84C]/30 text-left space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1A3A5C]">
                  <ShieldCheck size={16} className="text-[#C9A84C]" />
                  <span>Deux options simples :</span>
                </div>
                <ul className="text-xs text-[#1A3A5C]/80 space-y-1 list-disc list-inside font-light">
                  <li>Cliquez sur le bouton direct présent dans l'e-mail.</li>
                  <li>Ou saisissez immédiatement votre code à 6 chiffres ci-dessous.</li>
                </ul>
              </div>

              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                  className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  <span>Saisir Mon Code à 6 Chiffres</span>
                  <ArrowRight size={15} className="text-[#C9A84C]" />
                </button>

                <button
                  type="button"
                  onClick={() => setIsSent(false)}
                  className="text-xs text-[#1A3A5C]/60 hover:text-[#C9A84C] transition-colors font-light"
                >
                  Renvoyer ou changer d'e-mail
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full mt-8 pt-6 border-t border-gray-100 flex items-center justify-center">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-xs text-[#1A3A5C]/70 hover:text-[#C9A84C] font-semibold uppercase tracking-wider transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Retour à la connexion</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
