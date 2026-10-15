import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { getMediaUrl } from '../../../services/profile';
import { toast } from '../../../stores/useToastStore';
import { 
  Send, Loader, Heart, CheckCheck, Sparkles, MapPin, Church, 
  ArrowLeft, Image as ImageIcon, Smile, MoreVertical, 
  ShieldAlert, Ban, X, BookOpen, Quote, Eye,
  Phone, Video, Mic, Trash2, Search, UserCheck
} from 'lucide-react';
import WhatsAppEmojiPicker from '../components/WhatsAppEmojiPicker';
import AudioMessageBubble from '../components/AudioMessageBubble';
import CallModal from '../components/CallModal';
import PartnerProfileDrawer from '../components/PartnerProfileDrawer';
import MessageReactionBar from '../components/MessageReactionBar';

const CHRISTIAN_ICEBREAKERS = [
  {
    category: "Salutations & Paix",
    items: [
      "Que la paix et la grâce du Seigneur reposent sur ta journée.",
      "Bénie soit notre rencontre en ce saint jour.",
      "Que l'Éternel éclaire tes pas et guide nos échanges."
    ]
  },
  {
    category: "Foi & Partage",
    items: [
      "J'ai été très touché(e) par la ferveur qui se dégage de ton profil.",
      "Quel verset biblique t'accompagne tout particulièrement ces temps-ci ?",
      "Comment s'est passée ta semaine sous le regard du Seigneur ?"
    ]
  },
  {
    category: "Paroles d'Alliance",
    items: [
      "« 1 Corinthiens 13:4-7 — L'amour est patient, il est plein de bonté. »",
      "« Proverbes 3:5-6 — Confie-toi en l'Éternel de tout ton cœur. »",
      "« Ecclésiaste 4:12 — La corde à trois fils ne se rompt pas facilement. »"
    ]
  }
];

