import React from 'react';
import { DialogueBox } from './DialogueBox';
import { CharacterDisplay } from './CharacterDisplay';
import { BackgroundDisplay } from './BackgroundDisplay';
import { useDialogueSystem, DialogueScene } from '@/hooks/useDialogueSystem';

interface VisualNovelEngineProps {
  scenes: DialogueScene[];
  onComplete?: (gameData: Record<string, any>) => void;
  className?: string;
}

export const VisualNovelEngine: React.FC<VisualNovelEngineProps> = ({
  scenes,
  onComplete,
  className = ""
}) => {
  const {
    currentScene,
    currentMessage,
    isTyping,
    isComplete,
    nextMessage,
    handleChoice,
  } = useDialogueSystem({ scenes, onComplete });

  if (isComplete) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-background ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Story Complete!</h2>
          <p className="text-muted-foreground">Thank you for playing.</p>
        </div>
      </div>
    );
  }

  if (!currentScene || !currentMessage) {
    return (
      <div className={`min-h-screen flex items-center justify-center bg-background ${className}`}>
        <div className="text-center">
          <h2 className="text-xl text-muted-foreground">Loading...</h2>
        </div>
      </div>
    );
  }

  const activeCharacter = currentMessage.isPlayer 
    ? undefined 
    : currentScene.characters.find(c => c.name === currentMessage.speaker)?.id;

  const hasChoices = currentMessage.choices && currentMessage.choices.length > 0;
  const showNext = !hasChoices && !isTyping;

  return (
    <div className={`min-h-screen relative overflow-hidden ${className}`}>
      {/* Background */}
      <BackgroundDisplay background={currentScene.background} />
      
      {/* Characters */}
      <CharacterDisplay 
        characters={currentScene.characters}
        activeCharacter={activeCharacter}
      />
      
      {/* Dialogue UI */}
      <DialogueBox
        message={currentMessage}
        onChoiceSelect={handleChoice}
        onNext={nextMessage}
        showNext={showNext}
        isTyping={isTyping}
      />
      
      {/* Click to continue overlay (when no choices) */}
      {showNext && (
        <div 
          className="fixed inset-0 z-20 cursor-pointer"
          onClick={nextMessage}
          style={{ background: 'transparent' }}
        />
      )}
    </div>
  );
};