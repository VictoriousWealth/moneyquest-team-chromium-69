import React from 'react';
import ProfileSection from '../../../components/student/ProfileSection';
import ProgressSummary from '../../../components/student/ProgressSummary';
import JournalPreview from '../../../components/student/JournalPreview';

const StudentDashboard: React.FC = () => {
  return (
    // This grid establishes the main two-column layout and its height.
    // Uses h-full minus 40px to prevent phantom scrolling.
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,_30%)_1fr] lg:gap-6 h-[calc(100dvh-250px)]">
      
      {/* Left Column: Profile. Will stretch to fill its grid area height. */}
      <div>
        <ProfileSection />
      </div>

      {/* Right Column: Stacked Progress & Journal. This column also stretches. */}
      {/* Its internal grid divides the available space between Progress and Journal. */}
      <div className="grid lg:grid-rows-[minmax(360px,_0.6fr)_minmax(240px,_0.4fr)] gap-6">
        <ProgressSummary />
        <JournalPreview />
      </div>

    </div>
  );
};

export default StudentDashboard;