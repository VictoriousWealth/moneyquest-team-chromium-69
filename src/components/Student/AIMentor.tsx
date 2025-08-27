import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Bot, User, Lightbulb, Target, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface MentorMessage {
  id: string;
  content: string;
  sender: 'user' | 'mentor';
  timestamp: Date;
  type?: 'text' | 'tip' | 'plan' | 'quiz';
}

export const AIMentor = () => {
  const [messages, setMessages] = useState<MentorMessage[]>([
    {
      id: '1',
      content: "Hi there! I'm your AI financial mentor. I'm here to help you learn about money management, investing, and building financial literacy. What would you like to explore today?",
      sender: 'mentor',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  
  const [inputValue, setInputValue] = useState("");

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: MentorMessage = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate mentor response
    setTimeout(() => {
      const mentorResponse: MentorMessage = {
        id: (Date.now() + 1).toString(),
        content: "That's a great question! Let me help you understand that concept better. Financial literacy is all about making informed decisions with your money.",
        sender: 'mentor',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, mentorResponse]);
    }, 1000);
  };

  const quickActions = [
    { icon: Lightbulb, label: "Money Tips", action: "Give me a money saving tip" },
    { icon: Target, label: "Set Goals", action: "Help me set financial goals" },
    { icon: BookOpen, label: "Learn Basics", action: "Teach me about budgeting" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">AI Financial Mentor</h1>
        <p className="text-muted-foreground">
          Get personalized guidance on your financial literacy journey
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start h-auto p-3"
                    onClick={() => setInputValue(action.action)}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    <span className="text-sm">{action.label}</span>
                  </Button>
                );
              })}
            </CardContent>
          </Card>

          <Card className="gradient-primary text-white">
            <CardContent className="p-4">
              <Bot className="h-8 w-8 mb-2" />
              <h3 className="font-semibold mb-1">AI Mentor</h3>
              <p className="text-xs text-white/80">
                Available 24/7 to help with your financial questions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Chat Interface */}
        <Card className="lg:col-span-3">
          <CardContent className="p-0">
            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.sender === 'mentor' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="gradient-primary text-white">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div className={`max-w-xs lg:max-w-md ${
                    message.sender === 'user' ? 'order-first' : ''
                  }`}>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'gradient-primary text-white'
                        : 'bg-muted'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      {message.type === 'tip' && (
                        <Badge variant="secondary" className="mt-2">
                          <Lightbulb className="h-3 w-3 mr-1" />
                          Tip
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>

                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="border-t p-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask your financial mentor anything..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  variant="hero"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};