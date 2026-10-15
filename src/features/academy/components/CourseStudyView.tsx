import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, CheckCircle2, Circle, Play, Download, 
  Award, Clock, BookOpen, Sparkles, Check, ChevronRight, FileText, Share2 
} from 'lucide-react';
import CertificateModal from './CertificateModal';

interface CourseStudyViewProps {
  course: any;
  onBack: () => void;
  onCompleteLesson: (lessonId: number) => Promise<any>;
}

export default function CourseStudyView({ course, onBack, onCompleteLesson }: CourseStudyViewProps) {
  // Trouver la première leçon ou la première non terminée
  const allLessons = course.modules?.flatMap((m: any) => m.lessons || []) || [];
  const firstIncomplete = allLessons.find((l: any) => !l.is_completed) || allLessons[0];
  
  const [activeLesson, setActiveLesson] = useState<any>(firstIncomplete || null);
  const [completing, setCompleting] = useState(false);
  const [showCertificate, setShowCertificate] = useState(false);

  // Mettre à jour si le cours change
  useEffect(() => {
    if (!activeLesson && allLessons.length > 0) {
      setActiveLesson(allLessons[0]);
    }
  }, [course]);

  const completedCount = allLessons.filter((l: any) => l.is_completed).length;
  const totalCount = allLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isAllCompleted = totalCount > 0 && completedCount === totalCount;

  const handleMarkComplete = async () => {
    if (!activeLesson || completing) return;
    setCompleting(true);
    try {
      await onCompleteLesson(activeLesson.id);
      
      // Trouver la leçon suivante
      const currentIndex = allLessons.findIndex((l: any) => l.id === activeLesson.id);
      if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        setActiveLesson(allLessons[currentIndex + 1]);
      }
    } finally {
      setCompleting(false);
    }
  };

  // Extraire l'ID YouTube si c'est un lien YouTube
  const getEmbedVideoUrl = (url: string) => {
    if (!url) return null;
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}?autoplay=0&rel=0`;
    }
    return url;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FAF9F6]">
      {/* Barre supérieure de navigation */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#EFECE6] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-[#1A3A5C] transition-colors shrink-0"
            title="Retour au catalogue"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h2 className="font-serif font-bold text-sm sm:text-base text-[#1A3A5C] truncate">
              {course.title}
            </h2>
            <p className="text-[11px] text-[#C9A84C] font-semibold tracking-wider uppercase truncate">
              Instructeur : {course.instructor_name}
            </p>
          </div>
        </div>

        {/* Progression & Certificat */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="hidden sm:flex flex-col items-end gap-1">
            <span className="text-[11px] font-bold text-[#1A3A5C]">
              {completedCount} / {totalCount} leçons ({progressPercent}%)
            </span>
            <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[#C9A84C] to-[#deb958] rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {isAllCompleted && (
            <button
              type="button"
              onClick={() => setShowCertificate(true)}
              className="px-3.5 py-1.5 rounded-full bg-[#C9A84C] text-[#1A3A5C] text-xs font-bold hover:brightness-105 transition-all shadow-md flex items-center gap-1.5"
            >
              <Award size={15} />
              <span className="hidden sm:inline">Mon Certificat</span>
            </button>
          )}
        </div>
      </div>

      {/* Contenu principal divisé en Lecteur (gauche) et Programme (droite) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 gap-6">
        
        {/* Colonne Gauche : Lecteur & Notes de cours */}
        <div className="flex-1 flex flex-col space-y-6 min-w-0">
          {activeLesson ? (
            <>
              {/* Conteneur Média (Vidéo / Audio) */}
              <div className="w-full bg-black rounded-3xl overflow-hidden shadow-xl border border-gray-900 aspect-video relative flex items-center justify-center">
                {activeLesson.video_url ? (
                  activeLesson.video_url.includes('youtube.com') || activeLesson.video_url.includes('youtu.be') ? (
                    <iframe
                      src={getEmbedVideoUrl(activeLesson.video_url) || ''}
                      title={activeLesson.title}
                      className="w-full h-full border-none"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={activeLesson.video_url}
                      controls
                      className="w-full h-full object-contain"
                    />
                  )
                ) : activeLesson.audio_url ? (
                  <div className="flex flex-col items-center justify-center p-8 text-center text-white space-y-4">
                    <div className="w-20 h-20 rounded-full bg-[#C9A84C]/20 border border-[#C9A84C] flex items-center justify-center text-[#ebd18b]">
                      <Play size={36} className="fill-current" />
                    </div>
                    <audio src={activeLesson.audio_url} controls className="w-full max-w-md mt-4" />
                  </div>
                ) : (
                  <div className="p-8 text-center text-white space-y-3">
                    <FileText size={48} className="mx-auto text-[#C9A84C]" />
                    <h4 className="font-serif font-bold text-lg">Enseignement Textuel & Méditation</h4>
                    <p className="text-xs text-gray-400">Consultez les notes et les versets ci-dessous.</p>
                  </div>
                )}
              </div>

              {/* Titre & Contrôles de la leçon */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFECE6] shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFECE6]">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C]">
                        {activeLesson.lesson_type === 'VIDEO' ? 'Vidéo' : activeLesson.lesson_type === 'AUDIO' ? 'Audio' : 'Lecture'}
                      </span>
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {activeLesson.duration_minutes} min
                      </span>
                    </div>
                    <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#1A3A5C]">
                      {activeLesson.title}
                    </h1>
                  </div>

                  {/* Bouton d'achèvement */}
                  <button
                    type="button"
                    onClick={handleMarkComplete}
                    disabled={completing}
                    className={`px-6 py-3 rounded-full text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 ${
                      activeLesson.is_completed
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-[#1A3A5C] text-white hover:bg-[#132c45]'
                    }`}
                  >
                    <CheckCircle2 size={16} className={activeLesson.is_completed ? 'text-emerald-600' : 'text-[#ebd18b]'} />
                    <span>{activeLesson.is_completed ? 'Leçon terminée (Valider à nouveau)' : 'Marquer comme terminée'}</span>
                  </button>
                </div>

                {/* Notes de cours & Méditations */}
                <div>
                  <h3 className="font-serif font-bold text-base text-[#1A3A5C] mb-3 flex items-center gap-2">
                    <BookOpen size={16} className="text-[#C9A84C]" />
                    <span>Notes spirituelles & Passages bibliques</span>
                  </h3>
                  <div className="text-xs sm:text-sm text-gray-700 leading-relaxed bg-[#FAF9F6] p-5 rounded-2xl border border-[#EFECE6] whitespace-pre-wrap font-sans">
                    {activeLesson.content || "Prenez ce temps pour méditer sur l'enseignement partagé et prier sur vos désirs d'alliance."}
                  </div>
                </div>

                {/* Téléchargement du support de cours si présent */}
                {activeLesson.attachment_url && (
                  <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText size={20} className="text-[#C9A84C]" />
                      <div>
                        <h4 className="text-xs font-bold text-[#1A3A5C]">Document & Fiche de Méditation PDF</h4>
                        <p className="text-[11px] text-gray-500">Support imprimable pour votre étude personnelle</p>
                      </div>
                    </div>
                    <a
                      href={activeLesson.attachment_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full bg-white text-[#1A3A5C] border border-[#EFECE6] text-xs font-bold hover:bg-[#FAF9F6] transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <Download size={13} /> Télécharger
                    </a>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center text-gray-400">
              Aucune leçon sélectionnée.
            </div>
          )}
        </div>

        {/* Colonne Droite : Sommaire des Modules & Leçons */}
        <div className="w-full lg:w-96 shrink-0 space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-[#EFECE6] shadow-sm sticky top-20">
            <h3 className="font-serif font-bold text-base text-[#1A3A5C] mb-4 flex items-center justify-between">
              <span>Programme de la formation</span>
              <span className="text-xs font-sans text-[#C9A84C] font-semibold">{totalCount} leçons</span>
            </h3>

            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              {course.modules?.map((module: any, mIdx: number) => (
                <div key={module.id || mIdx} className="space-y-2">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Module {module.order || mIdx + 1} : {module.title}
                  </h4>

                  <div className="space-y-1.5">
                    {module.lessons?.map((lesson: any) => {
                      const isCurrent = activeLesson?.id === lesson.id;
                      const isDone = Boolean(lesson.is_completed);

                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full text-left p-3 rounded-2xl flex items-center gap-3 transition-all ${
                            isCurrent
                              ? 'bg-[#1A3A5C] text-white shadow-md'
                              : 'bg-[#FCFBF9] hover:bg-gray-50 text-gray-800 border border-[#EFECE6]'
                          }`}
                        >
                          <div className="shrink-0">
                            {isDone ? (
                              <CheckCircle2 size={16} className={isCurrent ? 'text-[#ebd18b]' : 'text-emerald-500'} />
                            ) : (
                              <Circle size={16} className={isCurrent ? 'text-white/40' : 'text-gray-300'} />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-medium truncate ${isCurrent ? 'text-white font-semibold' : ''}`}>
                              {lesson.title}
                            </p>
                            <span className={`text-[10px] ${isCurrent ? 'text-[#ebd18b]' : 'text-gray-400'}`}>
                              {lesson.duration_minutes} min
                            </span>
                          </div>

                          <ChevronRight size={14} className={isCurrent ? 'text-white' : 'text-gray-300'} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* MODAL DU CERTIFICAT OFFICIEL D'ALLIANCE GSD */}
      {showCertificate && (
        <CertificateModal
          course={course}
          onClose={() => setShowCertificate(false)}
        />
      )}
    </div>
  );
}
