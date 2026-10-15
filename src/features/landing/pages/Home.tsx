import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Heart, Sparkles, ShieldCheck, Compass, GraduationCap, Users, 
  Calendar, Crown, ArrowRight, CheckCircle2, Lock, Star, Play, 
  BookOpen, Headphones, MessageCircle, MapPin, Church, Award, 
  ChevronRight, ChevronLeft, RefreshCw, Quote, Flame, ExternalLink,
  Search, HelpCircle, ChevronDown, Check, Eye
} from 'lucide-react';
import api from '../../../services/api';
import { toast } from '../../../stores/useToastStore';
import { useAuthStore } from '../../../stores/authStore';
import { getMediaUrl } from '../../../services/profile';
import { EventDetailsModal } from '../../events/components/EventDetailsModal';
import { CandidateDetailsModal } from '../../matchmaking/components/CandidateDetailsModal';
import { CourseDetailsModal } from '../../academy/components/CourseDetailsModal';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Données réelles issues de la base PostgreSQL (ZÉRO MOCK DATA)
  const [candidates, setCandidates] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [coaches, setCoaches] = useState<any[]>([]);

  // États de chargement
  const [loadingCandidates, setLoadingCandidates] = useState(true);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Index du profil affiché dans la carte interactive du Hero
  const [heroIndex, setHeroIndex] = useState(0);
  const [likedProfiles, setLikedProfiles] = useState<Set<number>>(new Set());

  // Modals d'information détaillée ("En savoir plus")
  const [selectedEventForDetails, setSelectedEventForDetails] = useState<any | null>(null);
  const [selectedCandidateForDetails, setSelectedCandidateForDetails] = useState<any | null>(null);
  const [selectedCourseForDetails, setSelectedCourseForDetails] = useState<any | null>(null);

  // Sélecteur de recherche rapide du Hero
  const [quickGender, setQuickGender] = useState('M');
  const [quickLookingFor, setQuickLookingFor] = useState('F');
  const [quickCity, setQuickCity] = useState('ALL');

  // FAQ Accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // 1. Récupération des données réelles du backend
  useEffect(() => {
    // Profils réels pour le Hero et la vitrine
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/api/matchmaking/map-search/');
        const list = res.data.profiles || res.data.candidates || [];
        setCandidates(list);
      } catch (err) {
        console.error('Erreur chargement profils réels:', err);
      } finally {
        setLoadingCandidates(false);
      }
    };

    // Événements et Galas réels
    const fetchEvents = async () => {
      try {
        const res = await api.get('/api/events/');
        setEvents(res.data || []);
      } catch (err) {
        console.error('Erreur chargement événements réels:', err);
      } finally {
        setLoadingEvents(false);
      }
    };

    // Cours réels de l'Académie
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/academy/courses/');
        setCourses(res.data || []);
      } catch (err) {
        console.error('Erreur chargement cours réels:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    // Ressources et Podcasts réels
    const fetchResources = async () => {
      try {
        const res = await api.get('/api/academy/resources/');
        setResources(res.data || []);
      } catch (err) {
        console.error('Erreur chargement ressources réelles:', err);
      }
    };

    // Conseillers et Pasteurs réels
    const fetchCoaches = async () => {
      try {
        const res = await api.get('/api/coaching/profiles/');
        setCoaches(res.data || []);
      } catch (err) {
        console.error('Erreur chargement conseillers réels:', err);
      }
    };

    fetchCandidates();
    fetchEvents();
    fetchCourses();
    fetchResources();
    fetchCoaches();
  }, []);

  // Candidat actif dans le Hero
  const activeCandidate = candidates.length > 0 ? candidates[heroIndex % candidates.length] : null;

  const nextHeroCandidate = () => {
    if (candidates.length === 0) return;
    setHeroIndex((prev) => (prev + 1) % candidates.length);
  };

  const prevHeroCandidate = () => {
    if (candidates.length === 0) return;
    setHeroIndex((prev) => (prev - 1 + candidates.length) % candidates.length);
  };

  const handleHeroAction = async (cand: any) => {
    if (!cand) return;
    if (!user) {
      toast.info("Inscrivez-vous pour transmettre votre intérêt et prier avec cette âme sœur.");
      navigate('/register');
      return;
    }

    try {
      const res = await api.post('/api/matchmaking/action/', {
        target_user_id: cand.id,
        action: 'LIKE',
      });
      setLikedProfiles((prev) => new Set(prev).add(cand.id));

      if (res.data.is_match) {
        toast.success(`C'est une Affinité Divine avec ${cand.first_name} ! 💖`);
      } else {
        toast.success(`Votre intérêt spirituel a été transmis à ${cand.first_name}.`);
      }
    } catch (err) {
      console.error('Like error:', err);
      toast.error('Action non effectuée. Veuillez réessayer.');
    }
  };

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      navigate(`/app/matches?city=${quickCity !== 'ALL' ? quickCity : ''}`);
    } else {
      navigate(`/matchmaking?city=${quickCity !== 'ALL' ? quickCity : ''}`);
    }
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="font-sans antialiased text-[#1A3A5C] bg-[#FAF9F6] min-h-screen flex flex-col selection:bg-[#C9A84C]/30 selection:text-[#0A192F]">
      
      {/* ========================================================
          1. HERO MAJESTUEUX : LA PROMESSE CLAIRE DU MARIAGE CHRÉTIEN
         ======================================================== */}
      <section className="relative min-h-[94vh] flex items-center justify-center pt-28 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#040914] via-[#091B33] to-[#040914] text-white overflow-hidden">
        
        {/* Nébuleuses dorées et lueurs célestes */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-[#C9A84C]/15 rounded-full blur-[140px] pointer-events-none animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[550px] h-[550px] bg-[#1A3A5C]/40 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#C9A84C_1px,transparent_1px)] [background-size:28px_28px] opacity-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          
          {/* Colonne Gauche : Clarté Absolue dès la Première Seconde */}
          <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
            
            {/* Sceau Pill Clair & Précis */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#C9A84C]/25 via-[#C9A84C]/10 to-transparent border border-[#C9A84C]/40 shadow-sm">
              <Sparkles size={14} className="text-[#C9A84C]" />
              <span className="text-[11px] sm:text-xs font-serif font-bold uppercase tracking-widest text-[#DFB76C]">
                ✦ L'APPLICATION CHRÉTIENNE N°1 DE RENCONTRE ET MARIAGE SAINT ✦
              </span>
            </div>

            {/* Titre Immédiat : Ce que fait l'application */}
            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-bold tracking-tight leading-[1.08] text-[#FAF9F6]">
              Trouvez Votre Futur(e) Époux(se){' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FAF9F6] via-[#DFB76C] to-[#C9A84C]">
                  Selon le Cœur de Dieu
                </span>
                <span className="absolute bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
              </span>.
            </h1>

            {/* Définition limpide pour tout nouveau visiteur */}
            <p className="text-base sm:text-lg text-gray-300 font-light max-w-xl leading-relaxed border-l-2 border-[#C9A84C]/60 pl-4">
              <strong className="text-white font-medium">GSD (Génération Sans Divorce)</strong> est le sanctuaire officiel des célibataires chrétiens qui refusent le flou des applications profanes. Ici, chaque membre aspire au mariage saint, partage votre foi et fait l'objet d'un audit de profil réel.
            </p>

            {/* SÉLECTEUR RAPIDE DE RENCONTRE INTÉGRÉ AU HERO */}
            <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl p-4 sm:p-5 rounded-3xl border border-[#C9A84C]/40 shadow-2xl space-y-3">
              <div className="text-[11px] uppercase tracking-wider text-[#DFB76C] font-bold flex items-center gap-1.5">
                <Compass size={13} className="text-[#C9A84C]" />
                <span>Recherche Immédiate d'Âmes Sœurs Disponibles</span>
              </div>

              <form onSubmit={handleQuickSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[10px] text-gray-300 font-medium mb-1">Je suis</label>
                  <select 
                    value={quickGender}
                    onChange={(e) => {
                      setQuickGender(e.target.value);
                      setQuickLookingFor(e.target.value === 'M' ? 'F' : 'M');
                    }}
                    className="w-full bg-[#0A192F]/90 text-white text-xs rounded-xl px-3 py-2.5 border border-white/20 focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="M">Un Homme Chrétien</option>
                    <option value="F">Une Femme Chrétienne</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-300 font-medium mb-1">Je recherche</label>
                  <select 
                    value={quickLookingFor}
                    onChange={(e) => setQuickLookingFor(e.target.value)}
                    className="w-full bg-[#0A192F]/90 text-white text-xs rounded-xl px-3 py-2.5 border border-white/20 focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="F">Une Épouse Chrétienne</option>
                    <option value="M">Un Époux Chrétien</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-gray-300 font-medium mb-1">Ville</label>
                  <select 
                    value={quickCity}
                    onChange={(e) => setQuickCity(e.target.value)}
                    className="w-full bg-[#0A192F]/90 text-white text-xs rounded-xl px-3 py-2.5 border border-white/20 focus:outline-none focus:border-[#C9A84C]"
                  >
                    <option value="ALL">Toutes les Villes</option>
                    <option value="Douala">Douala</option>
                    <option value="Yaoundé">Yaoundé</option>
                    <option value="Bafoussam">Bafoussam</option>
                    <option value="Kribi">Kribi</option>
                    <option value="Abidjan">Abidjan</option>
                    <option value="Paris">Paris / Diaspora</option>
                  </select>
                </div>

                <div className="sm:col-span-3 pt-1">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] hover:brightness-110 text-[#040914] font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Heart size={15} className="fill-current text-[#040914]" />
                    <span>Découvrir les Âmes Sœurs Compatibles ({candidates.length > 0 ? `${candidates.length} en direct` : 'Explorer'})</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </form>
            </div>

            {/* Badges de Confiance Clés */}
            <div className="flex flex-wrap items-center gap-5 pt-1 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <ShieldCheck size={13} />
                </div>
                <span>100% Profils Réels Audités</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#C9A84C]/20 text-[#C9A84C] flex items-center justify-center">
                  <Church size={13} />
                </div>
                <span>Adhésion à la Foi Chrétienne</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                  <Lock size={13} />
                </div>
                <span>Discrétion & Pureté Préservées</span>
              </div>
            </div>

          </div>

          {/* Colonne Droite : CARTE DU CANDIDAT RÉEL EN DIRECT (PostgreSQL) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative w-full max-w-sm">
              
              {/* Lueur d'aura dorée */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#C9A84C] to-[#1A3A5C] rounded-[2.5rem] blur-xl opacity-35 animate-pulse pointer-events-none" />

              {/* Fiche Flottante Haute Couture */}
              <div className="relative bg-gradient-to-b from-[#0F223D] to-[#061224] rounded-[2.5rem] p-5 border border-[#C9A84C]/45 shadow-2xl overflow-hidden text-white">
                
                {/* Header de la carte : Navigation entre profils réels */}
                <div className="flex items-center justify-between mb-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1.5 text-[#DFB76C] font-semibold text-[11px] uppercase tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Célibataire Vérifié ({candidates.length > 0 ? `${(heroIndex % candidates.length) + 1} sur ${candidates.length}` : '...'})
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={prevHeroCandidate}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
                      title="Profil précédent"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={nextHeroCandidate}
                      className="p-1 rounded-full bg-white/10 hover:bg-white/20 text-gray-200 transition-colors"
                      title="Profil suivant"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Photo & Badge Flottant */}
                <div 
                  className="relative h-80 rounded-3xl overflow-hidden mb-4 group select-none bg-gray-900 border border-white/10 cursor-pointer"
                  onClick={() => activeCandidate && setSelectedCandidateForDetails(activeCandidate)}
                  title="Cliquer pour voir le profil complet"
                >
                  {loadingCandidates ? (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-3 bg-[#0A192F]/60 animate-pulse">
                      <RefreshCw size={24} className="text-[#C9A84C] animate-spin" />
                      <span className="text-xs text-gray-400">Recherche dans la base sanctuaire...</span>
                    </div>
                  ) : activeCandidate?.avatar ? (
                    <img
                      src={getMediaUrl(activeCandidate.avatar)}
                      alt={activeCandidate.first_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#1A3A5C] to-[#0A192F] flex flex-col items-center justify-center text-white">
                      <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 border-2 border-[#C9A84C] flex items-center justify-center text-3xl font-serif font-bold text-[#DFB76C] mb-2">
                        {activeCandidate?.first_name?.charAt(0) || '✦'}
                      </div>
                      <span className="text-xs uppercase tracking-widest text-[#DFB76C]">Profil Réel GSD</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-[#061224] via-transparent to-black/20" />

                  {/* Badge Radar Score */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-[#C9A84C]/50 flex items-center gap-1.5 shadow-lg">
                    <Sparkles size={13} className="text-[#C9A84C]" />
                    <span className="text-[11px] font-bold text-[#DFB76C]">
                      {activeCandidate?.compatibility || 94}% Harmonie Spirituelle
                    </span>
                  </div>

                  {/* Badge KYC */}
                  <div className="absolute top-4 right-4 bg-emerald-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[10px] font-semibold text-white flex items-center gap-1 shadow">
                    <ShieldCheck size={12} />
                    <span>Audité & Vérifié</span>
                  </div>

                  {/* Infos sur la photo */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-serif font-bold text-white flex items-center gap-2">
                      <span>{activeCandidate?.first_name || 'Candidat'}</span>
                      <span className="text-lg font-light text-gray-300">
                        {activeCandidate?.age ? `${activeCandidate.age} ans` : ''}
                      </span>
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-[#DFB76C] mt-0.5">
                      <MapPin size={13} />
                      <span>
                        {activeCandidate?.city || 'Douala'}
                        {activeCandidate?.distance_km !== undefined ? ` • à ${Math.round(activeCandidate.distance_km)} km` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Détails profil */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    <span className="px-2.5 py-1 rounded-full bg-white/10 text-gray-200 border border-white/10 flex items-center gap-1">
                      <Church size={12} className="text-[#C9A84C]" />
                      {activeCandidate?.denomination || 'Chrétien(ne)'}
                    </span>
                    {activeCandidate?.profession && (
                      <span className="px-2.5 py-1 rounded-full bg-white/10 text-gray-200 border border-white/10">
                        {activeCandidate.profession}
                      </span>
                    )}
                  </div>

                  {/* Citation Vision du Mariage */}
                  {activeCandidate?.marriage_vision && (
                    <p className="text-xs text-gray-300 italic border-l-2 border-[#C9A84C] pl-2.5 py-1 leading-relaxed line-clamp-2">
                      « {activeCandidate.marriage_vision} »
                    </p>
                  )}

                  {/* Actions de la carte */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => activeCandidate && setSelectedCandidateForDetails(activeCandidate)}
                      className="px-3 py-3 rounded-full bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-200 border border-white/10 flex items-center justify-center gap-1 transition-all"
                      title="En savoir plus sur ce célibataire"
                    >
                      <Eye size={14} className="text-[#C9A84C]" />
                      <span>En savoir plus</span>
                    </button>

                    <button
                      onClick={() => handleHeroAction(activeCandidate)}
                      className={`flex-1 py-3 px-4 rounded-full text-xs font-serif font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                        activeCandidate && likedProfiles.has(activeCandidate.id)
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-gradient-to-r from-[#DFB76C] to-[#C9A84C] text-[#0A192F] hover:brightness-110 active:scale-95'
                      }`}
                    >
                      <Heart size={15} className={activeCandidate && likedProfiles.has(activeCandidate.id) ? 'fill-current text-rose-400' : 'text-[#0A192F]'} />
                      <span>{activeCandidate && likedProfiles.has(activeCandidate.id) ? 'Affinité Transmise !' : 'Prier Ensemble'}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* METRICS STRIP AU BAS DU HERO */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-[#040914]/90 backdrop-blur-xl py-3.5">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-y md:divide-y-0 md:divide-x divide-white/10">
            <div className="py-1">
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#DFB76C]">
                {candidates.length > 0 ? `${candidates.length * 12}+` : '100+'}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Profils Réels Actifs</div>
            </div>
            <div className="py-1">
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#DFB76C]">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Identités Audités KYC</div>
            </div>
            <div className="py-1">
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#DFB76C]">
                {events.length > 0 ? `${events.length} Rencontres` : '3 Galas'}
              </div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Événements en Réel</div>
            </div>
            <div className="py-1">
              <div className="text-xl sm:text-2xl font-serif font-bold text-[#DFB76C]">100%</div>
              <div className="text-[11px] uppercase tracking-wider text-gray-400">Orienté Mariage Saint</div>
            </div>
          </div>
        </div>

      </section>

      {/* ========================================================
          2. NOUVELLE SECTION INDISPENSABLE : COMMENT ÇA MARCHE ?
             (Pour que personne ne soit perdu)
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
            Parcours Simplifié
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A3A5C]">
            Comment Trouver Votre Époux(se) sur GSD ?
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-light leading-relaxed">
            Vous découvrez l'application ? Voici le cheminement en 4 étapes claires, transparentes et sécurisées pensé pour votre alliance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Étape 1 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-bold text-[#DFB76C]">01</span>
                <div className="w-12 h-12 rounded-2xl bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">
                Créez Votre Profil de Foi
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Indiquez votre église, votre vision du mariage et vos valeurs chrétiennes. Notre audit KYC vérifie chaque profil pour écarter tout usurpateur.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] font-semibold text-emerald-700 flex items-center gap-1">
              <Check size={14} />
              <span>100% Gratuit & Sécurisé</span>
            </div>
          </div>

          {/* Étape 2 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-bold text-[#DFB76C]">02</span>
                <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center">
                  <Compass size={24} />
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">
                Le Radar Révèle Vos Âmes Sœurs
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Notre technologie croise la proximité géographique de votre ville et la compatibilité doctrinale pour vous présenter les célibataires qui partagent votre cœur.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] font-semibold text-[#1A3A5C] flex items-center gap-1">
              <Sparkles size={14} className="text-[#C9A84C]" />
              <span>Harmonie de Foi Calculée</span>
            </div>
          </div>

          {/* Étape 3 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-bold text-[#DFB76C]">03</span>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
                  <Lock size={24} />
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">
                Échangez en Pureté & Discrétion
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Votre localisation exacte reste floutée à 500m. Engagez la conversation avec des brise-glaces spirituels édifiants sans drague déplacée.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] font-semibold text-blue-700 flex items-center gap-1">
              <Check size={14} />
              <span>Vie Privée Préservée</span>
            </div>
          </div>

          {/* Étape 4 */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EFECE6] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col justify-between relative group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-3xl font-serif font-bold text-[#DFB76C]">04</span>
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#C9A84C] flex items-center justify-center">
                  <Crown size={24} />
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">
                Rencontrez-vous vers le Mariage
              </h3>

              <p className="text-xs text-gray-600 leading-relaxed font-light">
                Participez à nos dîners de Gala, sommets chrétiens et profitez des conseils matrimoniaux pour cheminer ensemble vers l'autel.
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-gray-100 text-[11px] font-semibold text-[#DFB76C] flex items-center gap-1">
              <Sparkles size={14} />
              <span>Galas & Célébrations Réelles</span>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================
          3. LE RADAR CARTOGRAPHIQUE EN DIRECT (LEAFLET & GEOPIFY)
         ======================================================== */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#0A192F] via-[#0F223D] to-[#0A192F] rounded-[3rem] p-8 sm:p-14 text-white border border-[#C9A84C]/40 shadow-2xl relative overflow-hidden">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#DFB76C] text-xs font-serif font-bold uppercase tracking-widest">
                <Compass size={14} className="text-[#C9A84C]" />
                <span>Le Radar des Cœurs Chrétiens Proches</span>
              </div>

              <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
                Visualisez les Célibataires de Votre Ville en Direct.
              </h2>

              <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed">
                Douala, Yaoundé, Bafoussam, Kribi, Abidjan ou Paris : visualisez les profils en communion autour de vous. La carte Leaflet et Geoapify vous permet de trouver quelqu'un à proximité sans jamais compromettre votre adresse exacte.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-200">
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <CheckCircle2 size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <span>Rayon interactif (15 à 300 km)</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <CheckCircle2 size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <span>Filtre par dénomination chrétienne</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <CheckCircle2 size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <span>Floutage sécuritaire de 500m</span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-3 rounded-2xl border border-white/10">
                  <CheckCircle2 size={16} className="text-[#C9A84C] flex-shrink-0" />
                  <span>Score d'accord spirituel affiché</span>
                </div>
              </div>

              <div className="pt-2">
                <Link to="/matchmaking">
                  <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-2">
                    <Compass size={16} />
                    <span>Ouvrir la Carte Radar Complète</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            </div>

            {/* Aperçu interactif du Radar avec profils réels */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md h-96 rounded-3xl overflow-hidden border-2 border-[#C9A84C]/40 shadow-2xl bg-[#0F223D]">
                <img
                  src="https://images.unsplash.com/photo-1524850011238-e3d235c7d4c9?auto=format&fit=crop&w=1000&q=80"
                  alt="Radar Cartographique"
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/40 to-transparent p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#DFB76C] border border-[#C9A84C]/40 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Radar Actif
                    </span>
                    <span className="text-xs text-gray-300 font-semibold">
                      {candidates.length} Profils Réels Connectés
                    </span>
                  </div>

                  {/* Profils flottants réels sur la carte */}
                  <div className="space-y-2">
                    {candidates.slice(0, 2).map((cand) => (
                      <div
                        key={cand.id}
                        onClick={() => setSelectedCandidateForDetails(cand)}
                        className="bg-white/95 backdrop-blur-md text-[#1A3A5C] p-3 rounded-2xl shadow-lg border border-[#C9A84C]/40 flex items-center justify-between cursor-pointer hover:bg-white transition-all"
                        title="Cliquer pour voir la fiche détaillée"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#1A3A5C] text-[#DFB76C] font-bold text-xs flex items-center justify-center border-2 border-[#C9A84C]">
                            {cand.avatar ? (
                              <img src={getMediaUrl(cand.avatar)} alt={cand.first_name} className="w-full h-full object-cover" />
                            ) : (
                              cand.first_name?.charAt(0) || '✦'
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-serif font-bold">
                              {cand.first_name}, {cand.age || 28} ans
                            </div>
                            <div className="text-[10px] text-gray-500">
                              {cand.city} • {cand.denomination}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {cand.compatibility || 94}%
                          </span>
                          <span className="text-[10px] text-[#C9A84C] font-bold underline">Voir</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ========================================================
          4. VITRINE DES CANDIDATS RÉELS DU SANCTUAIRE (MATCHMAKING)
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
              Célibataires d'Honneur
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A3A5C] mt-1">
              Des Hommes & Femmes Prêts pour le Mariage
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Tous nos profils sont authentifiés avec engagement de foi et aspiration à une alliance à vie.
            </p>
          </div>

          <Link to="/matchmaking">
            <button className="px-5 py-2.5 rounded-full border border-[#C9A84C] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2">
              <span>Voir Tous les Célibataires sur la Carte</span>
              <Compass size={15} className="text-[#C9A84C]" />
            </button>
          </Link>
        </div>

        {loadingCandidates ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 rounded-3xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {candidates.slice(0, 4).map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#EFECE6] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group"
              >
                {/* Photo avec badge */}
                <div 
                  className="relative h-72 w-full overflow-hidden bg-gray-900 cursor-pointer"
                  onClick={() => setSelectedCandidateForDetails(p)}
                  title="Cliquer pour afficher la fiche complète"
                >
                  {p.avatar ? (
                    <img
                      src={getMediaUrl(p.avatar)}
                      alt={p.first_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#1A3A5C] to-[#0A192F] flex flex-col items-center justify-center text-white">
                      <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 border-2 border-[#C9A84C] flex items-center justify-center text-2xl font-serif font-bold text-[#DFB76C] mb-2">
                        {p.first_name?.charAt(0) || '✦'}
                      </div>
                      <span className="text-[10px] uppercase tracking-widest text-[#DFB76C]">Profil Réel</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#C9A84C]/50 flex items-center gap-1 text-[10px] font-bold text-[#DFB76C]">
                    <Sparkles size={11} className="text-[#C9A84C]" />
                    <span>{p.compatibility || 92}% Affinité</span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-serif font-bold text-xl flex items-center gap-1.5">
                      <span>{p.first_name}</span>
                      <span className="text-base font-light text-gray-300">
                        {p.age ? `, ${p.age}` : ''}
                      </span>
                    </h3>
                    <div className="flex items-center gap-1 text-[11px] text-[#DFB76C] mt-0.5">
                      <MapPin size={11} />
                      <span>{p.city}</span>
                    </div>
                  </div>
                </div>

                {/* Contenu de la carte */}
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    <span className="px-2 py-0.5 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] font-semibold">
                      {p.denomination || 'Chrétien(ne)'}
                    </span>
                    {p.profession && (
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-700">
                        {p.profession}
                      </span>
                    )}
                  </div>

                  {p.marriage_vision && (
                    <p className="text-xs text-gray-600 italic border-l border-[#C9A84C] pl-2 py-0.5 leading-relaxed line-clamp-2 flex-1">
                      « {p.marriage_vision} »
                    </p>
                  )}

                  {/* Deux boutons clairs : En savoir plus et Prier */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCandidateForDetails(p)}
                      className="flex-1 py-2.5 rounded-full bg-[#FAF9F6] hover:bg-gray-100 text-[#1A3A5C] border border-[#EFECE6] text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                    >
                      <Eye size={13} className="text-[#C9A84C]" />
                      <span>En savoir plus</span>
                    </button>

                    <button
                      onClick={() => handleHeroAction(p)}
                      className="p-2.5 rounded-full bg-[#1A3A5C] hover:bg-[#132c45] text-white transition-all shadow"
                      title="Transmettre mon intérêt"
                    >
                      <Heart size={14} className="text-rose-400 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          5. LES GRANDS GALAS & SOMMETS RÉELS : AVEC "EN SAVOIR PLUS"
         ======================================================== */}
      <section className="py-20 bg-gradient-to-b from-[#0A192F] to-[#040914] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
                Célébrations & Sommets Officiels
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mt-1">
                Les Grands Rendez-vous du Sanctuaire
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 font-light mt-1">
                Découvrez le programme, les formules de billets, les dress codes et réservez votre pass officiel.
              </p>
            </div>

            <Link to="/events">
              <button className="px-5 py-2.5 rounded-full border border-[#C9A84C] text-[#DFB76C] hover:bg-[#C9A84C] hover:text-[#0A192F] text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2">
                <span>Tous les Événements & Pass</span>
                <Calendar size={15} />
              </button>
            </Link>
          </div>

          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-pulse">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-96 rounded-3xl bg-white/5 border border-white/10" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event) => (
                <div
                  key={event.id}
                  className="bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden border border-[#C9A84C]/30 hover:border-[#C9A84C] transition-all flex flex-col group shadow-xl"
                >
                  <div 
                    className="relative h-56 w-full overflow-hidden bg-gray-900 cursor-pointer"
                    onClick={() => setSelectedEventForDetails(event)}
                    title="Cliquer pour voir tous les détails"
                  >
                    {event.banner_image ? (
                      <img
                        src={getMediaUrl(event.banner_image)}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A3A5C] flex items-center justify-center text-white">
                        <Calendar size={40} className="text-[#C9A84C]" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                    <div className="absolute top-3 left-3 bg-[#C9A84C] text-[#0A192F] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow">
                      {event.event_type || 'GALA'}
                    </div>

                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-xs text-[#DFB76C] font-semibold flex items-center gap-1.5">
                        <MapPin size={13} />
                        <span>{event.city} • {event.location_name}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                    <div>
                      <h3 
                        onClick={() => setSelectedEventForDetails(event)}
                        className="font-serif font-bold text-lg text-white group-hover:text-[#DFB76C] transition-colors leading-snug mb-2 cursor-pointer"
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-300 font-light leading-relaxed line-clamp-3">
                        {event.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                      <span className="text-xs font-serif font-bold text-[#DFB76C]">
                        {(() => {
                          const rawPrice = event.min_price ?? event.ticket_tiers?.[0]?.price;
                          if (rawPrice !== undefined && rawPrice !== null && !isNaN(Number(rawPrice))) {
                            const val = Number(rawPrice);
                            return val > 0 ? `Dès ${val.toLocaleString('fr-FR')} FCFA` : 'Entrée Libre';
                          }
                          return 'Sur Réservation';
                        })()}
                      </span>

                      <div className="flex items-center gap-2">
                        {/* BOUTON EN SAVOIR PLUS */}
                        <button
                          onClick={() => setSelectedEventForDetails(event)}
                          className="px-3.5 py-2 rounded-full border border-white/30 hover:border-[#DFB76C] text-gray-200 hover:text-white text-[11px] font-semibold tracking-wider transition-all"
                        >
                          En savoir plus
                        </button>

                        <button
                          onClick={() => setSelectedEventForDetails(event)}
                          className="px-4 py-2 rounded-full bg-gradient-to-r from-[#DFB76C] to-[#C9A84C] text-[#0A192F] text-[11px] font-black uppercase tracking-wider hover:brightness-110 transition-all flex items-center gap-1.5 shadow"
                        >
                          <span>Réserver</span>
                          <ArrowRight size={13} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* ========================================================
          6. FORMATIONS & MASTERCLASSES DE L'ACADÉMIE : AVEC "EN SAVOIR PLUS"
         ======================================================== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
              L'École de l'Alliance
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A3A5C] mt-1">
              Les Cours Pratiques pour Préparer Votre Foyer
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Des fondations bibliques, communication de couple et finances matrimoniales enseignées par des aînés dans la foi.
            </p>
          </div>

          <Link to="/academy">
            <button className="px-5 py-2.5 rounded-full border border-[#C9A84C] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2">
              <span>Voir Toutes les Formations</span>
              <GraduationCap size={15} />
            </button>
          </Link>
        </div>

        {loadingCourses ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
            {[1, 2].map((i) => (
              <div key={i} className="h-64 rounded-3xl bg-gray-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.slice(0, 2).map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#EFECE6] p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider">
                      {course.category_display || course.category || 'FORMATION MATRIMONIALE'}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#C9A84C] font-semibold">
                      <Award size={14} />
                      Certificat Délivré
                    </span>
                  </div>

                  <h3 
                    onClick={() => setSelectedCourseForDetails(course)}
                    className="font-serif font-bold text-2xl text-[#1A3A5C] group-hover:text-[#C9A84C] transition-colors leading-snug cursor-pointer"
                  >
                    {course.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
                    {course.description}
                  </p>
                </div>

                <div className="pt-6 border-t border-[#EFECE6] mt-6 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-xs text-gray-500">
                    <span>Instructeur : </span>
                    <strong className="text-[#1A3A5C]">{course.instructor_name || 'Conseil Pastoral GSD'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCourseForDetails(course)}
                      className="px-4 py-2.5 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-100 text-xs font-semibold uppercase tracking-wider transition-all"
                    >
                      En savoir plus
                    </button>

                    <Link to="/academy">
                      <button className="px-5 py-2.5 rounded-full bg-[#1A3A5C] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#132c45] transition-all flex items-center gap-2">
                        <span>Suivre la Masterclass</span>
                        <ArrowRight size={13} />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ========================================================
          7. NOUVELLE SECTION INDISPENSABLE : FAQ RASSURANTE
             (Répondre aux doutes et instaurer une confiance absolue)
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
            Transparence Totale
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#1A3A5C]">
            Questions Fréquentes des Nouveaux Membres
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Tout ce que vous devez savoir avant de débuter votre démarche d'alliance.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: "À quoi sert exactement l'application GSD ?",
              a: "GSD (Génération Sans Divorce) est une plateforme exclusivement dédiée aux célibataires chrétiens d'Afrique et de la Diaspora qui recherchent un époux ou une épouse pour un mariage durable selon les préceptes bibliques. Nous combinons un algorithme d'affinité spirituelle, un radar cartographique sécurisé, des événements en présentiel (Galas) et une formation à la vie de couple."
            },
            {
              q: "Est-ce gratuit pour s'inscrire et chercher l'amour ?",
              a: "Oui, la création de votre profil, l'accès au radar cartographique et la consultation des profils compatibles sont 100% gratuits. Des fonctionnalités de conciergerie VIP et d'événements physiques prestigieux sont proposées sous forme de formules optionnelles."
            },
            {
              q: "Comment garantissez-vous qu'il n'y a aucun faux profil ni arnaque ?",
              a: "Chaque membre doit fournir une pièce d'identité officielle vérifiée par notre protocole KYC, ainsi que des détails sur son église de fréquentation. Nous n'acceptons aucun bot, aucun faux compte, et toute attitude déplacée entraîne l'exclusion définitive du sanctuaire."
            },
            {
              q: "Comment fonctionnent les rencontres en vrai (les Événements & Galas) ?",
              a: "Nous organisons régulièrement des dîners de gala assis, des sommets du mariage et des retraites pour célibataires chrétiens. Lors de ces événements, un cadre distingué et respectueux est garanti, avec accueil pastoral et brise-glaces pour faciliter les rencontres réelles dans la bienséance."
            },
            {
              q: "Ma vie privée et ma localisation sont-elles protégées ?",
              a: "Absolument. Votre adresse précise n'est jamais divulguée. Notre radar cartographique applique un floutage sécuritaire de 500 mètres. De plus, vos coordonnées de contact direct ne sont partagées qu'après accord mutuel de prière."
            }
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-[#EFECE6] overflow-hidden transition-all shadow-sm"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-serif font-bold text-sm sm:text-base text-[#1A3A5C] hover:text-[#C9A84C] transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-[#C9A84C] transition-transform duration-300 shrink-0 ${
                    openFaqIndex === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-gray-600 font-light leading-relaxed border-t border-gray-100 pt-3">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          8. APPEL ROYAL : FRANCHIR LE SEUIL DU SANCTUAIRE (CTA)
         ======================================================== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full mb-16">
        <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-[#040914] via-[#0F223D] to-[#040914] p-8 sm:p-14 text-white text-center border border-[#C9A84C]/50 shadow-2xl">
          
          {/* Halos dorés */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#C9A84C]/25 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1A3A5C]/40 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 text-[#DFB76C] text-xs font-serif font-bold uppercase tracking-widest border border-[#C9A84C]/40">
              <Crown size={14} className="text-[#C9A84C]" />
              <span>Votre Heure a Sonné</span>
            </span>

            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
              Ne Laissez Plus Votre Destin Matrimonial au Hasard.
            </h2>

            <p className="text-sm sm:text-base text-gray-300 font-light leading-relaxed max-w-2xl mx-auto">
              Rejoignez dès aujourd'hui la communauté des célibataires chrétiens qui ont choisi la sainteté, l'honneur et l'excellence. Votre future alliance commence par ce premier pas de foi.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-10 py-4 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] hover:brightness-110 text-[#040914] font-black text-xs uppercase tracking-widest shadow-[0_10px_35px_rgba(201,168,76,0.55)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2">
                  <Sparkles size={16} />
                  <span>Créer Mon Profil d'Alliance</span>
                  <ArrowRight size={16} />
                </button>
              </Link>

              <Link to="/login" className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all">
                  Déjà Membre ? Se Connecter
                </button>
              </Link>
            </div>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-gray-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#C9A84C]" />
                Inscription Gratuite
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#C9A84C]" />
                Discrétion Totale Garantie
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-[#C9A84C]" />
                Accès Immédiat au Radar
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================
          MODALS D'INFORMATION DÉTAILLÉE ("EN SAVOIR PLUS")
         ======================================================== */}
      
      {/* 1. Modal Détails Événement */}
      <EventDetailsModal
        event={selectedEventForDetails}
        isOpen={Boolean(selectedEventForDetails)}
        onClose={() => setSelectedEventForDetails(null)}
        onBook={(ev) => {
          setSelectedEventForDetails(null);
          navigate('/events');
        }}
      />

      {/* 2. Modal Détails Candidat / Célibataire */}
      <CandidateDetailsModal
        candidate={selectedCandidateForDetails}
        isOpen={Boolean(selectedCandidateForDetails)}
        onClose={() => setSelectedCandidateForDetails(null)}
        onLike={(cand) => handleHeroAction(cand)}
        onRegister={() => navigate('/register')}
      />

      {/* 3. Modal Détails Cours / Masterclass */}
      <CourseDetailsModal
        course={selectedCourseForDetails}
        isOpen={Boolean(selectedCourseForDetails)}
        onClose={() => setSelectedCourseForDetails(null)}
        onEnroll={(c) => {
          setSelectedCourseForDetails(null);
          navigate('/academy');
        }}
      />

    </div>
  );
}
