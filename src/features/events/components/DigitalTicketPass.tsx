import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { EventRegistration } from '../types/events';
import { 
  X, Printer, CheckCircle, ShieldCheck, MapPin, 
  Calendar, Clock, Sparkles, Download, AlertCircle 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DigitalTicketPassProps {
  registration: EventRegistration | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalTicketPass: React.FC<DigitalTicketPassProps> = ({
  registration,
  isOpen,
  onClose,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    if (registration?.qr_code_hash) {
      QRCode.toDataURL(registration.qr_code_hash, {
        width: 260,
        margin: 2,
        color: {
          dark: '#1A3A5C',
          light: '#FFFFFF',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error("Erreur génération QR code:", err));
    }
  }, [registration]);

  if (!isOpen || !registration) return null;

  const dateObj = new Date(registration.event_date);
  const formattedDate = dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:fixed">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-white rounded-3xl shadow-2xl border border-[#C9A84C]/40 w-full max-w-lg overflow-hidden my-6 print:shadow-none print:border-none print:w-full"
      >
        {/* Top Control Bar (Hidden on Print) */}
        <div className="bg-[#FAF9F6] px-6 py-3 border-b border-[#E8ECE9] flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2 text-xs font-bold text-[#1A3A5C]">
            <Sparkles size={14} className="text-[#C9A84C]" />
            Billet Officiel GSD Alliance
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 rounded-lg text-gray-600 hover:text-[#1A3A5C] hover:bg-white transition-colors"
              title="Imprimer / Enregistrer en PDF"
            >
              <Printer size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Boarding Pass Container */}
        <div className="p-6 sm:p-8 space-y-6">
          {/* Royal Header */}
          <div className="text-center relative pb-6 border-b border-dashed border-[#C9A84C]/40">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#1A3A5C] text-[#C9A84C] font-serif font-black text-xl mb-2 shadow-md border border-[#C9A84C]/40">
              GSD
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#C9A84C]">
              Pass d'Accès Officiel & Sécurisé
            </div>
            <h2 className="text-xl font-bold text-[#1A3A5C] mt-1 font-serif px-4">
              {registration.event_title}
            </h2>
          </div>

          {/* Guest & Tier Badge */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9]">
            <div className="text-center sm:text-left">
              <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Titulaire du Billet
              </span>
              <span className="text-base font-extrabold text-[#1A3A5C]">
                {registration.guest_name}
              </span>
              <span className="block text-xs text-gray-500 mt-0.5">
                {registration.guest_email}
              </span>
            </div>

            <div className="text-center sm:text-right">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-[#1A3A5C] text-[#C9A84C] border border-[#C9A84C]/50 shadow-sm inline-block">
                {registration.ticket_name}
              </span>
              <span className="block text-xs font-bold text-emerald-700 mt-1">
                {typeof registration.ticket_price === 'number'
                  ? `${registration.ticket_price.toLocaleString()} FCFA`
                  : `${parseInt(registration.ticket_price || '0', 10).toLocaleString()} FCFA`} • Confirmé
              </span>
            </div>
          </div>

          {/* Event Itinerary Details */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white border border-[#E8ECE9]">
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-bold mb-1">
                <Calendar size={12} className="text-[#C9A84C]" />
                Date & Heure
              </div>
              <div className="font-bold text-[#1A3A5C] capitalize">{formattedDate}</div>
              <div className="text-gray-500 text-[11px] font-medium">{formattedTime}</div>
            </div>

            <div className="p-3 rounded-xl bg-white border border-[#E8ECE9]">
              <div className="flex items-center gap-1.5 text-gray-400 text-[10px] uppercase font-bold mb-1">
                <MapPin size={12} className="text-[#C9A84C]" />
                Lieu & Ville
              </div>
              <div className="font-bold text-[#1A3A5C] truncate">{registration.event_location}</div>
              <div className="text-gray-500 text-[11px] font-medium">{registration.event_city}</div>
            </div>
          </div>

          {/* Dress Code Note */}
          {registration.dress_code && (
            <div className="p-3 rounded-xl bg-[#FAF9F6] border border-[#E8ECE9] text-xs text-gray-600 text-center">
              <span className="font-bold text-[#1A3A5C]">Dress Code Requis :</span> {registration.dress_code}
            </div>
          )}

          {/* QR Code Section */}
          <div className="text-center pt-2">
            <div className="inline-block p-4 rounded-3xl bg-white border-2 border-[#1A3A5C]/20 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code Billet"
                  className="w-48 h-48 mx-auto object-contain"
                />
              ) : (
                <div className="w-48 h-48 flex items-center justify-center text-xs text-gray-400">
                  Génération du QR Code...
                </div>
              )}
            </div>

            <div className="mt-3">
              <span className="font-mono text-xs font-bold text-[#1A3A5C] tracking-wider px-3 py-1 bg-gray-100 rounded-md">
                {registration.qr_code_hash}
              </span>
              <p className="text-[10px] text-gray-400 mt-2">
                Présentez ce QR Code aux hôtesses d'accueil à l'entrée du salon pour émargement.
              </p>
            </div>
          </div>

          {/* Check-in status tag */}
          <div className="text-center pt-2">
            {registration.is_checked_in ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">
                <CheckCircle size={13} className="text-gray-500" />
                Billet déjà émargé le {registration.checked_in_at ? new Date(registration.checked_in_at).toLocaleDateString('fr-FR') : ''}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ShieldCheck size={13} className="text-emerald-500" />
                Billet Valide • Non Émargé
              </span>
            )}
          </div>
        </div>

        {/* Footer Actions (Hidden on Print) */}
        <div className="p-4 bg-[#FCFBF9] border-t border-[#E8ECE9] flex items-center justify-between gap-3 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            Fermer
          </button>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            <Download size={14} className="text-[#C9A84C]" />
            Imprimer / Enregistrer PDF
          </button>
        </div>
      </motion.div>
    </div>
  );
};
