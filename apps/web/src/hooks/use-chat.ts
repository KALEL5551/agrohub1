'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import type { Message, ChatRoom } from '@/types';

export function useChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchRooms = async () => {
      const { data } = await supabase
        .from('chat_rooms')
        .select(`
          *,
          buyer:users!buyer_id(id, full_name, avatar_url),
          supplier:users!supplier_id(id, full_name, business_name, avatar_url)
        `)
        .or(`buyer_id.eq.${user.id},supplier_id.eq.${user.id}`)
        .order('last_message_at', { ascending: false, nullsFirst: false });

      setRooms((data as ChatRoom[]) || []);
      setIsLoading(false);
    };

    fetchRooms();

    const channel = supabase
      .channel('chat-rooms')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'chat_rooms' },
        () => fetchRooms()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  return { rooms, isLoading };
}

export function useChatMessages(roomId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const supabase = createClient();
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      const { data } = await supabase
        .from('messages')
        .select('*, sender:users!sender_id(id, full_name, avatar_url)')
        .eq('room_id', roomId)
        .order('created_at', { ascending: true })
        .limit(100);

      setMessages((data as Message[]) || []);
      setIsLoading(false);

      if (user) {
        await supabase
          .from('messages')
          .update({ is_read: true })
          .eq('room_id', roomId)
          .neq('sender_id', user.id)
          .eq('is_read', false);
      }
    };

    fetchMessages();

    channelRef.current = supabase
      .channel(`room-${roomId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `room_id=eq.${roomId}`,
        },
        async (payload) => {
          const { data: newMsg } = await supabase
            .from('messages')
            .select('*, sender:users!sender_id(id, full_name, avatar_url)')
            .eq('id', payload.new.id)
            .single();

          if (newMsg) {
            setMessages((prev) => [...prev, newMsg as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [roomId, user, supabase]);

  const sendMessage = useCallback(
    async (content: string, type: 'text' | 'image' | 'file' = 'text', fileUrl?: string) => {
      if (!roomId || !user) return;

      const { error } = await supabase.from('messages').insert({
        room_id: roomId,
        sender_id: user.id,
        content,
        message_type: type,
        file_url: fileUrl || null,
      });

      if (error) throw error;

      await supabase
        .from('chat_rooms')
        .update({
          last_message: content,
          last_message_at: new Date().toISOString(),
        })
        .eq('id', roomId);
    },
    [roomId, user, supabase]
  );

  return { messages, isLoading, sendMessage };
}
