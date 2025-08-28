import React from 'react';
import { MentorProposal } from '@/types/mentor';

interface QuickActionChipsProps {
  chips: string[];
  onChipClick: (chip: string) => void;
  pendingProposal?: MentorProposal;
  className?: string;
}

const QuickActionChips: React.FC<QuickActionChipsProps> = ({
  chips,
  onChipClick,
  pendingProposal,
  className = ''
}) => {
  const defaultChips = [
    "Give me a 3-question quiz",
    "Set a 1-week savings plan", 
    "What did I learn this week?"
  ];

  const displayChips = chips.length > 0 ? chips.slice(0, 3) : defaultChips;

  // Determine if a chip is a confirmation chip
  const isConfirmChip = (chip: string) => {
    return pendingProposal?.confirmChip === chip;
  };

  // Determine if a chip is a rejection chip
  const isRejectChip = (chip: string) => {
    return chip.toLowerCase().includes('no thanks') || 
           chip.toLowerCase().includes('not now') ||
           chip.toLowerCase().includes('maybe later');
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayChips.map((chip, index) => {
        const isConfirm = isConfirmChip(chip);
        const isReject = isRejectChip(chip);
        
        let chipStyles = "cursor-pointer transition-colors duration-200 px-3 py-1 rounded-full text-xs font-medium focus:outline-none focus:ring-2 focus:ring-offset-1";
        
        if (isConfirm) {
          // Confirm chip - prominent styling
          chipStyles += " bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500";
        } else if (isReject) {
          // Reject chip - subtle styling
          chipStyles += " bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-400";
        } else {
          // Regular chip - default styling
          chipStyles += " bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 hover:border-blue-300 focus:ring-blue-500";
        }
        
        return (
          <button
            key={index}
            className={chipStyles}
            onClick={() => onChipClick(chip)}
            aria-label={`Quick action: ${chip}`}
          >
            {chip}
          </button>
        );
      })}
    </div>
  );
};

export default QuickActionChips;