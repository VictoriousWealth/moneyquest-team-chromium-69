import React from 'react';
import Button from '@/components/ui/Button';

export interface DialogueChoice {
  id: string;
  text: string;
  action?: () => void;
}

export interface DialogueMessage {
  id: string;
  speaker: string;
  text: string;
  avatar?: string;
  choices?: DialogueChoice[];
  isPlayer?: boolean;
}

interface DialogueBoxProps {
  message: DialogueMessage;
  onChoiceSelect?: (choiceId: string) => void;
  onNext?: () => void;
  showNext?: boolean;
  isTyping?: boolean;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  message,
  onChoiceSelect,
  onNext,
  showNext = false,
  isTyping = false
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-background/95 to-background/80 backdrop-blur-sm p-6">
      <div className="max-w-4xl mx-auto">
        {/* Character Info */}
        <div className="flex items-center gap-4 mb-4">
          {message.avatar && (
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
              <img 
                src={message.avatar} 
                alt={message.speaker}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {message.speaker}
            </h3>
            {message.isPlayer && (
              <span className="text-sm text-muted-foreground">You</span>
            )}
          </div>
        </div>

        {/* Dialogue Text */}
        <div className="bg-card/90 backdrop-blur-sm rounded-lg p-6 mb-4 border border-border/50">
          <p className="text-foreground leading-relaxed text-lg">
            {isTyping ? (
              <span className="typing-animation">
                {message.text}
                <span className="animate-pulse">|</span>
              </span>
            ) : (
              message.text
            )}
          </p>
        </div>

        {/* Choices */}
        {message.choices && message.choices.length > 0 && (
          <div className="space-y-3">
            {message.choices.map((choice) => (
              <Button
                key={choice.id}
                variant="outline"
                className="w-full justify-start text-left p-4 h-auto bg-card/50 hover:bg-card/80 border-border/50"
                onClick={() => {
                  choice.action?.();
                  onChoiceSelect?.(choice.id);
                }}
              >
                {choice.text}
              </Button>
            ))}
          </div>
        )}

        {/* Next Button */}
        {showNext && !message.choices && (
          <div className="flex justify-end">
            <Button 
              onClick={onNext}
              className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30"
            >
              Continue →
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};