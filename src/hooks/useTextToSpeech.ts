import { useState } from 'react';

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading] = useState(false);

  const speak = async (_text: string) => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 300);
  };

  const stop = () => setIsPlaying(false);

  return { speak, stop, isPlaying, isLoading };
};
