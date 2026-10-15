import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, BookOpen, Award, CheckCircle2, Play, 
  Sparkles, ArrowRight, Star, Clock, Users, ShieldCheck, Headphones, RefreshCw
} from 'lucide-react';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { getMediaUrl } from '../../../services/profile';

export default function AcademyLanding() {
  const { user } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await api.get('/api/academy/courses/');
        setCourses(res.data || []);
      } catch (err) {
        console.error('Erreur chargement cours réels:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="font-sans antialiased text-[#1A3A5C] bg-[#FAF9F6] min-h-screen flex flex-col pt-24">
      
      {/* 1. HERO ACADÉMIE */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#0A192F] via-[#0D2240] to-[#0A192F] text-white overflow-hidden">
        <div className="absolute top-1/3 right-1/3 w-96 h-96 bg-[#C9A84C]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#DFB76C] text-xs font-serif font-bold uppercase tracking-widest">
            <GraduationCap size={15} className="text-[#C9A84C]" />
            <span>L'École Royale du Mariage & de la Maturité</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[#FAF9F6] max-w-4xl mx-auto leading-tight">
            Un Mariage Glorieux se Prépare Dès le Célibat.
          </h1>

          <p className="text-sm sm:text-base text-gray-300 font-light max-w-2xl mx-auto leading-relaxed">
            Acquérez les compétences spirituelles, émotionnelles et financières indispensables. Obtenez votre Certificat d'Achèvement GSD et témoignez de votre investissement sacré auprès de vos prétendants.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {user ? (
              <Link to="/app/academy">
                <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-2">
                  <Play size={16} />
                  <span>Accéder à Mon Espace Étudiant</span>
                  <ArrowRight size={16} />
                </button>
              </Link>
            ) : (
              <>
                <Link to="/register">
                  <button className="px-8 py-4 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-xl hover:brightness-110 transition-all flex items-center gap-2">
                    <Sparkles size={16} />
                    <span>Commencer Ma Formation Gratuite</span>
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

        {/* METRICS DE L'ACADÉMIE */}
        <div className="max-w-5xl mx-auto mt-16 pt-8 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-serif font-bold text-[#DFB76C]">
              {courses.length > 0 ? `${courses.length} Cursus` : 'Formations'}
            </div>
            <div className="text-xs text-gray-300">Formations Actives en Base</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#DFB76C]">100%</div>
            <div className="text-xs text-gray-300">Fondement Biblique</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#DFB76C]">1,450+</div>
            <div className="text-xs text-gray-300">Célibataires Formés</div>
          </div>
          <div>
            <div className="text-2xl font-serif font-bold text-[#DFB76C]">Sceau d'Or</div>
            <div className="text-xs text-gray-300">Certificat GSD Délivré</div>
          </div>
        </div>
      </section>

      {/* 2. CATALOGUE DES FORMATIONS RÉELLES (PostgreSQL) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-serif font-bold uppercase tracking-widest text-[#C9A84C]">
            Cursus d'Excellence Réel
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A3A5C]">
            Nos Formations Diplomantes de Référence
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 font-light leading-relaxed">
            Chaque cours allie rigueur doctrinale, psychologie chrétienne et cas pratiques de la vie quotidienne pour bâtir un foyer solide.
          </p>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-3">
            <RefreshCw size={28} className="text-[#C9A84C] animate-spin" />
            <p className="text-xs text-gray-500">Chargement des formations depuis l'Académie...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-sm">
            Aucune formation disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#EFECE6] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col group"
              >
                {/* Photo & Badge */}
                <div className="relative h-56 w-full overflow-hidden bg-gray-900">
                  {course.image ? (
                    <img
                      src={getMediaUrl(course.image)}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-tr from-[#1A3A5C] to-[#0A192F] flex items-center justify-center text-white">
                      <GraduationCap size={44} className="text-[#DFB76C]" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3 bg-[#1A3A5C]/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-[#DFB76C] border border-[#C9A84C]/40">
                    {course.category_display || course.category || 'FORMATION'}
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1 text-[#DFB76C]">
                      <Star size={13} fill="currentColor" />
                      <strong>4.9</strong> (Apprenants GSD)
                    </span>
                    <span className="flex items-center gap-1 text-gray-300">
                      <Clock size={13} />
                      <span>{course.modules_count || 5} Modules</span>
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#1A3A5C] group-hover:text-[#C9A84C] transition-colors leading-snug mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-600 font-light leading-relaxed line-clamp-3">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EFECE6]">
                    <div className="text-xs font-semibold text-[#1A3A5C]">
                      Instructeur : {course.instructor_name || 'Conseil Pastoral GSD'}
                    </div>

                    <Link to={user ? "/app/academy" : "/register"} className="block mt-4">
                      <button className="w-full py-2.5 rounded-full bg-[#FAF9F6] hover:bg-[#1A3A5C] text-[#1A3A5C] hover:text-white border border-[#EFECE6] text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2">
                        <span>Suivre Cette Masterclass</span>
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

      {/* 3. LE CERTIFICAT OFFICIEL GSD */}
      <section className="py-20 bg-gradient-to-r from-[#0A192F] via-[#10243E] to-[#0A192F] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          
          <div className="md:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C]/40 text-[#DFB76C] text-xs font-serif font-bold uppercase tracking-widest">
              <Award size={14} className="text-[#C9A84C]" />
              <span>Sceau de Distinction Matrimoniale</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Affichez Votre Certificat d'Honneur sur Votre Profil GSD
            </h2>

            <p className="text-sm text-gray-300 font-light leading-relaxed">
              En achevant vos parcours à 100%, vous débloquez le badge officiel <strong>"Certifié Académie GSD"</strong>. Vos prétendants savent immédiatement qu'ils s'adressent à une personne préparée, investie et prête pour les responsabilités d'une alliance sacrée.
            </p>

            <ul className="space-y-2 text-xs text-gray-200">
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#C9A84C]" />
                <span>Validation par QCM théologique et études de cas réels</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#C9A84C]" />
                <span>Délivrance automatique du certificat PDF signé numériquement</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#C9A84C]" />
                <span>Augmente par 3 le taux d'affinité mutuelle sur la plateforme</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link to={user ? "/app/academy" : "/register"}>
                <button className="px-8 py-3.5 rounded-full bg-gradient-to-r from-[#DFB76C] to-[#C9A84C] text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
                  <span>Obtenir Mon Certificat</span>
                  <ArrowRight size={15} />
                </button>
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 flex justify-center">
            <div className="relative p-6 rounded-3xl bg-white/5 border border-[#C9A84C]/40 shadow-2xl backdrop-blur-md max-w-sm text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#C9A84C] to-amber-200 p-1 mx-auto flex items-center justify-center shadow-lg">
                <div className="w-full h-full rounded-full bg-[#0A192F] flex items-center justify-center text-[#DFB76C]">
                  <Award size={36} />
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-widest text-[#DFB76C] font-serif font-bold">
                  Certificat d'Excellence
                </span>
                <h4 className="font-serif font-bold text-lg text-white">
                  Préparation & Alliance Sacrée
                </h4>
                <p className="text-[11px] text-gray-400">
                  Délivré par Le Conseil Pastoral du Grand Salon Divin
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 text-[10px] text-gray-300 flex justify-between">
                <span>Statut : Accrédité</span>
                <span className="text-[#DFB76C] font-semibold">Promotion 2026</span>
              </div>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
