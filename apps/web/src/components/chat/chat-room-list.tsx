'use client';

import { Avatar, Badge } from '@/components/ui';
import { formatRelativeTime, truncate } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { cn } from '@/lib/utils';
import type { ChatRoom } from '@/types';

interface ChatRoomListProps {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  onSelect: (roomId: string) => void;
}

export function ChatRoomList({ rooms, activeRoomId, onSelect }: ChatRoomListProps) {
  const { user } = useAuthStore();

  return (
    <div className="divide-y">
      {rooms.length === 0 && (
        <div className="p-8 text-center text-muted-foreground">
          <p className="text-3xl mb-2">💬</p>
          <p className="text-sm">No conversations yet</p>
        </div>
      )}
      {rooms.map((room) => {
        const otherUser = user?.id === room.buyer_id ? room.supplier : room.buyer;
        const isActive = room.id === activeRoomId;

        return (
          <button
            key={room.id}
            type="button"
            onClick={() => onSelect(room.id)}
            className={cn(
              'w-full flex items-center gap-3 p-3 text-left transition-colors hover:bg-muted/50',
              isActive && 'bg-primary/5 border-l-2 border-primary'
            )}
          >
            <Avatar
              src={otherUser?.avatar_url}
              name={otherUser?.full_name || 'User'}
              size="md"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm truncate">
                  {otherUser?.business_name || otherUser?.full_name || 'User'}
                </span>
                {room.last_message_at && (
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatRelativeTime(room.last_message_at)}
                  </span>
                )}
              </div>
              {room.last_message && (
                <p className="text-xs text-muted-foreground truncate">
                  {truncate(room.last_message, 50)}
                </p>
              )}
            </div>
            {room.unread_count && room.unread_count > 0 && (
              <Badge variant="secondary" className="flex-shrink-0">
                {room.unread_count}
              </Badge>
            )}
          </button>
        );
      })}
    </div>
  );
}
