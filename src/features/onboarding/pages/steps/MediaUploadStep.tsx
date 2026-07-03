import React, { useState } from 'react';
import { StepContainer } from '../../components/StepContainer';
import { useUploadMediaMutation } from '../../../../hooks/useProfile';
import { Upload } from 'lucide-react';

export const MediaUploadStep: React.FC = () => {
  const uploadMutation = useUploadMediaMutation();
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setUploadedFiles(prev => [...prev, file]);
      
      try {
        await uploadMutation.mutateAsync({ file, isPrimary: uploadedFiles.length === 0 });
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  return (
    <StepContainer 
      stepKey="media"
      title="Vos Photos"
      subtitle="Ajoutez des photos qui reflètent votre personnalité."
      benefit="Les profils avec au moins 3 photos claires obtiennent 5x plus de matchs."
    >
      <div className="space-y-8 max-w-2xl mx-auto w-full">
        <div className="grid grid-cols-3 gap-4">
          {/* Main Photo Upload Slot */}
          <div className="col-span-3 aspect-video bg-[#F5F7F5] rounded-2xl border-2 border-dashed border-[#C2C9C4] flex flex-col items-center justify-center relative hover:bg-[#E8ECE9] transition-colors cursor-pointer">
            <Upload className="w-8 h-8 text-[#8C9B90] mb-2" />
            <span className="text-sm font-medium text-gray-600">Ajouter une photo principale</span>
            <input 
              type="file" 
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={handleFileChange}
            />
          </div>

          {/* Secondary Photo Upload Slots */}
          {[1, 2, 3].map(slot => (
            <div key={slot} className="aspect-square bg-[#F5F7F5] rounded-xl border-2 border-dashed border-[#C2C9C4] flex flex-col items-center justify-center relative hover:bg-[#E8ECE9] transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-[#8C9B90] mb-1" />
              <input 
                type="file" 
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleFileChange}
              />
            </div>
          ))}
        </div>
      </div>
    </StepContainer>
  );
};
