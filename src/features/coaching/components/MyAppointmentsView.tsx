import React, { useState, useEffect } from 'react';
import type { Appointment } from '../types/coaching';
import { coachingService } from '../services/coachingService';
import { toast } from '../../../stores/useToastStore';
import { 
  Calendar, Clock, Video, AlertCircle, CheckCircle, 
  XCircle, Loader2, ArrowRight, ShieldCheck, HeartHandshake, MessageSquare
} from 'lucide-react';
import { motion } from 'framer-motion';

interface MyAppointmentsViewProps {
  onGoToDirectory: () => void;
}

export const MyAppointmentsView: React.FC<MyAppointmentsViewProps> = ({ onGoToDirectory }) => {
  const [scope, setScope] = useState<'upcoming' | 'past'>('upcoming');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const data = await coachingService.getMyAppointments(scope, false);
      setAppointments(data);
    } catch (err: any) {
      console.error("Erreur séances:", err);
      toast.error("Impossible de charger vos rendez-vous.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [scope]);

  const handleCancelAppointment = async (apptId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler ce rendez-vous pastoral ?")) return;

    setActionLoadingId(apptId);
    try {
      await coachingService.updateAppointmentStatus(apptId, 'CANCELLED');
      toast.success("Rendez-vous annulé.");
      await fetchAppointments();
    } catch (err: any) {
      console.error("Erreur annulation:", err);
      toast.error("Impossible d'annuler ce rendez-vous.");
    } finally {
      setActionLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 flex items-center gap-1.5">
            <Clock size={12} className="text-amber-500" />
            En attente de confirmation
          </span>
        );
      case 'CONFIRMED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 flex items-center gap-1.5">
            <CheckCircle size={12} className="text-emerald-500" />
            Séance Confirmée
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-100 text-gray-700 border border-gray-200 flex items-center gap-1.5">
            <ShieldCheck size={12} className="text-gray-500" />
            Séance Accomplie
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 flex items-center gap-1.5">
            <XCircle size={12} className="text-rose-500" />
            Annulé
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Scope Selector */}
      <div className="flex items-center justify-between border-b border-[#E8ECE9] pb-4">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setScope('upcoming')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              scope === 'upcoming'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 bg-white border border-[#E8ECE9]'
            }`}
          >
            Séances à venir
          </button>
          <button
            onClick={() => setScope('past')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              scope === 'past'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 bg-white border border-[#E8ECE9]'
            }`}
          >
            Historique & Passées
          </button>
        </div>

        <button
          onClick={onGoToDirectory}
          className="text-xs font-bold text-[#1A3A5C] hover:text-[#C9A84C] flex items-center gap-1.5 transition-colors"
        >
          Réserver une nouvelle séance
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="py-16 flex flex-col items-center justify-center text-gray-400 gap-3">
          <Loader2 size={28} className="animate-spin text-[#1A3A5C]" />
          <span className="text-xs font-medium">Chargement de vos séances pastorales...</span>
        </div>
      ) : appointments.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#E8ECE9] shadow-sm max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FAF9F6] border border-[#C9A84C]/30 text-[#1A3A5C] mx-auto flex items-center justify-center mb-4">
            <HeartHandshake size={32} className="text-[#C9A84C]" />
          </div>
          <h3 className="text-lg font-bold text-[#1A3A5C] mb-2">
            {scope === 'upcoming' ? "Aucune séance à venir" : "Aucun historique de rendez-vous"}
          </h3>
          <p className="text-xs text-gray-500 mb-6 leading-relaxed">
            Bénéficiez d'une écoute bienveillante, de conseils fondés sur les Écritures et d'un accompagnement personnalisé pour votre futur mariage.
          </p>
          <button
            onClick={onGoToDirectory}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#1A3A5C] to-[#244A72] text-white text-xs font-bold shadow-md hover:shadow-lg transition-all"
          >
            Découvrir les Conseillers Pastoraux
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {appointments.map((appt) => {
            const dateObj = new Date(appt.appointment_date);
            const dateFormatted = dateObj.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const timeFormatted = dateObj.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            return (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl border border-[#E8ECE9] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#1A3A5C] text-white flex items-center justify-center font-bold overflow-hidden border border-[#C9A84C]/40 shrink-0">
                        {appt.coach_avatar ? (
                          <img
                            src={appt.coach_avatar}
                            alt={appt.coach_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span>{appt.coach_name?.charAt(0) || 'P'}</span>
                        )}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-[#1A3A5C]">{appt.coach_name}</h4>
                        <p className="text-xs text-gray-500">{appt.coach_title}</p>
                      </div>
                    </div>
                    {getStatusBadge(appt.status)}
                  </div>

                  {/* Details */}
                  <div className="space-y-2.5 p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8ECE9] mb-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                      <Calendar size={14} className="text-[#C9A84C] shrink-0" />
                      <span className="capitalize">{dateFormatted}</span> à <span className="font-bold text-[#1A3A5C]">{timeFormatted}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      <HeartHandshake size={14} className="text-[#1A3A5C] shrink-0" />
                      <span>{appt.session_type_display} ({appt.duration_minutes} min)</span>
                    </div>
                  </div>

                  {/* User Note */}
                  {appt.user_notes && (
                    <div className="text-xs text-gray-500 bg-white p-3 rounded-xl border border-dashed border-[#E8ECE9] mb-4">
                      <span className="font-bold text-[#1A3A5C] block mb-0.5 text-[11px] uppercase tracking-wider">
                        Votre note pastorale :
                      </span>
                      <p className="line-clamp-2 italic text-gray-600">"{appt.user_notes}"</p>
                    </div>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="pt-3 border-t border-[#E8ECE9] flex items-center justify-between gap-2">
                  {appt.status === 'CONFIRMED' && appt.meeting_link ? (
                    <a
                      href={appt.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white text-xs font-bold shadow-sm transition-all"
                    >
                      <Video size={14} />
                      Rejoindre la visio pastorale
                    </a>
                  ) : (
                    <div className="text-[11px] text-gray-400">
                      {appt.status === 'PENDING' ? "Lien visio transmis dès validation" : ""}
                    </div>
                  )}

                  {(appt.status === 'PENDING' || appt.status === 'CONFIRMED') && (
                    <button
                      onClick={() => handleCancelAppointment(appt.id)}
                      disabled={actionLoadingId === appt.id}
                      className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50"
                    >
                      {actionLoadingId === appt.id ? "Annulation..." : "Annuler"}
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
