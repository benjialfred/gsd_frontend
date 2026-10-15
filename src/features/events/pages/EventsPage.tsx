import React, { useState, useEffect } from 'react';
import type { EventItem, EventRegistration } from '../types/events';
import { eventsService } from '../services/eventsService';
import { EventCard } from '../components/EventCard';
import { EventDetailsModal } from '../components/EventDetailsModal';
import { TicketBookingModal } from '../components/TicketBookingModal';
import { DigitalTicketPass } from '../components/DigitalTicketPass';
import { MyTicketsView } from '../components/MyTicketsView';
import { EventCheckInScanner } from '../components/EventCheckInScanner';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from '../../../stores/useToastStore';
import { 
  Sparkles, Ticket, Calendar, QrCode, Search, 
  MapPin, Loader2, Users, Award 
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'ALL', label: 'Tous les Événements' },
  { id: 'GALA', label: 'Dîners de Gala' },
  { id: 'CONFERENCE', label: 'Sommets & Conférences' },
  { id: 'RETREAT', label: 'Retraites Spirituelles' },
];

export const EventsPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'showcase' | 'my_tickets' | 'scanner'>('showcase');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCity, setSelectedCity] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [detailsEvent, setDetailsEvent] = useState<EventItem | null>(null);
  const [bookingEvent, setBookingEvent] = useState<EventItem | null>(null);
  const [generatedPass, setGeneratedPass] = useState<EventRegistration | null>(null);

  const isStaffOrAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' || user?.is_staff;

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const params: any = {};
      if (selectedCategory !== 'ALL') params.type = selectedCategory;
      if (selectedCity !== 'ALL') params.city = selectedCity;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const data = await eventsService.getEvents(params);
      setEvents(data);
    } catch (err: any) {
      console.error("Erreur chargement événements:", err);
      toast.error("Impossible de charger les événements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'showcase') {
      fetchEvents();
    }
  }, [activeTab, selectedCategory, selectedCity]);

  const handleBookingSuccess = (registration: EventRegistration) => {
    setGeneratedPass(registration);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Hero Showcase Banner */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1A3A5C] via-[#244A72] to-[#1A3A5C] text-white p-8 sm:p-12 overflow-hidden shadow-xl border border-[#C9A84C]/30">
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#FAF9F6] text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-[#C9A84C]" />
            Sommets & Galas Chrétiens 2026
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3 font-serif">
            Célébrations Royales & Rencontres Sanctifiées
          </h1>
          <p className="text-sm sm:text-base text-white/80 leading-relaxed font-light">
            Participez aux dîners de gala prestigieux, sommets internationaux du mariage chrétien et retraites spirituelles pour sceller des alliances selon le cœur de Dieu.
          </p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-[#E8ECE9] gap-4 overflow-x-auto pb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('showcase')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'showcase'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Calendar size={16} />
            Programme des Galas & Sommets
          </button>

          <button
            onClick={() => setActiveTab('my_tickets')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'my_tickets'
                ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Ticket size={16} />
            Mes Billets & Pass QR
          </button>

          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'scanner'
                ? 'bg-gradient-to-r from-[#C9A84C] to-[#B3933B] text-[#1A3A5C] shadow-md font-extrabold'
                : 'text-[#C9A84C] hover:bg-amber-50 border border-[#C9A84C]/40'
            }`}
          >
            <QrCode size={16} />
            Scanner d'Émargement
          </button>
        </div>
      </div>

      {/* TAB 1: SHOWCASE DES ÉVÉNEMENTS */}
      {activeTab === 'showcase' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {CATEGORY_TABS.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-[#1A3A5C] text-[#C9A84C] shadow-sm'
                      : 'bg-white text-gray-600 border border-[#E8ECE9] hover:bg-gray-50'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* City Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">Ville :</span>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-3 py-2 text-xs font-semibold rounded-xl border border-[#E8ECE9] bg-white text-gray-800 focus:outline-none"
              >
                <option value="ALL">Toutes les Villes</option>
                <option value="Douala">Douala</option>
                <option value="Yaoundé">Yaoundé</option>
                <option value="Kribi">Kribi</option>
              </select>
            </div>
          </div>

          {/* Events Grid */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center text-gray-400 gap-3">
              <Loader2 size={32} className="animate-spin text-[#1A3A5C]" />
              <span className="text-xs font-medium">Chargement des galas et sommets officiels...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8ECE9] shadow-sm max-w-md mx-auto my-12">
              <p className="text-sm font-semibold text-gray-700 mb-2">Aucun événement trouvé</p>
              <p className="text-xs text-gray-400">Modifiez vos critères ou votre sélection de ville.</p>
              <button
                onClick={() => {
                  setSelectedCategory('ALL');
                  setSelectedCity('ALL');
                }}
                className="mt-4 px-4 py-2 bg-[#1A3A5C] text-white text-xs font-bold rounded-xl"
              >
                Réinitialiser les filtres
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <EventCard
                  key={event.id}
                  event={event}
                  onDetails={(targetEvent) => setDetailsEvent(targetEvent)}
                  onBook={(targetEvent) => setBookingEvent(targetEvent)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MES BILLETS */}
      {activeTab === 'my_tickets' && (
        <MyTicketsView onGoToEvents={() => setActiveTab('showcase')} />
      )}

      {/* TAB 3: SCANNER D'ÉMARGEMENT */}
      {activeTab === 'scanner' && (
        <EventCheckInScanner />
      )}

      {/* Event Details / En Savoir Plus Modal */}
      <EventDetailsModal
        event={detailsEvent}
        isOpen={Boolean(detailsEvent)}
        onClose={() => setDetailsEvent(null)}
        onBook={(targetEvent) => {
          setDetailsEvent(null);
          setBookingEvent(targetEvent);
        }}
      />

      {/* Booking Modal */}
      <TicketBookingModal
        event={bookingEvent}
        isOpen={Boolean(bookingEvent)}
        onClose={() => setBookingEvent(null)}
        onSuccess={handleBookingSuccess}
      />

      {/* Digital Pass Modal (Post-Booking or View) */}
      <DigitalTicketPass
        registration={generatedPass}
        isOpen={Boolean(generatedPass)}
        onClose={() => setGeneratedPass(null)}
      />
    </div>
  );
};
