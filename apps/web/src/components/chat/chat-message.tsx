import { Avatar } from '@/components/ui';
import { formatRelativeTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

interface ChatMessageProps {
  message: Message;
  isOwn: boolean;
}

export function ChatMessage({ message, isOwn }: ChatMessageProps) {
  return (
    <div className={cn('flex gap-2 max-w-[80%]', isOwn && 'ml-auto flex-row-reverse')}>
      <Avatar
        src={message.sender?.avatar_url}
        name={message.sender?.full_name || 'User'}
        size="sm"
      />
      <div>
        <div
          className={cn(
            'rounded-2xl px-4 py-2.5 text-sm',
            isOwn
              ? 'bg-primary text-primary-foreground rounded-tr-sm'
              : 'bg-muted rounded-tl-sm'
          )}
        >
          {message.message_type === 'image' && message.file_url && (
            <img
              src={message.file_url}
              alt="Shared image"
              className="rounded-lg max-w-[250px] mb-1"
            />
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        <p
          className={cn(
            'text-[10px] text-muted-foreground mt-1',
            isOwn ? 'text-right' : 'text-left'
          )}
        >
          {formatRelativeTime(message.created_at)}
        </p>
      </div>
    </div>
  );
}
