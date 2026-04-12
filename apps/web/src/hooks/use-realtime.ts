'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

export function useRealtime(
  table: string,
  event: RealtimeEvent,
  callback: (payload: unknown) => void,
  filter?: string
) {
  const supabase = createClient();

  useEffect(() => {
    const channelConfig: {
      event: RealtimeEvent;
      schema: string;
      table: string;
      filter?: string;
    } = {
      event,
      schema: 'public',
      table,
    };

    if (filter) {
      channelConfig.filter = filter;
    }

    const channel = supabase
      .channel(`realtime-${table}-${event}`)
      .on('postgres_changes', channelConfig, callback)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, filter, callback, supabase]);
}
