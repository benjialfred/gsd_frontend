import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import api from '../../../services/api';
import { Send, Loader, Info, CheckCheck, Heart } from 'lucide-react';
import Logo from '../../../shared/components/Logo';

export default function ChatSpace() {
  const { token, user } = useAuthStore();
  const [matches, setMatches] = useState<any[]>([]);
  const [activeMatch, setActiveMatch] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Fetch confirmed Matches
    const fetchMatches = async () => {
      try {
        const res = await api.get('/api/matchmaking/matches/');
        // On ne gade que les matchs acceptés
        const acceptedMatches = res.data.filter((m: any) => m.is_accepted);
        setMatches(acceptedMatches);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [token]);

  // Handle active Match polling
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    const fetchMessages = async () => {
      if (!activeMatch) return;
      try {
        const res = await api.get(`/api/matchmaking/messages/?match_id=${activeMatch.id}`);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    if (activeMatch) {
      fetchMessages();
      interval = setInterval(fetchMessages, 3000); // Polling every 3s
    }

    return () => { if (interval) clearInterval(interval); };
  }, [activeMatch, token]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeMatch) return;
    
    // Optimistic UI Update
    const tempMsg = {
       id: Date.now(),
       content: newMessage,
       sender: user?.id,
       timestamp: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMsg]);
    setNewMessage('');

    try {
      await api.post('/api/matchmaking/messages/', {
        match: activeMatch.id,
        content: tempMsg.content
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getPartnerLabel = (match: any) => {
    const partner = match.user1 === user?.id ? match.user2_details : match.user1_details;
    if (partner) return `${partner.first_name} ${partner.last_name}`;
    return `Partenaire Divin #${match.user1 === user?.id ? match.user2 : match.user1}`;
  };

  if (loading) return <div className="flex h-full items-center justify-center text-[#dca54a]"><Loader className="animate-spin" size={32} /></div>;

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar des Conversations */}
      <div className={`${activeMatch ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col border-r border-gray-100 bg-[#f8f9fa]`}>
         <div className="p-6 border-b border-gray-100 bg-white shadow-sm z-10">
            <h2 className="text-xl font-serif font-bold text-[#082a5e]">Vos Connexions</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest">Échanges sécurisés</p>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {matches.length === 0 ? (
               <div className="text-center p-6 text-gray-400 mt-10">
                  <Heart className="mx-auto mb-3 opacity-30" size={32} />
                  <p className="text-sm">Aucun match validé pour le moment.</p>
               </div>
            ) : (
               matches.map((match) => {
                  const partner = match.user1 === user?.id ? match.user2_details : match.user1_details;
                  const partnerName = partner ? `${partner.first_name} ${partner.last_name}` : `Partenaire Divin #${match.user1 === user?.id ? match.user2 : match.user1}`;
                  const initials = partner ? `${partner.first_name.charAt(0)}${partner.last_name.charAt(0)}` : "P";
                  const isSelected = activeMatch?.id === match.id;
                  
                  return (
                     <button 
                       key={match.id} 
                       onClick={() => setActiveMatch(match)}
                       className={`w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all ${isSelected ? 'bg-[#082a5e] text-white shadow-lg' : 'bg-white border border-gray-100 text-gray-800 hover:border-[#dca54a]'}`}
                     >
                        {partner?.avatar ? (
                           <img src={partner.avatar} alt={partnerName} className="w-12 h-12 rounded-full object-cover shadow-sm" />
                        ) : (
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-inner uppercase ${isSelected ? 'bg-white/20 text-[#ebd18b]' : 'bg-gray-100 text-[#082a5e]'}`}>
                              {initials}
                           </div>
                         )}
                        <div className="flex-1 overflow-hidden">
                           <h4 className="font-bold text-sm truncate">{partnerName}</h4>
                           <p className={`text-xs truncate ${isSelected ? 'text-[#ebd18b]' : 'text-gray-400'}`}>Béni soit votre échange...</p>
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
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
               <Logo theme="light" className="scale-125 mb-6 opacity-30 grayscale" />
               <h3 className="text-2xl font-serif text-[#082a5e] mb-2">Le Salon Divin</h3>
               <p className="text-gray-500 max-w-sm">Sélectionnez une connexion dans la liste de gauche pour démarrer la conversation.</p>
            </div>
         ) : (
            <>
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-4 bg-white/80 backdrop-blur z-20">
                   <button onClick={() => setActiveMatch(null)} className="md:hidden text-gray-500">← Retour</button>
                   {(() => {
                      const partner = activeMatch.user1 === user?.id ? activeMatch.user2_details : activeMatch.user1_details;
                      const partnerName = partner ? `${partner.first_name} ${partner.last_name}` : `Partenaire Divin`;
                      const initials = partner ? `${partner.first_name.charAt(0)}${partner.last_name.charAt(0)}` : "P";
                      
                      return (
                         <>
                            {partner?.avatar ? (
                               <img src={partner.avatar} alt={partnerName} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                            ) : (
                               <div className="w-10 h-10 bg-gradient-to-tr from-[#dca54a] to-[#ebd18b] rounded-full shadow-md flex items-center justify-center text-white font-bold uppercase">{initials}</div>
                            )}
                            <div>
                               <h3 className="font-bold text-[#082a5e] leading-none mb-1">{partnerName}</h3>
                               <span className="text-[10px] text-[#ebd18b] uppercase tracking-widest font-bold font-mono">En Ligne</span>
                            </div>
                         </>
                      );
                   })()}
                </div>

               <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
                  <div className="flex justify-center mb-8">
                     <span className="bg-white border border-gray-200 text-gray-400 text-[10px] uppercase tracking-widest px-4 py-1.5 rounded-full font-bold shadow-sm">
                        Début de la conversation protégée
                     </span>
                  </div>

                  {messages.map((msg) => {
                     const isMine = msg.sender === user?.id;
                     return (
                        <div key={msg.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                           <div className={`max-w-[75%] p-4 rounded-[1.5rem] shadow-sm ${isMine ? 'bg-[#082a5e] text-white rounded-br-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-bl-sm'}`}>
                              <p className="text-sm leading-relaxed">{msg.content}</p>
                              <div className={`text-[9px] mt-2 flex items-center gap-1 opacity-70 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                 {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 {isMine && <CheckCheck size={12} />}
                              </div>
                           </div>
                        </div>
                     );
                  })}
                  <div ref={messagesEndRef} />
               </div>

               <div className="p-4 bg-white border-t border-gray-100">
                  <form onSubmit={handleSend} className="flex items-center gap-3 bg-[#f8f9fa] border border-gray-200 rounded-full p-2 pl-6 focus-within:bg-white focus-within:border-[#dca54a] focus-within:ring-2 focus-within:ring-[#dca54a]/20 transition-all">
                     <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Écrivez un message gracieux..." 
                        className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-gray-400 text-gray-800"
                     />
                     <button 
                        type="submit" 
                        disabled={!newMessage.trim()}
                        className="w-10 h-10 bg-[#082a5e] rounded-full flex items-center justify-center text-[#ebd18b] disabled:opacity-50 hover:bg-[#051833] transition-colors"
                     >
                        <Send size={18} />
                     </button>
                  </form>
               </div>
            </>
         )}
      </div>
    </div>
  );
}
