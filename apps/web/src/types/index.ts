// Barrel exports — makes both import styles work:
// import type { Product } from '@/types'          ✅
// import type { Product } from '@/types/database' ✅
export type {
  User, Product, Order, OrderItem, ShippingAddress,
  CartItem, Message, ChatRoom, Review, ShippingQuote, Dispute,
  UserRole, OrderStatus, EscrowStatus, ProductCategory,
  KycStatus, ListingStatus, ProductSubType,
} from './database';

export type {
  ApiResponse, PaginatedResponse,
  PaymentInitializeRequest, PaymentInitializeResponse,
  ShippingQuoteRequest, SupplierMatchResponse,
} from './api';
