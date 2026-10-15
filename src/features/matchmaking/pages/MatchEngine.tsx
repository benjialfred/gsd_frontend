import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { getMediaUrl } from '../../../services/profile';
import { toast } from '../../../stores/useToastStore';
import { 
  Heart, X, Star, Search, Loader, Info, ShieldCheck, MapPin, 
  Church, GraduationCap, Briefcase, MessageCircle, ChevronLeft, 
  ChevronRight, Sparkles, RefreshCw, Flame, CheckCircle, ArrowRight,
  Compass
} from 'lucide-react';
import type { MatchCandidate } from '../types';
import { MatchCardSkeleton, MatchListSkeleton } from '../../../components/common/Skeletons';
import MatchMapDiscovery from '../components/MatchMapDiscovery';

export default function MatchEngine() {
  const { token, user: currentUser } = useAuthStore();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'discover' | 'map' | 'matches'>('discover');
  const [candidates, setCandidates] = useState<MatchCandidate[]>([]);
  const [confirmedMatches, setConfirmedMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMatches, setLoadingMatches] = useState(true);
  const [limitReached, setLimitReached] = useState(false);
  const [resetTime, setResetTime] = useState<string | null>(null);

  // Carte en cours
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  const [detailCandidate, setDetailCandidate] = useState<MatchCandidate | null>(null);

  // Popup de match mutuel
  const [matchPopup, setMatchPopup] = useState<{
    isOpen: boolean;
    partner: any;
    matchId?: number;
  }>({ isOpen: false, partner: null });

  // 1. Charger les suggestions
  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/matchmaking/suggestions/');
      if (res.data.limit_reached) {
        setLimitReached(true);
        setResetTime(res.data.reset_at);
        setCandidates([]);
      } else {
        setLimitReached(false);
        setCandidates(res.data.suggestions || []);
        setActivePhotoIndex(0);
      }
    } catch (err: any) {
      console.error("Suggestions error", err);
      // Ne pas écraser les candidats si on en a déjà en mémoire/cache !
      toast.error("Impossible d'actualiser les suggestions de profil.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Charger les matches confirmés
  const fetchMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await api.get('/api/matchmaking/matches/');
      const accepted = res.data.filter((m: any) => m.is_accepted);
      setConfirmedMatches(accepted);
    } catch (err) {
      console.error("Matches error", err);
    } finally {
      setLoadingMatches(false);
    }
  };

  useEffect(() => {
    fetchSuggestions();
    fetchMatches();
  }, [token]);

  // Réinitialiser l'index photo à chaque changement de profil en haut de la pile
  useEffect(() => {
    setActivePhotoIndex(0);
  }, [candidates.length]);

  // Actions de Swipe
  const handleAction = async (targetId: number, action: 'LIKE' | 'PASS' | 'SUPER_LIKE') => {
    const swipedCandidate = candidates.find(c => c.candidate_id === targetId);
    
    // Retrait optimiste de la pile
    setCandidates(prev => prev.filter(c => c.candidate_id !== targetId));
    setActivePhotoIndex(0);
    if (detailCandidate?.candidate_id === targetId) {
      setDetailCandidate(null);
    }

    try {
      const res = await api.post('/api/matchmaking/action/', {
        target_user_id: targetId,
        action
      });

      if (res.data.is_match) {
        // MATCH MUTUEL DÉTECTÉ !
        const partnerData = res.data.partner || {
          id: targetId,
          first_name: swipedCandidate?.profile.first_name || "Partenaire",
          city: swipedCandidate?.profile.city || "",
          avatar: swipedCandidate?.profile.primary_photo || null,
          compatibility: swipedCandidate?.compatibility || 85
        };

        setMatchPopup({
          isOpen: true,
          partner: partnerData,
          matchId: res.data.match_id
        });

        fetchMatches(); // Rafraîchir la liste des affinités
      } else if (action === 'LIKE') {
        toast.success(`Votre intérêt pour ${swipedCandidate?.profile.first_name || 'ce profil'} a été transmis discrètement.`);
      }
    } catch (err: any) {
      console.error("Action error", err);
      toast.error("Une erreur est survenue lors de l'enregistrement de votre choix.");
    }
  };

  // Navigation dans les photos du candidat courant
  const nextPhoto = (e: React.MouseEvent, photosCount: number) => {
    e.stopPropagation();
    if (photosCount > 1) {
      setActivePhotoIndex(prev => (prev + 1) % photosCount);
    }
  };

  const prevPhoto = (e: React.MouseEvent, photosCount: number) => {
    e.stopPropagation();
    if (photosCount > 1) {
      setActivePhotoIndex(prev => (prev - 1 + photosCount) % photosCount);
    }
  };

  const topCandidate = candidates.length > 0 ? candidates[0] : null;

  return (
    <div className="h-full w-full bg-[#FAF9F6] flex flex-col overflow-y-auto">
      {/* Header avec Tabs Luxe */}
      <div className="bg-white border-b border-[#EFECE6] sticky top-0 z-30 px-6 py-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-bold text-[#1A3A5C]">Rencontres Chrétiennes</h1>
            <p className="text-xs text-[#C9A84C] font-semibold tracking-wider uppercase mt-0.5">
              Harmonie de Foi & Vision Sacrée
            </p>
          </div>

          <div className="flex bg-[#FAF9F6] p-1 rounded-full border border-[#EFECE6] shadow-inner">
            <button
              onClick={() => setActiveTab('discover')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'discover'
                  ? 'bg-[#1A3A5C] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1A3A5C]'
              }`}
            >
              <span>Découvrir</span>
              {loading ? (
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              ) : (
                <span>({candidates.length})</span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-[#1A3A5C] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1A3A5C]'
              }`}
            >
              <Compass size={14} className={activeTab === 'map' ? 'text-[#C9A84C]' : 'text-gray-400'} />
              <span>Carte Radar</span>
            </button>

            <button
              onClick={() => { setActiveTab('matches'); fetchMatches(); }}
              className={`px-4 sm:px-5 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'matches'
                  ? 'bg-[#1A3A5C] text-white shadow-md'
                  : 'text-gray-600 hover:text-[#1A3A5C]'
              }`}
            >
              <span>Affinités Divines</span>
              {loadingMatches ? (
                <span className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
              ) : confirmedMatches.length > 0 ? (
                <span className="w-4 h-4 rounded-full bg-[#C9A84C] text-white text-[10px] flex items-center justify-center font-bold">
                  {confirmedMatches.length}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
        {activeTab === 'map' ? (
          <div className="w-full max-w-5xl py-2">
            <MatchMapDiscovery 
              onMutualMatch={(partner, matchId) => {
                setMatchPopup({
                  isOpen: true,
                  partner,
                  matchId
                });
                fetchMatches();
              }}
            />
          </div>
        ) : activeTab === 'discover' && loading ? (
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <MatchCardSkeleton />
            <p className="text-xs uppercase tracking-widest text-[#1A3A5C]/60 font-medium">Recherche d'âmes complémentaires...</p>
          </div>
        ) : activeTab === 'matches' ? (
          /* VUE DES MATCHS CONFIRMÉS */
          <div className="w-full max-w-4xl py-4">
            {loadingMatches ? (
              <div className="space-y-4">
                <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                <MatchListSkeleton />
              </div>
            ) : confirmedMatches.length === 0 ? (
              <div className="text-center p-12 bg-white rounded-3xl border border-[#EFECE6] shadow-sm max-w-md mx-auto">
                <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
                  <Heart size={30} className="fill-current/30" />
                </div>
                <h3 className="text-xl font-serif font-bold text-[#1A3A5C] mb-2">Aucune affinité confirmée</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Continuez à explorer les profils. Dès qu'un intérêt réciproque est manifesté, il apparaîtra ici.
                </p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-3 rounded-full bg-[#1A3A5C] text-white text-xs font-semibold uppercase tracking-wider shadow-md hover:bg-[#132c45] transition-all"
                >
                  Reprendre la découverte
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-serif font-bold text-[#1A3A5C]">
                    Vos Cœurs Connectés ({confirmedMatches.length})
                  </h2>
                  <p className="text-xs text-gray-400">Matchs mutuellement bénis</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {confirmedMatches.map(match => {
                    const isUser1 = match.user1 === currentUser?.id;
                    const partner = isUser1 ? match.user2_details : match.user1_details;
                    const partnerName = partner?.first_name 
                      ? `${partner.first_name} ${partner.last_name || ''}`.trim() 
                      : `Partenaire #${isUser1 ? match.user2 : match.user1}`;
                    const avatarUrl = partner?.avatar ? getMediaUrl(partner.avatar) : null;

                    return (
                      <div 
                        key={match.id}
                        className="bg-white rounded-3xl border border-[#EFECE6] overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col"
                      >
                        <div className="h-44 bg-gray-100 relative">
                          {avatarUrl ? (
                            <img 
                              src={avatarUrl} 
                              alt={partnerName} 
                              className="w-full h-full object-cover"
                              onError={(e: any) => {
                                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(partnerName)}&background=ebd18b&color=082a5e`;
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-[#1A3A5C] to-[#2d5985] flex items-center justify-center text-white text-3xl font-serif">
                              {partnerName.charAt(0)}
                            </div>
                          )}
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-[#C9A84C] shadow-sm flex items-center gap-1">
                            <Sparkles size={12} /> {match.compatibility_score || 85}%
                          </div>
                        </div>

                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div>
                            <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">{partnerName}</h3>
                            <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                              <span className="flex items-center gap-1"><MapPin size={12} className="text-[#C9A84C]" /> {partner?.city || 'Douala'}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><Church size={12} className="text-[#C9A84C]" /> {partner?.denomination?.replace('_', ' ') || 'Chrétien(ne)'}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => navigate(`/app/messages?match_id=${match.id}`)}
                            className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#1A3A5C] to-[#244f7d] text-white text-xs font-semibold flex items-center justify-center gap-2 hover:shadow-md transition-all"
                          >
                            <MessageCircle size={15} />
                            Ouvrir la conversation
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : topCandidate ? (
          /* PILE DE CARTES INTERACTIVES */
          <div className="relative w-full max-w-sm sm:max-w-md h-[620px] flex items-center justify-center">
            {/* Carte de fond pour effet de profondeur */}
            {candidates.length > 1 && (
              <div className="absolute inset-0 top-3 scale-[0.96] rounded-[2.5rem] bg-[#EFECE6] border border-gray-200 shadow-md pointer-events-none opacity-60 z-0" />
            )}

            {/* Carte principale interactive */}
            {(() => {
              const p = topCandidate.profile;
              const photos = (p.photos && p.photos.length > 0) 
                ? p.photos 
                : (p.primary_photo ? [p.primary_photo] : []);
              const currentPhotoUrl = photos.length > 0 ? photos[activePhotoIndex % photos.length] : null;

              return (
                <div className="relative w-full h-full bg-white rounded-[2.5rem] shadow-2xl border border-[#EFECE6] overflow-hidden flex flex-col z-10 animate-in fade-in zoom-in-95 duration-300">
                  {/* Photo Hero & Carrousel Stories */}
                  <div className="relative h-[65%] w-full bg-gray-100 overflow-hidden select-none">
                    {/* Story Bars si plusieurs photos */}
                    {photos.length > 1 && (
                      <div className="absolute top-3 left-4 right-4 z-20 flex gap-1.5">
                        {photos.map((_, i) => (
                          <div 
                            key={i} 
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                              i === activePhotoIndex ? 'bg-white shadow-md' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Image courante */}
                    {currentPhotoUrl ? (
                      <img 
                        src={getMediaUrl(currentPhotoUrl)} 
                        alt={p.first_name} 
                        className="w-full h-full object-cover"
                        onError={(e: any) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(p.first_name)}&background=ebd18b&color=082a5e&size=512`;
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-b from-[#1A3A5C] to-[#0d2238] flex flex-col items-center justify-center text-white">
                        <span className="text-6xl font-serif font-light mb-2">{p.first_name.charAt(0)}</span>
                        <span className="text-xs text-[#ebd18b] uppercase tracking-widest">Profil Vérifié</span>
                      </div>
                    )}

                    {/* Gradient Overlay pour lisibilité */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                    {/* Contrôles tactiles de navigation photo */}
                    {photos.length > 1 && (
                      <>
                        <button 
                          onClick={(e) => prevPhoto(e, photos.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-20"
                        >
                          <ChevronLeft size={18} />
                        </button>
                        <button 
                          onClick={(e) => nextPhoto(e, photos.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 backdrop-blur text-white flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity z-20"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </>
                    )}

                    {/* Badge de compatibilité flottant */}
                    <div className="absolute top-7 right-4 z-20 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-lg border border-[#C9A84C]/30 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#C9A84C]" />
                      <span className="text-xs font-serif font-bold text-[#1A3A5C]">
                        {topCandidate.compatibility}% Affinité
                      </span>
                    </div>

                    {/* Bouton Info détail */}
                    <button 
                      onClick={() => setDetailCandidate(topCandidate)}
                      className="absolute top-7 left-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur text-white flex items-center justify-center hover:bg-black/60 transition-all shadow-md"
                      title="En savoir plus"
                    >
                      <Info size={16} />
                    </button>

                    {/* Identité sur l'image */}
                    <div className="absolute bottom-4 left-6 right-6 z-20 text-white">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-3xl font-serif font-bold tracking-tight">{p.first_name}</h2>
                        {p.age && <span className="text-2xl font-light opacity-90">, {p.age}</span>}
                        {p.kyc_verified && (
                          <span title="Profil vérifié">
                            <ShieldCheck size={20} className="text-emerald-400 fill-emerald-400/20" />
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-white/90">
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-[#ebd18b]" /> {p.city}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Church size={12} className="text-[#ebd18b]" /> {p.denomination?.replace('_', ' ') || 'Chrétien(ne)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Bas de carte : Points forts & Actions */}
                  <div className="flex-1 p-5 bg-white flex flex-col justify-between">
                    {/* Points forts */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-bold text-[#1A3A5C]/60 uppercase tracking-widest">
                          Convergence Spirituelle
                        </span>
                        <button 
                          onClick={() => setDetailCandidate(topCandidate)}
                          className="text-[11px] font-semibold text-[#C9A84C] hover:underline"
                        >
                          Voir détails →
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {topCandidate.highlights && topCandidate.highlights.length > 0 ? (
                          topCandidate.highlights.map((h, i) => (
                            <span 
                              key={i} 
                              className="text-[11px] bg-[#FAF9F6] text-[#1A3A5C] px-2.5 py-1 rounded-full border border-[#EFECE6] font-medium"
                            >
                              {h}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] bg-[#FAF9F6] text-[#1A3A5C] px-2.5 py-1 rounded-full border border-[#EFECE6]">
                            Profil chrétien engagé
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                        {p.marriage_objectives || p.bio || "Recherche d'une communion conjugale épanouie et sainte."}
                      </p>
                    </div>

                    {/* Barre d'Actions de Swipe */}
                    <div className="flex items-center justify-center gap-6 pt-3 border-t border-gray-100">
                      {/* Passer */}
                      <button 
                        onClick={() => handleAction(topCandidate.candidate_id, 'PASS')}
                        className="w-14 h-14 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50/50 flex items-center justify-center transition-all shadow-md hover:scale-105 active:scale-95"
                        title="Passer"
                      >
                        <X size={24} />
                      </button>

                      {/* Info / Détails */}
                      <button 
                        onClick={() => setDetailCandidate(topCandidate)}
                        className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#EFECE6] text-[#1A3A5C] hover:bg-[#EFECE6] flex items-center justify-center transition-all shadow-sm"
                        title="Consulter le profil complet"
                      >
                        <Info size={20} />
                      </button>

                      {/* Coup de cœur / Super Like */}
                      <button 
                        onClick={() => handleAction(topCandidate.candidate_id, 'SUPER_LIKE')}
                        className="w-12 h-12 rounded-full bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100 flex items-center justify-center transition-all shadow-sm hover:scale-105"
                        title="Coup de cœur divin"
                      >
                        <Star size={20} className="fill-current" />
                      </button>

                      {/* Like */}
                      <button 
                        onClick={() => handleAction(topCandidate.candidate_id, 'LIKE')}
                        className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#e8c66e] text-white flex items-center justify-center shadow-lg shadow-[#C9A84C]/30 hover:scale-110 active:scale-95 transition-all"
                        title="Aimer ce profil"
                      >
                        <Heart size={28} className="fill-current" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        ) : (
          /* AUCUN PROFIL DISPONIBLE OU LIMITE ATTEINTE */
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-3xl border border-[#EFECE6] shadow-md max-w-md text-center">
            <div className="w-16 h-16 bg-[#C9A84C]/10 rounded-full flex items-center justify-center text-[#C9A84C] mb-4">
              <Search size={32} />
            </div>
            
            {limitReached ? (
              <>
                <h3 className="text-xl font-serif font-bold text-[#1A3A5C] mb-2">Patience & Modération</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Vous avez atteint votre quota quotidien de découvertes. Prenez le temps de prier et d'échanger avec vos connexions.
                </p>
                <div className="p-3 bg-[#FAF9F6] rounded-2xl border border-[#EFECE6] text-xs text-gray-600 mb-6">
                  Réinitialisation à minuit.
                </div>
              </>
            ) : (
              <>
                <h3 className="text-xl font-serif font-bold text-[#1A3A5C] mb-2">Tous les profils ont été explorés</h3>
                <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                  Vous avez parcouru toutes les âmes sœurs actuellement disponibles selon vos critères. De nouveaux membres rejoignent Le Salon régulièrement !
                </p>
              </>
            )}

            <div className="flex flex-col w-full gap-3">
              <button 
                onClick={fetchSuggestions}
                className="w-full py-3.5 rounded-full bg-[#1A3A5C] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#132c45] transition-all shadow-md"
              >
                <RefreshCw size={15} />
                Actualiser la recherche
              </button>
              <button 
                onClick={() => navigate('/app/messages')}
                className="w-full py-3.5 rounded-full bg-white border border-[#1A3A5C] text-[#1A3A5C] text-xs font-semibold uppercase tracking-wider hover:bg-[#FAF9F6] transition-all"
              >
                Accéder à mes messages
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL DU PROFIL COMPLET DÉTAILLÉ */}
      {detailCandidate && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white w-full sm:max-w-2xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300">
            {/* Header du tiroir */}
            <div className="p-5 border-b border-[#EFECE6] flex items-center justify-between bg-[#FAF9F6]">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">
                  Profil de {detailCandidate.profile.first_name}
                </h3>
                <span className="text-xs text-[#C9A84C] font-semibold">
                  {detailCandidate.compatibility}% d'harmonie divine
                </span>
              </div>
              <button 
                onClick={() => setDetailCandidate(null)}
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Corps défilable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Galerie photos */}
              {detailCandidate.profile.photos && detailCandidate.profile.photos.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#1A3A5C]/60 uppercase tracking-widest mb-3">
                    Photos ({detailCandidate.profile.photos.length})
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {detailCandidate.profile.photos.map((url, idx) => (
                      <div key={idx} className="h-44 rounded-2xl overflow-hidden bg-gray-100 shadow-sm border border-gray-100">
                        <img 
                          src={getMediaUrl(url)} 
                          alt="" 
                          className="w-full h-full object-cover hover:scale-105 transition-transform" 
                          onError={(e: any) => {
                            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(detailCandidate.profile.first_name)}&background=ebd18b&color=082a5e`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Baromètre de compatibilité */}
              <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#EFECE6]">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={18} className="text-[#C9A84C]" />
                  <h4 className="font-serif font-bold text-[#1A3A5C] text-sm">Baromètre de Compatibilité</h4>
                </div>

                <div className="space-y-3">
                  {[
                    { label: "Foi & Spiritualité", val: detailCandidate.compatibility_breakdown?.faith || 80 },
                    { label: "Vision du Mariage & Valeurs", val: detailCandidate.compatibility_breakdown?.values || 85 },
                    { label: "Style de vie & Intérêts", val: detailCandidate.compatibility_breakdown?.lifestyle || 70 },
                    { label: "Proximité géographique", val: detailCandidate.compatibility_breakdown?.location || 90 },
                  ].map((item, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600 font-medium">{item.label}</span>
                        <span className="font-bold text-[#1A3A5C]">{item.val}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#C9A84C] to-[#ebd18b] rounded-full transition-all duration-500" 
                          style={{ width: `${item.val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Vie Spirituelle */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1A3A5C]/60 uppercase tracking-widest flex items-center gap-1.5">
                  <Church size={14} className="text-[#C9A84C]" /> Vie Spirituelle
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Dénomination :</span>
                    <strong className="text-gray-800 font-medium">{detailCandidate.profile.denomination || 'Chrétienne'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Pratique du culte :</span>
                    <strong className="text-gray-800 font-medium">{detailCandidate.profile.church_attendance || 'Régulière'}</strong>
                  </div>
                  {detailCandidate.profile.spiritual_commitment && (
                    <div className="sm:col-span-2 pt-2 border-t border-gray-200">
                      <span className="text-gray-400 block mb-0.5">Témoignage spirituel :</span>
                      <p className="text-gray-700 leading-relaxed">{detailCandidate.profile.spiritual_commitment}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Vision du Mariage */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1A3A5C]/60 uppercase tracking-widest flex items-center gap-1.5">
                  <Heart size={14} className="text-[#C9A84C]" /> Vision du Mariage
                </h4>
                <div className="bg-gray-50 p-4 rounded-2xl space-y-3 text-xs">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Objectifs matrimoniaux :</span>
                    <p className="text-gray-800 leading-relaxed font-medium">
                      {detailCandidate.profile.marriage_objectives || "Fonder un foyer centré sur le Seigneur."}
                    </p>
                  </div>
                  {detailCandidate.profile.marriage_values && (
                    <div>
                      <span className="text-gray-400 block mb-0.5">Valeurs clés :</span>
                      <p className="text-gray-700 leading-relaxed">{detailCandidate.profile.marriage_values}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Carrière & Formation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[#1A3A5C]/60 uppercase tracking-widest flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[#C9A84C]" /> Profession & Études
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-4 rounded-2xl">
                  <div>
                    <span className="text-gray-400 block mb-0.5">Profession :</span>
                    <strong className="text-gray-800 font-medium">{detailCandidate.profile.profession || 'Non précisée'}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block mb-0.5">Niveau d'études :</span>
                    <strong className="text-gray-800 font-medium">{detailCandidate.profile.education_level || 'Universitaire'}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions dans le modal */}
            <div className="p-4 bg-white border-t border-[#EFECE6] flex items-center justify-between gap-4">
              <button 
                onClick={() => {
                  handleAction(detailCandidate.candidate_id, 'PASS');
                  setDetailCandidate(null);
                }}
                className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-1.5"
              >
                <X size={16} /> Passer
              </button>

              <button 
                onClick={() => {
                  handleAction(detailCandidate.candidate_id, 'LIKE');
                  setDetailCandidate(null);
                }}
                className="flex-2 py-3 rounded-full bg-gradient-to-r from-[#C9A84C] to-[#e8c66e] text-white text-xs font-bold shadow-md hover:scale-[1.02] transition-all flex items-center justify-center gap-1.5"
              >
                <Heart size={16} className="fill-current" /> Aimer ce profil
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP SOMPTUEUX "MATCH DIVIN !" */}
      {matchPopup.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white p-8 sm:p-10 rounded-[2.5rem] border border-[#C9A84C]/40 flex flex-col items-center text-center max-w-md w-full shadow-2xl relative overflow-hidden animate-in zoom-in-90 duration-300">
            {/* Halo lumineux */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#C9A84C]/20 rounded-full blur-3xl pointer-events-none" />

            {/* Avatars jumeaux avec cœur doré central */}
            <div className="flex items-center justify-center relative mb-8">
              {/* Avatar Utilisateur Connecté */}
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 z-10 shrink-0">
                {currentUser?.avatar ? (
                  <img src={getMediaUrl(currentUser.avatar)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1A3A5C] text-white flex items-center justify-center text-2xl font-serif">
                    {currentUser?.first_name?.charAt(0) || 'V'}
                  </div>
                )}
              </div>

              {/* Cœur central ornemental */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#ebd18b] border-4 border-white shadow-xl text-white flex items-center justify-center -mx-3 z-20 shrink-0">
                <Heart size={20} className="fill-current animate-pulse" />
              </div>

              {/* Avatar Partenaire */}
              <div className="w-20 h-20 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100 z-10 shrink-0">
                {matchPopup.partner?.avatar ? (
                  <img src={getMediaUrl(matchPopup.partner.avatar)} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-[#1A3A5C] text-white flex items-center justify-center text-2xl font-serif">
                    {matchPopup.partner?.first_name?.charAt(0) || 'P'}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-widest">
                Par la Grâce de Dieu
              </span>
              <h2 className="text-3xl font-serif font-bold text-[#1A3A5C]">
                C'est un Match Divin !
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Vous et <strong className="text-[#1A3A5C]">{matchPopup.partner?.first_name}</strong> partagez un intérêt mutuel ({matchPopup.partner?.compatibility || 85}% d'harmonie).
              </p>
            </div>

            <div className="w-full space-y-3">
              <button 
                onClick={() => {
                  setMatchPopup({ isOpen: false, partner: null });
                  navigate(`/app/messages?match_id=${matchPopup.matchId}`);
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1A3A5C] to-[#244f7d] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                Échanger dans le Salon Privé
              </button>

              <button 
                onClick={() => setMatchPopup({ isOpen: false, partner: null })}
                className="w-full py-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-600 text-xs font-semibold transition-all"
              >
                Continuer à explorer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
