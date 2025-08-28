import React, { useEffect } from 'react';
import ProfileSection from '../../../components/student/ProfileSection';
import ProgressSummary from '../../../components/student/ProgressSummary';
import JournalPreview from '../../../components/student/JournalPreview';

const StudentDashboard: React.FC = () => {
  useEffect(() => {
    document.title = 'Student Overview | MoneyQuest';
    const desc = 'Student overview dashboard: profile, progress, and journal preview.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute('name', 'description');
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', desc);
  }, []);
  return (
    // This grid establishes the main two-column layout and its height.
    // It now uses h-full to adapt to the new flex-grow layout from the parent.
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(340px,_38%)_1fr] lg:gap-4 h-full text-[15px] md:text-[16px]">
      
      {/* Left Column: Profile. Will stretch to fill its grid area height. */}
      <div>
        <ProfileSection />
      </div>

      {/* Right Column: Stacked Progress & Journal. This column also stretches. */}
      {/* Its internal grid divides the available space between Progress and Journal. */}
      <div className="grid lg:grid-rows-[minmax(300px,_0.55fr)_minmax(200px,_0.45fr)] gap-4 min-h-0">
        <ProgressSummary />
        <JournalPreview />
      </div>

    </div>
  );
};

export default StudentDashboard;