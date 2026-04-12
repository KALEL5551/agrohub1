// ============================================================
// AgriTrade Africa — Shared TypeScript Types
// packages/shared/src/types/index.ts
// ============================================================

// ─── Enums ────────────────────────────────────────────────

export type UserRole = 'farmer' | 'supplier' | 'buyer' | 'admin';
export type ProductCategory = 'agriculture' | 'electronics' | 'books' | 'services' | 'other';
export type ProductStatus = 'draft' | 'pending_review' | 'active' | 'suspended' | 'out_of_stock';
export type OrderStatus =
  | 'pending_payment'
  | 'payment_held'
  | 'processing'
  | 'shipped'
  | 'in_customs'
  | 'out_for_delivery'
  | 'delivered'
  | 'disputed'
  | 'refunded'
  | 'cancelled';
export type PaymentMethod = 'mtn_momo' | 'airtel_money' | 'card' | 'bank_transfer' | 'ussd';
export type VerificationLevel = 'unverified' | 'email_verified' | 'kyc_basic' | 'kyc_full' | 'trusted_supplier';
export type ShippingZone = 'domestic_ug' | 'east_africa' | 'africa' | 'international';
export type RfqStatus = 'open' | 'bidding' | 'awarded' | 'completed' | 'cancelled';
export type MessageType = 'text' | 'image' | 'voice' | 'system' | 'offer';

// ─── Profile / User ───────────────────────────────────────

