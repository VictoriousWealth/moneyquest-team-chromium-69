import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import JuiceQuestPage from '../../../../pages/JuiceQuestPage';
import MomoBakeryQuestPage from '../../../../pages/MomoBakeryQuestPage';
import PancakeQuestPage from '../../../../pages/PancakeQuestPage';
import { episodes } from '../../../../lib/mockData';

const QuestPage: React.FC = () => {
  const { episodeId } = useParams<{ episodeId: string }>();
  const navigate = useNavigate();
  
  const episode = episodes.find(e => e.id === parseInt(episodeId || '0'));
  
  if (!episode) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h1 className="h1 mb-4">Quest Not Found</h1>
        <p className="text-muted mb-6">The quest you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/student/play')}>
          Back to Episodes
        </Button>
      </div>
    );
  }

  const renderQuest = () => {
    switch (episode.id) {
      case 1: return <JuiceQuestPage />;
      case 2: return <PancakeQuestPage />;
      case 3: return <MomoBakeryQuestPage />;
      case 4: return <JuiceQuestPage />; // Reuse for now
      case 5: return <PancakeQuestPage />; // Reuse for now
      case 6: return <MomoBakeryQuestPage />; // Reuse for now
      default: return <JuiceQuestPage />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-ring">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student/play')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Episodes
            </Button>
            <div className="flex-1">
              <h1 className="text-lg font-semibold">{episode.title}</h1>
              <p className="text-sm text-muted">Complete this quest to earn {episode.xpReward} XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quest Content - Your teammate's actual implementation */}
      <div className="py-8 px-4">
        {renderQuest()}
      </div>
    </div>
  );
};

export default QuestPage;