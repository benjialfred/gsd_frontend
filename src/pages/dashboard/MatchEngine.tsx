import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Heart, X, Search, Loader, Info } from 'lucide-react';

export default function MatchEngine() {
  const { token, user: currentUser } = useAuth();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchPopup, setMatchPopup] = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/users/discover/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfiles(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, [token]);

  const handleLike = async (targetId: number) => {
    try {
      const res = await axios.post('http://localhost:8000/api/matchmaking/matches/like/', 
        { target_user_id: targetId },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // Retirer le profil swipé de la liste
      setProfiles(prev => prev.filter(p => p.id !== targetId));

      if (res.data.status === 'matched') {
         setMatchPopup(true);
         setTimeout(() => setMatchPopup(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePass = (targetId: number) => {
    // Simple frontend hide for now
    setProfiles(prev => prev.filter(p => p.id !== targetId));
  };

  if (loading) return <div className="flex h-full items-center justify-center text-[#dca54a]"><Loader className="animate-spin" size={40} /></div>;

  return (
    <div className="h-full w-full bg-[#f8f9fa] flex flex-col items-center justify-center p-4">
       
       {matchPopup && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex items-center justify-center animate-in fade-in duration-300">
             <div className="bg-white p-10 rounded-[2rem] flex flex-col items-center text-center max-w-sm mx-4 transform scale-100 animate-in zoom-in-90">
                <div className="w-24 h-24 bg-gradient-to-tr from-[#dca54a] to-[#ebd18b] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#dca54a]/30">
                   <Heart size={40} className="text-white fill-current" />
                </div>
                <h2 className="text-3xl font-serif text-[#082a5e] mb-2">C'est un Match Divin !</h2>
                <p className="text-gray-500 text-sm">Vous pouvez maintenant échanger dans le Chat.</p>
             </div>
          </div>
       )}

       <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold text-[#082a5e]">Trouvez votre Partenaire</h1>
          <p className="text-gray-500 text-sm mt-1">Laissez Dieu écrire votre histoire.</p>
       </div>

       {profiles.length > 0 ? (
          <div className="relative w-full max-w-sm h-[500px]">
             {/* Render from bottom to top so the first is on top (index 0) */}
             {profiles.slice().reverse().map((profile, idx, arr) => {
                const isTop = idx === arr.length - 1;
                return (
                   <div 
                     key={profile.id} 
                     className={`absolute inset-0 bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 ${isTop ? 'scale-100 z-10' : 'scale-95 translate-y-4 z-0 opacity-50'}`}
                   >
                      <div className="h-2/3 bg-gray-100 relative">
                         {/* Placeholder for real picture */}
                         <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 z-10"></div>
                         <img src={`https://ui-avatars.com/api/?name=${profile.first_name}+${profile.last_name}&background=ebd18b&color=082a5e&size=512`} alt={profile.first_name} className="w-full h-full object-cover" />
                         
                         <div className="absolute bottom-4 left-6 z-20 text-white">
                            <h2 className="text-2xl font-bold">{profile.first_name} {profile.last_name}</h2>
                            <p className="text-xs font-semibold opacity-90">{profile.profile?.denomination || 'Chrétien'} • {profile.profile?.marital_status || 'Célibataire'}</p>
                         </div>
                      </div>
                      <div className="p-6 h-1/3 flex flex-col justify-between">
                         <div>
                            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Bio</h4>
                            <p className="text-sm text-gray-700 line-clamp-2">{profile.profile?.bio || "J'aimerais rencontrer une personne partageant ma foi."}</p>
                         </div>
                         <div className="flex justify-center gap-6 mt-4">
                            <button onClick={() => handlePass(profile.id)} className="w-14 h-14 bg-white border border-gray-100 shadow-md rounded-full flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                               <X size={24} />
                            </button>
                            <button onClick={() => handleLike(profile.id)} className="w-14 h-14 bg-gradient-to-tr from-[#dca54a] to-[#ebd18b] shadow-lg shadow-[#dca54a]/30 rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform">
                               <Heart size={24} className="fill-current" />
                            </button>
                         </div>
                      </div>
                   </div>
                );
             })}
          </div>
       ) : (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-[2rem] border border-gray-100 max-w-sm text-center">
             <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4"><Search className="text-gray-400" /></div>
             <h3 className="text-lg font-bold text-[#082a5e]">Plus de profils</h3>
             <p className="text-sm text-gray-500 mt-2">Vous avez vu tous les profils compatibles de notre base de données. Revenez plus tard !</p>
          </div>
       )}
    </div>
  );
}
