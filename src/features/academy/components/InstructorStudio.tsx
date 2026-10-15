import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { toast } from '../../../stores/useToastStore';
import { 
  PlusCircle, BookOpen, Users, Award, Radio, FileText, 
  Trash2, Upload, Loader, Video, Check, X, Sparkles, AlertCircle,
  FileAudio, FileVideo, Film, Music, Paperclip, Eye, Image as ImageIcon,
  CheckCircle2, Play, Pencil, ChevronDown, ChevronUp
} from 'lucide-react';

interface InstructorStudioProps {
  onRefreshCourses: () => void;
}

export default function InstructorStudio({ onRefreshCourses }: InstructorStudioProps) {
  const [stats, setStats] = useState<any>(null);
  const [myCourses, setMyCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals & Édition
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  // Formulaire Cours
  const [courseThumbnailMode, setCourseThumbnailMode] = useState<'upload' | 'url'>('upload');
  const [courseThumbnailFile, setCourseThumbnailFile] = useState<File | null>(null);
  const [courseThumbnailPreview, setCourseThumbnailPreview] = useState<string | null>(null);
  const [courseForm, setCourseForm] = useState({
    title: '',
    category: 'MARRIAGE_PREP',
    level: 'ALL_LEVELS',
    duration_hours: 2.0,
    thumbnail_url: '',
    description: '',
    certificate_available: true
  });

  // Formulaire Leçon
  const [lessonCourseId, setLessonCourseId] = useState<string>('');
  const [lessonVideoMode, setLessonVideoMode] = useState<'upload' | 'url'>('upload');
  const [lessonVideoFile, setLessonVideoFile] = useState<File | null>(null);
  const [lessonAudioFile, setLessonAudioFile] = useState<File | null>(null);
  const [lessonAttachmentFile, setLessonAttachmentFile] = useState<File | null>(null);
  const [lessonForm, setLessonForm] = useState({
    module_title: 'Module 1 : Fondations',
    title: '',
    lesson_type: 'VIDEO',
    video_url: '',
    duration_minutes: 15,
    content: ''
  });

  // Formulaire Ressource Bibliothèque
  const [resourceMode, setResourceMode] = useState<'upload' | 'url'>('upload');
  const [resourceAudioFile, setResourceAudioFile] = useState<File | null>(null);
  const [resourceDocFile, setResourceDocFile] = useState<File | null>(null);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    resource_type: 'podcast',
    category: 'Vie Spirituelle & Mariage',
    external_url: '',
    duration_minutes: 20,
    description: ''
  });

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} Ko`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  const fetchInstructorData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        api.get('/api/academy/courses/instructor_stats/'),
        api.get('/api/academy/courses/?my_courses=true')
      ]);
      setStats(statsRes.data);
      setMyCourses(coursesRes.data);
      if (coursesRes.data.length > 0 && !lessonCourseId) {
        setLessonCourseId(coursesRes.data[0].id.toString());
      }
    } catch (err) {
      console.error("Erreur stats formateur:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorData();
  }, []);

  // Gestion du thumbnail de cours
  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCourseThumbnailFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setCourseThumbnailPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setEditingCourseId(null);
    setCourseThumbnailFile(null);
    setCourseThumbnailPreview(null);
    setCourseForm({
      title: '',
      category: 'MARRIAGE_PREP',
      level: 'ALL_LEVELS',
      duration_hours: 2.0,
      thumbnail_url: '',
      description: '',
      certificate_available: true
    });
  };

  const handleOpenEditCourse = (course: any) => {
    setEditingCourseId(course.id);
    setCourseForm({
      title: course.title,
      category: course.category,
      level: course.level,
      duration_hours: parseFloat(course.duration_hours) || 2.0,
      thumbnail_url: course.thumbnail_url || '',
      description: course.description,
      certificate_available: course.certificate_available ?? true
    });
    setCourseThumbnailPreview(course.thumbnail_url || null);
    setCourseThumbnailMode('url');
    setShowCourseModal(true);
  };

  const handleCloseLessonModal = () => {
    setShowLessonModal(false);
    setEditingLessonId(null);
    setLessonVideoFile(null);
    setLessonAudioFile(null);
    setLessonAttachmentFile(null);
    setLessonForm({
      module_title: 'Module 1 : Fondations',
      title: '',
      lesson_type: 'VIDEO',
      video_url: '',
      duration_minutes: 15,
      content: ''
    });
  };

  const handleOpenEditLesson = (lesson: any, courseId: number) => {
    setEditingLessonId(lesson.id);
    setLessonCourseId(courseId.toString());
    setLessonForm({
      module_title: lesson.module_title || 'Module 1 : Fondations',
      title: lesson.title,
      lesson_type: lesson.lesson_type,
      video_url: lesson.video_url || '',
      duration_minutes: lesson.duration_minutes || 10,
      content: lesson.content || ''
    });
    setLessonVideoMode(lesson.video_url?.startsWith('http') ? 'url' : 'upload');
    setShowLessonModal(true);
  };

  // 1. Créer ou Modifier un cours
  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim()) {
      toast.error("Veuillez renseigner un titre pour le cours.");
      return;
    }
    setSubmitting(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('title', courseForm.title);
      formData.append('category', courseForm.category);
      formData.append('level', courseForm.level);
      formData.append('duration_hours', courseForm.duration_hours.toString());
      formData.append('description', courseForm.description);
      formData.append('certificate_available', courseForm.certificate_available ? 'true' : 'false');

      if (courseThumbnailMode === 'upload' && courseThumbnailFile) {
        formData.append('thumbnail', courseThumbnailFile);
      } else if (courseForm.thumbnail_url) {
        formData.append('thumbnail_url', courseForm.thumbnail_url);
      }

      if (editingCourseId) {
        await api.patch(`/api/academy/courses/${editingCourseId}/`, formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          }
        });
        toast.success("Formation mise à jour avec succès !");
      } else {
        await api.post('/api/academy/courses/', formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          }
        });
        toast.success("Formation publiée avec succès sur l'Académie !");
      }

      handleCloseCourseModal();
      fetchInstructorData();
      onRefreshCourses();
    } catch (err: any) {
      console.error("Erreur sauvegarde cours:", err);
      toast.error(err.response?.data?.detail || "Impossible d'enregistrer le cours.");
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  // 2. Créer ou Modifier une leçon
  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonCourseId) {
      toast.error("Veuillez sélectionner un cours existant.");
      return;
    }
    if (!lessonForm.title.trim()) {
      toast.error("Veuillez donner un titre à la leçon.");
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('title', lessonForm.title);
      formData.append('lesson_type', lessonForm.lesson_type);
      formData.append('duration_minutes', lessonForm.duration_minutes.toString());
      formData.append('content', lessonForm.content || '');

      if (lessonForm.lesson_type === 'VIDEO') {
        if (lessonVideoMode === 'upload' && lessonVideoFile) {
          formData.append('video_file', lessonVideoFile);
        } else if (lessonForm.video_url) {
          formData.append('video_url', lessonForm.video_url);
        }
      } else if (lessonForm.lesson_type === 'AUDIO') {
        if (lessonAudioFile) {
          formData.append('audio_file', lessonAudioFile);
        }
      }

      if (lessonAttachmentFile) {
        formData.append('attachment', lessonAttachmentFile);
      }

      if (editingLessonId) {
        await api.patch(`/api/academy/lessons/${editingLessonId}/`, formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          }
        });
        toast.success("Leçon mise à jour avec succès !");
      } else {
        // Trouver ou créer le module si nouvelle leçon
        const targetCourse = myCourses.find(c => c.id.toString() === lessonCourseId);
        let moduleId;
        if (targetCourse?.modules && targetCourse.modules.length > 0) {
          moduleId = targetCourse.modules[0].id;
        } else {
          const moduleRes = await api.post('/api/academy/modules/', {
            course: parseInt(lessonCourseId),
            title: lessonForm.module_title || "Module 1 : Fondations",
            order: 1
          });
          moduleId = moduleRes.data.id;
        }

        formData.append('module', moduleId.toString());
        formData.append('order', '1');

        await api.post('/api/academy/lessons/', formData, {
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          }
        });
        toast.success("Leçon ajoutée avec succès au programme !");
      }

      handleCloseLessonModal();
      fetchInstructorData();
      onRefreshCourses();
    } catch (err: any) {
      console.error("Erreur enregistrement leçon:", err);
      toast.error(err.response?.data?.detail || "Impossible d'enregistrer la leçon.");
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  // Supprimer une leçon
  const handleDeleteLesson = async (lessonId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette leçon du programme ?")) return;
    try {
      await api.delete(`/api/academy/lessons/${lessonId}/`);
      toast.success("Leçon supprimée.");
      fetchInstructorData();
      onRefreshCourses();
    } catch (err) {
      toast.error("Erreur lors de la suppression de la leçon.");
    }
  };

  // 3. Publier une ressource
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resourceForm.title.trim()) {
      toast.error("Veuillez renseigner un titre de ressource.");
      return;
    }
    setSubmitting(true);
    setUploadProgress(0);
    try {
      const formData = new FormData();
      formData.append('title', resourceForm.title);
      formData.append('resource_type', resourceForm.resource_type);
      formData.append('category', resourceForm.category);
      formData.append('duration_minutes', resourceForm.duration_minutes.toString());
      formData.append('description', resourceForm.description);

      const defaultImg = resourceForm.resource_type === 'podcast'
        ? "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=800&q=80"
        : "https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80";
      formData.append('image_url', defaultImg);

      if (resourceForm.resource_type === 'podcast') {
        if (resourceMode === 'upload' && resourceAudioFile) {
          formData.append('audio_file', resourceAudioFile);
        } else if (resourceForm.external_url) {
          formData.append('external_url', resourceForm.external_url);
        }
      } else {
        if (resourceMode === 'upload' && resourceDocFile) {
          formData.append('document_file', resourceDocFile);
        } else if (resourceForm.external_url) {
          formData.append('external_url', resourceForm.external_url);
        }
      }

      await api.post('/api/academy/resources/', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percent);
          }
        }
      });

      toast.success("Ressource publiée dans la bibliothèque spirituelle !");
      setShowResourceModal(false);
      setResourceAudioFile(null);
      setResourceDocFile(null);
      setResourceForm({
        title: '',
        resource_type: 'podcast',
        category: 'Vie Spirituelle & Mariage',
        external_url: '',
        duration_minutes: 20,
        description: ''
      });
      fetchInstructorData();
    } catch (err: any) {
      console.error("Erreur création ressource:", err);
      toast.error(err.response?.data?.detail || "Échec de la publication.");
    } finally {
      setSubmitting(false);
      setUploadProgress(null);
    }
  };

  // 4. Supprimer un cours
  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer définitivement cette formation et toutes ses leçons ?")) return;
    try {
      await api.delete(`/api/academy/courses/${courseId}/`);
      toast.success("Formation supprimée.");
      fetchInstructorData();
      onRefreshCourses();
    } catch (err) {
      toast.error("Erreur lors de la suppression.");
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-[#C9A84C]">
        <Loader className="animate-spin mx-auto mb-2" size={32} />
        <p className="text-xs uppercase tracking-wider text-gray-500 font-semibold">Chargement du Studio Formateur...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Bandeau d'accueil Formateur & Actions Rapides */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1A3A5C] to-[#244f7d] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C9A84C]/20 text-[#ebd18b] text-xs font-bold font-serif">
            <Sparkles size={13} />
            <span>Espace Instructeur & Formateur Agréé</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
            Studio Pédagogique & Publication
          </h2>
          <p className="text-xs sm:text-sm text-gray-200 max-w-xl leading-relaxed">
            Téléversez vos leçons vidéo, audios spirituels, livrets de préparation au mariage et suivez la progression de vos apprenants.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setEditingCourseId(null);
              setShowCourseModal(true);
            }}
            className="px-5 py-3 rounded-full bg-[#C9A84C] text-[#1A3A5C] text-xs font-bold hover:bg-[#ebd18b] shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Nouvelle Formation</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingLessonId(null);
              setShowLessonModal(true);
            }}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
          >
            <Video size={16} />
            <span>Ajouter une Leçon</span>
          </button>

          <button
            type="button"
            onClick={() => setShowResourceModal(true)}
            className="px-5 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2"
          >
            <Radio size={16} />
            <span>Publier Podcast / Livret</span>
          </button>
        </div>
      </div>

      {/* Cartes Métriques Formateur */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center shrink-0">
            <BookOpen size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Formations Créées</p>
            <p className="text-2xl font-serif font-bold text-[#1A3A5C] mt-0.5">{stats?.total_courses || 0}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center shrink-0">
            <Users size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Apprenants Inscrits</p>
            <p className="text-2xl font-serif font-bold text-[#1A3A5C] mt-0.5">{stats?.total_students || 0}</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Taux de Réussite</p>
            <p className="text-2xl font-serif font-bold text-emerald-700 mt-0.5">{stats?.completion_rate || 0}%</p>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#EFECE6] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Radio size={22} />
          </div>
          <div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Médias Publiés</p>
            <p className="text-2xl font-serif font-bold text-[#1A3A5C] mt-0.5">{stats?.total_resources || 0}</p>
          </div>
        </div>
      </div>

      {/* Liste des formations gérées */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EFECE6] shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6]">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#1A3A5C]">
              Vos Formations Actives ({myCourses.length})
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Éditez les programmes, ajoutez ou modifiez des leçons et suivez le contenu.</p>
          </div>
        </div>

        {myCourses.length === 0 ? (
          <div className="p-12 text-center text-gray-400 space-y-3">
            <BookOpen size={40} className="mx-auto text-gray-300" />
            <p className="text-sm">Vous n'avez pas encore publié de formation.</p>
            <button
              onClick={() => {
                setEditingCourseId(null);
                setShowCourseModal(true);
              }}
              className="px-5 py-2 rounded-full bg-[#1A3A5C] text-white text-xs font-bold"
            >
              Publier mon premier cours
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {myCourses.map((course) => {
              const isExpanded = expandedCourseId === course.id;
              const allLessons = course.modules?.flatMap((m: any) => m.lessons || []) || [];

              return (
                <div 
                  key={course.id}
                  className="rounded-2xl border border-[#EFECE6] overflow-hidden bg-[#FAF9F6] p-5 sm:p-6 flex flex-col space-y-4 hover:border-[#C9A84C]/40 transition-all shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center justify-between">
                    <div className="flex gap-4 items-center">
                      <img
                        src={course.thumbnail_url}
                        alt={course.title}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-[#EFECE6] shrink-0"
                      />
                      <div className="space-y-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C]">
                          {course.category}
                        </span>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-[#1A3A5C]">
                          {course.title}
                        </h4>
                        <p className="text-xs text-gray-500 line-clamp-2 max-w-xl">
                          {course.description}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-400 pt-1">
                          <span className="flex items-center gap-1"><BookOpen size={13} /> {allLessons.length} leçons</span>
                          <span className="flex items-center gap-1"><Users size={13} /> {course.duration_hours}h estimées</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-[#EFECE6]">
                      <button
                        type="button"
                        onClick={() => handleOpenEditCourse(course)}
                        className="px-3.5 py-1.5 rounded-full bg-white text-[#1A3A5C] border border-[#EFECE6] text-xs font-bold hover:bg-[#FAF9F6] transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Pencil size={13} />
                        <span>Modifier</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEditingLessonId(null);
                          setLessonCourseId(course.id.toString());
                          setShowLessonModal(true);
                        }}
                        className="px-3.5 py-1.5 rounded-full bg-[#1A3A5C] text-white text-xs font-bold hover:bg-[#132c45] transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <PlusCircle size={13} />
                        <span>Ajouter leçon</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExpandedCourseId(isExpanded ? null : course.id)}
                        className="px-3 py-1.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] text-xs font-bold hover:bg-[#C9A84C]/25 transition-all flex items-center gap-1"
                      >
                        <span>{isExpanded ? 'Masquer leçons' : `Gérer leçons (${allLessons.length})`}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteCourse(course.id)}
                        className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition-all"
                        title="Supprimer la formation"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* VUE DÉPLIANTE DU PROGRAMME DES LEÇONS */}
                  {isExpanded && (
                    <div className="pt-4 border-t border-[#EFECE6] space-y-3 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-[#1A3A5C]">
                          Programme d'enseignement ({allLessons.length} leçons)
                        </h5>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingLessonId(null);
                            setLessonCourseId(course.id.toString());
                            setShowLessonModal(true);
                          }}
                          className="text-[11px] font-bold text-[#C9A84C] hover:underline flex items-center gap-1"
                        >
                          <PlusCircle size={12} /> Nouvelle leçon
                        </button>
                      </div>

                      {allLessons.length === 0 ? (
                        <p className="text-xs text-gray-400 italic p-3 bg-white rounded-xl text-center">
                          Aucune leçon ajoutée pour le moment. Cliquez sur "Ajouter leçon" ci-dessus.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {allLessons.map((lesson: any, idx: number) => (
                            <div 
                              key={lesson.id}
                              className="p-3 bg-white rounded-xl border border-[#EFECE6] flex items-center justify-between gap-3 text-xs"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-6 h-6 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {idx + 1}
                                </span>
                                {lesson.lesson_type === 'VIDEO' ? (
                                  <Video size={16} className="text-[#C9A84C] shrink-0" />
                                ) : lesson.lesson_type === 'AUDIO' ? (
                                  <Radio size={16} className="text-[#C9A84C] shrink-0" />
                                ) : (
                                  <FileText size={16} className="text-[#C9A84C] shrink-0" />
                                )}
                                <div className="min-w-0">
                                  <p className="font-bold text-[#1A3A5C] truncate">{lesson.title}</p>
                                  <p className="text-[10px] text-gray-400">
                                    {lesson.duration_minutes} min • {lesson.lesson_type} {lesson.attachment_url ? '• Livret PDF inclus' : ''}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditLesson(lesson, course.id)}
                                  className="p-1.5 text-gray-500 hover:text-[#1A3A5C] hover:bg-gray-100 rounded-lg transition-colors"
                                  title="Modifier la leçon"
                                >
                                  <Pencil size={13} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Supprimer la leçon"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MODAL 1 : CRÉER OU MODIFIER UN COURS */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-[#EFECE6] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A3A5C]">
                  {editingCourseId ? 'Modifier la Formation' : 'Publier une Nouvelle Formation'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingCourseId ? 'Mettez à jour les informations et la miniature.' : 'Enrichissez le catalogue de l\'Académie avec vos enseignements.'}
                </p>
              </div>
              <button onClick={handleCloseCourseModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Titre de la formation *</label>
                <input
                  type="text"
                  required
                  value={courseForm.title}
                  onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                  placeholder="Ex : L'Alliance du Mariage Chrétien : Fondements et Sanctification"
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Thématique *</label>
                  <select
                    value={courseForm.category}
                    onChange={(e) => setCourseForm({ ...courseForm, category: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  >
                    <option value="MARRIAGE_PREP">Préparation au Mariage</option>
                    <option value="CELIBACY_FAITH">Célibat Consacré</option>
                    <option value="COMMUNICATION">Communication & Couple</option>
                    <option value="SPIRITUAL_GROWTH">Croissance Spirituelle</option>
                    <option value="FINANCES">Finances & Foyer</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Niveau</label>
                  <select
                    value={courseForm.level}
                    onChange={(e) => setCourseForm({ ...courseForm, level: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  >
                    <option value="ALL_LEVELS">Tous niveaux</option>
                    <option value="BEGINNER">Fondations</option>
                    <option value="INTERMEDIATE">Approfondissement</option>
                    <option value="ADVANCED">Avancé</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Durée estimée totale (heures)</label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={courseForm.duration_hours}
                  onChange={(e) => setCourseForm({ ...courseForm, duration_hours: parseFloat(e.target.value) || 1 })}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* SECTION TÉLÉVERSEMENT MINIATURE */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-gray-700">Image Miniature de la Formation</label>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setCourseThumbnailMode('upload')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        courseThumbnailMode === 'upload' ? 'bg-white shadow-xs text-[#1A3A5C]' : 'text-gray-500'
                      }`}
                    >
                      Fichier local
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourseThumbnailMode('url')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        courseThumbnailMode === 'url' ? 'bg-white shadow-xs text-[#1A3A5C]' : 'text-gray-500'
                      }`}
                    >
                      Lien URL
                    </button>
                  </div>
                </div>

                {courseThumbnailMode === 'upload' ? (
                  <div className="space-y-2">
                    {courseThumbnailPreview ? (
                      <div className="relative rounded-2xl overflow-hidden border border-[#C9A84C]/40 aspect-video group">
                        <img src={courseThumbnailPreview} alt="Aperçu" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => {
                              setCourseThumbnailFile(null);
                              setCourseThumbnailPreview(null);
                            }}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/60 text-white text-[10px] font-medium backdrop-blur-sm">
                          {courseThumbnailFile?.name || 'Image actuelle'} ({formatFileSize(courseThumbnailFile?.size || 0)})
                        </div>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-200 hover:border-[#C9A84C] rounded-2xl cursor-pointer bg-[#FAF9F6] transition-all group text-center">
                        <div className="w-12 h-12 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] group-hover:bg-[#C9A84C]/20 group-hover:text-[#C9A84C] flex items-center justify-center transition-colors mb-2">
                          <ImageIcon size={22} />
                        </div>
                        <span className="font-bold text-gray-700">Cliquez ou glissez une image ici</span>
                        <span className="text-[11px] text-gray-400 mt-0.5">Formats acceptés : JPG, PNG, WebP (Max 10 Mo)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleThumbnailChange}
                        />
                      </label>
                    )}
                  </div>
                ) : (
                  <input
                    type="url"
                    value={courseForm.thumbnail_url}
                    onChange={(e) => setCourseForm({ ...courseForm, thumbnail_url: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description et Objectifs d'édification *</label>
                <textarea
                  required
                  rows={3}
                  value={courseForm.description}
                  onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                  placeholder="Ce que l'étudiant apprendra et sanctifiera dans sa vie..."
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Barre de progression */}
              {uploadProgress !== null && (
                <div className="w-full space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="flex items-center gap-1.5"><Upload size={13} className="animate-pulse text-[#C9A84C]" /> Enregistrement en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1A3A5C] to-[#C9A84C] transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={handleCloseCourseModal}
                  className="px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#1A3A5C] text-white font-bold hover:bg-[#132c45] shadow-md transition-all flex items-center gap-2"
                >
                  {submitting && <Loader size={14} className="animate-spin" />}
                  <span>{submitting ? 'Enregistrement...' : editingCourseId ? 'Mettre à jour' : 'Publier la formation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2 : AJOUTER OU MODIFIER UNE LEÇON */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EFECE6] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A3A5C]">
                  {editingLessonId ? 'Modifier la Leçon' : 'Ajouter une Leçon au Programme'}
                </h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editingLessonId ? 'Mettez à jour le contenu, média ou livret.' : 'Téléversez vos fichiers vidéo, podcasts audio et livrets PDF.'}
                </p>
              </div>
              <button onClick={handleCloseLessonModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveLesson} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Cours associé *</label>
                <select
                  value={lessonCourseId}
                  onChange={(e) => setLessonCourseId(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                >
                  {myCourses.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Titre de la leçon *</label>
                <input
                  type="text"
                  required
                  value={lessonForm.title}
                  onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                  placeholder="Ex : Écouter la voix de Dieu & Discernement Spirituel"
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Format de la leçon</label>
                  <select
                    value={lessonForm.lesson_type}
                    onChange={(e) => setLessonForm({ ...lessonForm, lesson_type: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  >
                    <option value="VIDEO">Vidéo d'enseignement</option>
                    <option value="AUDIO">Audio / Podcast</option>
                    <option value="READING">Méditation écrite</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Durée (minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={lessonForm.duration_minutes}
                    onChange={(e) => setLessonForm({ ...lessonForm, duration_minutes: parseInt(e.target.value) || 10 })}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              {/* CHAMP CONDITIONNEL VIDÉO */}
              {lessonForm.lesson_type === 'VIDEO' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-gray-700">Fichier ou Source Vidéo</label>
                    <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setLessonVideoMode('upload')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          lessonVideoMode === 'upload' ? 'bg-white shadow-xs text-[#1A3A5C]' : 'text-gray-500'
                        }`}
                      >
                        Téléverser Vidéo
                      </button>
                      <button
                        type="button"
                        onClick={() => setLessonVideoMode('url')}
                        className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                          lessonVideoMode === 'url' ? 'bg-white shadow-xs text-[#1A3A5C]' : 'text-gray-500'
                        }`}
                      >
                        Lien URL
                      </button>
                    </div>
                  </div>

                  {lessonVideoMode === 'upload' ? (
                    <div>
                      {lessonVideoFile ? (
                        <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-emerald-800">
                            <FileVideo size={18} />
                            <div>
                              <p className="font-bold truncate max-w-[240px]">{lessonVideoFile.name}</p>
                              <p className="text-[10px] text-emerald-600">{formatFileSize(lessonVideoFile.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setLessonVideoFile(null)}
                            className="p-1 rounded-full text-emerald-700 hover:bg-emerald-100"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 hover:border-[#C9A84C] rounded-2xl cursor-pointer bg-[#FAF9F6] transition-all group text-center">
                          <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] group-hover:bg-[#C9A84C]/20 group-hover:text-[#C9A84C] flex items-center justify-center transition-colors mb-2">
                            <Film size={20} />
                          </div>
                          <span className="font-bold text-gray-700">Choisir un fichier vidéo (MP4, WebM, MOV)</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">Téléversement direct pour lecture intégrée</span>
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setLessonVideoFile(f);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <input
                      type="url"
                      value={lessonForm.video_url}
                      onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })}
                      placeholder="https://www.youtube.com/watch?v=..."
                      className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                    />
                  )}
                </div>
              )}

              {/* CHAMP CONDITIONNEL AUDIO */}
              {lessonForm.lesson_type === 'AUDIO' && (
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Fichier Audio Spirituel</label>
                  {lessonAudioFile ? (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-amber-900">
                        <FileAudio size={18} />
                        <div>
                          <p className="font-bold truncate max-w-[240px]">{lessonAudioFile.name}</p>
                          <p className="text-[10px] text-amber-600">{formatFileSize(lessonAudioFile.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLessonAudioFile(null)}
                        className="p-1 rounded-full text-amber-700 hover:bg-amber-100"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 hover:border-[#C9A84C] rounded-2xl cursor-pointer bg-[#FAF9F6] transition-all group text-center">
                      <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] group-hover:bg-[#C9A84C]/20 group-hover:text-[#C9A84C] flex items-center justify-center transition-colors mb-2">
                        <Music size={20} />
                      </div>
                      <span className="font-bold text-gray-700">Choisir un fichier audio (MP3, WAV, M4A)</span>
                      <span className="text-[10px] text-gray-400 mt-0.5">Enseignement audio ou podcast d'alliance</span>
                      <input
                        type="file"
                        accept="audio/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) setLessonAudioFile(f);
                        }}
                      />
                    </label>
                  )}
                </div>
              )}

              {/* SUPPORT DE COURS PDF ATTACHÉ (OPTIONNEL) */}
              <div>
                <label className="font-bold text-gray-700 block mb-1">Support de cours / Livret PDF (Optionnel)</label>
                {lessonAttachmentFile ? (
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-900">
                      <Paperclip size={18} />
                      <div>
                        <p className="font-bold truncate max-w-[240px]">{lessonAttachmentFile.name}</p>
                        <p className="text-[10px] text-blue-600">{formatFileSize(lessonAttachmentFile.size)}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setLessonAttachmentFile(null)}
                      className="p-1 rounded-full text-blue-700 hover:bg-blue-100"
                    >
                      <X size={15} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3 border border-dashed border-gray-300 hover:border-[#C9A84C] rounded-xl cursor-pointer bg-[#FAF9F6] transition-all text-center">
                    <Paperclip size={15} className="text-[#C9A84C]" />
                    <span className="font-medium text-gray-600">Joindre un document PDF ou livret d'exercices</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) setLessonAttachmentFile(f);
                      }}
                    />
                  </label>
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Contenu textuel, versets et méditation</label>
                <textarea
                  rows={3}
                  value={lessonForm.content}
                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                  placeholder="Points clés, références bibliques, questions d'introspection..."
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Barre de progression */}
              {uploadProgress !== null && (
                <div className="w-full space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="flex items-center gap-1.5"><Upload size={13} className="animate-pulse text-[#C9A84C]" /> Envoi des fichiers en cours...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1A3A5C] to-[#C9A84C] transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={handleCloseLessonModal}
                  className="px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#1A3A5C] text-white font-bold hover:bg-[#132c45] shadow-md transition-all flex items-center gap-2"
                >
                  {submitting && <Loader size={14} className="animate-spin" />}
                  <span>{submitting ? 'Enregistrement...' : editingLessonId ? 'Mettre à jour' : 'Ajouter la leçon'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3 : PUBLIER PODCAST / LIVRET NUMÉRIQUE */}
      {showResourceModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#EFECE6] max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#EFECE6] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#1A3A5C]">Publier dans la Bibliothèque</h3>
                <p className="text-xs text-gray-400 mt-0.5">Partagez vos podcasts et guides spirituels téléchargeables.</p>
              </div>
              <button onClick={() => setShowResourceModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateResource} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Titre de la ressource *</label>
                <input
                  type="text"
                  required
                  value={resourceForm.title}
                  onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                  placeholder="Ex : Guide de Prière : 21 Jours pour Bénir son Foyer"
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Type de ressource</label>
                  <select
                    value={resourceForm.resource_type}
                    onChange={(e) => setResourceForm({ ...resourceForm, resource_type: e.target.value })}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  >
                    <option value="podcast">Podcast Audio</option>
                    <option value="ebook">Livre / Livret PDF</option>
                    <option value="guide">Guide Pratique de Prière</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Durée (si podcast, min)</label>
                  <input
                    type="number"
                    value={resourceForm.duration_minutes}
                    onChange={(e) => setResourceForm({ ...resourceForm, duration_minutes: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  />
                </div>
              </div>

              {/* SOURCE FICHIER AUDIO OU DOCUMENT */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-bold text-gray-700">
                    {resourceForm.resource_type === 'podcast' ? 'Fichier Audio du Podcast' : 'Document PDF / Ebook'}
                  </label>
                  <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-lg text-[10px]">
                    <button
                      type="button"
                      onClick={() => setResourceMode('upload')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        resourceMode === 'upload' ? 'bg-white shadow-xs text-[#1A3A5C]' : 'text-gray-500'
                      }`}
                    >
                      Fichier local
                    </button>
                    <button
                      type="button"
                      onClick={() => setResourceMode('url')}
                      className={`px-2 py-0.5 rounded-md font-bold transition-all ${
                        resourceMode === 'url' ? 'bg-white shadow-xs text-[#1A3A5C]' : 'text-gray-500'
                      }`}
                    >
                      Lien externe
                    </button>
                  </div>
                </div>

                {resourceMode === 'upload' ? (
                  resourceForm.resource_type === 'podcast' ? (
                    <div>
                      {resourceAudioFile ? (
                        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-amber-900">
                            <FileAudio size={18} />
                            <div>
                              <p className="font-bold truncate max-w-[240px]">{resourceAudioFile.name}</p>
                              <p className="text-[10px] text-amber-600">{formatFileSize(resourceAudioFile.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResourceAudioFile(null)}
                            className="p-1 rounded-full text-amber-700 hover:bg-amber-100"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 hover:border-[#C9A84C] rounded-2xl cursor-pointer bg-[#FAF9F6] transition-all group text-center">
                          <div className="w-10 h-10 rounded-full bg-[#C9A84C]/15 text-[#C9A84C] flex items-center justify-center mb-2">
                            <Radio size={20} />
                          </div>
                          <span className="font-bold text-gray-700">Choisir l'enregistrement Audio (MP3, WAV)</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">Sera écoutable directement sur l'application</span>
                          <input
                            type="file"
                            accept="audio/*"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setResourceAudioFile(f);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      {resourceDocFile ? (
                        <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-blue-900">
                            <FileText size={18} />
                            <div>
                              <p className="font-bold truncate max-w-[240px]">{resourceDocFile.name}</p>
                              <p className="text-[10px] text-blue-600">{formatFileSize(resourceDocFile.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setResourceDocFile(null)}
                            className="p-1 rounded-full text-blue-700 hover:bg-blue-100"
                          >
                            <X size={15} />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-5 border-2 border-dashed border-gray-200 hover:border-[#C9A84C] rounded-2xl cursor-pointer bg-[#FAF9F6] transition-all group text-center">
                          <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/10 text-[#1A3A5C] flex items-center justify-center mb-2">
                            <FileText size={20} />
                          </div>
                          <span className="font-bold text-gray-700">Choisir le document PDF / EPUB</span>
                          <span className="text-[10px] text-gray-400 mt-0.5">Sera téléchargeable par les membres</span>
                          <input
                            type="file"
                            accept=".pdf,.epub,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) setResourceDocFile(f);
                            }}
                          />
                        </label>
                      )}
                    </div>
                  )
                ) : (
                  <input
                    type="url"
                    value={resourceForm.external_url}
                    onChange={(e) => setResourceForm({ ...resourceForm, external_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                  />
                )}
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description / Verset d'accompagnement *</label>
                <textarea
                  required
                  rows={3}
                  value={resourceForm.description}
                  onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })}
                  placeholder="Présentez le sujet du podcast ou le contenu du guide..."
                  className="w-full p-3 rounded-xl border border-gray-200 outline-none focus:border-[#C9A84C]"
                />
              </div>

              {/* Barre de progression */}
              {uploadProgress !== null && (
                <div className="w-full space-y-1.5 pt-2">
                  <div className="flex justify-between text-[11px] font-bold text-gray-600">
                    <span className="flex items-center gap-1.5"><Upload size={13} className="animate-pulse text-[#C9A84C]" /> Téléversement de la ressource...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#1A3A5C] to-[#C9A84C] transition-all duration-300 rounded-full"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EFECE6]">
                <button
                  type="button"
                  onClick={() => setShowResourceModal(false)}
                  className="px-4 py-2.5 rounded-full text-gray-600 hover:bg-gray-100 font-semibold"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#1A3A5C] text-white font-bold hover:bg-[#132c45] shadow-md transition-all flex items-center gap-2"
                >
                  {submitting && <Loader size={14} className="animate-spin" />}
                  <span>{submitting ? 'Mise en ligne...' : 'Mettre en ligne'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
