import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck, KeyRound, Loader2 } from 'lucide-react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../../services/api';
import Logo from '../../../shared/components/Logo';
import { toast } from '../../../stores/useToastStore';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramEmail = searchParams.get('email') || '';
  const paramCode = searchParams.get('code') || '';
  const paramUid = searchParams.get('uid') || '';
  const paramToken = searchParams.get('token') || '';

  const [email, setEmail] = useState(paramEmail);
  const [otpCode, setOtpCode] = useState(paramCode);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const isTokenMode = Boolean(paramUid && paramToken);

  useEffect(() => {
    if (paramEmail) setEmail(paramEmail);
    if (paramCode) setOtpCode(paramCode);
  }, [paramEmail, paramCode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!isTokenMode && (!email || !otpCode)) {
      setApiError("Veuillez renseigner votre e-mail et le code de sécurité à 6 chiffres.");
      return;
    }

    if (newPassword.length < 6) {
      setApiError("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setApiError("Les deux mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);

    try {
      const payload: any = {
        new_password: newPassword,
      };

      if (isTokenMode) {
        payload.uid = paramUid;
        payload.token = paramToken;
      } else {
        payload.email = email.trim().toLowerCase();
        payload.otp_code = otpCode.trim();
      }

      const res = await api.post('/api/users/password-reset/confirm/', payload);
      setIsSuccess(true);
      toast.success(res.data?.message || "Mot de passe réinitialisé avec succès !");
    } catch (err: any) {
      console.error("Erreur reset confirm:", err);
      const msg = err.response?.data?.error || "Échec de la réinitialisation. Le code a peut-être expiré.";
      setApiError(msg);
      toast.error(msg);
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

        <div className="w-12 h-12 rounded-2xl bg-[#1A3A5C] text-[#C9A84C] flex items-center justify-center mb-4 shadow-sm border border-[#C9A84C]/30">
          <ShieldCheck size={24} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif text-[#1A3A5C] text-center mb-2 font-normal">
          Nouveau Mot de Passe
        </h1>

        <p className="text-xs sm:text-sm text-[#1A3A5C]/70 text-center font-light mb-8 max-w-sm leading-relaxed">
          {isTokenMode 
            ? "Lien sécurisé vérifié. Définissez dès à présent votre nouveau mot de passe." 
            : "Saisissez le code de sécurité reçu par e-mail et choisissez votre nouveau mot de passe."}
        </p>

        {apiError && (
          <div className="w-full bg-red-50 border border-red-200 text-red-600 text-xs p-3.5 rounded-xl mb-6 text-center">
            {apiError}
          </div>
        )}

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form 
              key="reset-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onSubmit={handleSubmit} 
              className="w-full space-y-5"
            >
              {!isTokenMode && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">
                      Votre adresse e-mail
                    </label>
                    <input 
                      required 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 text-sm text-[#1A3A5C]"
                      placeholder="exemple@email.com"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">
                        Code de sécurité reçu (6 chiffres)
                      </label>
                      <Link to="/password-reset" className="text-[11px] text-[#C9A84C] hover:underline">
                        Renvoyer un code
                      </Link>
                    </div>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        required 
                        type="text" 
                        maxLength={8}
                        value={otpCode} 
                        onChange={e => setOtpCode(e.target.value.replace(/\s+/g, ''))}
                        className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-[#C9A84C] focus:ring-2 focus:ring-[#C9A84C]/20 text-base font-mono tracking-widest text-[#1A3A5C] font-semibold"
                        placeholder="Ex: 749281"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">
                  Nouveau mot de passe
                </label>
                <div className="relative border border-gray-200 rounded-xl focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all bg-white">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={newPassword} 
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full bg-transparent text-[#1A3A5C] pl-11 pr-11 py-3 outline-none placeholder:text-gray-300 text-sm font-light"
                    placeholder="Au moins 6 caractères"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#C9A84C] transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">
                  Confirmez le nouveau mot de passe
                </label>
                <div className="relative border border-gray-200 rounded-xl focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all bg-white">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} strokeWidth={1.5} />
                  <input 
                    required 
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-[#1A3A5C] pl-11 pr-11 py-3 outline-none placeholder:text-gray-300 text-sm font-light"
                    placeholder="Répétez le mot de passe"
                  />
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 group shadow-md mt-6 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-[#C9A84C]" />
                    <span>Mise à jour en cours...</span>
                  </>
                ) : (
                  <>
                    <span>Valider Mon Nouveau Mot de Passe</span>
                    <ArrowRight size={16} className="text-[#C9A84C] group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </motion.form>
          ) : (
            <motion.div 
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full space-y-6 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 size={34} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-serif text-[#1A3A5C]">
                  Mot de passe réinitialisé !
                </h3>
                <p className="text-xs text-[#1A3A5C]/70 leading-relaxed font-light">
                  Vos nouveaux identifiants sont immédiatement actifs. Vous pouvez désormais vous reconnecter ou utiliser votre code PIN.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-4 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md mt-4"
              >
                <span>Se Connecter Maintenant</span>
                <ArrowRight size={16} className="text-[#C9A84C]" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full mt-8 pt-6 border-t border-gray-100 flex items-center justify-center">
          <Link 
            to="/login" 
            className="text-xs text-[#1A3A5C]/70 hover:text-[#C9A84C] font-semibold uppercase tracking-wider transition-colors"
          >
            Retour à la page de connexion
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
