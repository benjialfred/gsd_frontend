import React, { useEffect, useState } from 'react';
import { ShieldCheck, XCircle, AlertTriangle, Loader, Eye } from 'lucide-react';
import api from '../../../services/api';

interface KYCSubmission {
  id: number;
  profile: {
    user: { username: string; email: string };
  };
  status: string;
  submitted_at: string;
}

export const KYCAdmin: React.FC = () => {
  const [submissions, setSubmissions] = useState<KYCSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      const res = await api.get('/api/admin/kyc/queue/?status=PENDING_REVIEW');
      setSubmissions(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (id: number, action: string, reason: string = '') => {
    try {
      await api.post(`/api/admin/kyc/review/${id}/`, { action, reason });
      fetchQueue();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-10 flex justify-center"><Loader className="animate-spin text-gray-500" /></div>;

  return (
    <div className="p-10 max-w-6xl mx-auto min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Administration KYC</h1>
        <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold uppercase">
          {submissions.length} en attente
        </span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="px-6 py-4 font-bold">Utilisateur</th>
              <th className="px-6 py-4 font-bold">Date de soumission</th>
              <th className="px-6 py-4 font-bold">Documents</th>
              <th className="px-6 py-4 font-bold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {submissions.map((sub) => (
              <tr key={sub.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {sub.profile.user.username}
                  <div className="text-xs text-gray-400 font-normal">{sub.profile.user.email}</div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {new Date(sub.submitted_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <button className="flex items-center text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-wide">
                    <Eye size={14} className="mr-1" /> Voir les fichiers
                  </button>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => handleReview(sub.id, 'APPROVED')}
                    className="bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded-lg font-bold text-xs flex-inline items-center gap-1 transition-colors"
                  >
                    <ShieldCheck size={14} /> Approuver
                  </button>
                  <button 
                    onClick={() => {
                      const reason = prompt('Raison de la demande de nouveau document ?');
                      if (reason) handleReview(sub.id, 'MORE_INFORMATION_REQUIRED', reason);
                    }}
                    className="bg-amber-50 text-amber-700 hover:bg-amber-100 px-3 py-1.5 rounded-lg font-bold text-xs flex-inline items-center gap-1 transition-colors"
                  >
                    <AlertTriangle size={14} /> Demander Doc
                  </button>
                  <button 
                    onClick={() => {
                      const reason = prompt('Raison du rejet ?');
                      if (reason) handleReview(sub.id, 'REJECTED', reason);
                    }}
                    className="bg-red-50 text-red-700 hover:bg-red-100 px-3 py-1.5 rounded-lg font-bold text-xs flex-inline items-center gap-1 transition-colors"
                  >
                    <XCircle size={14} /> Rejeter
                  </button>
                </td>
              </tr>
            ))}
            {submissions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  La file d'attente est vide. Bon travail !
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
