'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, Leaf, X } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AgroAdvisorProps {
  cropName?: string;
  sectorName?: string;
  /** If true shows as floating bubble button */
  floating?: boolean;
}

const QUICK_QUESTIONS = [
  'What diseases affect this crop?',
  'Best fungicides and dosage?',
  'Which countries produce the best seeds?',
  'When is the best time to plant?',
  'How do I prevent pests naturally?',
  'What fertilizers are recommended?',
];

export function AgroAdvisor({ cropName, sectorName, floating = false }: AgroAdvisorProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: cropName
        ? `👋 Hello! I'm your Agro Hub AI Advisor. I specialise in **${cropName}** and all things ${sectorName || 'agriculture'}.\n\nI can help you with:\n• 🌱 Best seed varieties by country\n• 💊 Disease treatment & medicines (fungicides, pesticides, herbicides)\n• 🌍 Where to source inputs globally\n• 🌾 Farming advice & expert tips\n• 💰 Pricing guidance & market insights\n\nWhat would you like to know about ${cropName}?`
        : `👋 Hello! I'm your Agro Hub AI Advisor — your personal agricultural expert.\n\nI can help with any farming question:\n• Crop diseases and treatment\n• Seed varieties and sourcing\n• Livestock health and breeding\n• Fisheries and aquaculture\n• Market prices and export tips\n\nWhat agricultural challenge can I help you solve today?`,
    },
  ]);
  const [input, setInput]       = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen]     = useState(!floating);
  const bottomRef               = useRef<HTMLDivElement>(null);
  const inputRef                = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || isLoading) return;

    setInput('');
    const newMessages: Message[] = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          cropName,
          sectorName,
        }),
      });

      if (!res.ok) throw new Error('Failed to get response');
      const data = await res.json();

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: '⚠️ Sorry, I had trouble connecting. Please try again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  // Floating button version
  if (floating) {
    return (
      <>
        {/* Floating toggle button */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
            title="Ask AI Agro Advisor"
          >
            <span className="text-2xl">🤖</span>
          </button>
        )}

        {/* Chat window */}
        {isOpen && (
          <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] h-[600px] max-h-[80vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            <ChatHeader onClose={() => setIsOpen(false)} cropName={cropName} />
            <ChatBody
              messages={messages}
              isLoading={isLoading}
              bottomRef={bottomRef}
              quickQuestions={!cropName ? QUICK_QUESTIONS : QUICK_QUESTIONS}
              onQuick={send}
            />
            <ChatInput input={input} setInput={setInput} onSend={() => send()} onKey={handleKey} inputRef={inputRef} isLoading={isLoading} />
          </div>
        )}
      </>
    );
  }

  // Inline version (used inside crop pages)
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-lg">
      <ChatHeader cropName={cropName} />
      <div className="h-80">
        <ChatBody
          messages={messages}
          isLoading={isLoading}
          bottomRef={bottomRef}
          quickQuestions={QUICK_QUESTIONS}
          onQuick={send}
        />
      </div>
      <ChatInput input={input} setInput={setInput} onSend={() => send()} onKey={handleKey} inputRef={inputRef} isLoading={isLoading} />
    </div>
  );
}

function ChatHeader({ onClose, cropName }: { onClose?: () => void; cropName?: string }) {
  return (
    <div className="bg-green-700 px-5 py-4 flex items-center justify-between flex-shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">🤖</div>
        <div>
          <p className="font-bold text-white text-sm">Agro Hub AI Advisor</p>
          <p className="text-green-200 text-xs">
            {cropName ? `Expert on ${cropName}` : 'Agricultural Expert'} • Powered by Claude AI
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
        <span className="text-green-200 text-xs">Online</span>
        {onClose && (
          <button type="button" onClick={onClose} className="ml-2 text-white/70 hover:text-white transition-colors">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
}

function ChatBody({
  messages, isLoading, bottomRef, quickQuestions, onQuick,
}: {
  messages: Message[];
  isLoading: boolean;
  bottomRef: React.RefObject<HTMLDivElement>;
  quickQuestions: string[];
  onQuick: (q: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-950 h-full">
      {messages.map((msg, i) => (
        <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm ${
            msg.role === 'assistant' ? 'bg-green-600 text-white' : 'bg-gray-200 dark:bg-gray-700'
          }`}>
            {msg.role === 'assistant' ? '🤖' : <User className="h-4 w-4" />}
          </div>
          <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
            msg.role === 'assistant'
              ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm rounded-tl-sm'
              : 'bg-green-600 text-white rounded-tr-sm'
          }`}>
            {msg.content}
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">🤖</div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
            <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Quick questions (show after first message) */}
      {messages.length <= 1 && (
        <div className="space-y-2">
          <p className="text-xs text-gray-400 font-medium">Quick questions:</p>
          {quickQuestions.map(q => (
            <button
              key={q}
              type="button"
              onClick={() => onQuick(q)}
              className="block w-full text-left text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl hover:border-green-400 hover:text-green-600 transition-colors"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

function ChatInput({
  input, setInput, onSend, onKey, inputRef, isLoading,
}: {
  input: string;
  setInput: (v: string) => void;
  onSend: () => void;
  onKey: (e: React.KeyboardEvent) => void;
  inputRef: React.RefObject<HTMLTextAreaElement>;
  isLoading: boolean;
}) {
  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900 flex-shrink-0">
      <div className="flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={onKey}
          placeholder="Ask anything about farming, diseases, seeds, medicines..."
          rows={1}
          disabled={isLoading}
          className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2.5 text-sm outline-none focus:border-green-400 focus:ring-2 focus:ring-green-100 dark:focus:ring-green-900 max-h-32 disabled:opacity-50"
        />
        <button
          type="button"
          onClick={onSend}
          disabled={!input.trim() || isLoading}
          className="w-10 h-10 rounded-xl bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white flex items-center justify-center transition-all flex-shrink-0"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </button>
      </div>
      <p className="text-center text-xs text-gray-400 mt-2">Powered by Claude AI · Press Enter to send</p>
    </div>
  );
}
