import React from 'react';
import { Play, Award, Clock, BookOpen, CheckCircle, Sparkles, User } from 'lucide-react';

interface CourseCardProps {
  course: any;
  onEnroll: (courseId: number) => void;
  onOpen: (course: any) => void;
  isEnrolled: boolean;
  progress: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  MARRIAGE_PREP: 'Préparation au Mariage',
  CELIBACY_FAITH: 'Célibat Consacré',
  COMMUNICATION: 'Communication & Couple',
  SPIRITUAL_GROWTH: 'Croissance Spirituelle',
  FINANCES: 'Finances & Foyer',
};

export default function CourseCard({ course, onEnroll, onOpen, isEnrolled, progress }: CourseCardProps) {
  const categoryLabel = CATEGORY_LABELS[course.category] || 'Formation GSD';
  const totalLessons = course.total_lessons_count || (course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0) || 0);

  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-[#EFECE6] shadow-sm hover:shadow-xl hover:border-[#C9A84C]/50 transition-all duration-300 flex flex-col group">
      {/* Vignette / Miniature */}
      <div className="relative h-48 sm:h-52 overflow-hidden bg-gray-100">
        <img
          src={course.thumbnail_url || "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e: any) => {
            e.target.src = "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Badge Catégorie */}
        <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
          {categoryLabel}
        </span>

        {/* Badge Certificat */}
        {course.certificate_available && (
          <span className="absolute top-3.5 right-3.5 bg-[#C9A84C] text-[#1A3A5C] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
            <Award size={12} />
            <span>Certificat</span>
          </span>
        )}

        {/* Durée en bas à droite */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1.5">
          <Clock size={12} />
          <span>{course.duration_hours}h</span>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1.5 font-medium">
            <User size={13} className="text-[#C9A84C]" />
            <span>{course.instructor_name || "Instructeur GSD"}</span>
          </div>

          <h3 className="font-serif font-bold text-lg text-[#1A3A5C] group-hover:text-[#C9A84C] transition-colors line-clamp-2 leading-snug mb-2">
            {course.title}
          </h3>

          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {course.description}
          </p>
        </div>

        {/* Progression & Actions */}
        <div className="pt-3 border-t border-[#EFECE6] space-y-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={13} className="text-[#C9A84C]" />
              {totalLessons} leçon{totalLessons > 1 ? 's' : ''}
            </span>
            <span className="text-[11px] font-medium bg-[#FAF9F6] border border-[#EFECE6] px-2 py-0.5 rounded-full text-gray-600">
              {course.level === 'ALL_LEVELS' ? 'Tous niveaux' : course.level}
            </span>
          </div>

          {/* Barre de progression si inscrit */}
          {isEnrolled && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-[#1A3A5C]">Votre progression</span>
                <span className="font-bold text-[#C9A84C]">{progress}%</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#C9A84C] to-[#deb958] transition-all duration-300 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Bouton d'action */}
          {isEnrolled ? (
            <button
              type="button"
              onClick={() => onOpen(course)}
              className="w-full py-2.5 rounded-full bg-[#1A3A5C] text-white text-xs font-semibold hover:bg-[#132c45] active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 group-hover:shadow-lg"
            >
              <Play size={14} className="fill-current text-[#ebd18b]" />
              <span>{progress === 100 ? 'Revoir la formation' : 'Continuer le cours'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onEnroll(course.id)}
              className="w-full py-2.5 rounded-full bg-gradient-to-tr from-[#C9A84C] to-[#deb958] text-[#1A3A5C] text-xs font-bold hover:brightness-105 active:scale-98 transition-all shadow-md flex items-center justify-center gap-2 shadow-[#C9A84C]/20"
            >
              <Sparkles size={14} />
              <span>S'inscrire à la formation</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
