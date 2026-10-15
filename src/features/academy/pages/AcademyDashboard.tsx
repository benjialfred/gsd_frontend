import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { toast } from '../../../stores/useToastStore';
import { 
  BookOpen, Award, CheckCircle, Play, Loader, Shield, 
  ArrowLeft, Video, BookOpenCheck, Radio, Sparkles, Filter 
} from 'lucide-react';
import CourseCard from '../components/CourseCard';
import CourseStudyView from '../components/CourseStudyView';
import InstructorStudio from '../components/InstructorStudio';
import LibraryView from '../components/LibraryView';
import { CourseGridSkeleton } from '../../../components/common/Skeletons';

export default function AcademyDashboard() {
  const { token, user } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Vue principale : 'catalog' | 'library' | 'studio'
  const isInstructor = user?.role === 'FORMATEUR' || user?.role === 'ADMIN';
  const [currentTab, setCurrentTab] = useState<'catalog' | 'library' | 'studio'>(
    user?.role === 'FORMATEUR' ? 'studio' : 'catalog'
  );
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Cours en cours d'étude
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const fetchData = async () => {
    try {
      const [coursesRes, enrollmentsRes] = await Promise.all([
        api.get('/api/academy/courses/'),
        api.get('/api/academy/enrollments/')
      ]);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (err) {
      console.error("Erreur chargement académie:", err);
      toast.error("Impossible de charger les formations.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  // Inscription à un cours
  const handleEnroll = async (courseId: number) => {
    try {
      const res = await api.post(`/api/academy/courses/${courseId}/enroll/`);
      toast.success(res.data.message || "Inscription validée !");
      await fetchData();
      
      // Ouvrir directement le cours
      const target = courses.find(c => c.id === courseId);
      if (target) {
        setSelectedCourse(target);
      }
    } catch (err: any) {
      console.error("Erreur inscription:", err);
      toast.error("Échec de l'inscription au cours.");
    }
  };

  // Validation d'une leçon
  const handleCompleteLesson = async (lessonId: number) => {
    try {
      const res = await api.post(`/api/academy/lessons/${lessonId}/complete/`);
      toast.success(res.data.message || "Leçon validée avec succès !");
      
      // Rafraîchir les données et mettre à jour le cours sélectionné
      const [coursesRes, enrollmentsRes] = await Promise.all([
        api.get('/api/academy/courses/'),
        api.get('/api/academy/enrollments/')
      ]);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);

      if (selectedCourse) {
        const updated = coursesRes.data.find((c: any) => c.id === selectedCourse.id);
        if (updated) setSelectedCourse(updated);
      }
      return res.data;
    } catch (err) {
      console.error("Erreur complétion leçon:", err);
      toast.error("Impossible de valider la leçon.");
      throw err;
    }
  };

  // Filtrage des cours par catégorie
  const filteredCourses = courses.filter(c => {
    if (selectedCategory === 'ALL') return true;
    return c.category === selectedCategory;
  });

  // Si l'utilisateur est en train d'étudier un cours précis
  if (selectedCourse) {
    return (
      <CourseStudyView
        course={selectedCourse}
        onBack={() => {
          setSelectedCourse(null);
          fetchData();
        }}
        onCompleteLesson={handleCompleteLesson}
      />
    );
  }


  return (
    <div className="min-h-screen bg-[#FAF9F6] p-4 sm:p-6 lg:p-8 space-y-8">
      
      {/* En-tête prestigieux de l'Académie */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#EFECE6]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-bold font-serif mb-2">
            <Sparkles size={14} />
            <span>L'Institut de Transformation & Préparation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#1A3A5C] tracking-tight">
            Académie & Bibliothèque Spirituelle
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 max-w-xl mt-1 leading-relaxed">
            Nourrissez votre âme, découvrez les fondements divins de l'alliance et préparez votre cœur pour une union bénie.
          </p>
        </div>

        {/* Sélecteur d'onglets principaux (Catalogue, Bibliothèque, Studio Formateur) */}
        <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-full border border-[#EFECE6] shadow-xs shrink-0 overflow-x-auto">
          <button
            type="button"
            onClick={() => setCurrentTab('catalog')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'catalog'
                ? 'bg-[#1A3A5C] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1A3A5C]'
            }`}
          >
            <BookOpen size={14} />
            <span>Formations</span>
          </button>

          <button
            type="button"
            onClick={() => setCurrentTab('library')}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              currentTab === 'library'
                ? 'bg-[#1A3A5C] text-white shadow-sm'
                : 'text-gray-600 hover:text-[#1A3A5C]'
            }`}
          >
            <Radio size={14} />
            <span>Bibliothèque & Podcasts</span>
          </button>

          {/* Onglet Studio Formateur conditionnel */}
          {isInstructor && (
            <button
              type="button"
              onClick={() => setCurrentTab('studio')}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                currentTab === 'studio'
                  ? 'bg-[#C9A84C] text-[#1A3A5C] shadow-md font-serif'
                  : 'text-amber-800 hover:text-amber-950 font-medium'
              }`}
            >
              <Video size={14} />
              <span>Studio Formateur</span>
            </button>
          )}
        </div>
      </div>

      {/* VUE 1 : CATALOGUE DES COURS */}
      {currentTab === 'catalog' && (
        <div className="space-y-6">
          
          {/* Barre des filtres par catégorie */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
            <span className="text-xs text-gray-400 font-semibold flex items-center gap-1 mr-2 shrink-0">
              <Filter size={13} className="text-[#C9A84C]" /> Thématique :
            </span>

            {[
              { id: 'ALL', label: 'Toutes les formations' },
              { id: 'MARRIAGE_PREP', label: 'Préparation au Mariage' },
              { id: 'CELIBACY_FAITH', label: 'Célibat Consacré' },
              { id: 'COMMUNICATION', label: 'Communication & Couple' },
              { id: 'SPIRITUAL_GROWTH', label: 'Croissance Spirituelle' },
              { id: 'FINANCES', label: 'Finances & Foyer' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-[#1A3A5C] text-white shadow-sm'
                    : 'bg-white text-gray-600 border border-[#EFECE6] hover:border-[#C9A84C]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grille des Formations */}
          {loading ? (
            <CourseGridSkeleton />
          ) : filteredCourses.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400 border border-[#EFECE6]">
              <BookOpenCheck size={44} className="mx-auto text-[#C9A84C]/50 mb-3" />
              <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">Aucune formation disponible</h3>
              <p className="text-xs text-gray-500 mt-1">Revenez bientôt ou connectez-vous avec le compte formateur pour publier un cours.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const enrollment = enrollments.find((e: any) => e.course?.id === course.id);
                const isEnrolled = Boolean(enrollment || course.is_enrolled);
                const progress = enrollment?.progress_percentage ?? (course.progress_percentage || 0);

                return (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onEnroll={handleEnroll}
                    onOpen={(c) => setSelectedCourse(c)}
                    isEnrolled={isEnrolled}
                    progress={progress}
                  />
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* VUE 2 : BIBLIOTHÈQUE SPIRITUELLE & PODCASTS */}
      {currentTab === 'library' && (
        <LibraryView />
      )}

      {/* VUE 3 : STUDIO DU FORMATEUR (Création & Gestion) */}
      {currentTab === 'studio' && isInstructor && (
        <InstructorStudio onRefreshCourses={fetchData} />
      )}

    </div>
  );
}