export interface Profile {
  id: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  email?: string;
  avatar_url?: string;
  bio?: string;
  district?: string;
  country: string;
  verification_level: VerificationLevel;
  language: string;
  is_active: boolean;
  total_orders: number;
  total_sales: number;
  rating?: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierProfile {
  id: string;
  user_id: string;
  company_name: string;
  company_website?: string;
  company_country: string;
  company_description?: string;
  logo_url?: string;
  banner_url?: string;
  min_order_usd?: number;
  response_time_hours?: number;
  is_verified: boolean;
  verified_at?: string;
  categories?: ProductCategory[];
  total_listings: number;
  completed_orders: number;
  rating?: number;
  created_at: string;
  // Joined
  profile?: Profile;
}

// ─── Product ──────────────────────────────────────────────

export interface Product {
  id: string;
  supplier_id: string;
  category: ProductCategory;
  subcategory?: string;
  title: string;
  description: string;
  images: string[];
  price_usd: number;
  price_ugx?: number;
  currency: string;
  min_order_qty: number;
  unit: string;
  stock_qty?: number;
  sku?: string;
  origin_country?: string;
  status: ProductStatus;
  attributes?: Record<string, unknown>;
  tags?: string[];
  view_count: number;
  order_count: number;
  rating?: number;
  shipping_weight_kg?: number;
  shipping_zones?: ShippingZone[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  // Joined
  supplier?: SupplierProfile;
}

// Agriculture-specific product attributes
export interface AgricultureAttributes {
  germination_rate?: number;        // percentage
  soil_type?: string[];
  growing_season?: string;
  days_to_maturity?: number;
  yield_per_hectare?: string;
  disease_resistance?: string[];
  organic_certified?: boolean;
  certification_body?: string;
}

// Electronics-specific product attributes
export interface ElectronicsAttributes {
  component_type?: string;          // IC, PCB, resistor, capacitor, etc.
  voltage_input?: string;
  current_rating?: string;
  package_type?: string;            // DIP, SMD, TO-220, etc.
  operating_temp_range?: string;
  datasheet_url?: string;
  rohs_compliant?: boolean;
  manufacturer?: string;
  manufacturer_part_no?: string;
}

// ─── Order ────────────────────────────────────────────────

export interface OrderItem {
  product_id: string;
  title: string;
  qty: number;
  unit_price_usd: number;
  image?: string;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  district: string;
  address_line: string;
  city: string;
  country: string;
}

export interface LogisticsStage {
  stage: string;
  location: string;
  timestamp: string;
  note?: string;
  completed: boolean;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  supplier_id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal_usd: number;
  shipping_cost_usd: number;
  platform_fee_usd: number;
  markup_usd: number;
  total_usd: number;
  total_ugx?: number;
  payment_method?: PaymentMethod;
  payment_ref?: string;
  paid_at?: string;
  escrow_released: boolean;
  escrow_released_at?: string;
  shipping_address: ShippingAddress;
  shipping_carrier?: string;
  tracking_number?: string;
  tracking_url?: string;
  shipped_at?: string;
  estimated_delivery?: string;
  delivered_at?: string;
  delivery_confirmed_at?: string;
  logistics_stages?: LogisticsStage[];
  disputed_at?: string;
  dispute_reason?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Joined
  buyer?: Profile;
  supplier?: Profile;
}

// ─── RFQ ──────────────────────────────────────────────────

export interface Rfq {
  id: string;
  buyer_id: string;
  category: ProductCategory;
  title: string;
  description: string;
  quantity: number;
  unit: string;
  target_price_usd?: number;
  destination: string;
  required_by?: string;
  status: RfqStatus;
  awarded_bid_id?: string;
  expires_at: string;
  created_at: string;
  buyer?: Profile;
  bids?: RfqBid[];
}

export interface RfqBid {
  id: string;
  rfq_id: string;
  supplier_id: string;
  price_usd: number;
  shipping_usd: number;
  lead_time_days: number;
  notes?: string;
  is_awarded: boolean;
  created_at: string;
  supplier?: SupplierProfile;
}

// ─── Chat ─────────────────────────────────────────────────

export interface ChatRoom {
  id: string;
  order_id?: string;
  rfq_id?: string;
  participant_a: string;
  participant_b: string;
  last_message?: string;
  last_message_at?: string;
  unread_a: number;
  unread_b: number;
  created_at: string;
  other_participant?: Profile;  // resolved on client
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content?: string;
  message_type: MessageType;
  attachment_url?: string;
  offer_data?: {
    product_id: string;
    qty: number;
    price_usd: number;
  };
  is_read: boolean;
  read_at?: string;
  created_at: string;
  sender?: Profile;
}

// ─── Review ───────────────────────────────────────────────

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewed_id: string;
  product_id?: string;
  rating: number;
  title?: string;
  body?: string;
  images?: string[];
  response?: string;
  response_at?: string;
  is_verified: boolean;
  created_at: string;
  reviewer?: Profile;
}

// ─── Shipping ─────────────────────────────────────────────

export interface ShippingQuote {
  id: string;
  origin_country: string;
  dest_country: string;
  dest_district?: string;
  weight_kg: number;
  carrier: string;
  service_type: 'express' | 'standard' | 'economy';
  base_cost_usd: number;
  platform_markup_usd: number;
  total_cost_usd: number;
  transit_days_min: number;
  transit_days_max: number;
  valid_until: string;
}

// ─── Notification ─────────────────────────────────────────

export interface Notification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}

// ─── API Response wrappers ────────────────────────────────

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  per_page: number;
  total_pages: number;
}

// ─── Filter / Query params ────────────────────────────────

export interface ProductFilters {
  category?: ProductCategory;
  subcategory?: string;
  min_price_usd?: number;
  max_price_usd?: number;
  origin_country?: string;
  shipping_zone?: ShippingZone;
  min_rating?: number;
  in_stock?: boolean;
  tags?: string[];
  search?: string;
  sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'rating' | 'popular';
  page?: number;
  per_page?: number;
}

// ─── Cart (client-side only) ──────────────────────────────

export interface CartItem {
  product: Product;
  qty: number;
}

export interface Cart {
  items: CartItem[];
  total_usd: number;
  total_items: number;
}

// ─── Checkout ─────────────────────────────────────────────

export interface CheckoutPayload {
  items: Array<{ product_id: string; qty: number }>;
  shipping_address: ShippingAddress;
  payment_method: PaymentMethod;
  shipping_quote_id: string;
  notes?: string;
}

export interface CheckoutSummary {
  items: OrderItem[];
  subtotal_usd: number;
  shipping_cost_usd: number;
  platform_fee_usd: number;
  total_usd: number;
  total_ugx: number;
  estimated_delivery_range: string;
  exchange_rate: number;
}
