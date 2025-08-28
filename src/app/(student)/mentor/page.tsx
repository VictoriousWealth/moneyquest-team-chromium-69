import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import MascotAvatar from '@/components/mentor/MascotAvatar';
import ChatMessage from '@/components/mentor/ChatMessage';
import QuickActionChips from '@/components/mentor/QuickActionChips';
import { useMentorState } from '@/hooks/useMentorState';
import { Message, MoodType } from '@/types/mentor';

const StudentMentor: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mascotMood, setMascotMood] = useState<MoodType>('idle');
  const [quickChips, setQuickChips] = useState<string[]>([]);
  const mentorState = useMentorState();
  const [shownCardIds, setShownCardIds] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Send initial greeting
    handleInitialGreeting();
  }, []);

  const handleInitialGreeting = async () => {
    try {
      setIsLoading(true);
      setMascotMood('thinking');
      
      const { data, error } = await supabase.functions.invoke('mentor-chat', {
        body: { 
          message: "Hi! I'm ready to learn about money and finance. Can you introduce yourself and tell me how you can help?",
          conversationHistory: [],
          acceptProposalId: null
        }
      });

      if (error) throw error;

      const mentorResponse = data;
      setMascotMood(mentorResponse.mood || 'gentle');
      setQuickChips(mentorResponse.chips || []);
      
      // Handle proposal if present
      if (mentorResponse.proposal) {
        mentorState.setPendingProposal(mentorResponse.proposal);
      }

      setMessages([{
        role: 'assistant',
        content: mentorResponse.text || "Hi! I'm your AI financial mentor. I'm here to help you learn about money through fun quizzes, savings plans, and personalized advice!",
        cards: [],
        proposal: mentorResponse.proposal,
        mode: mentorResponse.mode,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error getting initial greeting:', error);
      toast({
        title: "Connection Error",
        description: "Having trouble connecting to your mentor. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (messageText: string, acceptProposalId?: string) => {
    if (!messageText.trim() || isLoading) return;

    // Log consent for observability
    if (acceptProposalId) {
      console.log('User accepted proposal:', acceptProposalId, new Date().toISOString());
    }

    const userMessage: Message = {
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setMascotMood('thinking');

    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const { data, error } = await supabase.functions.invoke('mentor-chat', {
        body: { 
          message: messageText.trim(),
          conversationHistory,
          acceptProposalId
        }
      });

      if (error) throw error;

      const mentorResponse = data;
      setMascotMood(mentorResponse.mood || 'gentle');
      setQuickChips(mentorResponse.chips || []);
      
      // Handle state changes based on response
      if (mentorResponse.proposal) {
        mentorState.setPendingProposal(mentorResponse.proposal);
      } else if (acceptProposalId) {
        // If we accepted a proposal, we're now in an activity
        const accepted = mentorState.acceptProposal();
        if (accepted) {
          console.log('Started activity:', accepted.type, accepted.id);
        }
      }

      // Consent-gated + de-duplicated cards
      const incomingCards = (mentorResponse.mode === 'final' && acceptProposalId)
        ? (mentorResponse.cards || [])
        : [];
      const filteredCards = incomingCards.filter((c: any) => c?.id && !shownCardIds.has(c.id));
      if (incomingCards.length > 0 && filteredCards.length === 0) {
        console.log('Suppressing duplicate cards; already shown:', incomingCards.map((c: any) => c.id));
      }

      const assistantMessage: Message = {
        role: 'assistant',
        content: mentorResponse.text || '',
        cards: filteredCards,
        proposal: mentorResponse.proposal,
        mode: mentorResponse.mode,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (filteredCards.length > 0) {
        setShownCardIds(prev => new Set([...prev, ...filteredCards.map((c: any) => c.id)]));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Message Failed",
        description: "Couldn't send your message. Please try again.",
      });
      setMascotMood('gentle');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleChipClick = (chipText: string) => {
    // Check if this is a confirmation chip for a pending proposal
    if (mentorState.state.pendingProposal && chipText === mentorState.state.pendingProposal.confirmChip) {
      sendMessage(chipText, mentorState.state.pendingProposal.id);
    } else if (chipText.toLowerCase().includes('no thanks') || chipText.toLowerCase().includes('not now')) {
      // Handle rejection
      mentorState.rejectProposal();
      sendMessage(chipText);
    } else {
      // Regular chip click
      sendMessage(chipText);
    }
  };

  const handleCardAction = (action: string, cardId: string, data?: any) => {
    console.log('Card action:', action, cardId, data);
    
    switch (action) {
      case 'export_pdf':
        toast({
          title: "Downloaded!",
          description: "Your plan has been saved as a PDF file.",
        });
        break;
      case 'quiz_answer':
        if (data?.isCorrect) {
          toast({
            title: "Correct! 🎉",
            description: "Great job! You're learning fast.",
          });
        }
        break;
      case 'try_again':
        sendMessage("Give me another practice question");
        break;
      case 'activity_complete':
        // Reset to idle state after activity completion
        mentorState.completeActivity();
        console.log('Activity completed, returned to idle state');
        break;
      default:
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
      {/* Mentor Avatar/Animation Section */}
      <div className="flex flex-col bg-surface rounded-lg shadow-soft ring-1 ring-[var(--ring)] p-6">
        <div className="flex-1 flex items-center justify-center">
          <MascotAvatar mood={mascotMood} intensity={1} />
        </div>
        <div className="text-center mt-4">
          <h3 className="h3 mb-2">AI Mentor</h3>
          <p className="text-subtext text-sm">Ready to help you learn!</p>
        </div>
      </div>

      {/* Chat Section */}
      <section className="flex flex-col bg-surface rounded-lg shadow-soft ring-1 ring-[var(--ring)] overflow-hidden">
        <header className="p-4 border-b border-muted flex-shrink-0">
          <h2 className="h2">AI Mentor Chat</h2>
        </header>
        
        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              role={message.role}
              content={message.content}
              cards={message.cards}
              proposal={message.proposal}
              mode={message.mode}
              timestamp={message.timestamp}
              onCardAction={handleCardAction}
              onMascotMood={(mood) => setMascotMood(mood as MoodType)}
              mentorState={mentorState.state}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl rounded-bl-md px-4 py-3">
                <Loader2 className="animate-spin" size={16} />
                <span className="text-sm text-gray-600">Thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Action Chips */}
        {quickChips.length > 0 && !isLoading && (
          <div className="px-4 py-2 border-t border-muted">
            <QuickActionChips 
              chips={quickChips} 
              onChipClick={handleChipClick}
              pendingProposal={mentorState.state.pendingProposal}
            />
          </div>
        )}

        {/* Input Section */}
        <div className="p-4 border-t border-muted flex-shrink-0">
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={inputValue}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about money and finance..."
                className="
                  w-full resize-none rounded-lg border border-muted
                  px-3 py-2 text-sm bg-background
                  focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent
                  placeholder:text-muted-foreground
                  min-h-[40px] max-h-[120px]
                "
                rows={1}
                disabled={isLoading}
              />
            </div>
            <Button
              onClick={() => sendMessage(inputValue)}
              disabled={!inputValue.trim() || isLoading}
              size="sm"
              className="shrink-0"
            >
              <Send size={16} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentMentor;