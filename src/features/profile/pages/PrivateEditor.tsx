import React, { useState, useEffect } from 'react';
import { Camera, ChevronLeft, ChevronDown, X, Info, Check, Loader2, Trash2 } from 'lucide-react';
import api from '../../../services/api';
import { uploadMedia, updateProfile, getMediaUrl } from '../../../services/profile';
import { toast } from '../../../stores/useToastStore';
import { PinSecurityCard } from '../components/PinSecurityCard';

export const PrivateEditor = ({ user, referenceData, onProfileUpdate }: any) => {
  const profile = user?.profile || {};
  const [mediaList, setMediaList] = useState<any[]>([]);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const fetchMedia = async () => {
    try {
      const res = await api.get('/api/profiles/me/media/');
      const items = Array.isArray(res.data) ? res.data : (res.data?.results || []);
      setMediaList(items);
    } catch (err) {
      console.error("Failed to load profile media", err);
    }
  };

  useEffect(() => {
    fetchMedia();
    
    // Init form data with current user & profile state
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      city: profile.city || '',
      country_code: profile.country_code || 'FR',
      profession: profile.profession || '',
      education_level: profile.education_level || '',
      denomination: profile.denomination || '',
      church_attendance: profile.church_attendance || '',
      spiritual_commitment: profile.spiritual_commitment || '',
      bio: profile.bio || '',
      marital_status: profile.marital_status || '',
      marriage_vision: profile.marriage_vision || '',
      marriage_values: profile.marriage_values || '',
      marriage_objectives: profile.marriage_objectives || '',
    });
  }, [user, profile]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Basic validation
      if (file.size > 10 * 1024 * 1024) {
        toast.error("La photo dépasse la taille maximale autorisée (10 Mo).");
        return;
      }

      setUploading(true);
      try {
        const isPrimary = mediaList.length === 0;
        await uploadMedia(file, isPrimary);
        await fetchMedia();
        if (onProfileUpdate) await onProfileUpdate();
        toast.success("Photo ajoutée avec succès !");
      } catch (err: any) {
        console.error("Upload failed", err);
        const message = err?.response?.data?.file?.[0] || err?.response?.data?.detail || "Échec de l'envoi de la photo. Veuillez réessayer.";
        toast.error(message);
      } finally {
        setUploading(false);
        // Reset file input
        e.target.value = '';
      }
    }
  };
  
  const handleDeleteMedia = async (id: number) => {
    try {
      await api.delete(`/api/profiles/me/media/${id}/`);
      setMediaList((prev) => prev.filter((m) => m.id !== id));
      if (onProfileUpdate) await onProfileUpdate();
      toast.success("Photo supprimée.");
    } catch (err: any) {
      console.error("Delete failed", err);
      toast.error("Impossible de supprimer la photo.");
    }
  };

  const handleSave = async (section: string) => {
    setSavingSection(section);
    try {
      await updateProfile(formData);
      toast.success("Modifications enregistrées avec succès !");
      if (onProfileUpdate) await onProfileUpdate();
      setExpandedSection(null);
    } catch (err: any) {
      console.error("Save error", err);
      const errData = err?.response?.data;
      let errMsg = "Erreur lors de l'enregistrement.";
      if (typeof errData === 'string') {
        errMsg = errData;
      } else if (errData?.detail) {
        errMsg = errData.detail;
      } else if (errData && typeof errData === 'object') {
        const firstKey = Object.keys(errData)[0];
        const val = errData[firstKey];
        errMsg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${val}`;
      }
      toast.error(errMsg);
    } finally {
      setSavingSection(null);
    }
  };

  const handleChange = (e: any) => {
    setFormData((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const renderSaveButton = (sectionId: string) => (
    <button
      type="button"
      disabled={savingSection === sectionId}
      onClick={() => handleSave(sectionId)}
      className="w-full bg-[#1A3A5C] hover:bg-[#152e4a] text-white py-3.5 px-6 rounded-2xl font-bold mt-6 transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50 active:scale-[0.99] cursor-pointer"
    >
      {savingSection === sectionId ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          <span>Enregistrement en cours...</span>
        </>
      ) : (
        <>
          <Check size={18} />
          <span>Enregistrer les modifications</span>
        </>
      )}
    </button>
  );

  const sections = [
    {
      id: 'identity',
      title: 'Identité & Localisation',
      content: (
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Prénom</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name || ''}
                onChange={handleChange}
                placeholder="Votre prénom"
                className="w-full mt-1 border-b border-[#E8ECE9] bg-transparent py-2.5 outline-none text-[#1A3A5C] font-medium focus:border-[#C9A84C] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Nom</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name || ''}
                onChange={handleChange}
                placeholder="Votre nom"
                className="w-full mt-1 border-b border-[#E8ECE9] bg-transparent py-2.5 outline-none text-[#1A3A5C] font-medium focus:border-[#C9A84C] transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="Ex: Paris, Lyon, Yaoundé..."
                className="w-full mt-1 border-b border-[#E8ECE9] bg-transparent py-2.5 outline-none text-[#1A3A5C] font-medium focus:border-[#C9A84C] transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Code Pays</label>
              <input
                type="text"
                name="country_code"
                value={formData.country_code || ''}
                onChange={handleChange}
                placeholder="Ex: FR, CM, CA, BE..."
                maxLength={2}
                className="w-full mt-1 border-b border-[#E8ECE9] bg-transparent py-2.5 outline-none text-[#1A3A5C] font-medium focus:border-[#C9A84C] transition-colors uppercase"
              />
            </div>
          </div>

          {renderSaveButton('identity')}
        </div>
      )
    },
    {
      id: 'career',
      title: 'Profession & Formation',
      content: (
        <div className="space-y-4 p-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Profession actuelle</label>
            <input
              type="text"
              name="profession"
              value={formData.profession || ''}
              onChange={handleChange}
              placeholder="Ex: Ingénieur, Enseignant, Designer..."
              className="w-full mt-1 border-b border-[#E8ECE9] bg-transparent py-2.5 outline-none text-[#1A3A5C] font-medium focus:border-[#C9A84C] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Niveau d'études</label>
            <select
              name="education_level"
              value={formData.education_level || ''}
              onChange={handleChange}
              className="w-full mt-1 border-b border-[#E8ECE9] py-2.5 outline-none text-[#1A3A5C] font-medium bg-transparent focus:border-[#C9A84C] transition-colors"
            >
              <option value="">Sélectionner</option>
              <option value="BAC">Baccalauréat</option>
              <option value="BAC_PLUS_2">Bac +2 / BTS / DUT</option>
              <option value="LICENCE">Licence / Bachelor (Bac +3)</option>
              <option value="MASTER">Master / École d'ingénieur / Commerce (Bac +5)</option>
              <option value="DOCTORAT">Doctorat / Ph.D</option>
              <option value="AUTRE">Autre</option>
            </select>
          </div>

          {renderSaveButton('career')}
        </div>
      )
    },
    {
      id: 'spiritual',
      title: 'Parcours Spirituel & Foi',
      content: (
        <div className="space-y-4 p-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Dénomination</label>
            <select
              name="denomination"
              value={formData.denomination || ''}
              onChange={handleChange}
              className="w-full mt-1 border-b border-[#E8ECE9] py-2.5 outline-none text-[#1A3A5C] font-medium bg-transparent focus:border-[#C9A84C] transition-colors"
            >
              <option value="">Sélectionner</option>
              <option value="CATHOLIC">Catholique</option>
              <option value="PROTESTANT">Protestant</option>
              <option value="EVANGELICAL">Évangélique</option>
              <option value="PENTECOSTAL">Pentecôtiste</option>
              <option value="BAPTIST">Baptiste</option>
              <option value="ADVENTIST">Adventiste</option>
              <option value="OTHER">Autre</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Fréquence de culte / Assemblée</label>
            <input
              type="text"
              name="church_attendance"
              value={formData.church_attendance || ''}
              onChange={handleChange}
              placeholder="Ex: Tous les dimanches, Hebdomadaire, Régulièrement..."
              className="w-full mt-1 border-b border-[#E8ECE9] bg-transparent py-2.5 outline-none text-[#1A3A5C] font-medium focus:border-[#C9A84C] transition-colors"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">À propos de moi & ma foi (Bio)</label>
            <textarea
              name="bio"
              value={formData.bio || ''}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 border border-[#E8ECE9] rounded-xl p-3 outline-none text-[#1A3A5C] font-medium placeholder-gray-400 focus:border-[#C9A84C] transition-colors resize-none"
              placeholder="Décrivez votre parcours personnel et ce qui vous anime..."
            />
          </div>

          {renderSaveButton('spiritual')}
        </div>
      )
    },
    {
      id: 'vision',
      title: 'Vision du Mariage',
      content: (
        <div className="space-y-4 p-5">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Statut Marital</label>
            <select
              name="marital_status"
              value={formData.marital_status || ''}
              onChange={handleChange}
              className="w-full mt-1 border-b border-[#E8ECE9] py-2.5 outline-none text-[#1A3A5C] font-medium bg-transparent focus:border-[#C9A84C] transition-colors"
            >
              <option value="">Sélectionner</option>
              <option value="SINGLE">Célibataire (jamais marié)</option>
              <option value="WIDOWED">Veuf(ve)</option>
              <option value="DIVORCED">Divorcé(e)</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Ma vision du foyer chrétien</label>
            <textarea
              name="marriage_vision"
              value={formData.marriage_vision || ''}
              onChange={handleChange}
              rows={4}
              className="w-full mt-1 border border-[#E8ECE9] rounded-xl p-3 outline-none text-[#1A3A5C] font-medium placeholder-gray-400 focus:border-[#C9A84C] transition-colors resize-none"
              placeholder="Ce que le mariage et la vie à deux représentent pour vous..."
            />
          </div>

          {renderSaveButton('vision')}
        </div>
      )
    },
    {
      id: 'interests',
      title: 'Centres d\'intérêt & Langues',
      content: (
        <div className="space-y-4 p-5">
          <p className="text-sm text-gray-600 leading-relaxed">
            Vos langues et passions enrichissent notre algorithme d'affinité mutuelle. Vous pouvez les consulter sur votre vue publique ou les réajuster lors des mises à jour recommandées.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {profile.interests && profile.interests.length > 0 ? (
              profile.interests.map((it: any, i: number) => (
                <span key={i} className="px-3 py-1.5 rounded-full bg-[#fcf9f2] border border-[#C9A84C]/30 text-xs font-semibold text-[#1A3A5C]">
                  {typeof it === 'string' ? it : it?.name || `Intérêt #${i + 1}`}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-400 italic">Aucun centre d'intérêt renseigné.</span>
            )}
          </div>
        </div>
      )
    }
  ];

  const isMissingInfo = !profile.bio || !profile.city || !profile.denomination || !profile.marriage_vision;

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6 pb-32">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A3A5C]">Éditer mon profil</h2>
          <p className="text-xs text-gray-500 mt-1">Mettez à jour vos photos et vos informations pour des suggestions précises.</p>
        </div>
      </div>

      {isMissingInfo && (
        <div className="bg-[#fcf9f2] border-l-4 border-[#C9A84C] p-4 rounded-r-2xl shadow-sm mb-6 flex items-start gap-3">
          <div className="mt-0.5 text-[#C9A84C] shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-bold text-[#1A3A5C] text-sm">Complétez votre profil</h4>
            <p className="text-xs text-[#1A3A5C]/75 mt-1 leading-relaxed">
              Certaines informations essentielles ne sont pas encore renseignées. Un profil soigné a 80% plus d'affinités ! Dépliez les sections ci-dessous pour les renseigner.
            </p>
          </div>
        </div>
      )}

      {/* Photo Manager */}
      <div className="bg-white rounded-3xl p-6 border border-[#E8ECE9] shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="font-bold text-[#1A3A5C]">Photos de profil</h3>
            <p className="text-xs text-gray-400 mt-0.5">La première photo sera votre portrait principal.</p>
          </div>
          <span className="text-xs text-[#C9A84C] font-extrabold tracking-wider bg-[#FCFBF9] px-3 py-1.5 rounded-full border border-[#E8ECE9]">
            {mediaList.length} / 3
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-3.5">
          {/* Main Photo Slot */}
          {mediaList.length > 0 ? (
            <div className="col-span-2 row-span-2 relative rounded-2xl overflow-hidden aspect-square border-2 border-[#C9A84C]/30 shadow-sm group bg-gray-50">
              <img
                src={getMediaUrl(mediaList[0].file || mediaList[0].url)}
                alt="Photo principale"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e: any) => {
                  e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400';
                }}
              />
              <div className="absolute top-2.5 left-2.5 bg-[#C9A84C] text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md">
                Principale
              </div>
              <button
                type="button"
                onClick={() => handleDeleteMedia(mediaList[0].id)}
                className="absolute top-2.5 right-2.5 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg cursor-pointer"
                title="Supprimer la photo"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <label className="col-span-2 row-span-2 relative rounded-2xl border-2 border-dashed border-[#C9A84C]/40 bg-[#fcf9f2] aspect-square flex flex-col items-center justify-center text-[#C9A84C] hover:bg-white hover:border-[#C9A84C] transition-all cursor-pointer shadow-inner">
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={32} className="animate-spin text-[#C9A84C]" />
                  <span className="text-xs font-bold uppercase tracking-wider">Téléversement...</span>
                </div>
              ) : (
                <>
                  <Camera size={36} className="mb-2" />
                  <span className="text-xs font-bold uppercase tracking-wider">Ajouter Photo Principale</span>
                  <span className="text-[10px] text-gray-400 mt-1">JPG, PNG (max 10 Mo)</span>
                </>
              )}
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          )}
          
          {/* Secondary Slots (indices 1 and 2) */}
          {[1, 2].map((idx) => {
            const media = mediaList[idx];
            return media ? (
              <div key={idx} className="relative rounded-2xl overflow-hidden border border-[#E8ECE9] aspect-square group shadow-sm bg-gray-50">
                <img
                  src={getMediaUrl(media.file || media.url)}
                  alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e: any) => {
                    e.target.src = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=400';
                  }}
                />
                <button
                  type="button"
                  onClick={() => handleDeleteMedia(media.id)}
                  className="absolute top-2 right-2 bg-rose-600/90 hover:bg-rose-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md cursor-pointer"
                  title="Supprimer la photo"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ) : (
              <label
                key={idx}
                className={`relative rounded-2xl border-2 border-dashed border-[#E8ECE9] bg-[#fcf9f2] aspect-square flex flex-col items-center justify-center text-[#C9A84C] hover:bg-white hover:border-[#C9A84C] transition-all cursor-pointer ${
                  uploading || mediaList.length >= 3 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {uploading ? (
                  <Loader2 size={20} className="animate-spin text-[#C9A84C]" />
                ) : (
                  <>
                    <Camera size={22} className="mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ajouter</span>
                  </>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUpload}
                  disabled={uploading || mediaList.length >= 3}
                />
              </label>
            );
          })}
        </div>

        {mediaList.length === 0 && (
          <p className="text-xs text-rose-500 mt-4 font-semibold flex items-center gap-1.5">
            <X size={15} /> Aucune photo de profil n'a encore été ajoutée.
          </p>
        )}
      </div>

      {/* Accordion List */}
      <div className="bg-white rounded-3xl border border-[#E8ECE9] overflow-hidden shadow-sm divide-y divide-[#E8ECE9]">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id}>
              <button
                type="button"
                onClick={() => setExpandedSection(isExpanded ? null : section.id)}
                className="w-full px-6 py-5 flex justify-between items-center bg-white hover:bg-[#FDFBF7] transition-colors text-left cursor-pointer"
              >
                <span className="font-bold text-[#1A3A5C] text-sm">{section.title}</span>
                {isExpanded ? (
                  <ChevronDown className="text-[#C9A84C]" size={20} />
                ) : (
                  <ChevronLeft className="text-gray-400 transform rotate-180" size={18} />
                )}
              </button>
              {isExpanded && (
                <div className="bg-[#fcf9f2]/40 border-t border-[#E8ECE9]">
                  {section.content}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Paramètres de Sécurité & Code PIN */}
      <div className="mt-8">
        <PinSecurityCard />
      </div>
    </div>
  );
};
