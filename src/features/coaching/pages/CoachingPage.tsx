import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import type { CoachProfile } from '../types/coaching';
import { coachingService } from '../services/coachingService';
import { CoachCard } from '../components/CoachCard';
import { BookingModal } from '../components/BookingModal';
import { MyAppointmentsView } from '../components/MyAppointmentsView';
import { CoachDashboard } from '../components/CoachDashboard';
import { toast } from '../../../stores/useToastStore';
import { 
  HeartHandshake, Search, Filter, Calendar, Users, 
  Sparkles, ShieldCheck, Loader2, BookOpen 
} from 'lucide-react';
import { motion } from 'framer-motion';

const SPECIALTY_PILLS = [
  { id: 'ALL', label: 'Toutes les Spécialités' },
  { id: 'Préparation', label: 'Préparation au Mariage' },
  { id: 'Communication', label: 'Communication & Résolution' },
  { id: 'Délivrance', label: 'Guérison Intérieure & Paix' },
  { id: 'Sanctification', label: 'Sanctification & Pureté' },
  { id: 'Finances', label: 'Vision Familiale & Finances' },
];

export const CoachingPage: React.FC = () => {
  const { user } = useAuthStore();
  const isCoach = user?.role === 'COACH' || user?.role === 'ADMIN';

  // Tabs: 'directory' | 'my_appointments' | 'coach_workspace'
  const [activeTab, setActiveTab] = useState<'directory' | 'my_appointments' | 'coach_workspace'>(
    user?.role === 'COACH' ? 'coach_workspace' : 'directory'
  );

  const [coaches, setCoaches] = useState<CoachProfile[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('ALL');

  // Booking modal
  const [bookingCoach, setBookingCoach] = useState<CoachProfile | null>(null);

  const fetchCoaches = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (searchTerm.trim()) params.search = searchTerm.trim();
      if (selectedSpecialty !== 'ALL') params.specialty = selectedSpecialty;

      const data = await coachingService.getCoaches(params);
      setCoaches(data);
    } catch (err: any) {
      console.error("Erreur annuaire conseillers:", err);
      toast.error("Impossible de charger les conseillers pastoraux.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'directory') {
      fetchCoaches();
    }
  }, [activeTab, selectedSpecialty]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchCoaches();
  };

  const handleBookingSuccess = () => {
    setActiveTab('my_appointments');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Banner */}
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
            <Sparkles size={14} className="text-[#C9A84C]" />
            Accompagnement Spirituel & Conjugal
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-serif">
            Conseil Pastoral & Médiation Matrimoniale
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
            Posez les fondations d'un foyer saint et harmonieux. Prenez rendez-vous en tête-à-tête vidéo avec des pasteurs, docteurs et conseillers chrétiens certifiés par GSD.
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-[#E8ECE9] gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('directory')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'directory'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Users size={16} />
            Annuaire des Conseillers
          </button>

          <button
            onClick={() => setActiveTab('my_appointments')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'my_appointments'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Calendar size={16} />
            Mes Rendez-vous
          </button>

          {isCoach && (
            <button
              onClick={() => setActiveTab('coach_workspace')}
              className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
                activeTab === 'coach_workspace'
                  ? 'bg-gradient-to-r from-[#C9A84C] to-[#B3933B] text-[#1A3A5C] shadow-md font-extrabold'
                  : 'text-[#C9A84C] hover:bg-amber-50 border border-[#C9A84C]/40'
              }`}
            >
              <ShieldCheck size={16} />
              Mon Bureau Pastoral (Coach)
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: ANNUAIRE DES CONSEILLERS */}
      {activeTab === 'directory' && (
        <div className="space-y-6">
          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un pasteur, conseiller ou spécialité..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#E8ECE9] bg-white text-xs text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:border-[#1A3A5C]"
              />
            </form>

            {/* Specialty Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-2xl">
              {SPECIALTY_PILLS.map((pill) => (
                <button
                  key={pill.id}
                  onClick={() => setSelectedSpecialty(pill.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSpecialty === pill.id
                      ? 'bg-[#1A3A5C] text-white shadow-sm'
                      : 'bg-white text-gray-600 border border-[#E8ECE9] hover:bg-gray-50'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>
          </div>

          {/* Directory Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 size={32} className="animate-spin text-[#1A3A5C]" />
              <span className="text-xs font-medium">Chargement des conseillers certifiés...</span>
            </div>
          ) : coaches.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8ECE9] shadow-sm max-w-md mx-auto my-12">
              <p className="text-sm font-semibold text-gray-700 mb-2">Aucun conseiller trouvé</p>
              <p className="text-xs text-gray-400">Essayez de réinitialiser vos filtres ou votre recherche.</p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedSpecialty('ALL');
                }}
                className="mt-4 px-4 py-2 bg-[#1A3A5C] text-white text-xs font-bold rounded-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coaches.map((coach) => (
                <CoachCard
                  key={coach.id}
                  coach={coach}
                  onBook={(targetCoach) => setBookingCoach(targetCoach)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MES SÉANCES */}
      {activeTab === 'my_appointments' && (
        <MyAppointmentsView onGoToDirectory={() => setActiveTab('directory')} />
      )}

      {/* TAB 3: ESPACE PASTEUR / CONSEILLER */}
      {activeTab === 'coach_workspace' && isCoach && (
        <CoachDashboard />
      )}

      {/* Booking Modal */}
      <BookingModal
        coach={bookingCoach}
        isOpen={Boolean(bookingCoach)}
        onClose={() => setBookingCoach(null)}
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
};
