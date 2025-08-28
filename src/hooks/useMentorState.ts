import { useState, useCallback } from 'react';
import { DialogueMode, MentorProposal, MentorState } from '@/types/mentor';

export const useMentorState = () => {
  const [state, setState] = useState<MentorState>({
    mode: 'idle'
  });

  const setMode = useCallback((mode: DialogueMode) => {
    setState(prev => ({ ...prev, mode }));
  }, []);

  const setPendingProposal = useCallback((proposal?: MentorProposal) => {
    setState(prev => ({ 
      ...prev, 
      pendingProposal: proposal,
      mode: proposal ? 'awaiting_confirm' : 'idle'
    }));
  }, []);

  const acceptProposal = useCallback(() => {
    if (!state.pendingProposal) return null;
    
    const proposal = state.pendingProposal;
    setState(prev => ({
      ...prev,
      mode: proposal.type === 'quiz' ? 'running_quiz' : 'planning',
      currentActivity: {
        type: proposal.type,
        id: proposal.id
      },
      pendingProposal: undefined
    }));
    
    return proposal;
  }, [state.pendingProposal]);

  const rejectProposal = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'idle',
      pendingProposal: undefined
    }));
  }, []);

  const completeActivity = useCallback(() => {
    setState(prev => ({
      ...prev,
      mode: 'idle',
      currentActivity: undefined
    }));
  }, []);

  const reset = useCallback(() => {
    setState({
      mode: 'idle'
    });
  }, []);

  return {
    state,
    setMode,
    setPendingProposal,
    acceptProposal,
    rejectProposal,
    completeActivity,
    reset
  };
};