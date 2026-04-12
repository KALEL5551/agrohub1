'use client';

import { useState } from 'react';
import { useChatRooms } from '@/hooks/use-chat';
import { ChatRoomList } from '@/components/chat/chat-room-list';
import { ChatWindow } from '@/components/chat/chat-window';
import { Card, Spinner } from '@/components/ui';

export default function ChatPage() {
  const { rooms, isLoading } = useChatRooms();
  const [activeRoom, setActiveRoom] = useState<string | null>(null);

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold mb-6">Messages</h1>

      <Card className="flex h-[calc(100vh-12rem)] overflow-hidden">
        <div className="w-80 border-r overflow-y-auto">
          {isLoading ? (
            <Spinner className="py-10" />
          ) : (
            <ChatRoomList rooms={rooms} activeRoomId={activeRoom} onSelect={setActiveRoom} />
          )}
        </div>

        <ChatWindow roomId={activeRoom} />
      </Card>
    </div>
  );
}
