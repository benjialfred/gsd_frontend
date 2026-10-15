import React, { useState } from 'react';
import { eventsService } from '../services/eventsService';
import type { CheckInResult } from '../types/events';
import { toast } from '../../../stores/useToastStore';
import { 
  QrCode, CheckCircle2, AlertTriangle, XCircle, 
  Search, Loader2, Users, ShieldCheck, Clock 
} from 'lucide-react';
import { motion } from 'framer-motion';

export const EventCheckInScanner: React.FC = () => {
  const [qrInput, setQrInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<CheckInResult | null>(null);
  const [recentScans, setRecentScans] = useState<CheckInResult[]>([]);

  const handleScanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = qrInput.trim();
    if (!code) return;

    setLoading(true);
    setScanResult(null);

    try {
      const res = await eventsService.checkInTicket(code);
      setScanResult(res);
      setRecentScans((prev) => [res, ...prev.slice(0, 9)]);
      toast.success(res.message || "Accès validé !");
      setQrInput('');
    } catch (err: any) {
      const errorData = err.response?.data;
      const failedResult: CheckInResult = {
        valid: false,
        already_scanned: errorData?.already_scanned || false,
        error: errorData?.error || "Code invalide ou introuvable.",
        guest_name: errorData?.guest_name,
        ticket_name: errorData?.ticket_name,
        event_title: errorData?.event_title,
      };
      setScanResult(failedResult);
      setRecentScans((prev) => [failedResult, ...prev.slice(0, 9)]);
      toast.error(failedResult.error || "Billet non valide.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title & Info */}
      <div className="text-center space-y-1.5">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#1A3A5C] text-[#C9A84C] border border-[#C9A84C]/40">
          <ShieldCheck size={14} />
          Terminal d'Accueil & Contrôle d'Accès
        </div>
        <h2 className="text-2xl font-bold text-[#1A3A5C] font-serif">
          Poste d'Émargement des Billets
        </h2>
        <p className="text-xs text-gray-500 max-w-md mx-auto">
          Scannez le QR Code du participant ou collez son identifiant unique pour vérifier et valider l'entrée au salon d'honneur.
        </p>
      </div>

      {/* Input Scanner Form */}
      <form onSubmit={handleScanSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E8ECE9] shadow-sm space-y-4">
        <label className="block text-xs font-bold text-[#1A3A5C] uppercase tracking-wider">
          Code QR / Identifiant Billet
        </label>

        <div className="relative">
          <QrCode size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            autoFocus
            value={qrInput}
            onChange={(e) => setQrInput(e.target.value)}
            placeholder="Ex: GSD-EVT-1-A1B2C3D4E5F6"
            className="w-full pl-12 pr-28 py-3.5 text-sm font-mono font-semibold rounded-2xl border-2 border-[#E8ECE9] focus:outline-none focus:border-[#1A3A5C] bg-[#FAF9F6] text-gray-800"
          />
          <button
            type="submit"
            disabled={loading || !qrInput.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-[#1A3A5C] hover:bg-[#132A42] text-[#C9A84C] font-bold text-xs rounded-xl shadow transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : "Vérifier"}
          </button>
        </div>

        <p className="text-[11px] text-gray-400">
          Compatible avec les douchettes / scanners de code-barres USB ou saisie manuelle.
        </p>
      </form>

      {/* Real-time Scan Result Card */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`p-6 rounded-3xl border text-center space-y-2 shadow-lg ${
            scanResult.valid
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
              : scanResult.already_scanned
              ? 'bg-amber-50 border-amber-300 text-amber-900'
              : 'bg-rose-50 border-rose-300 text-rose-900'
          }`}
        >
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-white shadow-md mb-2">
            {scanResult.valid ? (
              <div className="w-full h-full bg-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
            ) : scanResult.already_scanned ? (
              <div className="w-full h-full bg-amber-500 rounded-2xl flex items-center justify-center">
                <AlertTriangle size={32} />
              </div>
            ) : (
              <div className="w-full h-full bg-rose-600 rounded-2xl flex items-center justify-center">
                <XCircle size={32} />
              </div>
            )}
          </div>

          <h3 className="text-xl font-black uppercase tracking-wide">
            {scanResult.valid
              ? "Accès Autorisé"
              : scanResult.already_scanned
              ? "Billet Déjà Émargé !"
              : "Accès Refusé"}
          </h3>

          <p className="text-sm font-semibold max-w-md mx-auto">
            {scanResult.valid
              ? scanResult.message
              : scanResult.error}
          </p>

          {scanResult.guest_name && (
            <div className="pt-2 text-xs border-t border-black/10 mt-3 flex items-center justify-center gap-4">
              <span>Invité : <strong>{scanResult.guest_name}</strong></span>
              {scanResult.ticket_name && <span>Catégorie : <strong>{scanResult.ticket_name}</strong></span>}
            </div>
          )}
        </motion.div>
      )}

      {/* Recent Scans Log */}
      {recentScans.length > 0 && (
        <div className="bg-white p-6 rounded-3xl border border-[#E8ECE9] shadow-sm space-y-3">
          <h4 className="text-xs font-bold text-[#1A3A5C] uppercase tracking-wider flex items-center gap-1.5">
            <Clock size={13} className="text-[#C9A84C]" />
            Derniers émargements de la session
          </h4>

          <div className="divide-y divide-gray-100">
            {recentScans.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      item.valid ? 'bg-emerald-500' : item.already_scanned ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                  />
                  <span className="font-bold text-gray-800">
                    {item.guest_name || 'Code inconnu'}
                  </span>
                  {item.ticket_name && (
                    <span className="text-gray-400 text-[11px]">({item.ticket_name})</span>
                  )}
                </div>

                <span
                  className={`text-[11px] font-bold ${
                    item.valid ? 'text-emerald-600' : item.already_scanned ? 'text-amber-600' : 'text-rose-600'
                  }`}
                >
                  {item.valid ? 'Autorisé' : item.already_scanned ? 'Déjà Scanné' : 'Rejeté'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
