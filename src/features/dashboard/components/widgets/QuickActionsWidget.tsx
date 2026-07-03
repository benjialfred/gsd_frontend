import React from 'react';
import { Users, Calendar, BookOpen } from 'lucide-react';

export const QuickActionsWidget: React.FC = () => {
  const actions = [
    {
      title: 'Découvrir',
      description: 'Nouveaux profils',
      icon: Users,
      color: 'bg-rose-50 text-rose-600',
      hover: 'hover:border-rose-200 hover:bg-rose-50/50'
    },
    {
      title: 'Événements',
      description: 'Près de chez vous',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600',
      hover: 'hover:border-blue-200 hover:bg-blue-50/50'
    },
    {
      title: 'Ressources',
      description: 'Croissance spirituelle',
      icon: BookOpen,
      color: 'bg-[#F5F7F5] text-[#8C9B90]',
      hover: 'hover:border-[#8C9B90]/30 hover:bg-[#F5F7F5]/50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {actions.map((action, index) => (
        <button key={index} className={`flex items-center gap-4 p-4 rounded-2xl border border-[#E8ECE9] bg-white transition-all text-left ${action.hover}`}>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${action.color}`}>
            <action.icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-medium text-gray-900 text-sm">{action.title}</h4>
            <p className="text-xs text-gray-500 mt-0.5">{action.description}</p>
          </div>
        </button>
      ))}
    </div>
  );
};
