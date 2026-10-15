import React, { useState, useEffect } from 'react';
import type { EventRegistration } from '../types/events';
import { eventsService } from '../services/eventsService';
import { DigitalTicketPass } from './DigitalTicketPass';
import { toast } from '../../../stores/useToastStore';
import { 
  Ticket, Calendar, MapPin, QrCode, ShieldCheck, 
  CheckCircle, ArrowRight, Loader2, Sparkles 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MyTicketsViewProps {
  onGoToEvents: () => void;
}

export const MyTicketsView: React.FC<MyTicketsViewProps> = ({ onGoToEvents }) => {
  const [tickets, setTickets] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTicket, setSelectedTicket] = useState<EventRegistration | null>(null);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await eventsService.getMyTickets();
      setTickets(data);
    } catch (err: any) {
      console.error("Erreur chargement billets:", err);
      toast.error("Impossible de récupérer vos billets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E8ECE9] pb-4">
        <div>
          <h2 className="text-base font-bold text-[#1A3A5C]">Mes Billets & Pass d'Accès</h2>
          <p className="text-xs text-gray-400">Présentez vos QR Codes aux hôtesses le jour de l'événement</p>
        </div>

        <button
          onClick={onGoToEvents}
          className="text-xs font-bold text-[#1A3A5C] hover:text-[#C9A84C] flex items-center gap-1.5 transition-colors"
        >
          Découvrir d'autres galas
          <ArrowRight size={14} />
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 size={32} className="animate-spin text-[#1A3A5C]" />
          <span className="text-xs font-medium">Chargement de vos pass sécurisés...</span>
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8ECE9] shadow-sm max-w-md mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF9F6] border border-[#C9A84C]/30 text-[#1A3A5C] mx-auto flex items-center justify-center mb-4">
            <Ticket size={32} className="text-[#C9A84C]" />
          </div>
          <h3 className="text-lg font-bold text-[#1A3A5C] mb-2">Aucun billet réservé</h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Participez aux galas d'honneur, sommets internationaux et retraites de célibataires chrétiens.
          </p>
          <button
            onClick={onGoToEvents}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            Explorer les Événements & Galas
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((t) => {
            const dateObj = new Date(t.event_date);
            const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });
            const timeFormatted = dateObj.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-[#E8ECE9] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase bg-[#1A3A5C] text-[#C9A84C] border border-[#C9A84C]/40">
                      {t.ticket_name}
                    </span>

                    {t.is_checked_in ? (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-gray-100 text-gray-600 border border-gray-300 flex items-center gap-1">
                        <CheckCircle size={11} className="text-gray-500" />
                        Émargé à l'entrée
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                        <ShieldCheck size={11} className="text-emerald-500" />
                        Billet Valide
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#1A3A5C] mb-2 line-clamp-2">
                    {t.event_title}
                  </h3>

                  <div className="space-y-1.5 p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9] text-xs text-gray-600 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar size={13} className="text-[#C9A84C] shrink-0" />
                      <span className="capitalize">{dateFormatted}</span> à <span className="font-bold text-[#1A3A5C]">{timeFormatted}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-[#1A3A5C] shrink-0" />
                      <span>{t.event_location} ({t.event_city})</span>
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center justify-between px-1">
                    <span>Titulaire : <strong className="text-gray-800">{t.guest_name}</strong></span>
                    <span className="font-mono text-[11px] text-gray-400">Ref: #{t.id}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E8ECE9] mt-4 flex items-center justify-between">
                  <div className="text-xs font-bold text-gray-700">
                    {typeof t.ticket_price === 'number'
                      ? `${t.ticket_price.toLocaleString()} FCFA`
                      : `${parseInt(t.ticket_price || '0', 10).toLocaleString()} FCFA`}
                  </div>

                  <button
                    onClick={() => setSelectedTicket(t)}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] text-white text-xs font-bold shadow-sm hover:shadow transition-all"
                  >
                    <QrCode size={14} className="text-[#C9A84C]" />
                    Afficher le Pass & QR
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Digital Ticket Modal */}
      <DigitalTicketPass
        registration={selectedTicket}
        isOpen={Boolean(selectedTicket)}
        onClose={() => setSelectedTicket(null)}
      />
    </div>
  );
};
