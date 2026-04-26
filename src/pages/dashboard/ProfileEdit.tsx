import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { User, Save, Heart, Shield, Loader } from 'lucide-react';

export default function ProfileEdit() {
  const { token, user: authUser, login } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    profile: {
      denomination: '',
      marital_status: '',
      bio: '',
      objectives: ''
    }
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/users/me/', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = res.data;
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          profile: {
            denomination: data.profile?.denomination || '',
            marital_status: data.profile?.marital_status || '',
            bio: data.profile?.bio || '',
            objectives: data.profile?.objectives || ''
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('profile.')) {
      const field = name.split('.')[1];
      setFormData({ ...formData, profile: { ...formData.profile, [field]: value } });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    try {
      const res = await axios.put('http://localhost:8000/api/users/me/', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Optionally update user context
      login(token as string, localStorage.getItem('refresh') || '', res.data);
      setSuccessMsg('Profil mis à jour avec succès !');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-10 flex justify-center text-[#dca54a]"><Loader className="animate-spin" size={32} /></div>;

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-[#082a5e] flex items-center gap-3">
           <User className="text-[#dca54a]" size={36} /> Mon Profil Spirituel
        </h1>
        <p className="text-gray-500 mt-2">Dites-nous en plus sur vous pour trouver la connexion divine.</p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-[0_10px_40px_rgba(8,42,94,0.05)] border border-gray-100 p-8 md:p-12 relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#ebd18b]/20 to-transparent rounded-bl-full pointer-events-none"></div>

        {successMsg && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-xl border border-green-200 font-bold text-sm flex items-center gap-3">
             <Shield size={18} /> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          
          <div className="grid md:grid-cols-2 gap-8">
             <div className="space-y-5">
                <h3 className="text-[#082a5e] font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                   <User size={14} className="text-[#dca54a]" /> Identité Civile
                </h3>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-widest">Prénom</label>
                  <input required name="first_name" value={formData.first_name} onChange={handleChange} type="text" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all" />
                </div>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-widest">Nom de famille</label>
                  <input required name="last_name" value={formData.last_name} onChange={handleChange} type="text" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all" />
                </div>
             </div>

             <div className="space-y-5">
                <h3 className="text-[#082a5e] font-bold border-b border-gray-100 pb-2 mb-4 flex items-center gap-2 uppercase tracking-widest text-xs">
                   <Heart size={14} className="text-[#dca54a]" /> Parcours Chrétien
                </h3>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-widest">Dénomination</label>
                  <select name="profile.denomination" value={formData.profile.denomination} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all bg-white">
                     <option value="">Sélectionner...</option>
                     <option value="Protestant">Protestant</option>
                     <option value="Évangélique">Évangélique</option>
                     <option value="Catholique">Catholique</option>
                     <option value="Autre">Autre</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-widest">Statut Marital</label>
                  <select name="profile.marital_status" value={formData.profile.marital_status} onChange={handleChange} className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all bg-white">
                     <option value="Célibataire">Célibataire</option>
                     <option value="Veuf/Veuve">Veuf / Veuve</option>
                  </select>
                </div>
             </div>
          </div>

          <div className="space-y-5 pt-4">
             <div>
               <label className="block text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-widest">Bio / Présentation</label>
               <textarea name="profile.bio" value={formData.profile.bio} onChange={handleChange} rows={4} placeholder="Parlez-nous de vous, de votre foi, de ce qui vous anime..." className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all resize-none"></textarea>
             </div>
             
             <div>
               <label className="block text-[10px] font-extrabold text-gray-500 mb-1.5 uppercase tracking-widest">Objectifs de Couple</label>
               <textarea name="profile.objectives" value={formData.profile.objectives} onChange={handleChange} rows={3} placeholder="Quelle est votre vision du mariage ?" className="w-full p-3.5 rounded-xl border border-gray-200 focus:border-[#dca54a] focus:ring-1 focus:ring-[#dca54a] outline-none transition-all resize-none"></textarea>
             </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end">
             <button disabled={saving} type="submit" className="bg-[#082a5e] hover:bg-[#051833] text-white px-8 py-3.5 rounded-xl font-bold tracking-widest text-[11px] uppercase shadow-[0_10px_20px_rgba(8,42,94,0.2)] hover:shadow-[0_15px_30px_rgba(8,42,94,0.3)] transition-all flex items-center gap-2">
                {saving ? <Loader className="animate-spin" size={16} /> : <Save size={16} />}
                {saving ? 'Enregistrement...' : 'Enregistrer mon profil'}
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}
