import React from 'react';

export interface Background {
  id: string;
  image: string;
  alt: string;
}

interface BackgroundDisplayProps {
  background: Background;
  overlay?: boolean;
  overlayOpacity?: number;
}

export const BackgroundDisplay: React.FC<BackgroundDisplayProps> = ({
  background,
  overlay = true,
  overlayOpacity = 0.3
}) => {
  return (
    <div className="fixed inset-0 z-0">
      <img
        src={background.image}
        alt={background.alt}
        className="w-full h-full object-cover"
      />
      {overlay && (
        <div 
          className="absolute inset-0 bg-background/30"
          style={{ backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})` }}
        />
      )}
    </div>
  );
};