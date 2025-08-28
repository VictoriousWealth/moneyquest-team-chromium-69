import React from 'react';
import Badge from '@/components/ui/Badge';

interface QuickActionChipsProps {
  chips: string[];
  onChipClick: (chip: string) => void;
  className?: string;
}

const QuickActionChips: React.FC<QuickActionChipsProps> = ({
  chips,
  onChipClick,
  className = ''
}) => {
  const defaultChips = [
    "Give me a 3-question quiz",
    "Set a 1-week savings plan", 
    "What did I learn this week?"
  ];

  const displayChips = chips.length > 0 ? chips.slice(0, 3) : defaultChips;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {displayChips.map((chip, index) => (
        <button
          key={index}
          className="
            cursor-pointer bg-blue-50 text-blue-700 hover:bg-blue-100 
            border border-blue-200 hover:border-blue-300
            transition-colors duration-200 px-3 py-1 rounded-full text-xs font-medium
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          "
          onClick={() => onChipClick(chip)}
          aria-label={`Quick action: ${chip}`}
        >
          {chip}
        </button>
      ))}
    </div>
  );
};

export default QuickActionChips;