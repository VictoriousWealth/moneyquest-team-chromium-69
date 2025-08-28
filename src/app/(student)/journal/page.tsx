import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

const StudentJournal: React.FC = () => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link to="/student/dashboard">
          <Button variant="ghost" size="sm" className="p-2">
            <ArrowLeft size={16} />
          </Button>
        </Link>
        <h1 className="h1">Learning Journal</h1>
      </div>
      <p className="text-subtext">Your personal reflection space for financial learning insights.</p>
    </div>
  );
};

export default StudentJournal;