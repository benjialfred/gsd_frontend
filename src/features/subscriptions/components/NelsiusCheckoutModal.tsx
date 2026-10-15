import React, { useState } from 'react';
import type { SubscriptionPlan } from '../types/subscriptions';
import { subscriptionService } from '../services/subscriptionService';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from '../../../stores/useToastStore';
import { 
  X, ShieldCheck, Lock, ExternalLink, Loader2, 
  CheckCircle2, Smartphone, CreditCard, Sparkles, AlertCircle 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NelsiusCheckoutModalProps {
  plan: SubscriptionPlan | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const NelsiusCheckoutModal: React.FC<NelsiusCheckoutModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuthStore();
  const [customerPhone, setCustomerPhone] = useState<string>(
    user?.profile?.phone || ''
  );
  const [isInitializing, setIsInitializing] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  // Étape de paiement : 'INPUT' | 'PENDING_CHECKOUT' | 'SUCCESS'
  const [step, setStep] = useState<'INPUT' | 'PENDING_CHECKOUT' | 'SUCCESS'>('INPUT');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [checkoutUrl, setCheckoutUrl] = useState<string>('');

  if (!isOpen || !plan) return null;

  const formattedPrice = typeof plan.price === 'number'
    ? `${plan.price.toLocaleString()} FCFA`
    : `${parseInt(plan.price || '0', 10).toLocaleString()} FCFA`;

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInitializing(true);

    try {
      const res = await subscriptionService.subscribeToPlan(
        plan.id,
        customerPhone,
        window.location.href
      );

      if (plan.code === 'FREE') {
        toast.success(res.message || "Pass gratuit activé !");
        setStep('SUCCESS');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1500);
        return;
      }

      if (res.payment_reference) {
        setPaymentReference(res.payment_reference);
        setCheckoutUrl(res.checkout_url || '');
        setStep('PENDING_CHECKOUT');

        // Si une URL de paiement externe NelsiusPay est fournie, l'ouvrir dans un nouvel onglet
        if (res.checkout_url && res.checkout_url.startsWith('http')) {
          window.open(res.checkout_url, '_blank');
        }
      } else {
        toast.error("Impossible d'initialiser la session NelsiusPay.");
      }
    } catch (err: any) {
      console.error("Erreur souscription:", err);
      const msg = err.response?.data?.error || "Échec de l'initialisation du paiement.";
      toast.error(msg);
    } finally {
      setIsInitializing(false);
    }
  };

  const handleConfirmVerification = async () => {
    if (!paymentReference) return;
    setIsVerifying(true);

    try {
      const res = await subscriptionService.confirmPayment(paymentReference);
      if (res.success) {
        toast.success(res.message || "Abonnement activé avec succès !");
        setStep('SUCCESS');
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 1800);
      } else {
        toast.error("Paiement non confirmé auprès de NelsiusPay.");
      }
    } catch (err: any) {
      console.error("Erreur confirmation:", err);
      toast.error("Vérification en attente. Veuillez finaliser le paiement sur le guichet.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#E8ECE9] w-full max-w-lg overflow-hidden my-6"
      >
        {/* Header */}
        <div className="bg-[#1A3A5C] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-white/70 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#C9A84C] text-[#1A3A5C] mb-2">
            <Lock size={11} />
            Guichet Sécurisé NelsiusPay
          </div>

          <h2 className="text-xl font-bold text-white font-serif">{plan.name}</h2>
          <p className="text-xs text-white/70 mt-1">
            {plan.description || "Activez vos privilèges matrimoniaux exclusifs."}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* STEP 1: Formulaire de paiement */}
          {step === 'INPUT' && (
            <form onSubmit={handleStartPayment} className="space-y-6">
              {/* Récapitulatif montant */}
              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Montant total à régler
                  </span>
                  <span className="text-2xl font-extrabold text-[#1A3A5C] font-serif">
                    {formattedPrice}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    Validité
                  </span>
                  <span className="text-xs font-bold text-[#C9A84C]">
                    {plan.duration_days > 0 ? `${plan.duration_days} jours` : 'À vie'}
                  </span>
                </div>
              </div>

              {/* Modes de paiement NelsiusPay acceptés */}
              <div>
                <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-2.5">
                  Moyens de paiement acceptés via NelsiusPay
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] flex items-center gap-2 font-medium text-gray-700">
                    <Smartphone size={16} className="text-amber-500" />
                    <span>MTN Mobile Money</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] flex items-center gap-2 font-medium text-gray-700">
                    <Smartphone size={16} className="text-orange-500" />
                    <span>Orange Money</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] flex items-center gap-2 font-medium text-gray-700">
                    <Smartphone size={16} className="text-blue-500" />
                    <span>Wave Mobile</span>
                  </div>
                  <div className="p-3 rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] flex items-center gap-2 font-medium text-gray-700">
                    <CreditCard size={16} className="text-[#1A3A5C]" />
                    <span>Visa / Mastercard</span>
                  </div>
                </div>
              </div>

              {/* Numéro de téléphone Mobile Money */}
              {Number(plan.price) > 0 && (
                <div>
                  <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider mb-1.5">
                    Numéro de téléphone / Mobile Money
                  </label>
                  <p className="text-[11px] text-gray-500 mb-2">
                    Recevez directement la notification de confirmation sur votre téléphone.
                  </p>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+237 6XX XX XX XX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] text-xs font-semibold focus:outline-none focus:border-[#1A3A5C]"
                  />
                </div>
              )}

              {/* CTA button */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={isInitializing}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] text-white text-xs font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all"
                >
                  {isInitializing ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Connexion au guichet...
                    </>
                  ) : (
                    <>
                      Payer {formattedPrice}
                      <Lock size={13} className="text-[#C9A84C]" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: En attente de paiement sur NelsiusPay */}
          {step === 'PENDING_CHECKOUT' && (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 mx-auto flex items-center justify-center">
                <Loader2 size={32} className="animate-spin" />
              </div>

              <div>
                <h3 className="text-base font-bold text-[#1A3A5C]">
                  Session NelsiusPay Initialisée
                </h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1 leading-relaxed">
                  Veuillez valider le paiement sur votre application Mobile Money ou via la fenêtre sécurisée.
                </p>
                <div className="mt-3 inline-block px-3 py-1 rounded-md bg-gray-100 font-mono text-xs font-bold text-gray-700">
                  Réf : {paymentReference}
                </div>
              </div>

              {checkoutUrl && checkoutUrl.startsWith('http') && (
                <div>
                  <a
                    href={checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#C9A84C]/60 text-[#1A3A5C] text-xs font-bold hover:bg-[#FAF9F6]/80 transition-colors"
                  >
                    <ExternalLink size={14} className="text-[#C9A84C]" />
                    Rouvrir le guichet NelsiusPay
                  </a>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9] space-y-3">
                <p className="text-xs font-medium text-gray-600">
                  Une fois votre paiement effectué sur votre téléphone :
                </p>
                <button
                  type="button"
                  disabled={isVerifying}
                  onClick={handleConfirmVerification}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white font-bold text-xs shadow-md hover:shadow-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Vérification auprès de NelsiusPay...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 size={16} />
                      J'ai validé mon paiement • Activer mes privilèges
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Paiement Réussi */}
          {step === 'SUCCESS' && (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
                <CheckCircle2 size={36} />
              </div>
              <h3 className="text-xl font-bold text-[#1A3A5C] font-serif">
                Félicitations !
              </h3>
              <p className="text-xs text-gray-600 max-w-sm mx-auto leading-relaxed">
                Votre formule <strong className="text-[#1A3A5C]">{plan.name}</strong> a été activée avec succès. Vos privilèges matrimoniaux sont immédiatement débloqués.
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
