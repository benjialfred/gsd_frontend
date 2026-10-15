import React, { useState, useEffect } from 'react';
import type { PaymentTransaction } from '../types/subscriptions';
import { subscriptionService } from '../services/subscriptionService';
import { toast } from '../../../stores/useToastStore';
import { 
  Receipt, Calendar, Clock, CheckCircle, 
  XCircle, AlertCircle, Loader2, ArrowRight 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const PaymentHistoryView: React.FC = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const data = await subscriptionService.getMyPaymentHistory();
      setTransactions(data);
    } catch (err: any) {
      console.error("Erreur historique paiements:", err);
      toast.error("Impossible de récupérer l'historique des paiements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
            <CheckCircle size={11} className="text-emerald-500" />
            Payé avec succès
          </span>
        );
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
            <Clock size={11} className="text-amber-500" />
            En attente
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-[10px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
            <XCircle size={11} className="text-rose-500" />
            Échoué / Annulé
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-base font-bold text-[#1A3A5C]">Historique des Paiements & Reçus</h3>
        <p className="text-xs text-gray-400">Toutes vos transactions sécurisées traitées par NelsiusPay</p>
      </div>

      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 size={28} className="animate-spin text-[#1A3A5C]" />
          <span className="text-xs font-medium">Chargement de vos reçus...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border border-[#E8ECE9] shadow-sm max-w-md mx-auto my-6">
          <div className="w-14 h-14 rounded-2xl bg-[#FAF9F6] border border-[#C9A84C]/30 text-[#1A3A5C] mx-auto flex items-center justify-center mb-3">
            <Receipt size={28} className="text-[#C9A84C]" />
          </div>
          <h4 className="text-sm font-bold text-[#1A3A5C] mb-1">Aucune transaction enregistrée</h4>
          <p className="text-xs text-gray-400">Vos prochains reçus et abonnements s'afficheront ici.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {transactions.map((tx) => {
            const dateObj = new Date(tx.created_at);
            const dateStr = dateObj.toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const timeStr = dateObj.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const formattedAmount = typeof tx.amount === 'number'
              ? `${tx.amount.toLocaleString()} FCFA`
              : `${parseInt(tx.amount || '0', 10).toLocaleString()} FCFA`;

            return (
              <div
                key={tx.id}
                className="bg-white p-4 rounded-2xl border border-[#E8ECE9] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm hover:border-[#C9A84C]/40 transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8ECE9] flex items-center justify-center text-[#1A3A5C] shrink-0">
                    <Receipt size={18} className="text-[#C9A84C]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#1A3A5C]">{tx.purpose_display}</span>
                      <span className="font-mono text-[10px] text-gray-400">#{tx.reference}</span>
                    </div>
                    <div className="text-[11px] text-gray-500 mt-0.5">
                      {dateStr} à {timeStr} • Passerelle : <strong>NelsiusPay</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-gray-100">
                  <div className="text-sm font-extrabold text-[#1A3A5C]">
                    {formattedAmount}
                  </div>
                  {getStatusBadge(tx.status)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
