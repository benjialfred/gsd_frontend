import React, { useState } from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useUploadMediaMutation } from '../../../../hooks/useProfile';
import { Upload, X, Loader } from 'lucide-react';

interface PreviewFile {
  file: File;
  previewUrl: string;
  isUploading: boolean;
}

export const MediaUploadStep: React.FC = () => {
  const uploadMutation = useUploadMediaMutation();
  const [previews, setPreviews] = useState<PreviewFile[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      
      const newPreview = { file, previewUrl, isUploading: true };
      setPreviews(prev => [...prev, newPreview]);
      
      try {
        await uploadMutation.mutateAsync({ file, isPrimary: previews.length === 0 });
        setPreviews(prev => prev.map(p => p.previewUrl === previewUrl ? { ...p, isUploading: false } : p));
      } catch (err) {
        console.error("Upload failed", err);
        setPreviews(prev => prev.filter(p => p.previewUrl !== previewUrl));
      }
    }
  };

  const removePhoto = (index: number) => {
    setPreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].previewUrl);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
    // Need API call to delete media ideally
  };

  return (
    <StepContainer 
      stepKey="media"
      title="Vos Photos"
      subtitle="Ajoutez des photos qui reflètent votre personnalité."
      benefit="Les profils avec au moins 3 photos claires obtiennent 5x plus de matchs."
    >
      <div className="space-y-10 max-w-2xl mx-auto w-full mt-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          
          {/* Photos existantes / En cours */}
          {previews.map((preview, idx) => (
            <div key={preview.previewUrl} className={`relative bg-gray-50 aspect-[3/4] flex flex-col items-center justify-center overflow-hidden ${idx === 0 ? 'col-span-2 md:col-span-1 row-span-2' : ''}`}>
              <img src={preview.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              
              <button 
                onClick={() => removePhoto(idx)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1.5 hover:bg-black/70 transition-colors"
              >
                <X size={14} />
              </button>

              {preview.isUploading && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <Loader className="animate-spin text-[#1A3A5C]" size={24} />
                </div>
              )}
            </div>
          ))}

          {/* Slots de téléversement */}
          {previews.length < 3 && (
            <div className={`relative aspect-[3/4] border border-dashed border-[#C9A84C]/50 flex flex-col items-center justify-center hover:bg-[#fcf9f2] transition-colors cursor-pointer group ${previews.length === 0 ? 'col-span-2 md:col-span-1 row-span-2' : ''}`}>
              <Upload className="w-6 h-6 text-[#C9A84C] mb-3 group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
              <span className="text-xs font-medium text-[#1A3A5C]/70 uppercase tracking-widest text-center px-4">Ajouter une photo</span>
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          )}
        </div>
        <p className="text-xs text-center text-gray-400 font-light mt-4">Formats acceptés : JPG, PNG. Taille max : 5 Mo.</p>
      </div>
    </StepContainer>
  );
};
