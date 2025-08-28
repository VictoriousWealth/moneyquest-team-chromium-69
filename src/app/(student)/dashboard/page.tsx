import React from 'react';
import ProfileSection from '../../../components/student/ProfileSection';
import ProgressSummary from '../../../components/student/ProgressSummary';
import JournalPreview from '../../../components/student/JournalPreview';

const StudentDashboard: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,_30%)_1fr] gap-4 lg:gap-6 h-full min-h-0">
      
      {/* Left Column: Profile. Will stretch to fill its grid area height. */}
      <div className="min-h-0">
        <ProfileSection />
      </div>

      {/* Right Column: Stacked Progress & Journal. This column also stretches. */}
      {/* Its internal grid divides the available space between Progress and Journal. */}
      <div className="grid grid-rows-[minmax(360px,_0.6fr)_minmax(240px,_0.4fr)] gap-4 lg:gap-6 min-h-0">
        <ProgressSummary />
        <JournalPreview />
      </div>

    </div>
  );
};

export default StudentDashboard;