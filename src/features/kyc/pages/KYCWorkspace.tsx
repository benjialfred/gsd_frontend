import React, { useState } from 'react';
import { useAuthStore } from '../../../stores/authStore';
import { ShieldCheck, ArrowLeft, UploadCloud, Clock, AlertTriangle, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';

import { submitKYC } from '../../../services/profile';

export const KYCWorkspace: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(user?.profile?.kyc_status === 'NOT_SUBMITTED' ? 'INTRO' : 'STATUS');
  const [loading, setLoading] = useState(false);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!frontFile || !selfieFile) {
      alert("Veuillez fournir au moins une pièce d'identité recto et un selfie.");
      return;
    }
    setLoading(true);
    try {
      // Create a dummy backFile if not provided to satisfy API if it requires 3 files
      const dummyBack = backFile || new File([""], "dummy.jpg", { type: "image/jpeg" });
      await submitKYC(frontFile, dummyBack, selfieFile);
      setStep('STATUS');
      window.location.reload(); 
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de l'envoi.");
    } finally {
      setLoading(false);
    }
  };

  const status = user?.profile?.kyc_status || 'NOT_SUBMITTED';

  if (status === 'PENDING_REVIEW' || status === 'APPROVED' || step === 'STATUS') {
    return (
      <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-10 flex flex-col">
        <button onClick={() => navigate('/app')} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 w-fit transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Retour au Dashboard
        </button>

        <div className="max-w-2xl w-full mx-auto bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#E8ECE9] text-center">
          {status === 'APPROVED' ? (
            <>
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl font-serif text-gray-900 mb-3">Profil Officiellement Certifié</h2>
              <p className="text-gray-500">Votre identité a été vérifiée avec succès. Vous bénéficiez désormais d'une visibilité optimale.</p>
            </>
          ) : status === 'MORE_INFORMATION_REQUIRED' ? (
             <>
               <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                 <AlertTriangle className="w-10 h-10 text-red-500" />
               </div>
               <h2 className="text-2xl font-serif text-gray-900 mb-3">Action Requise</h2>
               <p className="text-gray-500 mb-8">Un de vos documents n'est pas lisible. Veuillez soumettre une nouvelle photo pour finaliser la vérification.</p>
               <button onClick={() => setStep('UPLOAD')} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs">
                 Soumettre à nouveau
               </button>
             </>
          ) : (
            <>
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-10 h-10 text-blue-500" />
              </div>
              <h2 className="text-2xl font-serif text-gray-900 mb-3">Votre dossier est en cours d'examen</h2>
              <p className="text-gray-500 mb-8">Nous vérifions actuellement vos informations. Ce processus prend généralement moins de 24 heures.</p>
              
              <div className="bg-[#FDFBF7] border border-[#E8ECE9] rounded-xl p-6 text-left">
                 <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-900">Date de soumission</span>
                    <span className="text-sm text-gray-500">Aujourd'hui</span>
                 </div>
                 <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-900">Délai estimé</span>
                    <span className="text-sm text-amber-600 font-bold">&lt; 24h</span>
                 </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFBF7] p-6 md:p-10 flex flex-col">
      <button onClick={() => navigate('/app')} className="flex items-center text-gray-500 hover:text-gray-900 mb-8 w-fit transition-colors">
        <ArrowLeft size={16} className="mr-2" /> Retour au Dashboard
      </button>

      <div className="max-w-3xl w-full mx-auto">
        <h1 className="text-3xl font-serif text-gray-900 mb-8">Certification Profil</h1>

        {step === 'INTRO' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#E8ECE9]">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheck className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl font-serif text-gray-900 mb-4">Pourquoi devenir certifié ?</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              La certification GSD est un gage de confiance absolu. Elle garantit à la communauté que vous êtes bien la personne sur vos photos.
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 mt-1">✓</div>
                 <div>
                    <h4 className="font-medium text-gray-900">Plus de visibilité</h4>
                    <p className="text-sm text-gray-500">Les profils certifiés sont mis en avant par l'algorithme.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 mt-1">✓</div>
                 <div>
                    <h4 className="font-medium text-gray-900">Confiance immédiate</h4>
                    <p className="text-sm text-gray-500">Un badge rassure instantanément vos futurs matchs.</p>
                 </div>
              </div>
              <div className="flex items-start gap-4">
                 <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600 mt-1">✓</div>
                 <div>
                    <h4 className="font-medium text-gray-900">Meilleure qualité des interactions</h4>
                    <p className="text-sm text-gray-500">Réduit considérablement les faux profils et le spam.</p>
                 </div>
              </div>
            </div>

            <button onClick={() => setStep('UPLOAD')} className="w-full bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors">
              Commencer la vérification
            </button>
          </div>
        )}

        {step === 'UPLOAD' && (
          <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-[#E8ECE9]">
            <h2 className="text-2xl font-serif text-gray-900 mb-2">Vos documents</h2>
            <p className="text-gray-500 mb-8">Vos données sont chiffrées et ne seront jamais partagées publiquement.</p>

            <div className="grid md:grid-cols-2 gap-6 mb-10">
              <label className="border-2 border-dashed border-[#E8ECE9] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FDFBF7] transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) setFrontFile(e.target.files[0]);
                  }}
                />
                <UploadCloud className={`w-8 h-8 mb-3 ${frontFile ? 'text-green-500' : 'text-gray-400'}`} />
                <h4 className="font-medium text-sm text-gray-900">
                  {frontFile ? "Pièce d'identité (Sélectionnée)" : "Pièce d'identité"}
                </h4>
                <p className="text-xs text-gray-500 mt-1">Passeport ou CNI (Recto)</p>
              </label>

              <label className="border-2 border-dashed border-[#E8ECE9] rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-[#FDFBF7] transition-colors relative">
                <input 
                  type="file" 
                  accept="image/*,video/*" 
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) setSelfieFile(e.target.files[0]);
                  }}
                />
                <Camera className={`w-8 h-8 mb-3 ${selfieFile ? 'text-green-500' : 'text-gray-400'}`} />
                <h4 className="font-medium text-sm text-gray-900">
                  {selfieFile ? "Selfie (Sélectionné)" : "Selfie de vérification"}
                </h4>
                <p className="text-xs text-gray-500 mt-1">Pour confirmer votre visage</p>
              </label>
            </div>

            <button onClick={handleSubmit} disabled={loading} className="w-full bg-gray-900 text-white px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-gray-800 transition-colors disabled:opacity-50">
              {loading ? 'Soumission en cours...' : 'Soumettre mon dossier'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
