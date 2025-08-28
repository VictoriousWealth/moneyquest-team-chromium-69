import React, { useEffect, useState } from 'react';
import { Bot, Heart, Lightbulb, Star, Eye, Smile } from 'lucide-react';

type MoodType = 'cheer' | 'thinking' | 'proud' | 'curious' | 'gentle' | 'idle';

interface MascotAvatarProps {
  mood: MoodType;
  intensity?: number;
  className?: string;
}

const MascotAvatar: React.FC<MascotAvatarProps> = ({ 
  mood = 'idle', 
  intensity = 1, 
  className = '' 
}) => {
  const [currentMood, setCurrentMood] = useState<MoodType>('idle');
  const [showReaction, setShowReaction] = useState(false);

  useEffect(() => {
    if (mood !== 'idle') {
      setShowReaction(true);
      setCurrentMood(mood);
      
      // Return to idle after animation
      const timer = setTimeout(() => {
        setCurrentMood('idle');
        setShowReaction(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [mood]);

  const getMoodIcon = () => {
    switch (currentMood) {
      case 'cheer':
        return <Star className="text-yellow-400" size={20} />;
      case 'thinking':
        return <Lightbulb className="text-blue-400" size={20} />;
      case 'proud':
        return <Heart className="text-red-400" size={20} />;
      case 'curious':
        return <Eye className="text-purple-400" size={20} />;
      case 'gentle':
        return <Smile className="text-green-400" size={20} />;
      default:
        return null;
    }
  };

  const getMoodColor = () => {
    switch (currentMood) {
      case 'cheer':
        return 'from-yellow-400 to-orange-400';
      case 'thinking':
        return 'from-blue-400 to-indigo-400';
      case 'proud':
        return 'from-red-400 to-pink-400';
      case 'curious':
        return 'from-purple-400 to-violet-400';
      case 'gentle':
        return 'from-green-400 to-emerald-400';
      default:
        return 'from-blue-600 to-blue-800';
    }
  };

  const getAnimationClass = () => {
    if (!showReaction) return 'animate-pulse'; // Idle breathing
    
    switch (currentMood) {
      case 'cheer':
        return 'animate-bounce';
      case 'thinking':
        return 'animate-pulse';
      case 'proud':
        return 'animate-ping';
      case 'curious':
        return 'animate-pulse';
      case 'gentle':
        return 'animate-pulse';
      default:
        return 'animate-pulse';
    }
  };

  return (
    <div className={`relative ${className}`}>
      {/* Main avatar */}
      <div 
        className={`
          w-32 h-32 rounded-full 
          bg-gradient-to-br ${getMoodColor()}
          flex items-center justify-center 
          text-white shadow-lg
          transition-all duration-300 ease-in-out
          ${getAnimationClass()}
        `}
        style={{
          transform: `scale(${0.9 + intensity * 0.1})`,
          animationDuration: currentMood === 'cheer' ? '0.5s' : '2s'
        }}
        aria-label={`Mentor looks ${currentMood}`}
      >
        <Bot size={48} className="relative z-10" />
        
        {/* Mood indicator overlay */}
        {showReaction && (
          <div className="absolute -top-2 -right-2 z-20">
            <div className="bg-white rounded-full p-1 shadow-md animate-scale-in">
              {getMoodIcon()}
            </div>
          </div>
        )}
      </div>
      
      {/* Confetti burst for celebration */}
      {currentMood === 'cheer' && showReaction && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-ping"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + (i % 2) * 20}%`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MascotAvatar;