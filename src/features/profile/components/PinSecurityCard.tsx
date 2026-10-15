import React, { useState } from 'react';
import { KeyRound, ShieldCheck, ShieldAlert, Lock, ArrowRight, X, Trash2, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PinInput } from '../../../shared/components/PinInput';
import api from '../../../services/api';
import { toast } from '../../../stores/useToastStore';
import { useAuthStore } from '../../../stores/authStore';

export const PinSecurityCard: React.FC = () => {
  const { user, fetchUser } = useAuthStore();
  const hasPin = Boolean(user?.has_pin);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'SET' | 'REMOVE'>('SET');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const openSetPinModal = () => {
    setModalMode('SET');
    setCurrentPassword('');
    setNewPin('');
    setConfirmPin('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const openRemovePinModal = () => {
    setModalMode('REMOVE');
    setCurrentPassword('');
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleSavePin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (newPin.length < 4) {
      setErrorMsg("Le code PIN doit comporter 4 chiffres.");
      return;
    }

    if (newPin !== confirmPin) {
      setErrorMsg("La confirmation du code PIN ne correspond pas.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/api/users/set-pin/', {
        pin: newPin,
        current_password: currentPassword
      });

      toast.success(res.data?.message || "Code PIN enregistré avec succès !");
      await fetchUser();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Erreur set-pin:", err);
      const msg = err.response?.data?.error || "Impossible d'enregistrer le code PIN.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemovePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      setErrorMsg("Votre mot de passe est requis pour désactiver le code PIN.");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post('/api/users/remove-pin/', {
        current_password: currentPassword
      });

      toast.success(res.data?.message || "Code PIN désactivé.");
      await fetchUser();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Erreur remove-pin:", err);
      const msg = err.response?.data?.error || "Mot de passe incorrect.";
      setErrorMsg(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8ECE9] shadow-sm space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center shrink-0 border border-[#1A3A5C]/20">
            <KeyRound size={22} className="text-[#C9A84C]" />
          </div>
          <div>
            <h3 className="text-lg font-serif text-[#1A3A5C] font-semibold">
              Code PIN & Reconnexion Rapide
            </h3>
            <p className="text-xs text-[#1A3A5C]/70 font-light">
              Déverrouillez votre espace GSD en 4 chiffres sans devoir saisir votre long mot de passe.
            </p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider shrink-0 ${
          hasPin 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-amber-50 text-amber-700 border border-amber-200'
        }`}>
          {hasPin ? 'PIN Actif' : 'Non configuré'}
        </span>
      </div>

      <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#C9A84C]/25 text-xs text-[#1A3A5C]/80 space-y-2">
        <div className="flex items-center gap-2 font-semibold text-[#1A3A5C]">
          <ShieldCheck size={16} className="text-[#C9A84C]" />
          <span>Sécurité et protection anti-brute force</span>
        </div>
        <p className="font-light leading-relaxed">
          Le code PIN est haché selon les normes cryptographiques de sécurité. Après 5 tentatives erronées consécutives, l'accès par PIN est temporairement suspendu pendant 15 minutes, protégeant vos données intimes.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="text-xs text-[#1A3A5C]/60 font-light">
          {hasPin 
            ? "Vous pouvez modifier votre code PIN ou le désactiver à tout moment."
            : "Activez votre code PIN dès maintenant pour gagner du temps à chaque visite."}
        </div>

        <div className="flex items-center gap-3">
          {hasPin && (
            <button
              type="button"
              onClick={openRemovePinModal}
              className="px-4 py-2.5 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} />
              <span>Désactiver le PIN</span>
            </button>
          )}

          <button
            type="button"
            onClick={openSetPinModal}
            className="px-5 py-2.5 rounded-xl bg-[#1A3A5C] hover:bg-[#152e4a] text-white text-xs font-semibold uppercase tracking-wider transition-all flex items-center gap-2 shadow-sm"
          >
            <span>{hasPin ? 'Modifier mon Code PIN' : 'Configurer un Code PIN'}</span>
            <ArrowRight size={14} className="text-[#C9A84C]" />
          </button>
        </div>
      </div>

      {/* Modal de Configuration du Code PIN */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-100 relative"
            >
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="absolute right-5 top-5 text-gray-400 hover:text-gray-600 p-1"
              >
                <X size={20} />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 border border-[#C9A84C]/30 text-[#1A3A5C] flex items-center justify-center mx-auto mb-3">
                  <KeyRound size={22} className="text-[#C9A84C]" />
                </div>
                <h3 className="text-xl font-serif text-[#1A3A5C]">
                  {modalMode === 'SET' 
                    ? (hasPin ? 'Modifier votre Code PIN' : 'Créer votre Code PIN')
                    : 'Désactiver le Code PIN'}
                </h3>
                <p className="text-xs text-[#1A3A5C]/70 font-light mt-1">
                  {modalMode === 'SET'
                    ? 'Choisissez un code à 4 chiffres facile à retenir pour vous.'
                    : 'Confirmez votre mot de passe pour désactiver la reconnexion par PIN.'}
                </p>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs text-center">
                  {errorMsg}
                </div>
              )}

              {modalMode === 'SET' ? (
                <form onSubmit={handleSavePin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">
                      Mot de passe actuel (Sécurité)
                    </label>
                    <div className="relative border border-gray-200 rounded-xl focus-within:border-[#C9A84C] bg-white">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        required
                        type="password"
                        value={currentPassword}
                        onChange={e => setCurrentPassword(e.target.value)}
                        placeholder="Votre mot de passe actuel"
                        className="w-full bg-transparent pl-10 pr-4 py-2.5 text-xs text-[#1A3A5C] outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-center py-2">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70 block">
                      Nouveau Code PIN (4 chiffres)
                    </label>
                    <PinInput
                      length={4}
                      value={newPin}
                      onChange={setNewPin}
                      autoFocus={false}
                    />
                  </div>

                  <div className="space-y-1 text-center py-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70 block">
                      Confirmez le Code PIN
                    </label>
                    <PinInput
                      length={4}
                      value={confirmPin}
                      onChange={setConfirmPin}
                      autoFocus={false}
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading || newPin.length < 4 || confirmPin.length < 4}
                      className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md disabled:opacity-40"
                    >
                      {isLoading ? 'Enregistrement...' : 'Valider Mon Code PIN'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRemovePin} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-[#1A3A5C]/70">
                      Mot de passe actuel
                    </label>
                    <input
                      required
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Saisissez votre mot de passe pour confirmer"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-xs text-[#1A3A5C] outline-none focus:border-red-400"
                    />
                  </div>

                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isLoading || !currentPassword}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all shadow-md disabled:opacity-40"
                    >
                      {isLoading ? 'Désactivation...' : 'Confirmer la désactivation'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
