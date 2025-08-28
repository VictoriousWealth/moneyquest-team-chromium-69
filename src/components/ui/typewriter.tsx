import React, { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number; // ms per char
  className?: string;
  onComplete?: () => void;
}

export const Typewriter: React.FC<TypewriterProps> = ({ text, speed = 30, className = '', onComplete }) => {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    setDisplayed('');
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, Math.max(1, speed));
    return () => clearInterval(interval);
  }, [text, speed, onComplete]);

  return <span className={className}>{displayed}</span>;
};
