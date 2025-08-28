import React, { useEffect } from 'react';
import ProfileSection from '../../../components/student/ProfileSection';
import ProgressSummary from '../../../components/student/ProgressSummary';
import JournalPreview from '../../../components/student/JournalPreview';
import DataSyncButton from '../../../components/admin/DataSyncButton';
import { useDataSync } from '../../../hooks/useDataSync';

const StudentDashboard: React.FC = () => {
  const { syncAllData } = useDataSync();
  useEffect(() => { syncAllData(); }, []);
  return (
    <div className="space-y-4">
      {/* Data Sync Button - for development */}
      <div className="flex justify-end">
        <DataSyncButton />
      </div>
      
      {/* Main Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,_30%)_1fr] lg:gap-6 h-full">
        
        {/* Left Column: Profile. Will stretch to fill its grid area height. */}
        <div>
          <ProfileSection />
        </div>

        {/* Right Column: Stacked Progress & Journal. This column also stretches. */}
        {/* Reduce minimums to prevent overflow - use shrinkable tracks */}
        <div className="grid lg:grid-rows-[minmax(0,_0.6fr)_minmax(0,_0.4fr)] gap-6 min-h-0">
          <ProgressSummary />
          <JournalPreview />
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;