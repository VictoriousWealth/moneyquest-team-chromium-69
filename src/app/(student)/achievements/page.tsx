import React from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { achievements } from '../../../lib/mockData';
import { Trophy, Lock } from 'lucide-react';

const StudentAchievements: React.FC = () => {
  const earnedAchievements = achievements.filter(a => a.earned);
  const lockedAchievements = achievements.filter(a => !a.earned);

  return (
    <div>
      <h1 className="h1 mb-6">Achievements</h1>
      
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-text">{earnedAchievements.length}</div>
          <div className="text-sm text-subtext">Achievements Earned</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-text">{achievements.length}</div>
          <div className="text-sm text-subtext">Total Available</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-text">
            {Math.round((earnedAchievements.length / achievements.length) * 100)}%
          </div>
          <div className="text-sm text-subtext">Completion Rate</div>
        </Card>
      </div>

      {/* Earned Achievements */}
      <div className="mb-8">
        <h2 className="h2 mb-4 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-[var(--mint-400)]" />
          Earned Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {earnedAchievements.map(achievement => (
            <Card key={achievement.id} className="p-4 border-[var(--mint-400)]/20 bg-[var(--mint-400)]/5">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text">{achievement.title}</h3>
                  <Badge variant="mint">{achievement.category}</Badge>
                </div>
              </div>
              <p className="text-sm text-subtext mb-2">{achievement.description}</p>
              {achievement.earnedDate && (
                <p className="text-xs text-[var(--mint-400)]">
                  Earned {achievement.earnedDate.toLocaleDateString()}
                </p>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Locked Achievements */}
      <div>
        <h2 className="h2 mb-4 flex items-center gap-2">
          <Lock className="h-6 w-6 text-subtext" />
          Locked Achievements
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {lockedAchievements.map(achievement => (
            <Card key={achievement.id} className="p-4 opacity-60">
              <div className="flex items-center gap-3 mb-3">
                <div className="text-3xl grayscale">{achievement.icon}</div>
                <div className="flex-1">
                  <h3 className="font-semibold text-text">{achievement.title}</h3>
                  <Badge variant="muted">{achievement.category}</Badge>
                </div>
              </div>
              <p className="text-sm text-subtext">{achievement.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentAchievements;