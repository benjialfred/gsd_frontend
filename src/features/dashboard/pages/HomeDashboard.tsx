import React from 'react';
import { WelcomeWidget } from '../components/widgets/WelcomeWidget';
import { GrowthWidget } from '../components/widgets/GrowthWidget';
import { KYCWidget } from '../components/widgets/KYCWidget';
import { ActivityWidget } from '../components/widgets/ActivityWidget';
import { QuickActionsWidget } from '../components/widgets/QuickActionsWidget';

export const HomeDashboard: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-8 pb-32">
      <div className="space-y-8">
        
        {/* Welcome Banner */}
        <WelcomeWidget />

        {/* Growth & KYC */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <GrowthWidget />
          </div>
          <div className="md:col-span-1">
            <KYCWidget />
          </div>
        </div>

        {/* Quick Actions Grid */}
        <QuickActionsWidget />

        {/* Activity Feed */}
        <ActivityWidget />

      </div>
    </div>
  );
};
