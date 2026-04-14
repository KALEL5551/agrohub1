export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface PaymentInitializeRequest {
  order_id: string;
  payment_method: 'card' | 'paypal' | 'mobilemoney' | 'bank_transfer' | 'crypto';
  currency: string;
}

export interface PaymentInitializeResponse {
  payment_link: string;
  reference: string;
}

export interface ShippingQuoteRequest {
  origin_country: string;
  destination_country: string;
  weight_kg: number;
  dimensions?: { length: number; width: number; height: number };
}

export interface SupplierMatchResponse {
  matches: Array<{
    supplier_id: string;
    supplier_name: string;
    relevance_score: number;
    reason: string;
    products: Array<{ id: string; title: string; price: number }>;
  }>;
}
