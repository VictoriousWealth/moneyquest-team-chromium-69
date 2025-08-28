import React from 'react';
import ProfileSection from '../../../components/student/ProfileSection';
import ProgressSummary from '../../../components/student/ProgressSummary';
import JournalPreview from '../../../components/student/JournalPreview';

const StudentDashboard: React.FC = () => {
  return (
    // Fixed viewport layout - everything fits on screen
    <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-6 h-[calc(100vh-120px)] overflow-hidden pb-5">
      
      {/* Left Column: Profile. Will stretch to fill its grid area height. */}
      <div>
        <ProfileSection />
      </div>

      {/* Right Column: Stacked Progress & Journal. This column also stretches. */}
      {/* Its internal grid divides the available space between Progress and Journal. */}
      <div className="grid grid-rows-[1fr_150px] gap-6 h-full">
        <ProgressSummary />
        <JournalPreview />
      </div>

    </div>
  );
};

export default StudentDashboard;