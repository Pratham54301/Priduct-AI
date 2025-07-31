'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import ProfileCard from '@/components/profile/ProfileCard';
import HistoryTable from '@/components/profile/HistoryTable';
import WatchlistGrid from '@/components/profile/WatchlistGrid';
import AlertPreferences from '@/components/profile/AlertPreferences';
import SubscriptionCard from '@/components/profile/SubscriptionCard';
import SecuritySettings from '@/components/profile/SecuritySettings';
import FeedbackSupport from '@/components/profile/FeedbackSupport';
import DangerZone from '@/components/profile/DangerZone';
import SidebarStats from '@/components/profile/SidebarStats';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8">
              <ProfileCard />
              <HistoryTable />
              <WatchlistGrid />
              <AlertPreferences />
              <SubscriptionCard />
              <SecuritySettings />
              <FeedbackSupport />
              <DangerZone />
            </div>
            
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <SidebarStats />
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}