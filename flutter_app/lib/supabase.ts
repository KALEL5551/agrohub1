// ============================================================
// AgriTrade Africa — Supabase Client & Query Helpers
// apps/web/src/lib/supabase.ts
// ============================================================

import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js';
import type {
  Profile, Product, Order, Message, ChatRoom,
  Notification, ProductFilters, PaginatedResponse, CheckoutPayload,
  CheckoutSummary, ShippingQuote, Rfq, RfqBid
} from '@agritrade/shared/types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Singleton client
let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: { eventsPerSecond: 10 },
      },
    });
  }
  return client;
}

export const supabase = getSupabase();

// ─── Auth Helpers ─────────────────────────────────────────

export const auth = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { data, error };
  },

  async signInWithPhone(phone: string) {
    const { data, error } = await supabase.auth.signInWithOtp({
      phone: phone.startsWith('+') ? phone : `+256${phone.replace(/^0/, '')}`,
    });
    return { data, error };
  },

  async verifyOtp(phone: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      phone: phone.startsWith('+') ? phone : `+256${phone.replace(/^0/, '')}`,
      token,
      type: 'sms',
    });
    return { data, error };
  },

  async signOut() {
    return supabase.auth.signOut();
  },

  async getSession() {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  async getUser() {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  onAuthStateChange(callback: Parameters<typeof supabase.auth.onAuthStateChange>[0]) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

// ─── Profile Helpers ──────────────────────────────────────

export const profiles = {
  async getById(id: string): Promise<Profile | null> {
    const { data } = await supabase
      .from('profiles')
      .select('*, supplier_profile:supplier_profiles(*)')
      .eq('id', id)
      .single();
    return data;
  },

  async update(id: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    return { data, error };
  },

  async uploadAvatar(userId: string, file: File): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const path = `avatars/${userId}.${ext}`;
    const { error } = await supabase.storage
      .from('user-uploads')
      .upload(path, file, { upsert: true });
    if (error) return null;
    const { data } = supabase.storage.from('user-uploads').getPublicUrl(path);
    return data.publicUrl;
  },
};

// ─── Product Helpers ──────────────────────────────────────

export const products = {
  async list(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const {
      category, subcategory, min_price_usd, max_price_usd,
      origin_country, min_rating, in_stock, tags, search,
      sort_by = 'newest', page = 1, per_page = 24,
    } = filters;

    let query = supabase
      .from('products')
      .select('*, supplier:supplier_profiles(*, profile:profiles(*))', { count: 'exact' })
      .eq('status', 'active');

    if (category)         query = query.eq('category', category);
    if (subcategory)      query = query.eq('subcategory', subcategory);
    if (min_price_usd)    query = query.gte('price_usd', min_price_usd);
    if (max_price_usd)    query = query.lte('price_usd', max_price_usd);
    if (origin_country)   query = query.eq('origin_country', origin_country);
    if (min_rating)       query = query.gte('rating', min_rating);
    if (in_stock)         query = query.gt('stock_qty', 0);
    if (tags?.length)     query = query.overlaps('tags', tags);
    if (search)           query = query.textSearch('search_vector', search, { type: 'websearch' });

    switch (sort_by) {
      case 'price_asc':   query = query.order('price_usd', { ascending: true }); break;
      case 'price_desc':  query = query.order('price_usd', { ascending: false }); break;
      case 'rating':      query = query.order('rating', { ascending: false, nullsFirst: false }); break;
      case 'popular':     query = query.order('order_count', { ascending: false }); break;
      default:            query = query.order('created_at', { ascending: false });
    }

    const from = (page - 1) * per_page;
    query = query.range(from, from + per_page - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    return {
      data: data ?? [],
      count: count ?? 0,
      page,
      per_page,
      total_pages: Math.ceil((count ?? 0) / per_page),
    };
  },

  async getById(id: string): Promise<Product | null> {
    const { data } = await supabase
      .from('products')
      .select('*, supplier:supplier_profiles(*, profile:profiles(*))')
      .eq('id', id)
      .single();

    // Increment view count (fire-and-forget)
    if (data) {
      supabase.rpc('increment_product_views', { product_id: id }).then(() => {});
    }

    return data;
  },

  async create(product: Partial<Product>) {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('products')
      .insert({ ...product, supplier_id: user.id })
      .select()
      .single();
    return { data, error };
  },

  async uploadImages(productId: string, files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const path = `products/${productId}/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from('product-images').upload(path, file);
      if (!error) {
        const { data } = supabase.storage.from('product-images').getPublicUrl(path);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  },

  async getFeatured(): Promise<Product[]> {
    const { data } = await supabase
      .from('products')
      .select('*, supplier:supplier_profiles(company_name, logo_url, is_verified)')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('order_count', { ascending: false })
      .limit(12);
    return data ?? [];
  },
};

// ─── Order Helpers ────────────────────────────────────────

export const orders = {
  async getCheckoutSummary(payload: CheckoutPayload): Promise<CheckoutSummary> {
    const { data, error } = await supabase.functions.invoke('calculate-checkout', {
      body: payload,
    });
    if (error) throw error;
    return data;
  },

  async create(payload: CheckoutPayload): Promise<Order> {
    const { data, error } = await supabase.functions.invoke('create-order', {
      body: payload,
    });
    if (error) throw error;
    return data;
  },

  async listMine(status?: Order['status']): Promise<Order[]> {
    const user = await auth.getUser();
    if (!user) return [];

    let query = supabase
      .from('orders')
      .select('*, buyer:profiles!buyer_id(full_name, avatar_url), supplier:profiles!supplier_id(full_name, avatar_url)')
      .or(`buyer_id.eq.${user.id},supplier_id.eq.${user.id}`)
      .order('created_at', { ascending: false });

    if (status) query = query.eq('status', status);
    const { data } = await query;
    return data ?? [];
  },

  async getById(id: string): Promise<Order | null> {
    const { data } = await supabase
      .from('orders')
      .select('*, buyer:profiles!buyer_id(*), supplier:profiles!supplier_id(*)')
      .eq('id', id)
      .single();
    return data;
  },

  async confirmDelivery(orderId: string): Promise<void> {
    const { error } = await supabase
      .from('orders')
      .update({
        status: 'delivered',
        delivered_at: new Date().toISOString(),
        delivery_confirmed_at: new Date().toISOString(),
      })
      .eq('id', orderId);
    if (error) throw error;

    // Trigger escrow release
    await supabase.functions.invoke('release-escrow', { body: { order_id: orderId } });
  },

  subscribeToOrder(orderId: string, callback: (order: Order) => void): RealtimeChannel {
    return supabase
      .channel(`order:${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`,
      }, (payload) => callback(payload.new as Order))
      .subscribe();
  },
};

// ─── Chat Helpers ─────────────────────────────────────────

export const chat = {
  async getRooms(): Promise<ChatRoom[]> {
    const user = await auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from('chat_rooms')
      .select('*, participant_a:profiles!participant_a(id, full_name, avatar_url, role), participant_b:profiles!participant_b(id, full_name, avatar_url, role)')
      .or(`participant_a.eq.${user.id},participant_b.eq.${user.id}`)
      .order('last_message_at', { ascending: false, nullsFirst: false });
    return data ?? [];
  },

  async getOrCreateRoom(otherUserId: string, orderId?: string): Promise<ChatRoom> {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Deterministic participant ordering
    const [a, b] = [user.id, otherUserId].sort();

    const existing = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('participant_a', a)
      .eq('participant_b', b)
      .eq('order_id', orderId ?? null)
      .maybeSingle();

    if (existing.data) return existing.data;

    const { data, error } = await supabase
      .from('chat_rooms')
      .insert({ participant_a: a, participant_b: b, order_id: orderId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getMessages(roomId: string, limit = 50): Promise<Message[]> {
    const { data } = await supabase
      .from('messages')
      .select('*, sender:profiles(id, full_name, avatar_url)')
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })
      .limit(limit);
    return (data ?? []).reverse();
  },

  async sendMessage(roomId: string, content: string, type: Message['message_type'] = 'text'): Promise<Message> {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('messages')
      .insert({ room_id: roomId, sender_id: user.id, content, message_type: type })
      .select('*, sender:profiles(id, full_name, avatar_url)')
      .single();

    if (error) throw error;

    // Update room last_message
    await supabase
      .from('chat_rooms')
      .update({ last_message: content, last_message_at: new Date().toISOString() })
      .eq('id', roomId);

    return data;
  },

  subscribeToRoom(roomId: string, onMessage: (msg: Message) => void): RealtimeChannel {
    return supabase
      .channel(`room:${roomId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `room_id=eq.${roomId}`,
      }, (payload) => onMessage(payload.new as Message))
      .subscribe();
  },

  async markRoomRead(roomId: string): Promise<void> {
    const user = await auth.getUser();
    if (!user) return;

    await supabase
      .from('messages')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('room_id', roomId)
      .neq('sender_id', user.id)
      .eq('is_read', false);
  },
};

// ─── Shipping Quote Helpers ───────────────────────────────

export const shipping = {
  async getQuotes(
    originCountry: string,
    weightKg: number,
    destDistrict?: string
  ): Promise<ShippingQuote[]> {
    const { data, error } = await supabase.functions.invoke('get-shipping-quotes', {
      body: { origin_country: originCountry, weight_kg: weightKg, dest_district: destDistrict },
    });
    if (error) throw error;
    return data ?? [];
  },
};

// ─── Notifications ────────────────────────────────────────

export const notifications = {
  async listMine(limit = 20): Promise<Notification[]> {
    const user = await auth.getUser();
    if (!user) return [];
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    return data ?? [];
  },

  async markRead(id: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id);
  },

  async markAllRead(): Promise<void> {
    const user = await auth.getUser();
    if (!user) return;
    await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .eq('is_read', false);
  },

  subscribe(userId: string, onNotification: (n: Notification) => void): RealtimeChannel {
    return supabase
      .channel(`notifications:${userId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`,
      }, (payload) => onNotification(payload.new as Notification))
      .subscribe();
  },
};

// ─── RFQ Helpers ──────────────────────────────────────────

export const rfqs = {
  async list(category?: Product['category']): Promise<Rfq[]> {
    let query = supabase
      .from('rfqs')
      .select('*, buyer:profiles(full_name, avatar_url, district), bids:rfq_bids(count)')
      .eq('status', 'open')
      .order('created_at', { ascending: false });
    if (category) query = query.eq('category', category);
    const { data } = await query;
    return data ?? [];
  },

  async create(rfq: Partial<Rfq>): Promise<Rfq> {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('rfqs')
      .insert({ ...rfq, buyer_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async placeBid(rfqId: string, bid: Partial<RfqBid>): Promise<RfqBid> {
    const user = await auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await supabase
      .from('rfq_bids')
      .insert({ ...bid, rfq_id: rfqId, supplier_id: user.id })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};
