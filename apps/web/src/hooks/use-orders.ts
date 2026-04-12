'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/auth-store';
import type { Order } from '@/types';

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();
  const supabase = createClient();

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setIsLoading(true);

      const column = user.role === 'supplier' ? 'supplier_id' : 'buyer_id';
      const { data } = await supabase
        .from('orders')
        .select('*, buyer:users!buyer_id(id, full_name, avatar_url), supplier:users!supplier_id(id, full_name, business_name, avatar_url)')
        .eq(column, user.id)
        .order('created_at', { ascending: false });

      setOrders((data as Order[]) || []);
      setIsLoading(false);
    };

    fetchOrders();

    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `${user.role === 'supplier' ? 'supplier_id' : 'buyer_id'}=eq.${user.id}`,
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, supabase]);

  return { orders, isLoading };
}

export function useOrder(id: string) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, buyer:users!buyer_id(*), supplier:users!supplier_id(*)')
        .eq('id', id)
        .single();

      setOrder(data as Order);
      setIsLoading(false);
    };

    if (id) fetchOrder();
  }, [id, supabase]);

  return { order, isLoading };
}
