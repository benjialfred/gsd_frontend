import React from 'react';
import { 
  X, BookOpen, Clock, Award, CheckCircle2, 
  GraduationCap, ArrowRight, ShieldCheck, PlayCircle 
} from 'lucide-react';
import { getMediaUrl } from '../../../services/profile';

interface CourseDetailsModalProps {
  course: any | null;
  isOpen: boolean;
  onClose: () => void;
  onEnroll: (course: any) => void;
}

export const CourseDetailsModal: React.FC<CourseDetailsModalProps> = ({
  course,
  isOpen,
  onClose,
  onEnroll,
}) => {
  if (!isOpen || !course) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl border border-[#C9A84C]/40 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* BOUTON FERMER */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center transition-colors shadow-lg border border-white/20"
        >
          <X size={18} />
        </button>

        {/* HERO IMAGE */}
        <div className="relative h-60 sm:h-68 w-full overflow-hidden bg-[#0A192F] shrink-0">
          {course.thumbnail || course.thumbnail_url ? (
            <img
              src={course.thumbnail_url || getMediaUrl(course.thumbnail)}
              alt={course.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-[#0A192F] to-[#1A3A5C] flex items-center justify-center">
              <GraduationCap size={50} className="text-[#C9A84C]" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/50 to-transparent" />

          {/* Badge Catégorie */}
          <div className="absolute top-4 left-4 bg-[#C9A84C] text-[#0A192F] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-md">
            {course.category_display || course.category || 'Formation Matrimoniale'}
          </div>

          {/* Titre & Instructeur sur l'image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white leading-tight">
              {course.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-[#DFB76C] font-semibold mt-1">
              <span>Instructeur : {course.instructor_name || 'Collège Pastoral GSD'}</span>
              {course.duration_hours && (
                <span className="flex items-center gap-1 text-gray-300">
                  <Clock size={13} />
                  {course.duration_hours}h de formation
                </span>
              )}
            </div>
          </div>
        </div>

        {/* CONTENU DÉTAILLÉ */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1 text-gray-700">
          
          {/* Badges de Valeur */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400">Niveau</div>
              <div className="text-xs font-bold text-[#1A3A5C] mt-0.5">{course.level || 'Tous Niveaux'}</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] text-center">
              <div className="text-[10px] uppercase font-bold text-gray-400">Certification</div>
              <div className="text-xs font-bold text-[#C9A84C] mt-0.5">Certificat Inclus</div>
            </div>
            <div className="p-3 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] text-center col-span-2 sm:col-span-1">
              <div className="text-[10px] uppercase font-bold text-gray-400">Format</div>
              <div className="text-xs font-bold text-emerald-700 mt-0.5">En Ligne à Votre Rythme</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#1A3A5C] mb-2">
              À Propos du Cursus
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed font-light whitespace-pre-line">
              {course.description}
            </p>
          </div>

          {/* Programme des Modules / Syllabus */}
          {course.modules && course.modules.length > 0 && (
            <div>
              <h4 className="text-xs font-serif font-bold uppercase tracking-widest text-[#1A3A5C] mb-3">
                Syllabus & Modules du Cours ({course.modules.length} Modules)
              </h4>
              <div className="space-y-2">
                {course.modules.map((mod: any, index: number) => (
                  <div
                    key={mod.id || index}
                    className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#EFECE6] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-[#1A3A5C]/10 text-[#1A3A5C] font-bold text-xs flex items-center justify-center shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-xs font-medium text-[#1A3A5C]">{mod.title}</span>
                    </div>
                    {mod.lessons && (
                      <span className="text-[11px] text-gray-400 font-semibold">
                        {mod.lessons.length} leçons
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Garantie d'Édification */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-center gap-3">
            <Award size={20} className="text-[#C9A84C] shrink-0" />
            <span>
              Un examen de validation final permet d'obtenir le Badge Officiel « Préparation au Mariage Validée » affiché sur votre profil de célibataire.
            </span>
          </div>

        </div>

        {/* PIED DE PAGE ACTION */}
        <div className="p-5 sm:p-6 bg-[#FAF9F6] border-t border-[#EFECE6] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 text-xs font-semibold uppercase tracking-wider transition-colors w-full sm:w-auto"
          >
            Fermer
          </button>

          <button
            onClick={() => {
              onClose();
              onEnroll(course);
            }}
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#DFB76C] via-[#C9A84C] to-[#B38E36] hover:brightness-110 text-[#0A192F] font-black text-xs uppercase tracking-widest shadow-lg transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <PlayCircle size={15} />
            <span>Suivre Cette Masterclass</span>
            <ArrowRight size={15} />
          </button>
        </div>

      </div>
    </div>
  );
};
