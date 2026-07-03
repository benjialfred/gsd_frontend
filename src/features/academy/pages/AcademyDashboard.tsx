import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { BookOpen, Award, CheckCircle, Play, Loader, Shield, ArrowLeft, Video, BookOpenCheck } from 'lucide-react';

export default function AcademyDashboard() {
  const { token } = useAuthStore();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Active learning view state
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completing, setCompleting] = useState(false);

  const fetchData = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [coursesRes, enrollmentsRes] = await Promise.all([
        api.get('/api/academy/courses/'),
        api.get('/api/academy/enrollments/')
      ]);
      setCourses(coursesRes.data);
      setEnrollments(enrollmentsRes.data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Impossible de charger les cours.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleEnroll = async (courseId: number) => {
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');
    try {
      const res = await api.post(`/api/academy/courses/${courseId}/enroll/`);
      setSuccessMsg(res.data.message || "Inscription réussie !");
      await fetchData();
    } catch (err) {
      console.error(err);
      setErrorMsg("Échec de l'inscription.");
      setLoading(false);
    }
  };

  const handleCompleteLesson = async (lessonId: number) => {
    setCompleting(true);
    try {
      await api.post(`http://localhost:8000/api/academy/lessons/${lessonId}/complete/`);
      // Refresh enrollments & update selected course progress
      const headers = { Authorization: `Bearer ${token}` };
      const enrollmentsRes = await api.get('/api/academy/enrollments/');
      const newEnrollments = enrollmentsRes.data;
      setEnrollments(newEnrollments);
      
      // Update local state for checks
      if (selectedCourse) {
        const updatedEnrollment = newEnrollments.find((e: any) => e.course.id === selectedCourse.id);
        if (updatedEnrollment) {
          // Keep active lesson but trigger refresh UI
          setActiveLesson((prev: any) => ({ ...prev }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  const getEnrollmentForCourse = (courseId: number) => {
    return enrollments.find(e => e.course.id === courseId);
  };

  const isLessonCompleted = (lessonId: number, courseId: number) => {
    const enrollment = getEnrollmentForCourse(courseId);
    if (!enrollment || !enrollment.lesson_progress) return false;
    return enrollment.lesson_progress.some((p: any) => p.lesson === lessonId && p.is_completed);
  };

  if (loading) return <div className="flex h-full items-center justify-center text-[#dca54a]"><Loader className="animate-spin" size={40} /></div>;

  // LEARNING VIEW (When a course is opened)
  if (selectedCourse) {
    const enrollment = getEnrollmentForCourse(selectedCourse.id);
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
        {/* Sidebar course structure */}
        <aside className="w-full md:w-80 bg-white border-r border-gray-100 flex flex-col shrink-0">
          <div className="p-6 border-b border-gray-50 bg-[#082a5e] text-white">
             <button onClick={() => { setSelectedCourse(null); setActiveLesson(null); }} className="flex items-center gap-2 text-xs font-bold text-[#ebd18b] hover:text-white uppercase tracking-widest mb-4 transition-colors">
                <ArrowLeft size={16} /> Retour catalogue
             </button>
             <h3 className="font-serif font-bold text-lg leading-tight">{selectedCourse.title}</h3>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
             {selectedCourse.modules?.map((module: any) => (
                <div key={module.id} className="space-y-2">
                   <h4 className="text-xs font-extrabold text-[#082a5e] uppercase tracking-wider border-b border-gray-100 pb-1">
                      {module.title}
                   </h4>
                   <div className="space-y-1">
                      {module.lessons?.map((lesson: any) => {
                         const completed = isLessonCompleted(lesson.id, selectedCourse.id);
                         const active = activeLesson?.id === lesson.id;
                         return (
                            <button
                              key={lesson.id}
                              onClick={() => setActiveLesson(lesson)}
                              className={`w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between text-xs transition-all ${active ? 'bg-[#ebd18b]/15 text-[#082a5e] font-bold border-l-4 border-l-[#dca54a]' : 'text-gray-600 hover:bg-gray-50 border-l-4 border-l-transparent'}`}
                            >
                               <span className="truncate flex-1 mr-2">{lesson.title}</span>
                               {completed ? (
                                  <CheckCircle size={14} className="text-green-500 fill-current bg-white" />
                               ) : (
                                  <Play size={10} className="text-gray-400" />
                               )}
                            </button>
                         );
                      })}
                   </div>
                </div>
             ))}
          </div>
        </aside>

        {/* Content Viewer */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
           {activeLesson ? (
              <div className="max-w-3xl mx-auto bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-gray-100">
                 <h2 className="text-2xl md:text-3xl font-serif font-bold text-[#082a5e] mb-6">{activeLesson.title}</h2>
                 
                 {/* Video player if video_url is present */}
                 {activeLesson.video_url && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black mb-8 shadow-lg">
                       <iframe 
                         src={activeLesson.video_url.replace("watch?v=", "embed/")} 
                         title={activeLesson.title}
                         className="w-full h-full border-none"
                         allowFullScreen
                       />
                    </div>
                 )}

                 {/* Text Content */}
                 <div className="prose max-w-none text-gray-700 text-sm md:text-base leading-relaxed space-y-4 mb-8">
                    {activeLesson.content.split('\n').map((para: string, idx: number) => (
                       <p key={idx}>{para}</p>
                    ))}
                 </div>

                 {/* Actions */}
                 <div className="border-t border-gray-100 pt-6 flex justify-between items-center">
                    {isLessonCompleted(activeLesson.id, selectedCourse.id) ? (
                       <span className="text-green-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                          <CheckCircle size={16} /> Leçon complétée
                       </span>
                    ) : (
                       <button
                         disabled={completing}
                         onClick={() => handleCompleteLesson(activeLesson.id)}
                         className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold tracking-widest text-[10px] uppercase transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
                       >
                          {completing ? <Loader className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                          Marquer comme terminé
                       </button>
                    )}
                 </div>
              </div>
           ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                 <BookOpenCheck size={48} className="text-gray-300 mb-4 animate-bounce" />
                 <h3 className="text-xl font-bold text-[#082a5e]">Commencez votre apprentissage</h3>
                 <p className="text-sm text-gray-500 mt-2">Sélectionnez une leçon dans la barre latérale pour afficher le contenu.</p>
              </div>
           )}
        </main>
      </div>
    );
  }

  // CATALOGUE / DASHBOARD VIEW
  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-serif font-bold text-[#082a5e] flex items-center gap-3">
              <BookOpen className="text-[#dca54a]" size={36} /> Académie Chrétienne GSD
           </h1>
           <p className="text-gray-500 mt-2">Formez-vous aux principes du couple, du développement personnel et financier.</p>
        </div>
        
        {enrollments.length > 0 && (
           <div className="bg-[#ebd18b]/10 border border-[#dca54a]/30 px-4 py-3 rounded-2xl flex items-center gap-3">
              <Award className="text-[#dca54a]" size={24} />
              <div>
                 <div className="text-xs font-extrabold text-[#082a5e] uppercase tracking-wider">Vos Certificats</div>
                 <div className="text-[10px] text-gray-500 mt-0.5">{enrollments.filter(e => e.is_completed).length} cours terminé(s)</div>
              </div>
           </div>
        )}
      </div>

      {successMsg && (
         <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 font-bold text-sm flex items-center gap-3">
            <Shield size={18} /> {successMsg}
         </div>
      )}

      {errorMsg && (
         <div className="mb-6 bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 font-bold text-sm">
            {errorMsg}
         </div>
      )}

      {/* Grid des Cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => {
           const enrollment = getEnrollmentForCourse(course.id);
           const isEnrolled = !!enrollment;
           
           return (
              <div 
                key={course.id} 
                className="bg-white rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(8,42,94,0.03)] border border-gray-100 hover:border-[#ebd18b] hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                 <div className="h-44 bg-gray-100 relative">
                    <img 
                      src={`https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`} 
                      alt={course.title} 
                      className="w-full h-full object-cover" 
                    />
                    {course.is_premium && (
                       <span className="absolute top-4 right-4 bg-gradient-to-r from-[#dca54a] to-[#ebd18b] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full shadow-md">
                          Premium
                       </span>
                    )}
                 </div>
                 
                 <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                       <h3 className="text-lg font-serif font-bold text-[#082a5e] line-clamp-2">{course.title}</h3>
                       <p className="text-gray-500 text-xs mt-2 line-clamp-3 leading-relaxed">{course.description}</p>
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                       {isEnrolled ? (
                          <>
                             <div className="text-[10px] font-bold text-[#dca54a] uppercase tracking-wider">
                                {enrollment.is_completed ? "Terminé" : "En cours..."}
                             </div>
                             <button 
                               onClick={() => setSelectedCourse(course)}
                               className="bg-[#082a5e] hover:bg-[#051833] text-white px-5 py-2.5 rounded-xl font-bold tracking-widest text-[9px] uppercase transition-all shadow-md"
                             >
                                Étudier
                             </button>
                          </>
                       ) : (
                          <>
                             <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                Non inscrit
                             </div>
                             <button 
                               onClick={() => handleEnroll(course.id)}
                               className="border border-gray-200 text-[#082a5e] hover:bg-gray-50 px-5 py-2.5 rounded-xl font-bold tracking-widest text-[9px] uppercase transition-all"
                             >
                                S'inscrire
                             </button>
                          </>
                       )}
                    </div>
                 </div>
              </div>
           );
        })}
      </div>
    </div>
  );
}
