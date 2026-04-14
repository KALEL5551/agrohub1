export type UserRole = 'buyer' | 'supplier' | 'admin';

export type OrderStatus =
  | 'pending' | 'confirmed' | 'processing'
  | 'shipped' | 'delivered' | 'cancelled' | 'disputed';

export type EscrowStatus = 'held' | 'released' | 'refunded';

export type ProductCategory =
  | 'cash_crops' | 'food_crops' | 'vegetables' | 'fruits'
  | 'livestock' | 'poultry' | 'fisheries' | 'coffee_beverages'
  | 'spices_herbs' | 'dairy' | 'honey' | 'seeds_nursery'
  | 'farm_inputs' | 'farm_equipment' | 'agro_processing';

export type KycStatus = 'pending' | 'approved' | 'rejected';

export type ListingStatus =
  | 'draft' | 'pending_review' | 'active' | 'rejected' | 'archived';

export type ProductSubType =
  | 'seeds' | 'pesticide' | 'fungicide' | 'herbicide' | 'fertilizer'
  | 'produce_fresh' | 'produce_dried' | 'expert_service' | 'equipment'
  | 'live_animals' | 'meat_cuts' | 'hides_skins' | 'wool_fiber' | 'eggs'
  | 'raw_milk' | 'animal_feed' | 'veterinary' | 'breeding_stock'
  | 'dairy_products' | 'live_fish' | 'fresh_chilled' | 'frozen'
  | 'dried_smoked' | 'canned' | 'fish_feed' | 'fish_medicine' | 'fingerlings';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  business_name: string | null;
  business_address: string | null;
  country: string;
  city: string | null;
  kyc_status: KycStatus;
  kyc_documents: string[] | null;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  supplier_id: string;
  title: string;
  slug: string;
  description: string;
  category: ProductCategory;
  subcategory: string;
  product_type?: ProductSubType | string;
  price: number;
  currency: string;
  unit: string;
  min_order_quantity: number;
  max_order_quantity: number | null;
  stock_quantity: number;
  images: string[];
  specifications: Record<string, string>;
  tags: string[];
  origin_country: string;
  listing_status: ListingStatus;
  is_featured: boolean;
  views: number;
  rating: number;
  total_reviews: number;
  trade_type?: 'b2b' | 'b2c' | 'both';
  created_at: string;
  updated_at: string;
  supplier?: User;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  supplier_id: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shipping_cost: number;
  platform_commission: number;
  total: number;
  currency: string;
  display_currency?: string;
  display_amount?: number;
  escrow_status: EscrowStatus;
  payment_reference: string | null;
  payment_method: string | null;
  shipping_address: ShippingAddress;
  shipping_type?: string;
  shipping_tracking_number: string | null;
  shipping_carrier: string | null;
  notes: string | null;
  estimated_delivery: string | null;
  delivered_at: string | null;
  created_at: string;
  updated_at: string;
  buyer?: User;
  supplier?: User;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  image: string;
  original_currency?: string;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Message {
  id: string;
  room_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'system';
  file_url: string | null;
  is_read: boolean;
  created_at: string;
  sender?: User;
}

export interface ChatRoom {
  id: string;
  buyer_id: string;
  supplier_id: string;
  order_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  buyer?: User;
  supplier?: User;
  unread_count?: number;
}

export interface Review {
  id: string;
  order_id: string;
  reviewer_id: string;
  reviewee_id: string;
  product_id: string | null;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: User;
}

export interface ShippingQuote {
  id: string;
  carrier: string;
  service_name: string;
  price: number;
  currency: string;
  estimated_days: number;
  origin_country: string;
  destination_country: string;
}

export interface Dispute {
  id: string;
  order_id: string;
  raised_by: string;
  reason: string;
  description: string;
  evidence_urls: string[];
  status: 'open' | 'under_review' | 'resolved_buyer' | 'resolved_supplier' | 'closed';
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}
