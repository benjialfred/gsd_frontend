import React, { useState, useEffect } from 'react';
import type { 
  CoachProfile, 
  Appointment, 
  CoachStats, 
  AvailabilitySlot, 
  AppointmentStatus 
} from '../types/coaching';
import { coachingService } from '../services/coachingService';
import { toast } from '../../../stores/useToastStore';
import { 
  Users, Calendar, Clock, DollarSign, Star, CheckCircle, 
  XCircle, Video, FileText, Plus, Trash2, Edit3, Loader2, Save 
} from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS_OF_WEEK = [
  { id: 0, label: 'Lundi' },
  { id: 1, label: 'Mardi' },
  { id: 2, label: 'Mercredi' },
  { id: 3, label: 'Jeudi' },
  { id: 4, label: 'Vendredi' },
  { id: 5, label: 'Samedi' },
  { id: 6, label: 'Dimanche' },
];

export const CoachDashboard: React.FC = () => {
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [stats, setStats] = useState<CoachStats | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filtre statut rendez-vous
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Gestion des notes pastorales
  const [editingNotesApptId, setEditingNotesApptId] = useState<number | null>(null);
  const [pastoralNotesDraft, setPastoralNotesDraft] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState<boolean>(false);

  // Gestion de la confirmation de séance avec lien visio
  const [confirmingAppt, setConfirmingAppt] = useState<Appointment | null>(null);
  const [meetingLinkInput, setMeetingLinkInput] = useState<string>('');

  // Gestion de l'ajout de créneau
  const [showAddSlot, setShowAddSlot] = useState<boolean>(false);
  const [newSlotDay, setNewSlotDay] = useState<number>(0);
  const [newSlotStart, setNewSlotStart] = useState<string>('14:00');
  const [newSlotEnd, setNewSlotEnd] = useState<string>('15:00');
  const [creatingSlot, setCreatingSlot] = useState<boolean>(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [profileData, statsData, apptsData, slotsData] = await Promise.all([
        coachingService.getMyCoachProfile(),
        coachingService.getCoachStats(),
        coachingService.getMyAppointments('all', true),
        coachingService.getMyAvailabilitySlots(),
      ]);

      setProfile(profileData);
      setStats(statsData);
      setAppointments(apptsData);
      setSlots(slotsData);
    } catch (err: any) {
      console.error("Erreur dashboard coach:", err);
      toast.error("Impossible de charger l'espace conseiller.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Action Statut
  const handleUpdateStatus = async (apptId: number, status: AppointmentStatus, link?: string) => {
    try {
      await coachingService.updateAppointmentStatus(apptId, status, link);
      toast.success(
        status === 'CONFIRMED'
          ? "Rendez-vous confirmé !"
          : status === 'COMPLETED'
          ? "Séance marquée comme accomplie !"
          : "Statut mis à jour."
      );
      setConfirmingAppt(null);
      await fetchData();
    } catch (err: any) {
      console.error("Erreur statut:", err);
      toast.error("Échec de la mise à jour du rendez-vous.");
    }
  };

  // Enregistrement des notes pastorales
  const handleSavePastoralNotes = async (apptId: number) => {
    setSavingNotes(true);
    try {
      await coachingService.savePastoralNotes(apptId, pastoralNotesDraft);
      toast.success("Notes pastorales confidentielles enregistrées.");
      setEditingNotesApptId(null);
      await fetchData();
    } catch (err: any) {
      console.error("Erreur enregistrement notes:", err);
      toast.error("Erreur lors de l'enregistrement des notes.");
    } finally {
      setSavingNotes(false);
    }
  };

  // Création créneau
  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingSlot(true);
    try {
      await coachingService.createAvailabilitySlot({
        day_of_week: newSlotDay,
        start_time: newSlotStart,
        end_time: newSlotEnd,
        is_active: true,
      });
      toast.success("Nouveau créneau ajouté avec succès !");
      setShowAddSlot(false);
      const updatedSlots = await coachingService.getMyAvailabilitySlots();
      setSlots(updatedSlots);
    } catch (err: any) {
      console.error("Erreur ajout créneau:", err);
      toast.error("Erreur lors de l'ajout du créneau.");
    } finally {
      setCreatingSlot(false);
    }
  };

  // Suppression créneau
  const handleDeleteSlot = async (slotId: number) => {
    if (!window.confirm("Supprimer ce créneau d'accueil ?")) return;
    try {
      await coachingService.deleteAvailabilitySlot(slotId);
      toast.success("Créneau supprimé.");
      setSlots((prev) => prev.filter((s) => s.id !== slotId));
    } catch (err: any) {
      console.error("Erreur suppression créneau:", err);
      toast.error("Impossible de supprimer le créneau.");
    }
  };

  const filteredAppointments = appointments.filter((appt) => {
    if (statusFilter === 'ALL') return true;
    return appt.status === statusFilter;
  });

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
        <Loader2 size={32} className="animate-spin text-[#1A3A5C]" />
        <span className="text-xs font-semibold">Chargement de votre bureau pastoral...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-gradient-to-r from-[#1A3A5C] via-[#244A72] to-[#1A3A5C] rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-[#C9A84C]/30 relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden border-2 border-[#C9A84C]/50 flex items-center justify-center font-bold text-2xl shrink-0">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <span>{profile?.full_name?.charAt(0) || 'P'}</span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-white">{profile?.full_name}</h1>
                <span className="px-2.5 py-0.5 text-[10px] font-extrabold uppercase bg-[#C9A84C] text-[#1A3A5C] rounded-full shadow-sm">
                  Certifié Pasteur & Conseiller
                </span>
              </div>
              <p className="text-xs text-white/80 font-medium mb-1">{profile?.title}</p>
              <div className="text-xs text-white/60 flex items-center gap-3">
                <span>Dénomination : <strong className="text-white">{profile?.denomination}</strong></span>
                <span>•</span>
                <span>Tarif séance : <strong className="text-[#C9A84C]">{typeof profile?.hourly_rate === 'number' ? profile.hourly_rate.toLocaleString() : profile?.hourly_rate} FCFA</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8ECE9] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-[#1A3A5C]">
            <Calendar size={22} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Séances à venir</div>
            <div className="text-xl font-extrabold text-[#1A3A5C]">{stats?.upcoming_sessions || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8ECE9] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600">
            <CheckCircle size={22} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Séances accomplies</div>
            <div className="text-xl font-extrabold text-[#1A3A5C]">{stats?.completed_sessions || 0}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8ECE9] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <DollarSign size={22} />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Honoraires générés</div>
            <div className="text-xl font-extrabold text-[#1A3A5C]">
              {(stats?.total_earnings_fcfa || 0).toLocaleString()} <span className="text-xs font-normal text-gray-400">FCFA</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8ECE9] shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-50 text-amber-500">
            <Star size={22} className="fill-amber-400" />
          </div>
          <div>
            <div className="text-xs font-medium text-gray-500">Avis & Évaluation</div>
            <div className="text-xl font-extrabold text-[#1A3A5C]">
              {stats?.rating ? Number(stats.rating).toFixed(1) : '5.0'} <span className="text-xs font-normal text-gray-400">({stats?.reviews_count || 0})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Appointments & Availability Slots */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Colonne gauche (2/3) : Liste des demandes et entretiens */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#E8ECE9] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1A3A5C]">Demandes & Entretiens Pastoraux</h2>
              <p className="text-xs text-gray-400">Suivi des accompagnements et rendez-vous matrimoniaux</p>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'].map((filterKey) => (
                <button
                  key={filterKey}
                  onClick={() => setStatusFilter(filterKey)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    statusFilter === filterKey
                      ? 'bg-[#1A3A5C] text-[#C9A84C]'
                      : 'bg-white text-gray-500 border border-[#E8ECE9] hover:bg-gray-50'
                  }`}
                >
                  {filterKey === 'ALL'
                    ? 'Tous'
                    : filterKey === 'PENDING'
                    ? 'En attente'
                    : filterKey === 'CONFIRMED'
                    ? 'Confirmés'
                    : 'Terminés'}
                </button>
              ))}
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center border border-[#E8ECE9] shadow-sm">
              <p className="text-xs text-gray-400">Aucun entretien trouvé pour ce filtre.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredAppointments.map((appt) => {
                const dateObj = new Date(appt.appointment_date);
                const dateStr = dateObj.toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const timeStr = dateObj.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const isEditingNotes = editingNotesApptId === appt.id;

                return (
                  <div
                    key={appt.id}
                    className="bg-white rounded-2xl border border-[#E8ECE9] p-5 shadow-sm space-y-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-[#1A3A5C]">{appt.user_name}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {appt.session_type_display}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={13} className="text-[#C9A84C]" />
                            {dateStr} à {timeStr}
                          </span>
                          <span>•</span>
                          <span>{appt.duration_minutes} min</span>
                        </div>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {appt.status === 'PENDING' && (
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                            En attente
                          </span>
                        )}
                        {appt.status === 'CONFIRMED' && (
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Confirmé
                          </span>
                        )}
                        {appt.status === 'COMPLETED' && (
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-gray-100 text-gray-700 border border-gray-200">
                            Terminé
                          </span>
                        )}
                        {appt.status === 'CANCELLED' && (
                          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                            Annulé
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Notes du fidèle */}
                    {appt.user_notes && (
                      <div className="bg-[#FAF9F6] p-3 rounded-xl border border-[#E8ECE9] text-xs text-gray-600">
                        <span className="font-bold text-[#1A3A5C] block mb-0.5 text-[10px] uppercase">
                          Sujet déposé par le fidèle :
                        </span>
                        "{appt.user_notes}"
                      </div>
                    )}

                    {/* Section notes confidentielles pastorales */}
                    {isEditingNotes ? (
                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-200/60 space-y-2">
                        <label className="block text-xs font-bold text-[#1A3A5C] flex items-center gap-1.5">
                          <FileText size={14} className="text-[#C9A84C]" />
                          Dossier pastoral confidentiel (Visible uniquement par vous)
                        </label>
                        <textarea
                          rows={3}
                          value={pastoralNotesDraft}
                          onChange={(e) => setPastoralNotesDraft(e.target.value)}
                          placeholder="Recommandations bibliques, suivi du couple, engagements pris..."
                          className="w-full p-2.5 text-xs bg-white rounded-lg border border-amber-200 focus:outline-none"
                        />
                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setEditingNotesApptId(null)}
                            className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg"
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            disabled={savingNotes}
                            onClick={() => handleSavePastoralNotes(appt.id)}
                            className="px-4 py-1.5 bg-[#1A3A5C] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                          >
                            {savingNotes ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
                            Sauvegarder
                          </button>
                        </div>
                      </div>
                    ) : (
                      appt.pastoral_notes && (
                        <div className="bg-amber-50/40 p-3 rounded-xl border border-amber-200/50 text-xs text-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-[#1A3A5C] text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <FileText size={12} className="text-[#C9A84C]" />
                              Notes pastorales confidentielles :
                            </span>
                            <button
                              onClick={() => {
                                setEditingNotesApptId(appt.id);
                                setPastoralNotesDraft(appt.pastoral_notes || '');
                              }}
                              className="text-[11px] text-[#1A3A5C] font-semibold hover:underline"
                            >
                              Modifier
                            </button>
                          </div>
                          <p className="line-clamp-2 italic">{appt.pastoral_notes}</p>
                        </div>
                      )
                    )}

                    {/* Actions bar */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#E8ECE9]">
                      <div className="flex items-center gap-2">
                        {!isEditingNotes && !appt.pastoral_notes && (
                          <button
                            onClick={() => {
                              setEditingNotesApptId(appt.id);
                              setPastoralNotesDraft('');
                            }}
                            className="px-3 py-1.5 text-xs text-gray-600 hover:text-[#1A3A5C] hover:bg-gray-50 rounded-lg border border-gray-200 font-medium flex items-center gap-1.5"
                          >
                            <FileText size={13} />
                            Ajouter notes pastorales
                          </button>
                        )}

                        {appt.status === 'CONFIRMED' && appt.meeting_link && (
                          <a
                            href={appt.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm hover:bg-emerald-700"
                          >
                            <Video size={13} />
                            Lancer la Visio
                          </a>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {appt.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => {
                                setConfirmingAppt(appt);
                                setMeetingLinkInput(appt.meeting_link || profile?.meeting_link || 'https://meet.google.com/');
                              }}
                              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                            >
                              Confirmer
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(appt.id, 'CANCELLED')}
                              className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              Décliner
                            </button>
                          </>
                        )}

                        {appt.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleUpdateStatus(appt.id, 'COMPLETED')}
                            className="px-3.5 py-1.5 rounded-lg bg-[#1A3A5C] text-[#C9A84C] hover:bg-[#132A42] text-xs font-bold transition-colors"
                          >
                            Clôturer la séance
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Colonne droite (1/3) : Gestion des créneaux récurrents */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8ECE9] pb-3">
            <div>
              <h2 className="text-base font-bold text-[#1A3A5C]">Créneaux Récurrents</h2>
              <p className="text-xs text-gray-400">Vos plages d'accueil hebdomadaires</p>
            </div>
            <button
              onClick={() => setShowAddSlot(!showAddSlot)}
              className="p-2 rounded-xl bg-[#1A3A5C] text-[#C9A84C] hover:bg-[#132A42] transition-colors shadow-sm"
              title="Ajouter un créneau"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Formulaire ajout créneau */}
          {showAddSlot && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleAddSlot}
              className="bg-white p-4 rounded-2xl border border-[#C9A84C]/40 shadow-sm space-y-3"
            >
              <div className="text-xs font-bold text-[#1A3A5C]">Nouveau créneau récurrent</div>
              <div>
                <label className="block text-[11px] text-gray-500 mb-1">Jour de la semaine</label>
                <select
                  value={newSlotDay}
                  onChange={(e) => setNewSlotDay(parseInt(e.target.value, 10))}
                  className="w-full p-2 text-xs rounded-lg border border-[#E8ECE9] bg-[#FAF9F6]"
                >
                  {DAYS_OF_WEEK.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Début</label>
                  <input
                    type="time"
                    value={newSlotStart}
                    onChange={(e) => setNewSlotStart(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-[#E8ECE9] bg-[#FAF9F6]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-gray-500 mb-1">Fin</label>
                  <input
                    type="time"
                    value={newSlotEnd}
                    onChange={(e) => setNewSlotEnd(e.target.value)}
                    className="w-full p-2 text-xs rounded-lg border border-[#E8ECE9] bg-[#FAF9F6]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddSlot(false)}
                  className="px-3 py-1.5 text-xs text-gray-500"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={creatingSlot}
                  className="px-4 py-1.5 bg-[#1A3A5C] text-[#C9A84C] font-bold text-xs rounded-lg shadow-sm"
                >
                  {creatingSlot ? "Ajout..." : "Enregistrer"}
                </button>
              </div>
            </motion.form>
          )}

          {/* Slots list */}
          <div className="space-y-2">
            {slots.length === 0 ? (
              <div className="bg-white p-6 rounded-2xl border border-[#E8ECE9] text-center text-xs text-gray-400">
                Aucun créneau configuré. Cliquez sur '+' pour définir vos disponibilités.
              </div>
            ) : (
              slots.map((slot) => (
                <div
                  key={slot.id}
                  className="bg-white p-3.5 rounded-xl border border-[#E8ECE9] flex items-center justify-between shadow-sm hover:border-[#C9A84C]/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <div>
                      <div className="text-xs font-bold text-[#1A3A5C]">{slot.day_name}</div>
                      <div className="text-[11px] text-gray-500">
                        {slot.start_time.slice(0, 5)} - {slot.end_time.slice(0, 5)}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                    title="Supprimer ce créneau"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal avec Lien Visio */}
      {confirmingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[#E8ECE9] space-y-4">
            <h3 className="text-base font-bold text-[#1A3A5C]">Confirmer le rendez-vous</h3>
            <p className="text-xs text-gray-500">
              Veuillez vérifier le lien de visioconférence sécurisée qui sera communiqué au fidèle :
            </p>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Lien de la visioconférence</label>
              <input
                type="url"
                value={meetingLinkInput}
                onChange={(e) => setMeetingLinkInput(e.target.value)}
                placeholder="https://meet.google.com/abc-defg-hij"
                className="w-full p-2.5 text-xs rounded-xl border border-[#E8ECE9] bg-[#FAF9F6] focus:outline-none focus:border-[#1A3A5C]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setConfirmingAppt(null)}
                className="px-4 py-2 text-xs text-gray-500 font-semibold"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => handleUpdateStatus(confirmingAppt.id, 'CONFIRMED', meetingLinkInput)}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Valider & Envoyer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
