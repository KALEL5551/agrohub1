'use client';

import { useEffect, useRef } from 'react';
import { useChatMessages } from '@/hooks/use-chat';
import { useAuthStore } from '@/store/auth-store';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { Spinner } from '@/components/ui';
import { toast } from 'sonner';

interface ChatWindowProps {
  roomId: string | null;
}

export function ChatWindow({ roomId }: ChatWindowProps) {
  const { messages, isLoading, sendMessage } = useChatMessages(roomId);
  const { user } = useAuthStore();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!roomId) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <p className="text-5xl mb-4">💬</p>
          <p className="font-semibold">Select a conversation</p>
          <p className="text-sm">Choose from your existing chats or start a new one</p>
        </div>
      </div>
    );
  }

  const handleSend = async (content: string) => {
    try {
      await sendMessage(content);
    } catch {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
        {isLoading ? (
          <Spinner className="py-20" />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatMessage
                key={msg.id}
                message={msg}
                isOwn={msg.sender_id === user?.id}
              />
            ))}
            <div ref={scrollRef} />
          </>
        )}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
}
