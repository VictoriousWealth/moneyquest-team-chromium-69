import React from 'react';
import { User, Bot } from 'lucide-react';
import InteractiveCard from './InteractiveCard';
import { Card, MentorProposal, MentorState } from '@/types/mentor';

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  cards?: Card[];
  proposal?: MentorProposal;
  mode?: 'dialog' | 'proposal' | 'final';
  timestamp?: Date;
  onCardAction?: (action: string, cardId: string, data?: any) => void;
  onMascotMood?: (mood: string) => void;
  mentorState?: MentorState;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  cards = [],
  proposal,
  mode,
  timestamp,
  onCardAction,
  onMascotMood,
  mentorState
}) => {
  const isUser = role === 'user';

  // Only show cards if mode is 'final' - implements consent gating
  const shouldShowCards = mode === 'final' && cards && cards.length > 0;

  return (
    <div className={`flex gap-3 mb-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`
        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
        ${isUser ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
      `}>
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      {/* Message content */}
      <div className={`flex-1 max-w-[80%] ${isUser ? 'text-right' : 'text-left'}`}>
        {/* Text bubble */}
        {content && (
          <div className={`
            inline-block p-2.5 rounded-2xl max-w-full
            ${isUser 
              ? 'bg-blue-500 text-white rounded-br-md' 
              : 'bg-gray-100 text-gray-800 rounded-bl-md'
            }
          `}>
            <p className="text-xs whitespace-pre-wrap">{content}</p>
          </div>
        )}

        {/* Proposal information (if present) */}
        {proposal && mode === 'proposal' && !isUser && (
          <div className="mt-2 p-2.5 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-blue-800 text-xs font-medium">{proposal.description}</p>
            <p className="text-blue-600 text-xs mt-1">
              {proposal.topic && `Topic: ${proposal.topic}`}
              {proposal.size && ` • ${proposal.size} questions`}
            </p>
          </div>
        )}

        {/* Interactive cards - only shown when mode is 'final' */}
        {shouldShowCards && (
          <div className={`mt-3 space-y-3 ${isUser ? 'flex justify-end' : ''}`}>
            <div className={isUser ? 'max-w-sm' : 'max-w-full'}>
              {cards.map((card, index) => (
                <div key={card.id || index} className="mb-3 last:mb-0">
                  <InteractiveCard
                    card={card}
                    onAction={onCardAction}
                    onMascotMood={onMascotMood}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Timestamp */}
        {timestamp && (
          <div className={`mt-1 text-xs text-gray-500 ${isUser ? 'text-right' : 'text-left'}`}>
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;