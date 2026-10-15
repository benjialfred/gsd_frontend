import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Star, Compass, ShieldCheck, Church, Sparkles, 
  ArrowRight, CheckCircle2, Lock, MapPin, Eye, Sliders, Users, Flame, RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { getMediaUrl } from '../../../services/profile';

export default function MatchmakingLanding() {
  const { user } = useAuthStore();
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIdx, setSelectedIdx] = useState(0);

  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const res = await api.get('/api/matchmaking/map-search/');
        const list = res.data.profiles || res.data.candidates || [];
        setCandidates(list);
      } catch (err) {
        console.error('Erreur chargement profils réels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCandidates();
  }, []);

  const current = candidates.length > 0 ? candidates[selectedIdx % candidates.length] : null;

  return (
    <div className="font-sans antialiased text-[#1A3A5C] bg-[#FAF9F6] min-h-screen flex flex-col pt-24">
      
      {/* 1. HERO MATCHMAKING */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A192F] via-[#0D2240] to-[#0A192F] text-white overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-[140px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto w-full text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#DFB76C] text-xs font-serif font-bold uppercase tracking-widest">
            <Compass size={14} className="text-[#C9A84C]" />
            <span>Le Radar des Âmes Sœurs Bénies</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF9F6] max-w-4xl mx-auto leading-tight">
            Là où les Cœurs Consacrés se Reconnaissent dans la Clarté.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Fini les algorithmes superficiels basés sur l'apparence passagère. Le Grand Salon Divin associe les célibataires chrétiens selon l'accord de foi, les objectifs de vie et la proximité géographique.
          </p>

          {/* CTA si connecté ou non */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/app/matches">
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-2">
                  <Compass size={16} />
                  <span>Ouvrir Mon Moteur de Rencontre en Direct</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>Créer Mon Profil Gratuitement</span>
                    <ArrowRight size={16} />
                  </button>
                </Link>
                <Link to="/login">
                  <button className="px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-bold uppercase tracking-wider transition-all">
                    Déjà Inscrit ? Se Connecter
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 2. DÉMONSTRATEUR D'AFFINITÉ EN DIRECT (PostgreSQL) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full -mt-12 relative z-20">
        <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-[#C9A84C]/30 shadow-2xl">
          
          <div className="text-center mb-8">
            <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
              Simulateur d'Affinité Réelle
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A3A5C] mt-1">
              Explorez la Précision du Moteur de Matching
            </h2>
          </div>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-3">
              <RefreshCw size={28} className="text-[#C9A84C] animate-spin" />
              <p className="text-xs text-gray-500">Chargement des profils vérifiés de la base...</p>
            </div>
          ) : candidates.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm">
              Aucun profil disponible pour le moment.
            </div>
          ) : (
            <>
              {/* Sélecteur de candidat réel */}
              <div className="flex justify-center flex-wrap gap-2 mb-8">
                {candidates.slice(0, 5).map((c, i) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedIdx(i)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold transition-all flex items-center gap-2 ${
                      selectedIdx === i
                        ? 'bg-[#1A3A5C] text-white shadow-md'
                        : 'bg-[#FAF9F6] text-gray-600 border border-[#EFECE6] hover:bg-gray-100'
                    }`}
                  >
                    <span>{c.first_name}{c.age ? `, ${c.age}` : ''}</span>
                    <span className="text-[10px] text-[#C9A84C]">({c.compatibility || 94}%)</span>
                  </button>
                ))}
              </div>

              {/* Fiche détaillée du candidat réel */}
              {current && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center bg-[#FAF9F6] rounded-3xl p-6 sm:p-8 border border-[#EFECE6]">
                  
                  {/* Colonne Photo */}
                  <div className="md:col-span-5 relative h-80 rounded-2xl overflow-hidden shadow-lg border-2 border-[#C9A84C]/30 bg-gray-900">
                    {current.avatar ? (
                      <img
                        src={getMediaUrl(current.avatar)}
                        alt={current.first_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#1A3A5C] flex flex-col items-center justify-center text-white">
                        <div className="w-16 h-16 rounded-full bg-[#C9A84C]/20 border-2 border-[#C9A84C] flex items-center justify-center text-2xl font-serif font-bold text-[#DFB76C] mb-2">
                          {current.first_name?.charAt(0) || '✦'}
                        </div>
                        <span className="text-xs uppercase tracking-widest text-[#DFB76C]">Profil Réel GSD</span>
                      </div>
                    )}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-[#DFB76C] border border-[#C9A84C]/40 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#C9A84C]" />
                      <span>{current.compatibility || 94}% Accord Sacré</span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 rounded-xl text-white">
                      <h3 className="text-xl font-serif font-bold">
                        {current.first_name}{current.age ? `, ${current.age} ans` : ''}
                      </h3>
                      <p className="text-xs text-gray-200">{current.profession || 'Membre GSD'}</p>
                    </div>
                  </div>

                  {/* Colonne Barres d'Harmonie */}
                  <div className="md:col-span-7 space-y-4">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-[#C9A84C] font-semibold">
                        <MapPin size={14} />
                        <span>{current.city || 'Douala'}</span>
                      </div>
                      <h4 className="text-lg font-serif font-bold text-[#1A3A5C] mt-1">
                        Confession : {current.denomination || 'Chrétien(ne)'}
                      </h4>
                      <p className="text-xs text-gray-500">
                        {current.church_attendance ? `Pratique : ${current.church_attendance}` : 'Engagement chrétien régulier'}
                      </p>
                    </div>

                    {/* Citation Vision réelle */}
                    {current.marriage_vision && (
                      <p className="text-xs text-gray-700 italic border-l-2 border-[#C9A84C] pl-3 py-1 bg-white p-2.5 rounded-r-xl border border-gray-100">
                        « {current.marriage_vision} »
                      </p>
                    )}

                    {/* Barres de compatibilité décomposée */}
                    <div className="space-y-2 pt-2 text-xs">
                      <div>
                        <div className="flex justify-between text-gray-600 mb-1">
                          <span className="font-medium">Harmonie Spirituelle & Doctrine</span>
                          <span className="font-bold text-[#1A3A5C]">
                            {current.breakdown?.faith || 95}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: `${current.breakdown?.faith || 95}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-600 mb-1">
                          <span className="font-medium">Vision du Rôle dans le Foyer</span>
                          <span className="font-bold text-[#1A3A5C]">
                            {current.breakdown?.values || 92}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${current.breakdown?.values || 92}%` }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-gray-600 mb-1">
                          <span className="font-medium">Style de Vie & Proximité</span>
                          <span className="font-bold text-[#1A3A5C]">
                            {current.breakdown?.lifestyle || 90}%
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-600 rounded-full" style={{ width: `${current.breakdown?.lifestyle || 90}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Link to={user ? "/app/matches" : "/register"}>
                        <button className="w-full py-3 rounded-full bg-[#1A3A5C] text-white text-xs font-bold uppercase tracking-wider shadow hover:bg-[#132c45] transition-all flex items-center justify-center gap-2">
                          <Heart size={14} className="text-[#C9A84C] fill-current" />
                          <span>Calculer Mon Affinité Réelle</span>
                        </button>
                      </Link>
                    </div>

                  </div>

                </div>
              )}
            </>
          )}

        </div>
      </section>

      {/* 3. LES 3 GARANTIES SACRÉES */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-2">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
            La Charte de Pureté
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#1A3A5C]">
            Nos Trois Engagements d'Honneur
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-3xl bg-white border border-[#EFECE6] shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A3A5C] mb-2">Vérification d'Identité Biométrique</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed">
              Pièce d'identité officielle et vérification faciale KYC obligatoires pour écarter tout profil trompeur.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#EFECE6] shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
              <Church size={28} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A3A5C] mb-2">Caution & Recommandation Pastorale</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed">
              Chaque membre peut faire valider son profil par son pasteur référent pour témoigner de son assiduité chrétienne.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-[#EFECE6] shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center mx-auto mb-4">
              <Lock size={28} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A3A5C] mb-2">Radar Sécurisé & Anti-Stalking</h3>
            <p className="text-xs text-gray-600 font-light leading-relaxed">
              Vos coordonnées exactes ne sont jamais divulguées. Notre radar applique un floutage sécuritaire de 500 mètres.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
