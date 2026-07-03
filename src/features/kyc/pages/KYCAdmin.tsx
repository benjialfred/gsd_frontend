import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { useAuthStore } from '../../../stores/authStore';
import { Navigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const KYCAdmin: React.FC = () => {
  const { user } = useAuthStore();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await api.get('/api/profiles/admin/kyc/');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchSubmissions();
    }
  }, [user]);

  if (user?.role !== 'ADMIN') {
    return <Navigate to="/app" replace />;
  }

  const handleAction = async (id: number, status: string) => {
    try {
      await api.patch(`/api/profiles/admin/kyc/${id}/`, { status });
      fetchSubmissions();
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'action");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Administration KYC</h1>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="grid gap-6">
          {submissions.length === 0 ? (
            <p className="text-gray-500">Aucune soumission trouvée.</p>
          ) : (
            submissions.map(sub => (
              <div key={sub.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">Soumission #{sub.id}</h3>
                    <p className="text-sm text-gray-500">Statut: {sub.status}</p>
                  </div>
                  <div className="flex gap-2">
                    {sub.status === 'PENDING_REVIEW' && (
                      <>
                        <button 
                          onClick={() => handleAction(sub.id, 'APPROVED')}
                          className="bg-green-100 text-green-700 p-2 rounded-full hover:bg-green-200"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(sub.id, 'MORE_INFORMATION_REQUIRED')}
                          className="bg-yellow-100 text-yellow-700 p-2 rounded-full hover:bg-yellow-200"
                        >
                          <AlertCircle className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleAction(sub.id, 'REJECTED')}
                          className="bg-red-100 text-red-700 p-2 rounded-full hover:bg-red-200"
                        >
                          <XCircle className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                {/* Images would go here - using dummy placeholder because real URLs depend on S3/backend config */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-500 border border-dashed">
                    [Image Recto ID]
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-center text-sm text-gray-500 border border-dashed">
                    [Video/Selfie]
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
