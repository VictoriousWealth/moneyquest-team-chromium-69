
import React, { useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { episodes } from '../../../lib/mockData';
import type { Episode } from '../../../types';

const AssignmentCard: React.FC<{ episode: Episode }> = ({ episode }) => {
    const [isAssigned, setIsAssigned] = useState(episode.assigned || false);

    const statusMap: Record<NonNullable<Episode['classStatus']>, 'mint' | 'teal' | 'muted'> = {
        'Completed': 'mint',
        'In Progress': 'teal',
        'Not Started': 'muted',
    };
    
    return (
        <Card className="p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-grow">
                <h3 className="h3 mb-1">{episode.title}</h3>
                <p className="small">{episode.dueDate || 'No due date set'}</p>
                 <div className="flex flex-wrap gap-2 mt-3">
                    {episode.concepts.map(concept => (
                        <Badge key={concept} variant="blue">{concept}</Badge>
                    ))}
                </div>
            </div>
            <div className="flex flex-col md:items-end gap-2 flex-shrink-0">
                {isAssigned && episode.classStatus && (
                     <Badge variant={statusMap[episode.classStatus]}>{episode.classStatus} (70%)</Badge>
                )}
                <Button variant={isAssigned ? "outline" : "primary"} onClick={() => setIsAssigned(!isAssigned)}>
                    {isAssigned ? 'Unassign' : 'Assign'}
                </Button>
            </div>
        </Card>
    )
}


const TeacherAssignments: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="h1">Assignments</h1>
        <Button variant="primary">Assign New Episode</Button>
      </div>
      <div className="space-y-4">
        {episodes.map(ep => <AssignmentCard key={ep.id} episode={ep} />)}
      </div>
    </div>
  );
};

export default TeacherAssignments;