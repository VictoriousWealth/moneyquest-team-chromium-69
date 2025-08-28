import React from 'react';

const SpeechBubble: React.FC<{ className?: string; children?: React.ReactNode; questId?: string; isHover?: boolean }> = ({ className = '', children }) => {
  return <div className={className}>{children}</div>;
};

export default SpeechBubble;
