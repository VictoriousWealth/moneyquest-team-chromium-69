
import React, { useState, useEffect, useRef } from 'react';
import { askMentor } from '../../../services/mentorService';
import { MentorCardRenderer } from '../../../components/student/MentorCards';
import type { CardPayload } from '../../../components/student/MentorCards';
import MentorWindow from '../../../components/student/MentorWindow';
import ReactMarkdown from 'react-markdown';
import { Button } from '../../../components/ui/Button';
import { Bot, Send, Info, ChevronDown, X } from 'lucide-react';

type Emotion = 'idle' | 'think' | 'celebrate' | 'encourage' | 'oops';
type Tone = 'Friendly' | 'Normal' | 'Formal';

interface ChatMessage {
    role: 'user' | 'mentor';
    content: string;
    card?: CardPayload;
}

const ContextDrawer: React.FC<{ isOpen: boolean; onClose: () => void; }> = ({ isOpen, onClose }) => {
    return (
        <>
            <div 
                className={`fixed inset-0 bg-bg/70 backdrop-blur-sm z-30 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
                aria-hidden="true"
            />
            <div 
                className={`fixed top-0 right-0 h-full w-full max-w-md bg-surface z-40 transform transition-transform duration-300 ease-in-out shadow-2xl rounded-l-lg
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}`
                }
                role="dialog"
                aria-modal="true"
                aria-labelledby="context-drawer-title"
            >
                <div className="p-6 flex flex-col h-full">
                    <header className="flex justify-between items-center mb-4">
                        <h2 id="context-drawer-title" className="h2">Episode Context</h2>
                        <Button onClick={onClose} variant="ghost" size="sm" className="!p-2">
                            <X size={20} />
                            <span className="sr-only">Close</span>
                        </Button>
                    </header>
                    <div className="flex-grow rounded-md bg-muted p-4">
                        <h3 className="font-semibold text-text mb-2">Current Episode: Saving for a Spaceship</h3>
                        <p className="small">You are trying to save $1000 for a new spaceship toy. You have a part-time job and must decide how much to save each week while covering your expenses.</p>
                    </div>
                </div>
            </div>
        </>
    );
};


const initialQuickPrompts = [
    'What did I learn this week?',
    'Give me a 3-question quiz',
    'Show my mistakes',
    'Set a savings plan',
    'Explain APR again',
];

const parseMentorResponse = (responseText: string) => {
    const separator = '\n---\n';
    const parts = responseText.split(separator);
    let text = responseText;
    let cardPayload = null;
    let uiPayload: { emotion?: Emotion, chips?: string[], intensity?: number } = {};

    if (parts.length > 1) {
        const potentialJson = parts.pop()!.trim();
        try {
            const parsed = JSON.parse(potentialJson);
            if (parsed.card || parsed.ui) {
                text = parts.join(separator).trim();
                cardPayload = parsed.card || null;
                uiPayload = parsed.ui || {};
            }
        } catch (e) {
            console.warn("Could not parse JSON payload from mentor response.", e);
        }
    }

    return { text, cardPayload, uiPayload };
}


const StudentMentor: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [emotion, setEmotion] = useState<Emotion>('idle');
  const [intensity, setIntensity] = useState<number>(0);
  const [tone, setTone] = useState<Tone>('Normal');
  const [isContextDrawerOpen, setIsContextDrawerOpen] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState(initialQuickPrompts);
  
  const emotionTimeoutRef = useRef<number | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory, isLoading]);

  // Get initial greeting from AI mentor
  useEffect(() => {
    const getInitialGreeting = async () => {
      if (chatHistory.length === 0) {  // Only get greeting if no history
        setIsLoading(true);
        setEmotion('think');
        
        try {
          const response = await askMentor('Hi!', 'Saving for a Spaceship', tone, []);
          const { text, cardPayload, uiPayload } = parseMentorResponse(response.answer);
          
          const mentorMessage: ChatMessage = { role: 'mentor', content: text, card: cardPayload };
          setChatHistory([mentorMessage]);
          
          if (uiPayload.chips) {
            setQuickPrompts(uiPayload.chips);
          }
        } catch (error) {
          console.error('Error getting initial greeting:', error);
          // Fallback greeting if backend fails
          setChatHistory([{ 
            role: 'mentor', 
            content: 'Hi! I\'m your AI mentor. How can I help you with your financial literacy journey today?' 
          }]);
        } finally {
          setIsLoading(false);
          setEmotion('idle');
        }
      }
    };
    
    getInitialGreeting();
  }, [tone, chatHistory.length]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (emotionTimeoutRef.current) {
        clearTimeout(emotionTimeoutRef.current);
      }
    };
  }, []);
  
  const handleSend = async (prompt?: string) => {
    const messageToSend = prompt || question;
    if (!messageToSend.trim()) return;

    const textarea = textareaRef.current;
    if (!prompt) {
      setQuestion('');
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height after sending
      }
    }
    
    setIsLoading(true);
    setEmotion('think');
    setIntensity(0);
    if (emotionTimeoutRef.current) clearTimeout(emotionTimeoutRef.current);
    
    const userMessage: ChatMessage = { role: 'user', content: messageToSend };
    setChatHistory(prev => [...prev, userMessage]);

    // Convert chat history to the format expected by the backend
    const conversationHistory = chatHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content
    }));

    const response = await askMentor(messageToSend, 'Saving for a Spaceship', tone, conversationHistory);
    
    const { text, cardPayload, uiPayload } = parseMentorResponse(response.answer);
    
    const mentorMessage: ChatMessage = { role: 'mentor', content: text, card: cardPayload };
    
    setChatHistory(prev => [...prev, mentorMessage]);
    setIsLoading(false);
    
    const newEmotion = uiPayload.emotion || response.emotion || 'celebrate';
    setEmotion(newEmotion);
    setIntensity(uiPayload.intensity || 0);

    if (uiPayload.chips) {
        setQuickPrompts(uiPayload.chips);
    }
    
    emotionTimeoutRef.current = window.setTimeout(() => {
      setEmotion('idle');
      setIntensity(0);
    }, 4000);
  };

  const autosize = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget;
    el.style.height = 'auto';
    const newHeight = Math.min(el.scrollHeight, 128); // Cap height at 128px
    el.style.height = newHeight + 'px';
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
        <MentorWindow emotion={emotion} intensity={intensity} isLoading={isLoading} />

        <section className="flex flex-col bg-surface rounded-lg shadow-soft ring-1 ring-[var(--ring)] overflow-hidden">
            <header className="p-4 border-b border-muted flex justify-between items-center flex-shrink-0">
                <h2 className="h2">AI Mentor</h2>
                <Button onClick={() => setIsContextDrawerOpen(true)} variant="ghost" size="sm" className="!p-2 flex items-center gap-1.5">
                    <Info size={16} />
                    <span className="text-xs font-semibold">Episode Context</span>
                </Button>
            </header>
            
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
                {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex flex-col items-start gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                        <div className={`flex items-start gap-3 w-full ${msg.role === 'user' ? 'justify-end' : ''}`}>
                            {msg.role === 'mentor' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white"><Bot size={16} /></div>}
                            {msg.content && (
                                <div className={`max-w-xl rounded-lg p-3 ${msg.role === 'user' ? 'bg-primary text-primary-ink' : 'bg-muted text-text'}`}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            )}
                        </div>
                        {msg.card && (
                            <div className="w-full max-w-xl ml-11">
                                <MentorCardRenderer card={msg.card} />
                            </div>
                        )}
                    </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-800 flex items-center justify-center text-white"><Bot size={16} /></div>
                        <div className="max-w-xl rounded-lg p-3 bg-muted text-text">
                            <span className="animate-pulse">...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-muted">
                <div className="flex flex-wrap gap-2 mb-3">
                    {quickPrompts.map((prompt) => (
                        <Button
                            key={prompt}
                            variant="outline"
                            size="sm"
                            className="!rounded-full flex-shrink-0 whitespace-nowrap !px-3"
                            onClick={() => handleSend(prompt)}
                            disabled={isLoading}
                        >
                            {prompt}
                        </Button>
                    ))}
                </div>
                <div className="flex items-end gap-2">
                    <div className="relative">
                        <select
                            value={tone}
                            onChange={(e) => setTone(e.target.value as Tone)}
                            disabled={isLoading}
                            className="h-12 appearance-none rounded-full bg-muted py-3 pl-4 pr-9 text-sm font-medium text-subtext focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Select mentor tone"
                        >
                            <option>Friendly</option>
                            <option>Normal</option>
                            <option>Formal</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-subtext pointer-events-none" />
                    </div>
                    <textarea
                        ref={textareaRef}
                        id="mq-input"
                        rows={1}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }}}
                        onInput={autosize}
                        placeholder="Ask the mentor a question…"
                        className="flex-1 resize-none rounded-xl border border-muted bg-muted px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <Button onClick={() => handleSend()} disabled={isLoading} className="!rounded-full h-12 w-12 flex-shrink-0" variant="accent">
                        <Send size={18} />
                    </Button>
                </div>
            </div>
        </section>
        <ContextDrawer isOpen={isContextDrawerOpen} onClose={() => setIsContextDrawerOpen(false)} />
    </div>
  );
};

export default StudentMentor;