'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '@/components/ui';

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message.trim());
    setMessage('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t p-3">
      <div className="flex items-end gap-2">
        <button
          type="button"
          className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
          disabled={disabled}
        >
          <Paperclip className="h-5 w-5" />
        </button>
        <textarea
          ref={inputRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          disabled={disabled}
          rows={1}
          className="flex-1 resize-none rounded-lg border border-input bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring max-h-32"
        />
        <Button
          type="button"
          size="icon"
          onClick={handleSend}
          disabled={disabled || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
