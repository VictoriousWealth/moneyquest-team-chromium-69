import React from 'react';
import { Bot } from 'lucide-react';

const StudentMentor: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6 h-full">
      {/* Mentor Avatar/Animation Section */}
      <div className="flex flex-col bg-surface rounded-lg shadow-soft ring-1 ring-[var(--ring)] p-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full bg-blue-800 flex items-center justify-center text-white">
            <Bot size={48} />
          </div>
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
        
        <div className="flex-1 p-4 flex items-center justify-center">
          <div className="text-center">
            <Bot className="mx-auto mb-4 text-blue-500" size={64} />
            <h3 className="h3 mb-2">AI Mentor Coming Soon</h3>
            <p className="text-subtext">
              The AI mentor feature will be available once backend integration is complete.
              You'll be able to chat with your personalized financial mentor here!
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StudentMentor;