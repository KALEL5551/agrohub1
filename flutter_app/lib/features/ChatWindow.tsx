'use client';
// ============================================================
// AgriTrade Africa — ChatWindow Component
// apps/web/src/components/chat/ChatWindow.tsx
//
// WhatsApp-style real-time chat with:
//   - Real-time messages via Supabase Realtime
//   - Offer messages (product deal proposals)
//   - Optimistic UI updates
//   - Typing indicator
//   - Read receipts
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { useChatMessages } from '../../hooks/useChat';
import type { ChatRoom, Message, Profile } from '@agritrade/shared/types';

interface ChatWindowProps {
  room: ChatRoom;
  currentUserId: string;
  otherUser: Profile;
}

export function ChatWindow({ room, currentUserId, otherUser }: ChatWindowProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, loading, sending, sendMessage } = useChatMessages(room.id);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const content = input.trim();
    if (!content || sending) return;
    setInput('');
    await sendMessage(content);
    inputRef.current?.focus();
  }, [input, sending, sendMessage]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
        <div className="relative">
          {otherUser.avatar_url ? (
            <Image
              src={otherUser.avatar_url}
              alt={otherUser.full_name}
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-sm font-semibold text-green-700">
                {otherUser.full_name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {/* Online indicator */}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">{otherUser.full_name}</p>
          <p className="text-xs text-gray-500 capitalize">{otherUser.role}</p>
        </div>

        {room.order_id && (
          <a
            href={`/orders/${room.order_id}`}
            className="text-xs text-green-600 hover:underline font-medium"
          >
            View Order →
          </a>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {loading ? (
          <MessagesSkeleton />
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">No messages yet.</p>
            <p className="text-xs text-gray-400 mt-1">Start a conversation to negotiate your deal.</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isOwn={msg.sender_id === currentUserId}
              showAvatar={
                idx === 0 ||
                messages[idx - 1]?.sender_id !== msg.sender_id
              }
              otherUser={otherUser}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message... (Enter to send)"
            rows={1}
            style={{ resize: 'none', minHeight: '40px', maxHeight: '120px' }}
            className="flex-1 px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder:text-gray-400"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || sending}
            className="w-10 h-10 flex-shrink-0 rounded-xl bg-green-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-green-700 active:scale-95 transition-all"
            aria-label="Send message"
          >
            {sending ? (
              <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M22 2L15 22 11 13 2 9l20-7z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            )}
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1.5 ml-1">
          All conversations are monitored for your protection · Deals are binding only after placing an order
        </p>
      </div>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar: boolean;
  otherUser: Profile;
}

function MessageBubble({ message, isOwn, showAvatar, otherUser }: MessageBubbleProps) {
  const isOptimistic = message.id.startsWith('optimistic-');

  if (message.message_type === 'offer') {
    return <OfferBubble message={message} isOwn={isOwn} />;
  }

  if (message.message_type === 'system') {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
          {message.content}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex gap-2 ${isOwn ? 'flex-row-reverse' : 'flex-row'} mb-0.5`}>
      {/* Avatar */}
      <div className="w-7 flex-shrink-0 self-end">
        {showAvatar && !isOwn && (
          otherUser.avatar_url ? (
            <Image
              src={otherUser.avatar_url}
              alt={otherUser.full_name}
              width={28}
              height={28}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-xs font-medium text-green-700">
                {otherUser.full_name.charAt(0)}
              </span>
            </div>
          )
        )}
      </div>

      {/* Bubble */}
      <div className={`max-w-[72%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed
          ${isOwn
            ? 'bg-green-600 text-white rounded-br-sm'
            : 'bg-gray-100 text-gray-900 rounded-bl-sm'
          }
          ${isOptimistic ? 'opacity-70' : 'opacity-100'}
        `}>
          {message.content}
        </div>
        <div className="flex items-center gap-1 mt-0.5 px-1">
          <span className="text-[10px] text-gray-400">
            {formatDistanceToNow(new Date(message.created_at), { addSuffix: false })}
          </span>
          {isOwn && (
            <svg className={`w-3 h-3 ${message.is_read ? 'text-green-500' : 'text-gray-300'}`}
              viewBox="0 0 16 16" fill="currentColor">
              <path d="M0 8l1.5-1.5 4 4L14 3l1.5 1.5-10 10L0 8z"/>
              {message.is_read && <path d="M3 8l1.5-1.5 4 4" opacity="0.5"/>}
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Offer bubble ─────────────────────────────────────────

function OfferBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  let offer: { product_id: string; qty: number; price_usd: number } | null = null;
  try { offer = JSON.parse(message.content ?? '{}'); } catch { return null; }
  if (!offer) return null;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}>
      <div className="max-w-[72%] bg-white border border-green-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-4 py-3">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-4 h-4 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"/>
            </svg>
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              Deal Offer
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-1">Qty: <span className="font-semibold text-gray-900">{offer.qty} units</span></p>
          <p className="text-lg font-bold text-gray-900">${offer.price_usd.toFixed(2)} <span className="text-sm font-normal text-gray-400">/ unit</span></p>
          <p className="text-sm text-gray-500 mt-1">Total: ${(offer.qty * offer.price_usd).toFixed(2)}</p>
        </div>
        {!isOwn && (
          <div className="grid grid-cols-2 border-t border-gray-100">
            <a
              href={`/products/${offer.product_id}`}
              className="py-2.5 text-center text-sm font-medium text-gray-600 hover:bg-gray-50 border-r border-gray-100"
            >
              View product
            </a>
            <button className="py-2.5 text-center text-sm font-medium text-green-600 hover:bg-green-50">
              Accept offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────

function MessagesSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      {[1,2,3,4].map(i => (
        <div key={i} className={`flex gap-2 ${i % 2 === 0 ? 'flex-row-reverse' : ''}`}>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex-shrink-0" />
          <div className={`h-10 rounded-2xl bg-gray-100 ${i % 2 === 0 ? 'w-40' : 'w-52'}`} />
        </div>
      ))}
    </div>
  );
}
