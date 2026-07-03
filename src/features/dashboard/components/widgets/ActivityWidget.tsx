import React, { useEffect, useState } from 'react';
import { Camera, CheckCircle, Edit3, Loader, Activity } from 'lucide-react';
import api from '../../../../services/api';

interface FeedEvent {
  id: number;
  event_type: string;
  metadata: any;
  created_at: string;
}

const getIconForEvent = (eventType: string) => {
  if (eventType.includes('KYC')) return CheckCircle;
  if (eventType.includes('PHOTO')) return Camera;
  if (eventType.includes('PROFILE')) return Edit3;
  return Activity;
};

const getColorForEvent = (eventType: string) => {
  if (eventType.includes('KYC')) return { color: 'text-amber-500', bg: 'bg-amber-50' };
  if (eventType.includes('PHOTO')) return { color: 'text-[#8C9B90]', bg: 'bg-[#F5F7F5]' };
  return { color: 'text-blue-500', bg: 'bg-blue-50' };
};

const getMessageForEvent = (eventType: string) => {
  switch (eventType) {
    case 'ONBOARDING_STARTED': return 'A démarré son inscription';
    case 'ONBOARDING_COMPLETED': return 'A complété l\'inscription de base';
    case 'KYC_STARTED': return 'A débuté la vérification d\'identité';
    case 'KYC_SUBMITTED': return 'A soumis ses documents KYC';
    case 'KYC_APPROVED': return 'Profil officiellement certifié';
    case 'KYC_REJECTED': return 'Documents KYC rejetés';
    case 'PROFILE_UPDATED': return 'A mis à jour son profil';
    case 'PROFILE_PHOTO_ADDED': return 'Nouvelle photo ajoutée';
    case 'PROFILE_PHOTO_REMOVED': return 'Photo supprimée';
    default: return eventType;
  }
};

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return "Il y a moins d'une heure";
  if (diffInHours < 24) return `Il y a ${diffInHours}h`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "Hier";
  return `Il y a ${diffInDays} jours`;
};

export const ActivityWidget: React.FC = () => {
  const [events, setEvents] = useState<FeedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const res = await api.get('/api/analytics/feed/');
        setEvents(res.data);
      } catch (err) {
        console.error("Failed to fetch feed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-[#E8ECE9] min-h-[200px] flex items-center justify-center">
        <Loader className="animate-spin text-[#dca54a]" size={24} />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 border border-[#E8ECE9]">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-gray-900">Vos dernières activités</h2>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-10 flex flex-col items-center justify-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <Activity className="w-10 h-10 text-gray-300 mb-3" />
          <h3 className="text-gray-500 font-medium mb-1">Aucune activité récente</h3>
          <p className="text-sm text-gray-400 max-w-xs mx-auto">
            Vos actions et interactions importantes apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {events.map((event, index) => {
            const Icon = getIconForEvent(event.event_type);
            const { color, bg } = getColorForEvent(event.event_type);
            const message = getMessageForEvent(event.event_type);
            const time = formatTime(event.created_at);

            return (
              <div key={event.id} className="flex gap-4 relative">
                {/* Timeline line */}
                {index !== events.length - 1 && (
                  <div className="absolute top-10 bottom-[-24px] left-[19px] w-[2px] bg-gray-100"></div>
                )}
                
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${bg}`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                
                <div className="flex-1 pt-2">
                  <p className="text-sm font-medium text-gray-900">{message}</p>
                  <p className="text-xs text-gray-500 mt-1">{time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