export default function ChatSpace() {
  const { token, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const matchIdParam = searchParams.get('match_id');

  const [matches, setMatches] = useState<any[]>([]);
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sélecteur d'émojis WhatsApp & Bénédictions
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showIcebreakers, setShowIcebreakers] = useState(false);

  // Recherche dans les messages
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Volet Fiche Profil Complète
  const [showProfileDrawer, setShowProfileDrawer] = useState(false);

  // Indicateur "En train d'écrire..."
  const [isPartnerTyping, setIsPartnerTyping] = useState(false);

  // Réactions et survol de message
  const [hoveredMessageId, setHoveredMessageId] = useState<number | null>(null);

  // Photos & Médias
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Note Vocale / MediaRecorder
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordingTimerRef = useRef<any>(null);

  // Appels Audio / Vidéo
  const [activeCall, setActiveCall] = useState<{
    type: 'AUDIO' | 'VIDEO';
    id?: number;
  } | null>(null);

  // Sécurité & Modération
  const [showMenu, setShowMenu] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reportReason, setReportReason] = useState('INAPPROPRIATE_BEHAVIOR');
  const [reportDetails, setReportDetails] = useState('');
  const [blockWithReport, setBlockWithReport] = useState(true);

  // 1. Fetch Matches
  const fetchMatches = async () => {
    try {
      const res = await api.get('/api/matchmaking/matches/');
      const acceptedMatches = res.data.filter((m: any) => m.is_accepted);
      setMatches(acceptedMatches);
      return acceptedMatches;
    } catch (err) {
      console.error("Erreur chargement matches:", err);
      return matches;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatches().then((fetched) => {
      if (matchIdParam && fetched.length > 0) {
        const found = fetched.find((m: any) => String(m.id) === String(matchIdParam));
        if (found) {
          setActiveMatch(found);
          return;
        }
      }
      if (!activeMatch && fetched.length > 0 && window.innerWidth >= 768) {
        setActiveMatch(fetched[0]);
      }
    });
  }, [token, matchIdParam]);

  // Sync activeMatch if matchIdParam changes
  useEffect(() => {
    if (matchIdParam && matches.length > 0) {
      const found = matches.find((m: any) => String(m.id) === String(matchIdParam));
      if (found) {
        setActiveMatch(found);
      }
    }
  }, [matchIdParam, matches]);

  // Fetch messages with polling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const fetchMessages = async () => {
      if (!activeMatch) return;
      try {
        const res = await api.get(`/api/matchmaking/messages/?match_id=${activeMatch.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error("Erreur messages:", err);
      }
    };

    if (activeMatch) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000);
    }

    return () => { if (interval) clearInterval(interval); };
  }, [activeMatch, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isPartnerTyping]);

  // Nettoyage de l'enregistreur audio lors du démontage
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
        mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Filtrage des messages pour la recherche
  const filteredMessages = useMemo(() => {
    if (!searchQuery.trim()) return messages;
    const q = searchQuery.toLowerCase();
    return messages.filter(m => m.content && m.content.toLowerCase().includes(q));
  }, [messages, searchQuery]);

  // Sélection d'image
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La photo ne doit pas dépasser 10 Mo.");
        return;
      }
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const cancelImagePreview = () => {
    setSelectedImage(null);
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Enregistrement d'une note vocale
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingDuration(0);

      recordingTimerRef.current = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      console.error("Microphone non disponible:", err);
      toast.error("Impossible d'accéder au microphone. Vérifiez vos autorisations.");
    }
  };

  const cancelRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      mediaRecorderRef.current = null;
    }
    audioChunksRef.current = [];
    setIsRecording(false);
    setRecordingDuration(0);
  };

  const sendRecording = () => {
    if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    if (!mediaRecorderRef.current || !activeMatch) return;

    const duration = recordingDuration;
    const recorder = mediaRecorderRef.current;

    recorder.onstop = async () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioFile = new File([audioBlob], `vocal_${Date.now()}.webm`, { type: 'audio/webm' });

      const tempAudioUrl = URL.createObjectURL(audioBlob);
      const tempMsg = {
        id: Date.now(),
        content: '',
        image_url: null,
        audio_url: tempAudioUrl,
        duration: duration,
        reactions: {},
        sender: user?.id,
        timestamp: new Date().toISOString(),
        is_read: false
      };

      setMessages(prev => [...prev, tempMsg]);

      try {
        const formData = new FormData();
        formData.append('match', activeMatch.id);
        formData.append('audio', audioFile);
        formData.append('duration', duration.toString());

        const res = await api.post('/api/matchmaking/messages/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (res.data) {
          setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.data : m));
        }
      } catch (err: any) {
        console.error("Erreur envoi note vocale:", err);
        toast.error("Échec de l'envoi de la note vocale.");
        setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      }
    };

    recorder.stop();
    recorder.stream.getTracks().forEach(track => track.stop());
    setIsRecording(false);
    setRecordingDuration(0);
  };

  // Envoi d'un message texte ou photo
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if ((!newMessage.trim() && !selectedImage) || !activeMatch) return;
    
    const tempContent = newMessage.trim();
    const tempImagePreview = imagePreview;

    const tempMsg = {
       id: Date.now(),
       content: tempContent,
       image_url: tempImagePreview,
       audio_url: null,
       duration: 0,
       reactions: {},
       sender: user?.id,
       timestamp: new Date().toISOString(),
       is_read: false
    };

    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');
    setShowEmojiPicker(false);
    setShowIcebreakers(false);

    // Reset preview
    const imageToSend = selectedImage;
    cancelImagePreview();

    try {
      setIsUploading(true);
      let res;
      if (imageToSend) {
        const formData = new FormData();
        formData.append('match', activeMatch.id);
        if (tempContent) formData.append('content', tempContent);
        formData.append('image', imageToSend);

        res = await api.post('/api/matchmaking/messages/', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/api/matchmaking/messages/', {
          match: activeMatch.id,
          content: tempContent
        });
      }

      if (res.data) {
        setMessages(prev => prev.map(m => m.id === tempMsg.id ? res.data : m));
      }
    } catch (err: any) {
      console.error("Erreur envoi message:", err?.response?.data || err);
      toast.error("Échec de l'envoi du message.");
      setMessages(prev => prev.filter(m => m.id !== tempMsg.id));
      setNewMessage(tempContent);
    } finally {
      setIsUploading(false);
    }
  };

  // Réactions aux messages (style WhatsApp)
  const handleReactMessage = async (msgId: number, emoji: string) => {
    setMessages(prev => prev.map(m => {
      if (m.id !== msgId) return m;
      const currentReactions = { ...(m.reactions || {}) };
      const myId = user?.id;
      const userList = [...(currentReactions[emoji] || [])];

      if (userList.includes(myId)) {
        currentReactions[emoji] = userList.filter((uid: number) => uid !== myId);
        if (currentReactions[emoji].length === 0) delete currentReactions[emoji];
      } else {
        // Enlever des autres émojis pour garder une seule réaction par personne
        Object.keys(currentReactions).forEach(k => {
          currentReactions[k] = currentReactions[k].filter((uid: number) => uid !== myId);
          if (currentReactions[k].length === 0) delete currentReactions[k];
        });
        currentReactions[emoji] = [...(currentReactions[emoji] || []), myId];
      }
      return { ...m, reactions: currentReactions };
    }));

    try {
      const res = await api.post(`/api/matchmaking/messages/${msgId}/react/`, { emoji });
      if (res.data) {
        setMessages(prev => prev.map(m => m.id === msgId ? res.data : m));
      }
    } catch (err) {
      console.error("Erreur réaction message:", err);
    }
  };

  // Suppression d'un message
  const handleDeleteMessage = async (msgId: number) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    try {
      await api.delete(`/api/matchmaking/messages/${msgId}/`);
      toast.success("Message supprimé.");
    } catch (err) {
      console.error("Erreur suppression:", err);
      toast.error("Impossible de supprimer le message.");
    }
  };

  // Gestion des appels
  const handleStartCall = async (type: 'AUDIO' | 'VIDEO') => {
    if (!activeMatch) return;
    try {
      const res = await api.post('/api/matchmaking/calls/', {
        match: activeMatch.id,
        call_type: type
      });
      setActiveCall({ type, id: res.data.id });
    } catch (err: any) {
      console.error("Erreur lancement appel:", err);
      setActiveCall({ type, id: Date.now() });
    }
  };

  const handleEndCall = async (durationSecs: number) => {
    if (activeCall?.id) {
      try {
        await api.post(`/api/matchmaking/calls/${activeCall.id}/end/`);
      } catch (err) {
        console.warn("Erreur cloture appel:", err);
      }
    }
    setActiveCall(null);
    const m = Math.floor(durationSecs / 60);
    const s = durationSecs % 60;
    toast.success(`Appel terminé (${m}m ${s < 10 ? '0' : ''}${s}s)`);
  };

  // Bloquer la conversation
  const handleBlockMatch = async () => {
    if (!activeMatch) return;
    try {
      await api.post(`/api/matchmaking/matches/${activeMatch.id}/block/`);
      toast.success("Cette conversation a été définitivement bloquée.");
      setShowBlockModal(false);
      setShowMenu(false);
      setActiveMatch(null);
      fetchMatches();
    } catch (err) {
      toast.error("Impossible de bloquer ce profil.");
    }
  };

  // Signaler le profil
  const handleReportMatch = async () => {
    if (!activeMatch) return;
    try {
      await api.post(`/api/matchmaking/matches/${activeMatch.id}/report/`, {
        reason: reportReason,
        details: reportDetails,
        block: blockWithReport
      });
      toast.success("Signalement transmis à l'équipe de modération.");
      setShowReportModal(false);
      setShowMenu(false);
      if (blockWithReport) {
        setActiveMatch(null);
        fetchMatches();
      }
    } catch (err) {
      toast.error("Échec de l'envoi du signalement.");
    }
  };

  const getPartnerData = (match: any) => {
    if (!match) return null;
    const isUser1 = match.user1 === user?.id;
    const partner = isUser1 ? match.user2_details : match.user1_details;
    const partnerName = partner?.first_name 
      ? `${partner.first_name} ${partner.last_name || ''}`.trim() 
      : `Partenaire Divin #${isUser1 ? match.user2 : match.user1}`;
    const initials = partner?.first_name ? partner.first_name.charAt(0).toUpperCase() : "P";
    const avatarUrl = partner?.avatar ? getMediaUrl(partner.avatar) : null;
    return {
      partner,
      partnerName,
      initials,
      avatarUrl,
      city: partner?.city || 'Douala',
      denomination: partner?.denomination?.replace('_', ' ') || 'Chrétien(ne)',
      compatibility: match.compatibility_score || 85
    };
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center text-[#C9A84C] bg-[#FAF9F6]">
        <div className="text-center space-y-3">
          <Loader className="animate-spin mx-auto text-[#C9A84C]" size={36} />
          <p className="text-xs uppercase tracking-widest text-[#1A3A5C]/60 font-medium">Ouverture du Salon Privé...</p>
        </div>
      </div>
    );
  }

  const currentPartner = activeMatch ? getPartnerData(activeMatch) : null;

  return (
    <div className="flex h-full bg-[#FAF9F6] overflow-hidden relative">
      {/* Sidebar des Conversations */}
      <div className={`${activeMatch ? 'hidden md:flex' : 'flex'} w-full md:w-80 lg:w-96 flex-col border-r border-[#EFECE6] bg-white`}>
         <div className="p-6 border-b border-[#EFECE6] bg-[#FCFBF9]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-serif font-bold text-[#1A3A5C]">Vos Échanges Privés</h2>
                <p className="text-[11px] text-[#C9A84C] font-semibold tracking-wider uppercase mt-0.5">Le Salon Sacré</p>
              </div>
              <span className="w-8 h-8 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center text-xs font-bold font-serif">
                {matches.length}
              </span>
            </div>
         </div>

         <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {matches.length === 0 ? (
               <div className="text-center p-8 text-gray-400 mt-10">
                  <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mx-auto mb-4">
                    <Heart size={28} className="fill-current/30" />
                  </div>
                  <h4 className="font-serif font-bold text-[#1A3A5C] mb-1">Aucun match pour le moment</h4>
                  <p className="text-xs text-gray-500 leading-relaxed mb-6">Explorez les profils suggérés et laissez la providence divine faire son œuvre.</p>
                  <button 
                    onClick={() => navigate('/app/matches')}
                    className="px-5 py-2.5 rounded-full bg-[#1A3A5C] text-white text-xs font-semibold hover:bg-[#132c45] transition-all shadow-md"
                  >
                    Découvrir des âmes sœurs
                  </button>
               </div>
            ) : (
               matches.map((match) => {
                  const pData = getPartnerData(match);
                  const isSelected = activeMatch?.id === match.id;
                  
                  return (
                     <button 
                       key={match.id} 
                       onClick={() => setActiveMatch(match)}
                       className={`w-full text-left p-3.5 rounded-2xl flex items-center gap-3.5 transition-all duration-200 ${
                         isSelected 
                           ? 'bg-[#1A3A5C] text-white shadow-lg shadow-[#1A3A5C]/15 ring-1 ring-[#1A3A5C]' 
                           : 'bg-[#FCFBF9] border border-[#EFECE6] text-gray-800 hover:border-[#C9A84C]/60 hover:bg-white'
                       }`}
                     >
                        <div className="relative flex-shrink-0 w-12 h-12">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 ring-2 ring-[#C9A84C]/30 flex items-center justify-center">
                            {pData?.avatarUrl ? (
                               <img 
                                 src={pData.avatarUrl} 
                                 alt={pData.partnerName} 
                                 className="w-full h-full object-cover" 
                                 onError={(e: any) => {
                                   e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pData.partnerName)}&background=ebd18b&color=082a5e`;
                                 }}
                               />
                            ) : (
                               <div className={`w-full h-full flex items-center justify-center font-bold font-serif text-sm ${
                                 isSelected ? 'bg-white/20 text-[#ebd18b]' : 'bg-[#EFECE6] text-[#1A3A5C]'
                               }`}>
                                  {pData?.initials}
                               </div>
                             )}
                          </div>
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between mb-0.5">
                              <h4 className="font-bold text-sm truncate font-serif">{pData?.partnerName}</h4>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                                isSelected ? 'bg-white/20 text-[#ebd18b]' : 'bg-[#C9A84C]/10 text-[#C9A84C]'
                              }`}>
                                {pData?.compatibility}%
                              </span>
                           </div>
                           <p className={`text-xs truncate ${isSelected ? 'text-[#ebd18b]/90' : 'text-gray-500'}`}>
                             {match.last_message?.audio_url 
                               ? '🎤 Note vocale' 
                               : match.last_message?.image_url 
                                 ? '📷 Photo reçue' 
                                 : (match.last_message?.content || "Connexion établie • Échangez en toute foi...")}
                           </p>
                        </div>
                     </button>
                  );
               })
            )}
         </div>
      </div>

      {/* Zone Principale du Chat */}
      <div className={`${!activeMatch ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white overflow-hidden relative`}>
         {!activeMatch ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center bg-[#FAF9F6]">
               <div className="w-20 h-20 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mb-6">
                 <Sparkles size={36} />
               </div>
               <h3 className="text-2xl font-serif font-bold text-[#1A3A5C] mb-2">Le Salon Privé</h3>
               <p className="text-gray-500 max-w-sm text-sm leading-relaxed mb-6">
                 Sélectionnez une de vos affinités dans la liste pour débuter un échange bienveillant et pieux.
               </p>
               <button 
                 onClick={() => navigate('/app/matches')}
                 className="px-6 py-3 rounded-full bg-gradient-to-r from-[#1A3A5C] to-[#244f7d] text-white text-xs font-semibold tracking-wider uppercase hover:shadow-lg transition-all"
               >
                 Trouver des profils
               </button>
            </div>
         ) : (
            <>
                {/* Header de la conversation avec Accès Fiche Profil, Appels et Recherche */}
                <div className="px-6 py-4 border-b border-[#EFECE6] flex items-center justify-between bg-white/95 backdrop-blur z-20 shadow-sm relative">
                   <div className="flex items-center gap-3.5">
                      <button 
                        onClick={() => setActiveMatch(null)} 
                        className="md:hidden p-2 -ml-2 text-gray-500 hover:text-[#1A3A5C] rounded-full hover:bg-gray-100"
                      >
                         <ArrowLeft size={20} />
                      </button>

                      {/* Clic sur la photo / nom ouvre la fiche profil complète */}
                      <div 
                        onClick={() => setShowProfileDrawer(true)}
                        className="flex items-center gap-3 cursor-pointer group"
                        title="Voir la fiche profil complète"
                      >
                        <div className="relative flex-shrink-0 w-10 h-10 group-hover:scale-105 transition-transform">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 ring-2 ring-[#C9A84C]/40 group-hover:ring-[#C9A84C] flex items-center justify-center transition-all">
                            {currentPartner?.avatarUrl ? (
                               <img 
                                 src={currentPartner.avatarUrl} 
                                 alt={currentPartner.partnerName} 
                                 className="w-full h-full object-cover" 
                                 onError={(e: any) => {
                                   e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(currentPartner.partnerName)}&background=ebd18b&color=082a5e`;
                                 }}
                               />
                            ) : (
                               <div className="w-full h-full bg-gradient-to-tr from-[#C9A84C] to-[#ebd18b] shadow-md flex items-center justify-center text-white font-bold font-serif">
                                 {currentPartner?.initials}
                               </div>
                            )}
                          </div>
                          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>

                        <div>
                           <div className="flex items-center gap-2">
                             <h3 className="font-serif font-bold text-[#1A3A5C] text-base leading-none group-hover:text-[#C9A84C] transition-colors">
                               {currentPartner?.partnerName}
                             </h3>
                             <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C9A84C]/15 text-[#C9A84C]">
                               {currentPartner?.compatibility}% affinité
                             </span>
                           </div>

                           {/* Statut En ligne & Indicateur "En train d'écrire..." */}
                           <div className="flex items-center gap-2 text-[11px] mt-1">
                             {isPartnerTyping ? (
                               <span className="text-[#C9A84C] font-semibold flex items-center gap-1.5 animate-pulse">
                                 <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />
                                 {currentPartner?.partner?.first_name || 'Votre partenaire'} est en train d'écrire...
                               </span>
                             ) : (
                               <div className="flex items-center gap-2 text-gray-500">
                                 <span className="flex items-center gap-1 text-emerald-600 font-medium">
                                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                   En ligne
                                 </span>
                                 <span>•</span>
                                 <span className="flex items-center gap-1"><MapPin size={11} className="text-[#C9A84C]" /> {currentPartner?.city}</span>
                                 <span>•</span>
                                 <span className="hidden sm:flex items-center gap-1"><Church size={11} className="text-[#C9A84C]" /> {currentPartner?.denomination}</span>
                               </div>
                             )}
                           </div>
                        </div>
                      </div>
                   </div>

                   {/* Actions Header : Fiche profil, Appel Vidéo, Appel Audio, Recherche & Sécurité */}
                   <div className="flex items-center gap-1 sm:gap-2 relative">
                     {/* Bouton Fiche Profil Complète */}
                     <button
                       type="button"
                       onClick={() => setShowProfileDrawer(true)}
                       className="p-2 sm:p-2.5 rounded-full hover:bg-[#FAF9F6] text-[#1A3A5C] hover:text-[#C9A84C] transition-colors"
                       title="Voir la fiche profil complète"
                     >
                       <UserCheck size={19} />
                     </button>

                     {/* Bouton Appel Vidéo */}
                     <button
                       type="button"
                       onClick={() => handleStartCall('VIDEO')}
                       className="p-2 sm:p-2.5 rounded-full hover:bg-[#FAF9F6] text-[#1A3A5C] hover:text-[#C9A84C] transition-colors"
                       title="Lancer un appel vidéo"
                     >
                       <Video size={19} />
                     </button>

                     {/* Bouton Appel Audio */}
                     <button
                       type="button"
                       onClick={() => handleStartCall('AUDIO')}
                       className="p-2 sm:p-2.5 rounded-full hover:bg-[#FAF9F6] text-[#1A3A5C] hover:text-[#C9A84C] transition-colors"
                       title="Lancer un appel audio"
                     >
                       <Phone size={19} />
                     </button>

                     {/* Bouton Recherche dans la conversation */}
                     <button
                       type="button"
                       onClick={() => {
                         setIsSearchOpen(prev => !prev);
                         if (isSearchOpen) setSearchQuery('');
                       }}
                       className={`p-2 sm:p-2.5 rounded-full transition-colors ${
                         isSearchOpen ? 'bg-[#FAF9F6] text-[#C9A84C]' : 'hover:bg-[#FAF9F6] text-gray-500 hover:text-[#1A3A5C]'
                       }`}
                       title="Rechercher dans la discussion"
                     >
                       <Search size={19} />
                     </button>

                     {/* Menu Actions de Sécurité */}
                     <button
                       onClick={() => setShowMenu(prev => !prev)}
                       className="p-2 sm:p-2.5 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                       title="Options de sécurité"
                     >
                       <MoreVertical size={18} />
                     </button>

                     {showMenu && (
                       <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-[#EFECE6] py-2 z-30 animate-in fade-in zoom-in-95 duration-150">
                         <button
                           onClick={() => { setShowMenu(false); setShowReportModal(true); }}
                           className="w-full px-4 py-2.5 text-left text-xs font-semibold text-amber-700 hover:bg-amber-50 flex items-center gap-2.5"
                         >
                           <ShieldAlert size={16} /> Signaler ce comportement
                         </button>
                         <button
                           onClick={() => { setShowMenu(false); setShowBlockModal(true); }}
                           className="w-full px-4 py-2.5 text-left text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                         >
                           <Ban size={16} /> Bloquer la conversation
                         </button>
                       </div>
                     )}
                   </div>
                </div>

                {/* Barre de Recherche dépliée dans la conversation */}
                {isSearchOpen && (
                  <div className="px-6 py-2.5 bg-[#FCFBF9] border-b border-[#EFECE6] flex items-center gap-3 animate-in slide-in-from-top-2 duration-150">
                    <Search size={16} className="text-[#C9A84C] shrink-0" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher un mot, un verset, un échange..."
                      className="flex-1 bg-white border border-[#EFECE6] rounded-full px-4 py-1.5 text-xs text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#C9A84C]"
                      autoFocus
                    />
                    {searchQuery && (
                      <span className="text-[11px] font-semibold text-gray-400">
                        {filteredMessages.length} trouvé{filteredMessages.length > 1 ? 's' : ''}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}

                {/* Fil des messages avec Réactions et Suppression */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FAF9F6]/80" onClick={() => setShowMenu(false)}>
                   <div className="flex flex-col items-center justify-center mb-6 text-center">
                      <div className="w-10 h-10 rounded-full bg-[#C9A84C]/10 text-[#C9A84C] flex items-center justify-center mb-2">
                        <Heart size={18} className="fill-current" />
                      </div>
                      <span className="bg-white border border-[#EFECE6] text-gray-500 text-[11px] px-4 py-1 rounded-full font-medium shadow-sm">
                         Échange privé sous le regard du Seigneur • Respect & Vérité
                      </span>
                   </div>

                   {filteredMessages.map((msg) => {
                      const isMine = msg.sender === user?.id;
                      const hasImage = Boolean(msg.image_url || msg.image);
                      const imageUrl = msg.image_url || (msg.image ? getMediaUrl(msg.image) : null);
                      const hasAudio = Boolean(msg.audio_url || msg.audio);
                      const audioUrl = msg.audio_url || (msg.audio ? getMediaUrl(msg.audio) : null);
                      const isHovered = hoveredMessageId === msg.id;

                      return (
                         <div 
                           key={msg.id} 
                           className={`flex ${isMine ? 'justify-end' : 'justify-start'} group relative`}
                           onMouseEnter={() => setHoveredMessageId(msg.id)}
                           onMouseLeave={() => setHoveredMessageId(null)}
                         >
                            {/* Barre de Réactions & Suppression façon WhatsApp */}
                            {isHovered && (
                              <div className={`absolute -top-7 ${isMine ? 'right-2' : 'left-2'}`}>
                                <MessageReactionBar
                                  onReact={(emoji) => handleReactMessage(msg.id, emoji)}
                                  onDelete={() => handleDeleteMessage(msg.id)}
                                  isMine={isMine}
                                />
                              </div>
                            )}

                            <div className={`max-w-[85%] sm:max-w-[65%] p-3.5 sm:p-4 rounded-[1.4rem] shadow-sm transition-all relative ${
                              isMine 
                                ? 'bg-[#1A3A5C] text-white rounded-br-xs shadow-[#1A3A5C]/10' 
                                : 'bg-white border border-[#EFECE6] text-gray-800 rounded-bl-xs'
                            }`}>
                               {/* Affichage de Note Vocale */}
                               {hasAudio && audioUrl && (
                                 <div className="mb-1.5">
                                   <AudioMessageBubble
                                     audioUrl={getMediaUrl(audioUrl)}
                                     duration={msg.duration || 0}
                                     isMine={isMine}
                                   />
                                 </div>
                               )}

                               {/* Affichage d'image */}
                               {hasImage && imageUrl && (
                                 <div className="mb-2 rounded-2xl overflow-hidden cursor-pointer group/img relative max-h-72">
                                   <img 
                                     src={getMediaUrl(imageUrl)} 
                                     alt="Photo partagée" 
                                     className="w-full h-full object-cover rounded-2xl group-hover/img:scale-[1.02] transition-transform duration-300"
                                     onClick={() => setLightboxImage(getMediaUrl(imageUrl))}
                                   />
                                   <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                     <Eye className="text-white drop-shadow" size={24} />
                                   </div>
                                 </div>
                               )}

                               {/* Contenu textuel */}
                               {msg.content && (
                                 <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                               )}

                               {/* Badges de Réactions Émojis */}
                               {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                 <div className={`flex flex-wrap gap-1 mt-2 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                   {Object.entries(msg.reactions).map(([emoji, userIds]: [string, any]) => {
                                     if (!Array.isArray(userIds) || userIds.length === 0) return null;
                                     const didIReact = userIds.includes(user?.id);
                                     return (
                                       <button
                                         key={emoji}
                                         type="button"
                                         onClick={() => handleReactMessage(msg.id, emoji)}
                                         className={`px-2 py-0.5 rounded-full text-xs flex items-center gap-1 border shadow-2xs transition-all ${
                                           didIReact
                                             ? (isMine ? 'bg-[#C9A84C] text-[#1A3A5C] border-[#ebd18b] font-bold' : 'bg-[#C9A84C]/20 text-[#1A3A5C] border-[#C9A84C] font-bold')
                                             : (isMine ? 'bg-white/20 border-white/30 text-white hover:bg-white/30' : 'bg-[#FCFBF9] border-gray-200 text-gray-700 hover:bg-white')
                                         }`}
                                         title={didIReact ? "Retirer votre réaction" : "Réagir"}
                                       >
                                         <span>{emoji}</span>
                                         <span className="text-[10px]">{userIds.length}</span>
                                       </button>
                                     );
                                   })}
                                 </div>
                               )}

                               {/* Horodatage & Accusé de lecture */}
                               <div className={`text-[10px] mt-1.5 flex items-center gap-1 ${
                                 isMine ? 'justify-end text-white/70' : 'justify-start text-gray-400'
                               }`}>
                                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  {isMine && (
                                    msg.is_read ? (
                                      <span title="Vu par votre partenaire" className="flex items-center text-[#ebd18b]">
                                        <CheckCheck size={14} />
                                      </span>
                                    ) : (
                                      <span title="Distribué" className="flex items-center opacity-60">
                                        <CheckCheck size={14} />
                                      </span>
                                    )
                                  )}
                               </div>
                            </div>
                         </div>
                      );
                   })}

                   {/* Bulle d'indication "En train d'écrire..." */}
                   {isPartnerTyping && (
                     <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-200">
                       <div className="bg-white border border-[#EFECE6] px-4 py-2.5 rounded-2xl rounded-bl-xs shadow-xs flex items-center gap-1.5 text-gray-400">
                         <span className="text-[11px] font-medium text-gray-500 mr-1">
                           {currentPartner?.partner?.first_name || 'Partenaire'} écrit
                         </span>
                         <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce [animation-delay:-0.3s]" />
                         <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce [animation-delay:-0.15s]" />
                         <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full animate-bounce" />
                       </div>
                     </div>
                   )}

                   <div ref={messagesEndRef} />
                </div>

                {/* Prévisualisation de photo sélectionnée avant envoi */}
                {imagePreview && (
                  <div className="px-6 py-3 bg-[#FCFBF9] border-t border-[#EFECE6] flex items-center gap-3">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-gray-200">
                      <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover" />
                      <button
                        onClick={cancelImagePreview}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                    <div className="text-xs text-gray-500">
                      <span className="font-semibold text-[#1A3A5C] block">Photo prête à être partagée</span>
                      Ajoutez une légende ou envoyez directement.
                    </div>
                  </div>
                )}

                {/* Tiroir d'Émojis WhatsApp Complet */}
                {showEmojiPicker && (
                  <WhatsAppEmojiPicker 
                    onSelectEmoji={(emoji) => setNewMessage(prev => prev + emoji)}
                    onClose={() => setShowEmojiPicker(false)}
                  />
                )}

                {/* Tiroir de Bénédictions & Brise-glace chrétiens */}
                {showIcebreakers && (
                  <div className="p-4 bg-[#FCFBF9] border-t border-[#EFECE6] max-h-48 overflow-y-auto space-y-3 animate-in slide-in-from-bottom-3 duration-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen size={13} /> Paroles inspirées & Brise-glace
                      </span>
                      <button onClick={() => setShowIcebreakers(false)} className="text-gray-400 hover:text-gray-600">
                        <X size={14} />
                      </button>
                    </div>
                    {CHRISTIAN_ICEBREAKERS.map((group, gIdx) => (
                      <div key={gIdx} className="space-y-1">
                        <span className="text-[10px] font-semibold text-gray-400">{group.category}</span>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((phrase, pIdx) => (
                            <button
                              key={pIdx}
                              onClick={() => {
                                setNewMessage(phrase);
                                setShowIcebreakers(false);
                              }}
                              className="text-left text-xs bg-white border border-[#EFECE6] text-[#1A3A5C] px-3 py-1.5 rounded-full hover:border-[#C9A84C] hover:bg-[#FAF9F6] transition-all"
                            >
                              {phrase}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Barre de Saisie & Enregistrement Audio façon WhatsApp */}
                <div className="p-4 bg-white border-t border-[#EFECE6]">
                   {isRecording ? (
                     /* Mode Enregistrement Audio Actif */
                     <div className="flex items-center justify-between bg-red-50/80 border border-red-200 rounded-full p-2 px-4 animate-in fade-in duration-200">
                       <div className="flex items-center gap-3">
                         <span className="w-3 h-3 rounded-full bg-red-600 animate-ping" />
                         <span className="font-mono text-sm font-bold text-red-600">
                           {Math.floor(recordingDuration / 60)}:{recordingDuration % 60 < 10 ? '0' : ''}{recordingDuration % 60}
                         </span>
                         <span className="text-xs text-gray-600 font-medium hidden sm:inline">
                           Enregistrement de la note vocale...
                         </span>
                       </div>

                       <div className="flex items-center gap-2">
                         {/* Annuler / Corbeille */}
                         <button
                           type="button"
                           onClick={cancelRecording}
                           className="w-10 h-10 rounded-full hover:bg-red-100 text-red-600 flex items-center justify-center transition-colors"
                           title="Supprimer la note vocale"
                         >
                           <Trash2 size={18} />
                         </button>

                         {/* Envoyer la note vocale */}
                         <button
                           type="button"
                           onClick={sendRecording}
                           className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center text-white transition-all shadow-md shadow-red-600/30 shrink-0"
                           title="Envoyer la note vocale"
                         >
                           <Send size={16} />
                         </button>
                       </div>
                     </div>
                   ) : (
                     /* Mode Saisie Standard */
                     <form onSubmit={handleSend} className="flex items-center gap-2 bg-[#FAF9F6] border border-[#EFECE6] rounded-full p-2 pl-4 focus-within:bg-white focus-within:border-[#C9A84C] focus-within:ring-2 focus-within:ring-[#C9A84C]/20 transition-all">
                        {/* Bouton Paroles / Brise-glace */}
                        <button 
                          type="button" 
                          onClick={() => { setShowIcebreakers(prev => !prev); setShowEmojiPicker(false); }}
                          className="text-[#C9A84C] hover:text-[#b8953c] p-1.5 rounded-full transition-colors"
                          title="Bénédictions et versets inspirés"
                        >
                           <Quote size={18} />
                        </button>

                        {/* Bouton Émojis WhatsApp */}
                        <button 
                          type="button" 
                          onClick={() => { setShowEmojiPicker(prev => !prev); setShowIcebreakers(false); }}
                          className={`p-1.5 rounded-full transition-colors ${
                            showEmojiPicker ? 'text-[#C9A84C]' : 'text-gray-400 hover:text-[#C9A84C]'
                          }`}
                          title="Toutes les émojis classées (WhatsApp)"
                        >
                           <Smile size={18} />
                        </button>

                        {/* Bouton Photo / Pièce jointe */}
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          onChange={handleFileSelect}
                          accept="image/*"
                          className="hidden" 
                        />
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-gray-400 hover:text-[#1A3A5C] p-1.5 rounded-full transition-colors"
                          title="Partager une photo"
                        >
                           <ImageIcon size={18} />
                        </button>

                        <input 
                           type="text" 
                           value={newMessage}
                           onChange={(e) => setNewMessage(e.target.value)}
                           placeholder={imagePreview ? "Ajoutez une légende (optionnel)..." : "Partagez un message inspiré..."} 
                           className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 text-gray-800 px-2"
                        />

                        {/* Si du texte ou une image est présent : Bouton Envoyer. Sinon : Bouton Micro façon WhatsApp */}
                        {newMessage.trim() || selectedImage ? (
                          <button 
                             type="submit" 
                             disabled={isUploading}
                             className="w-10 h-10 bg-gradient-to-tr from-[#C9A84C] to-[#deb958] rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:scale-105 active:scale-95 transition-all shadow-md shadow-[#C9A84C]/25 shrink-0"
                             title="Envoyer le message"
                          >
                             {isUploading ? <Loader size={16} className="animate-spin" /> : <Send size={16} />}
                          </button>
                        ) : (
                          <button 
                             type="button"
                             onClick={startRecording}
                             className="w-10 h-10 bg-[#1A3A5C] hover:bg-[#132c45] active:scale-95 rounded-full flex items-center justify-center text-[#ebd18b] transition-all shadow-md shadow-[#1A3A5C]/20 shrink-0"
                             title="Enregistrer une note vocale"
                          >
                             <Mic size={18} />
                          </button>
                        )}
                     </form>
                   )}
                </div>
            </>
         )}
      </div>

      {/* VOLET LATÉRAL : FICHE PROFIL COMPLÈTE */}
      {showProfileDrawer && currentPartner && (
        <PartnerProfileDrawer
          partner={currentPartner.partner}
          compatibility={currentPartner.compatibility}
          isOpen={showProfileDrawer}
          onClose={() => setShowProfileDrawer(false)}
          onOpenLightbox={(url) => setLightboxImage(url)}
        />
      )}

      {/* MODAL APPEL AUDIO / VIDEO */}
      {activeCall && currentPartner && (
        <CallModal
          partnerName={currentPartner.partnerName}
          partnerAvatar={currentPartner.avatarUrl}
          callType={activeCall.type}
          callId={activeCall.id}
          onEndCall={handleEndCall}
        />
      )}

      {/* LIGHTBOX GRAND FORMAT */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 w-10 h-10 rounded-full bg-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <X size={20} />
            </button>
            <img 
              src={lightboxImage} 
              alt="Agrandissement" 
              className="max-w-full max-h-[85vh] rounded-2xl object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* MODAL DE SIGNALEMENT */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#EFECE6] animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 text-amber-700 mb-4">
              <ShieldAlert size={28} />
              <div>
                <h3 className="font-serif font-bold text-lg text-[#1A3A5C]">Signaler un comportement</h3>
                <p className="text-xs text-gray-500">Protection du sanctuaire et des membres</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Motif du signalement :</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs bg-[#FAF9F6] outline-none focus:border-[#C9A84C]"
                >
                  <option value="INAPPROPRIATE_BEHAVIOR">Propos déplacés ou irrespectueux</option>
                  <option value="HARASSMENT">Harcèlement ou insistance indésirable</option>
                  <option value="FAKE_PROFILE">Profil trompeur ou usurpation</option>
                  <option value="FINANCIAL_REQUEST">Demande financière / tentative suspecte</option>
                  <option value="OTHER">Autre motif</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Détails complémentaires :</label>
                <textarea
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Expliquez brièvement ce qui s'est produit pour aider notre équipe..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs bg-[#FAF9F6] outline-none focus:border-[#C9A84C]"
                />
              </div>

              <label className="flex items-center gap-2 text-xs text-gray-700 cursor-pointer pt-1">
                <input 
                  type="checkbox" 
                  checked={blockWithReport} 
                  onChange={(e) => setBlockWithReport(e.target.checked)}
                  className="accent-[#1A3A5C]"
                />
                Bloquer également cette personne immédiatement
              </label>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleReportMatch}
                  className="px-5 py-2.5 rounded-full text-xs font-semibold bg-amber-700 text-white hover:bg-amber-800 transition-colors shadow-md"
                >
                  Transmettre le signalement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE BLOCAGE */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-[#EFECE6] text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-4">
              <Ban size={28} />
            </div>
            <h3 className="font-serif font-bold text-lg text-[#1A3A5C] mb-2">Bloquer cette personne ?</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Cette personne ne pourra plus vous envoyer de message et vos profils cesseront d'être connectés.
            </p>

            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleBlockMatch}
                className="px-5 py-2.5 rounded-full text-xs font-semibold bg-red-600 text-white hover:bg-red-700 transition-colors shadow-md"
              >
                Confirmer le blocage
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
