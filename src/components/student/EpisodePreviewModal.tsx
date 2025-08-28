import React from 'react';
import { X, Play, Clock, Trophy } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface Episode {
  id: number;
  title: string;
  status: 'Completed' | 'In progress' | 'Not started' | 'Failed';
  concepts: string[];
  xpReward: number;
  estimatedTime: string;
}

interface EpisodePreviewModalProps {
  episode: Episode;
  isOpen: boolean;
  onClose: () => void;
  onStartQuest: () => void;
}

const EpisodePreviewModal: React.FC<EpisodePreviewModalProps> = ({
  episode,
  isOpen,
  onClose,
  onStartQuest
}) => {
  if (!isOpen) return null;

  const statusColor = {
    'Completed': 'mint',
    'In progress': 'teal',
    'Not started': 'muted',
    'Failed': 'blue',
  } as const;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl shadow-elegant max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative">
          <img 
            src={`https://picsum.photos/seed/${episode.id}/800/300`} 
            alt={episode.title}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-4">
            <Badge variant={statusColor[episode.status]}>{episode.status}</Badge>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <h2 className="h2 mb-4">{episode.title}</h2>
          
          {/* Meta info */}
          <div className="flex items-center gap-6 mb-6 text-sm text-muted">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{episode.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span>{episode.xpReward} XP</span>
            </div>
          </div>

          {/* Concepts */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">What you'll learn:</h3>
            <div className="flex flex-wrap gap-2">
              {episode.concepts.map(concept => (
                <Badge key={concept} variant="blue">{concept}</Badge>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-semibold mb-3">Episode Overview:</h3>
            <p className="text-muted leading-relaxed">
              {episode.id === 1 && "Learn the fundamentals of budgeting with the 50/30/20 rule. Understand how to track income and expenses effectively."}
              {episode.id === 2 && "Discover powerful saving strategies including emergency funds and compound interest to build wealth over time."}
              {episode.id === 3 && "Master credit cards, learn about credit scores, APR, and building a strong payment history."}
              {episode.id === 4 && "Get started with investing basics including stocks, bonds, and the importance of diversification."}
              {episode.id === 5 && "Learn proven debt management strategies like debt snowball and avalanche methods."}
              {episode.id === 6 && "Plan for your future with retirement accounts, 401k matching, and long-term wealth building."}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button 
              variant="primary" 
              className="flex-1 flex items-center justify-center gap-2"
              onClick={onStartQuest}
            >
              <Play className="h-4 w-4" />
              {episode.status === 'In progress' ? 'Resume Quest' : 'Start Quest'}
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EpisodePreviewModal;