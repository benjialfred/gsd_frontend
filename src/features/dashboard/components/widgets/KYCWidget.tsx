import React from 'react';
import { ShieldAlert, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../../stores/authStore';

export const KYCWidget: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const kycStatus = user?.profile?.kyc_status || 'NOT_SUBMITTED';

  if (kycStatus === 'APPROVED') {
    return (
      <div className="bg-gradient-to-br from-amber-50 to-white rounded-3xl p-8 border border-amber-100 h-full flex flex-col justify-center items-center text-center">
        <ShieldCheck className="w-12 h-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Membre Certifié</h3>
        <p className="text-sm text-gray-600">Votre identité est vérifiée.</p>
      </div>
    );
  }

  if (kycStatus === 'PENDING_REVIEW') {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 border border-blue-100 h-full flex flex-col justify-center items-center text-center cursor-pointer hover:shadow-sm transition-all" onClick={() => navigate('/app/kyc')}>
        <ShieldAlert className="w-12 h-12 text-blue-400 mb-4 animate-pulse" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">En cours d'examen</h3>
        <p className="text-sm text-gray-600">Votre dossier est en cours de validation.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 border border-[#E8ECE9] h-full flex flex-col relative overflow-hidden group hover:border-[#8C9B90] transition-colors">
      <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-4 border border-amber-100">
        <ShieldAlert className="w-6 h-6 text-amber-600" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">Certifiez votre profil</h3>
      <p className="text-sm text-gray-500 mb-6 leading-relaxed">
        Gagnez en visibilité et rassurez vos futurs matchs en vérifiant votre identité en 2 minutes.
      </p>
      
      <button onClick={() => navigate('/app/kyc')} className="mt-auto w-full py-3 px-4 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 transition-all text-sm group-hover:border-[#8C9B90] group-hover:text-[#8C9B90]">
        {kycStatus === 'MORE_INFORMATION_REQUIRED' ? 'Compléter mon dossier' : 'Vérifier mon identité'}
      </button>
    </div>
  );
};
