import React, { useState } from 'react';
import { useDataSync } from '../../hooks/useDataSync';
import Button from '../ui/Button';
import { RefreshCw } from 'lucide-react';

const DataSyncButton: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { syncAllData } = useDataSync();

  const handleSync = async () => {
    setIsLoading(true);
    try {
      await syncAllData();
      alert('Data sync completed successfully!');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Data sync failed. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleSync} 
      disabled={isLoading}
      variant="outline"
      className="flex items-center gap-2"
    >
      <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
      {isLoading ? 'Syncing...' : 'Sync Frontend Data to DB'}
    </Button>
  );
};

export default DataSyncButton;