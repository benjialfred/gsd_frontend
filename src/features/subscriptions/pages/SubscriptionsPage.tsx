import React, { useState, useEffect } from 'react';
import type { SubscriptionPlan, UserSubscription } from '../types/subscriptions';
import { subscriptionService } from '../services/subscriptionService';
import { PlanPricingCard } from '../components/PlanPricingCard';
import { NelsiusCheckoutModal } from '../components/NelsiusCheckoutModal';
import { PaymentHistoryView } from '../components/PaymentHistoryView';
import { toast } from '../../../stores/useToastStore';
import { 
  Crown, Sparkles, Shield, Calendar, 
  Receipt, CheckCircle, AlertCircle, Loader2, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const SubscriptionsPage: React.FC = () => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [currentSub, setCurrentSub] = useState<UserSubscription | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'receipts'>('plans');

  // Modal de checkout
  const [selectedPlanForCheckout, setSelectedPlanForCheckout] = useState<SubscriptionPlan | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [plansData, subData] = await Promise.all([
        subscriptionService.getPlans(),
        subscriptionService.getMySubscription(),
      ]);
      setPlans(plansData);
      setCurrentSub(subData);
    } catch (err: any) {
      console.error("Erreur chargement abonnements:", err);
      toast.error("Impossible de charger les formules d'abonnement.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCheckoutSuccess = async () => {
    await fetchData();
  };

  const handleCancelAutoRenew = async () => {
    if (!window.confirm("Voulez-vous désactiver le renouvellement automatique ? Vos privilèges resteront actifs jusqu'à la fin de la période en cours.")) return;
    try {
      await subscriptionService.cancelAutoRenew();
      toast.success("Renouvellement automatique désactivé.");
      await fetchData();
    } catch (err: any) {
      toast.error("Impossible de modifier le renouvellement.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1A3A5C] via-[#244A72] to-[#1A3A5C] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-[#C9A84C]/30">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#FAF9F6] text-xs font-bold uppercase tracking-wider mb-4">
            <Crown size={14} className="text-[#C9A84C]" />
            Alliance & Engagement Sanctifié
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-serif">
            Abonnements & Privilèges Matrimoniaux
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
            Investir dans sa démarche de mariage est un filtre d'intentionnalité majeur. Débloquez les appels sécurisés, les likes illimités, l'accès complet à l'Académie et les réductions sur les événements et le coaching pastoral.
          </p>
        </div>
      </div>

      {/* Active Subscription Status Banner */}
      {currentSub && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8ECE9] shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C] text-[#C9A84C] flex items-center justify-center font-bold text-xl border border-[#C9A84C]/40 shrink-0 shadow-sm">
              {currentSub.plan.code === 'AMBASSADOR' ? (
                <Crown size={28} />
              ) : currentSub.plan.code === 'ALLIANCE' ? (
                <Sparkles size={28} />
              ) : (
                <Shield size={28} className="text-gray-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Votre Statut Actuel
                </span>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200">
                  {currentSub.status === 'ACTIVE' ? 'Actif' : 'Expiré'}
                </span>
              </div>
              <h2 className="text-xl font-bold text-[#1A3A5C] font-serif mt-0.5">
                {currentSub.plan.name}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {currentSub.end_date ? (
                  <>
                    Valide jusqu'au{' '}
                    <strong>
                      {new Date(currentSub.end_date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </strong>{' '}
                    ({currentSub.days_remaining} jours restants)
                  </>
                ) : (
                  "Formule permanente découverte"
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentSub.plan.code !== 'FREE' && currentSub.auto_renew && (
              <button
                onClick={handleCancelAutoRenew}
                className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold transition-colors"
              >
                Gérer le renouvellement
              </button>
            )}
            <button
              onClick={() => setActiveTab('receipts')}
              className="px-4 py-2.5 rounded-xl bg-[#FAF9F6] border border-[#E8ECE9] hover:border-[#C9A84C]/40 text-[#1A3A5C] text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Receipt size={14} className="text-[#C9A84C]" />
              Historique des reçus
            </button>
          </div>
        </div>
      )}

      {/* Tabs Selector */}
      <div className="flex items-center justify-between border-b border-[#E8ECE9] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('plans')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'plans'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Crown size={16} />
            Formules d'Abonnement
          </button>
          <button
            onClick={() => setActiveTab('receipts')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'receipts'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Receipt size={16} />
            Reçus & Transactions NelsiusPay
          </button>
        </div>
      </div>

      {/* TAB 1: FORMULES D'ABONNEMENT */}
      {activeTab === 'plans' && (
        <div className="space-y-12">
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 size={32} className="animate-spin text-[#1A3A5C]" />
              <span className="text-xs font-medium">Chargement des formules officielles...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
              {plans.map((plan) => (
                <PlanPricingCard
                  key={plan.id}
                  plan={plan}
                  currentSubscription={currentSub}
                  onSelect={(p) => setSelectedPlanForCheckout(p)}
                />
              ))}
            </div>
          )}

          {/* Reassurance & Value Arguments */}
          <div className="bg-[#FAF9F6] rounded-3xl p-8 border border-[#E8ECE9] space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <h3 className="text-lg font-bold text-[#1A3A5C] font-serif">
                Pourquoi la formule Premium fait toute la différence ?
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                Rejoignez les membres engagés et bénéficiez d'une suite complète pour préparer votre futur foyer dans la sainteté et la sérénité.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-4">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8ECE9] text-[#1A3A5C] flex items-center justify-center font-bold">
                  1
                </div>
                <h4 className="text-xs font-bold text-[#1A3A5C]">Sceau de Sérieux Matrimonial</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Votre badge doré prouve que vous investissez avec sérieux dans votre projet de mariage chrétien.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8ECE9] text-[#1A3A5C] flex items-center justify-center font-bold">
                  2
                </div>
                <h4 className="text-xs font-bold text-[#1A3A5C]">Appels & Visio Sécurisés</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Échangez en audio ou visio directement dans GSD sans divulguer votre numéro WhatsApp personnel.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8ECE9] text-[#1A3A5C] flex items-center justify-center font-bold">
                  3
                </div>
                <h4 className="text-xs font-bold text-[#1A3A5C]">Académie & Masterclasses</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Suivez toutes les formations des formateurs agréés et recevez votre Certificat d'Achèvement GSD.
                </p>
              </div>

              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#E8ECE9] text-[#1A3A5C] flex items-center justify-center font-bold">
                  4
                </div>
                <h4 className="text-xs font-bold text-[#1A3A5C]">Remises Galas & Coaching</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Économisez jusqu'à 25% sur les séances de conseil pastoral et vos billets pour les Grands Galas annuels.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HISTORIQUE DES REÇUS */}
      {activeTab === 'receipts' && (
        <PaymentHistoryView />
      )}

      {/* Checkout Modal */}
      <NelsiusCheckoutModal
        plan={selectedPlanForCheckout}
        isOpen={Boolean(selectedPlanForCheckout)}
        onClose={() => setSelectedPlanForCheckout(null)}
        onSuccess={handleCheckoutSuccess}
      />
    </div>
  );
};
