import React from 'react';
import type { SubscriptionPlan, UserSubscription } from '../types/subscriptions';
import { 
  Check, Sparkles, Crown, Shield, ArrowRight, 
  HeartHandshake, Lock, PhoneCall, Video 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface PlanPricingCardProps {
  plan: SubscriptionPlan;
  currentSubscription: UserSubscription | null;
  onSelect: (plan: SubscriptionPlan) => void;
}

export const PlanPricingCard: React.FC<PlanPricingCardProps> = ({
  plan,
  currentSubscription,
  onSelect,
}) => {
  const isCurrentPlan = currentSubscription?.plan?.code === plan.code && currentSubscription?.is_valid;
  const isFeatured = plan.is_featured;

  const formattedPrice = typeof plan.price === 'number'
    ? `${plan.price.toLocaleString()} FCFA`
    : `${parseInt(plan.price || '0', 10).toLocaleString()} FCFA`;

  const getCycleLabel = () => {
    switch (plan.code) {
      case 'FREE':
        return 'Gratuit à vie';
      case 'ALLIANCE':
        return 'par mois (30 jours)';
      case 'AMBASSADOR':
        return 'par an (365 jours)';
      default:
        return 'par cycle';
    }
  };

  const getIcon = () => {
    if (plan.code === 'AMBASSADOR') return <Crown size={22} className="text-[#C9A84C]" />;
    if (plan.code === 'ALLIANCE') return <Sparkles size={22} className="text-[#C9A84C]" />;
    return <Shield size={22} className="text-gray-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      className={`rounded-3xl border flex flex-col justify-between overflow-hidden transition-all relative ${
        isFeatured
          ? 'bg-gradient-to-b from-[#1A3A5C] via-[#1E4369] to-[#152F4A] text-white border-[#C9A84C]/60 shadow-[0_12px_40px_rgba(26,58,92,0.2)] ring-2 ring-[#C9A84C]/40'
          : 'bg-white text-gray-900 border-[#E8ECE9] shadow-[0_4px_24px_rgba(26,58,92,0.04)] hover:shadow-[0_10px_32px_rgba(26,58,92,0.08)]'
      }`}
    >
      {/* Featured Ribbon */}
      {isFeatured && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-[#C9A84C] to-[#E5C77A] text-[#1A3A5C] text-[10px] font-extrabold uppercase tracking-widest px-4 py-1 rounded-bl-2xl shadow-md">
            Recommandé pour le Mariage
          </div>
        </div>
      )}

      {/* Card Header */}
      <div className="p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
              isFeatured
                ? 'bg-white/10 border-[#C9A84C]/40 text-[#C9A84C]'
                : 'bg-[#FAF9F6] border-[#E8ECE9] text-[#1A3A5C]'
            }`}
          >
            {getIcon()}
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif leading-tight">{plan.name}</h3>
            <span
              className={`text-[11px] font-semibold uppercase tracking-wider ${
                isFeatured ? 'text-[#C9A84C]' : 'text-gray-400'
              }`}
            >
              {plan.badge_name}
            </span>
          </div>
        </div>

        {/* Price display */}
        <div className="mb-4">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight font-serif">
              {formattedPrice}
            </span>
          </div>
          <p className={`text-xs mt-1 ${isFeatured ? 'text-white/70' : 'text-gray-500'}`}>
            {getCycleLabel()}
          </p>
        </div>

        <p className={`text-xs leading-relaxed mb-6 ${isFeatured ? 'text-white/80' : 'text-gray-600'}`}>
          {plan.description}
        </p>

        {/* Features Checklist */}
        <div className="space-y-3 pt-4 border-t border-dashed border-gray-200/20">
          <span className={`text-[11px] font-bold uppercase tracking-wider block ${isFeatured ? 'text-[#C9A84C]' : 'text-[#1A3A5C]'}`}>
            Privilèges inclus :
          </span>

          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs">
                <div
                  className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isFeatured
                      ? 'bg-[#C9A84C] text-[#1A3A5C]'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  <Check size={11} strokeWidth={3} />
                </div>
                <span className={isFeatured ? 'text-white/90' : 'text-gray-700'}>
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Card Action Footer */}
      <div className={`p-6 pt-4 border-t ${isFeatured ? 'border-white/10 bg-white/5' : 'border-[#E8ECE9] bg-[#FCFBF9]'}`}>
        {isCurrentPlan ? (
          <div className="w-full py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 font-bold text-xs text-center flex items-center justify-center gap-1.5">
            <Check size={14} />
            Votre Formule Actuelle
          </div>
        ) : (
          <button
            onClick={() => onSelect(plan)}
            className={`w-full py-3.5 rounded-2xl font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95 ${
              isFeatured
                ? 'bg-gradient-to-r from-[#C9A84C] to-[#E5C77A] text-[#1A3A5C] hover:brightness-105'
                : 'bg-[#1A3A5C] text-white hover:bg-[#132A42]'
            }`}
          >
            {plan.code === 'FREE' ? "Sélectionner Gratuit" : "Souscrire via NelsiusPay"}
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
};
