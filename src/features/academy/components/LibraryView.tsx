import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Radio, FileText, Download, Play, Pause, Clock, Sparkles, BookOpen, ExternalLink, Loader } from 'lucide-react';
import { LibrarySkeleton } from '../../../components/common/Skeletons';

export default function LibraryView() {
  const [resources, setResources] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'podcast' | 'ebook' | 'guide'>('all');
  const [loading, setLoading] = useState(true);
  const [activeAudio, setActiveAudio] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchResources = async () => {
    try {
      const res = await api.get('/api/academy/resources/');
      setResources(res.data);
    } catch (err) {
      console.error("Erreur chargement bibliothèque:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDownload = async (resource: any) => {
    try {
      await api.post(`/api/academy/resources/${resource.id}/download/`);
      // Ouvrir le lien
      const url = resource.document_url || resource.external_url;
      if (url) {
        window.open(url, '_blank');
      }
      fetchResources();
    } catch (err) {
      console.error("Erreur téléchargement:", err);
    }
  };

  const filteredResources = resources.filter(r => {
    if (activeTab === 'all') return true;
    return r.resource_type === activeTab;
  });

  if (loading) {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFECE6]">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[#1A3A5C]">
              Bibliothèque Spirituelle & Podcasts
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Guides de prière, dévotions d'alliance et enseignements audio pour nourrir votre foi.
            </p>
          </div>
        </div>
        <LibrarySkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* En-tête de la Bibliothèque */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EFECE6]">
        <div>
          <h2 className="text-2xl font-serif font-bold text-[#1A3A5C]">
            Bibliothèque Spirituelle & Podcasts
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Guides de prière, dévotions d'alliance et enseignements audio pour nourrir votre foi.
          </p>
        </div>

        {/* Filtres par type */}
        <div className="flex items-center gap-1.5 bg-[#FAF9F6] p-1.5 rounded-full border border-[#EFECE6] overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              activeTab === 'all'
                ? 'bg-[#1A3A5C] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Tous ({resources.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('podcast')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'podcast'
                ? 'bg-[#1A3A5C] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Radio size={13} /> Podcasts
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('guide')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'guide'
                ? 'bg-[#1A3A5C] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <BookOpen size={13} /> Guides de Prière
          </button>
        </div>
      </div>

      {/* Grille des Ressources */}
      {filteredResources.length === 0 ? (
        <div className="p-12 text-center text-gray-400 bg-white rounded-3xl border border-[#EFECE6]">
          <FileText size={40} className="mx-auto text-[#C9A84C]/50 mb-3" />
          <h4 className="font-serif font-bold text-base text-[#1A3A5C]">Aucune ressource dans cette catégorie</h4>
          <p className="text-xs text-gray-500 mt-1">Consultez les autres sections ou revenez bientôt.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredResources.map((item) => {
            const isPodcast = item.resource_type === 'podcast';

            return (
              <div 
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#EFECE6] shadow-xs hover:shadow-xl hover:border-[#C9A84C]/50 transition-all duration-300 flex flex-col group"
              >
                {/* Miniature / Image */}
                <div className="relative h-44 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge Type */}
                  <span className="absolute top-3.5 left-3.5 bg-white/95 backdrop-blur-md text-[#1A3A5C] text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                    {isPodcast ? <Radio size={12} className="text-[#C9A84C]" /> : <FileText size={12} className="text-[#C9A84C]" />}
                    <span>{isPodcast ? 'Podcast Audio' : 'Guide / E-book'}</span>
                  </span>

                  {isPodcast && item.duration_minutes > 0 && (
                    <span className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-0.5 rounded-lg flex items-center gap-1">
                      <Clock size={11} /> {item.duration_minutes} min
                    </span>
                  )}
                </div>

                {/* Corps */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-wider block mb-1">
                      {item.category}
                    </span>
                    <h3 className="font-serif font-bold text-base text-[#1A3A5C] group-hover:text-[#C9A84C] transition-colors line-clamp-2 leading-snug mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#EFECE6] flex items-center justify-between">
                    <span className="text-[11px] text-gray-400">
                      Par {item.author_name}
                    </span>

                    {/* Action */}
                    {isPodcast ? (
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        className="px-4 py-2 rounded-full bg-[#1A3A5C] text-white text-xs font-bold hover:bg-[#132c45] transition-all flex items-center gap-1.5 shadow-sm"
                      >
                        <Play size={13} className="fill-current text-[#ebd18b]" /> Écouter
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        className="px-4 py-2 rounded-full bg-[#FAF9F6] border border-[#EFECE6] text-[#1A3A5C] text-xs font-bold hover:border-[#C9A84C] hover:bg-white transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        <Download size={13} className="text-[#C9A84C]" /> Télécharger
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
