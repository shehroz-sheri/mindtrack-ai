'use client';

import { useState, useEffect, useRef } from 'react';
import { JournalEntry } from '@/lib/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface SupportiveChatProps {
  entries: JournalEntry[];
}

export default function SupportiveChat({ entries }: SupportiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemContext, setSystemContext] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Build system context from entries
    const buildSystemContext = () => {
      if (entries.length === 0) {
        return 'User has no journal entries yet.';
      }

      // Calculate average mood in last 14 days
      const last14Days = new Date();
      last14Days.setDate(last14Days.getDate() - 14);
      
      const recentEntries = entries.filter(entry => {
        const entryDate = entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
        return entryDate >= last14Days;
      });

      const entriesWithMood = recentEntries.filter(entry => entry.mood);
      const averageMood = entriesWithMood.length > 0 
        ? (entriesWithMood.reduce((sum, entry) => sum + (entry.mood || 0), 0) / entriesWithMood.length).toFixed(1)
        : 'No mood data';

      // Get 3-5 most recent entries
      const recentSnippets = entries.slice(0, 5).map(entry => {
        const date = entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
        const snippet = entry.text.length > 100 ? entry.text.substring(0, 100) + '...' : entry.text;
        const moodText = entry.mood ? ` (Mood: ${entry.mood}/5)` : '';
        return `${date.toLocaleDateString()}: ${snippet}${moodText}`;
      });

      // Check for today's entry
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayEntry = entries.find(entry => {
        const entryDate = entry.timestamp.toDate ? entry.timestamp.toDate() : new Date(entry.timestamp);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === today.getTime();
      });

      let context = `User Context Summary:
- Average mood (last 14 days): ${averageMood}
- Recent entries (${recentSnippets.length}):
${recentSnippets.map(snippet => `  • ${snippet}`).join('\n')}`;

      if (todayEntry) {
        const todayMood = todayEntry.mood ? ` (Mood: ${todayEntry.mood}/5)` : '';
        context += `\n- Today's entry${todayMood}: ${todayEntry.text}`;
      }

      return context;
    };

    const context = buildSystemContext();
    setSystemContext(context);

    // Add welcome message
    if (messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Hello! I'm here to provide supportive conversation based on your journal entries. How are you feeling today, and what would you like to talk about?",
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [entries]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          systemContext,
          chatHistory: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const { reply } = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: reply,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-lg">
          <MessageCircle className="w-5 h-5 mr-2" />
          Supportive Chat
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 space-y-4 max-h-96">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-3 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                <p className="leading-relaxed">{message.content}</p>
                <div className={`text-xs mt-1 ${
                  message.role === 'user' ? 'text-gray-300' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 text-gray-900 p-3 rounded-lg text-sm">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent"
              rows={2}
              disabled={isLoading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="sm"
              className="self-end"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            This is a supportive AI assistant. For crisis support, call 988.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}