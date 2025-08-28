import React from 'react';

const SpeechBubble: React.FC<{ className?: string; children?: React.ReactNode }> = ({ className = '', children }) => {
  return <div className={className}>{children}</div>;
};

export default SpeechBubble;
