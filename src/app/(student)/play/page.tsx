import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { episodes } from '../../../lib/mockData';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import EpisodePreviewModal from '../../../components/student/EpisodePreviewModal';

const EpisodeCard: React.FC<{ episode: typeof episodes[0]; onPreview: () => void }> = ({ episode, onPreview }) => {
    const statusColor = {
        'Completed': 'mint',
        'In progress': 'teal',
        'Not started': 'muted',
        'Failed': 'blue', // using blue for failed to not be too negative
    } as const;

    return (
        <Card className="flex flex-col justify-between rounded-lg overflow-hidden">
            <div>
                <img src={`https://picsum.photos/seed/${episode.id}/400/200`} alt={episode.title} className="w-full h-32 object-cover" />
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="h3 mb-2">{episode.title}</h3>
                        <Badge variant={statusColor[episode.status]}>{episode.status}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {episode.concepts.map(concept => (
                            <Badge key={concept} variant="blue">{concept}</Badge>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-4 pt-0">
                <Button variant="primary" className="w-full mt-2" onClick={onPreview}>
                    {episode.status === 'In progress' ? 'Resume' : 'Start'}
                </Button>
            </div>
        </Card>
    );
}

const StudentPlay: React.FC = () => {
  const [selectedEpisode, setSelectedEpisode] = useState<typeof episodes[0] | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const navigate = useNavigate();

  const handlePreview = (episode: typeof episodes[0]) => {
    setSelectedEpisode(episode);
    setIsPreviewOpen(true);
  };

  const handleStartQuest = () => {
    if (selectedEpisode) {
      navigate(`/student/quest/${selectedEpisode.id}`);
    }
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setSelectedEpisode(null);
  };

  return (
    <div>
      <h1 className="h1 mb-6">Play Episodes</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {episodes.map(episode => (
          <EpisodeCard 
            key={episode.id} 
            episode={episode} 
            onPreview={() => handlePreview(episode)}
          />
        ))}
      </div>
      
      {selectedEpisode && (
        <EpisodePreviewModal
          episode={selectedEpisode}
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          onStartQuest={handleStartQuest}
        />
      )}
    </div>
  );
};

export default StudentPlay;