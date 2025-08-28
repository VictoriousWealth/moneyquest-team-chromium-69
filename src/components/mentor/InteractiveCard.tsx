import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import BadgeComponent from '@/components/ui/Badge';
import { Check, X, Download, MoreVertical } from 'lucide-react';
import { generatePDF } from '@/utils/pdfGenerator';

// Alias to avoid any potential naming conflicts
const Badge = BadgeComponent;

interface QuizCard {
  type: 'quiz';
  id: string;
  title: string;
  question: string;
  options: Array<{ id: string; text: string }>;
  correctOptionId: string;
  explanation: string;
  optionHints?: Record<string, string>;
}

interface PlanCard {
  type: 'plan';
  id: string;
  title: string;
  steps: string[];
  summary?: string;
  actions: string[];
}

interface RecapCard {
  type: 'recap';
  id: string;
  bullets: string[];
  suggestedNext?: string;
}

interface FixCard {
  type: 'fix';
  id: string;
  title: string;
  mistake: string;
  correctRule: string;
  oneExample: string;
  cta: string;
}

type CardData = QuizCard | PlanCard | RecapCard | FixCard;

interface InteractiveCardProps {
  card: CardData;
  onAction?: (action: string, cardId: string, data?: any) => void;
  onMascotMood?: (mood: string) => void;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({ 
  card, 
  onAction,
  onMascotMood 
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  const handleQuizAnswer = (optionId: string) => {
    if (showResult) return;
    
    setSelectedOption(optionId);
    setShowResult(true);
    
    if (card.type === 'quiz') {
      const isCorrect = optionId === card.correctOptionId;
      onMascotMood?.(isCorrect ? 'cheer' : 'gentle');
      onAction?.('quiz_answer', card.id, { optionId, isCorrect });
    }
  };

  const handleExportPDF = () => {
    try {
      generatePDF(card);
      onAction?.('export_pdf', card.id, card);
      onMascotMood?.('proud');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  if (card.type === 'quiz') {
    return (
      <Card className="bg-white border-l-2 border-l-blue-500 shadow-sm">
        <div className="p-2 pb-1.5 border-b border-gray-100">
          <h3 className="text-xs font-semibold text-gray-800">
            {card.title}
          </h3>
        </div>
        <div className="p-2 space-y-2">
          <p className="text-xs text-gray-700 font-medium">{card.question}</p>
          
          <div className="space-y-1">
            {card.options.map((option) => {
              const isSelected = selectedOption === option.id;
              const isCorrect = card.correctOptionId === option.id;
              const isWrong = showResult && isSelected && !isCorrect;
              
              return (
                <button
                  key={option.id}
                  onClick={() => handleQuizAnswer(option.id)}
                  disabled={showResult}
                  className={`
                    w-full p-2 text-left rounded-md border transition-all text-xs
                    ${!showResult ? 'hover:border-blue-300 hover:bg-blue-50' : ''}
                    ${isSelected && !showResult ? 'border-blue-500 bg-blue-50' : ''}
                    ${showResult && isCorrect ? 'border-green-500 bg-green-50' : ''}
                    ${isWrong ? 'border-red-500 bg-red-50' : ''}
                    ${showResult ? 'cursor-default' : 'cursor-pointer'}
                  `}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-800 text-xs">{option.text}</span>
                    {showResult && (
                      <div className="flex items-center gap-1">
                        {isCorrect && <Check className="text-green-600" size={14} />}
                        {isWrong && <X className="text-red-600" size={14} />}
                      </div>
                    )}
                  </div>
                  
                  {showResult && isWrong && card.optionHints?.[option.id] && (
                    <p className="mt-1 text-xs text-red-700">
                      {card.optionHints[option.id]}
                    </p>
                  )}
                </button>
              );
            })}
          </div>
          
          {showResult && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md">
              <p className="text-blue-800 font-medium text-xs">Explanation:</p>
              <p className="text-blue-700 mt-0.5 text-xs">{card.explanation}</p>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (card.type === 'plan') {
    return (
      <Card className="bg-white border-l-2 border-l-green-500 shadow-sm">
        <div className="p-2 pb-1.5 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-800">
              {card.title}
            </h3>
            <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
              <MoreVertical size={12} />
            </Button>
          </div>
        </div>
        <div className="p-2 space-y-2">
          <div className="space-y-1">
            {card.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="flex-shrink-0 w-4 h-4 bg-green-100 text-green-700 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </div>
                <p className="text-gray-700 text-xs">{step}</p>
              </div>
            ))}
          </div>
          
          {card.summary && (
            <div className="p-2 bg-green-50 rounded-md">
              <p className="text-green-800 text-xs">{card.summary}</p>
            </div>
          )}
          
          <div className="flex gap-1.5 pt-1">
            {card.actions.includes('export_pdf') && (
              <Button onClick={handleExportPDF} size="sm" variant="outline" className="h-6 text-xs px-2">
                <Download size={12} className="mr-1" />
                PDF
              </Button>
            )}
          </div>
        </div>
      </Card>
    );
  }

  if (card.type === 'recap') {
    return (
      <Card className="bg-white border-l-4 border-l-purple-500 shadow-sm">
        <div className="pt-6 p-4 space-y-4">
          <div className="space-y-2">
            {card.bullets.map((bullet, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">{bullet}</p>
              </div>
            ))}
          </div>
          
          {card.suggestedNext && (
            <div className="pt-2">
              <Badge variant="muted" className="bg-purple-50 text-purple-700">
                Next: {card.suggestedNext}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    );
  }

  if (card.type === 'fix') {
    return (
      <Card className="bg-white border-l-4 border-l-orange-500 shadow-sm">
        <div className="p-4 pb-3 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">
            {card.title}
          </h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium text-red-700 mb-1">What went wrong:</p>
              <p className="text-gray-700">{card.mistake}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-green-700 mb-1">The right way:</p>
              <p className="text-gray-700">{card.correctRule}</p>
            </div>
            
            <div>
              <p className="text-sm font-medium text-blue-700 mb-1">Example:</p>
              <p className="text-gray-700">{card.oneExample}</p>
            </div>
          </div>
          
          <Button 
            onClick={() => onAction?.('try_again', card.id)} 
            size="sm" 
            className="w-full mt-4"
          >
            {card.cta}
          </Button>
        </div>
      </Card>
    );
  }

  return null;
};

export default InteractiveCard;