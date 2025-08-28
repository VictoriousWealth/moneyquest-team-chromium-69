import React from 'react';

export interface Character {
  id: string;
  name: string;
  avatar: string;
  position?: 'left' | 'center' | 'right';
  emotion?: string;
  visible?: boolean;
}

interface CharacterDisplayProps {
  characters: Character[];
  activeCharacter?: string;
}

export const CharacterDisplay: React.FC<CharacterDisplayProps> = ({
  characters,
  activeCharacter
}) => {
  const getPositionClass = (position: Character['position']) => {
    switch (position) {
      case 'left':
        return 'left-16';
      case 'right':
        return 'right-16';
      case 'center':
      default:
        return 'left-1/2 transform -translate-x-1/2';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none">
      {characters.map((character) => (
        character.visible && (
          <div
            key={character.id}
            className={`absolute bottom-0 ${getPositionClass(character.position)} transition-all duration-500 ${
              activeCharacter === character.id 
                ? 'opacity-100 scale-100 z-10' 
                : 'opacity-60 scale-95 z-5'
            }`}
          >
            <div className="relative">
              <img
                src={character.avatar}
                alt={character.name}
                className="h-96 w-auto object-contain drop-shadow-2xl"
              />
              
              {/* Character name label */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-background/90 backdrop-blur-sm px-3 py-1 rounded-full border border-border/50">
                  <span className="text-sm text-foreground font-medium">
                    {character.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )
      ))}
    </div>
  );
};