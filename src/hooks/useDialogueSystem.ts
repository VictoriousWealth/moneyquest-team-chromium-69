import { useState, useCallback } from 'react';
import { DialogueMessage } from '@/components/dialogue/DialogueBox';
import { Character } from '@/components/dialogue/CharacterDisplay';
import { Background } from '@/components/dialogue/BackgroundDisplay';

export interface DialogueScene {
  id: string;
  messages: DialogueMessage[];
  characters: Character[];
  background: Background;
}

export interface DialogueState {
  currentScene: string;
  currentMessage: number;
  isComplete: boolean;
  gameData: Record<string, any>;
}

interface UseDialogueSystemProps {
  scenes: DialogueScene[];
  onComplete?: (gameData: Record<string, any>) => void;
}

export const useDialogueSystem = ({ 
  scenes, 
  onComplete 
}: UseDialogueSystemProps) => {
  const [state, setState] = useState<DialogueState>({
    currentScene: scenes[0]?.id || '',
    currentMessage: 0,
    isComplete: false,
    gameData: {}
  });

  const [isTyping, setIsTyping] = useState(false);

  const currentScene = scenes.find(scene => scene.id === state.currentScene);
  const currentMessage = currentScene?.messages[state.currentMessage];

  const nextMessage = useCallback(() => {
    if (!currentScene) return;

    setIsTyping(true);
    
    // Simulate typing delay
    setTimeout(() => {
      setIsTyping(false);
      
      setState(prev => {
        const nextMessageIndex = prev.currentMessage + 1;
        
        if (nextMessageIndex >= currentScene.messages.length) {
          // Scene complete
          const isLastScene = scenes.indexOf(currentScene) === scenes.length - 1;
          
          if (isLastScene) {
            onComplete?.(prev.gameData);
            return { ...prev, isComplete: true };
          } else {
            // Move to next scene
            const nextSceneIndex = scenes.indexOf(currentScene) + 1;
            return {
              ...prev,
              currentScene: scenes[nextSceneIndex].id,
              currentMessage: 0
            };
          }
        } else {
          // Move to next message
          return {
            ...prev,
            currentMessage: nextMessageIndex
          };
        }
      });
    }, 300);
  }, [currentScene, scenes, onComplete]);

  const handleChoice = useCallback((choiceId: string) => {
    const choice = currentMessage?.choices?.find(c => c.id === choiceId);
    
    if (choice) {
      // Store choice in game data
      setState(prev => ({
        ...prev,
        gameData: {
          ...prev.gameData,
          [`${state.currentScene}_${state.currentMessage}_choice`]: choiceId
        }
      }));
      
      choice.action?.();
      nextMessage();
    }
  }, [currentMessage, nextMessage, state.currentScene, state.currentMessage]);

  const jumpToScene = useCallback((sceneId: string) => {
    setState(prev => ({
      ...prev,
      currentScene: sceneId,
      currentMessage: 0
    }));
  }, []);

  const setGameData = useCallback((key: string, value: any) => {
    setState(prev => ({
      ...prev,
      gameData: {
        ...prev.gameData,
        [key]: value
      }
    }));
  }, []);

  const getGameData = useCallback((key: string) => {
    return state.gameData[key];
  }, [state.gameData]);

  return {
    currentScene,
    currentMessage,
    isTyping,
    isComplete: state.isComplete,
    gameData: state.gameData,
    nextMessage,
    handleChoice,
    jumpToScene,
    setGameData,
    getGameData
  };
};