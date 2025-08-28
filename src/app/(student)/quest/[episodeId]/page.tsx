import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../../../../components/ui/Button';
import { episodes } from '../../../../lib/mockData';

// Quest page components - these will be similar to your teammate's structure
const BudgetBasicsQuest = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-surface rounded-xl p-8 shadow-soft">
      <h1 className="h1 mb-6 text-center">Budget Basics Quest</h1>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
        <p className="text-xl font-semibold text-muted">Interactive Budget Game Loading...</p>
      </div>
      <p className="text-center text-muted">
        This is where your teammate's quest implementation will go. 
        You can directly integrate their JuiceQuestPage, MomoBakeryQuestPage, etc. here.
      </p>
    </div>
  </div>
);

const SavingStrategiesQuest = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-surface rounded-xl p-8 shadow-soft">
      <h1 className="h1 mb-6 text-center">Saving Strategies Quest</h1>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
        <p className="text-xl font-semibold text-muted">Interactive Saving Game Loading...</p>
      </div>
      <p className="text-center text-muted">
        Integration point for your teammate's quest component.
      </p>
    </div>
  </div>
);

const CreditCardQuest = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-surface rounded-xl p-8 shadow-soft">
      <h1 className="h1 mb-6 text-center">Credit Card Fundamentals Quest</h1>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
        <p className="text-xl font-semibold text-muted">Interactive Credit Game Loading...</p>
      </div>
      <p className="text-center text-muted">
        Integration point for your teammate's quest component.
      </p>
    </div>
  </div>
);

const InvestmentQuest = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-surface rounded-xl p-8 shadow-soft">
      <h1 className="h1 mb-6 text-center">Investment Basics Quest</h1>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
        <p className="text-xl font-semibold text-muted">Interactive Investment Game Loading...</p>
      </div>
      <p className="text-center text-muted">
        Integration point for your teammate's quest component.
      </p>
    </div>
  </div>
);

const DebtManagementQuest = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-surface rounded-xl p-8 shadow-soft">
      <h1 className="h1 mb-6 text-center">Debt Management Quest</h1>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
        <p className="text-xl font-semibold text-muted">Interactive Debt Game Loading...</p>
      </div>
      <p className="text-center text-muted">
        Integration point for your teammate's quest component.
      </p>
    </div>
  </div>
);

const RetirementQuest = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-surface rounded-xl p-8 shadow-soft">
      <h1 className="h1 mb-6 text-center">Retirement Planning Quest</h1>
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-6">
        <p className="text-xl font-semibold text-muted">Interactive Retirement Game Loading...</p>
      </div>
      <p className="text-center text-muted">
        Integration point for your teammate's quest component.
      </p>
    </div>
  </div>
);

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
      case 1: return <BudgetBasicsQuest />;
      case 2: return <SavingStrategiesQuest />;
      case 3: return <CreditCardQuest />;
      case 4: return <InvestmentQuest />;
      case 5: return <DebtManagementQuest />;
      case 6: return <RetirementQuest />;
      default: return <BudgetBasicsQuest />;
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

      {/* Quest Content */}
      <div className="py-8 px-4">
        {renderQuest()}
      </div>
    </div>
  );
};

export default QuestPage;