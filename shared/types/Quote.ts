/**
 * Quote and Cart-related type definitions
 * Shared between frontend and backend
 */

import { Product, PricingTier } from './Product';
import { Customer } from './Customer';

export interface CartItem {
  product: Product | CartProductInfo;
  quantity: number;
}

export interface CartProductInfo {
  id: string;
  name: string;
  price: number;
  image: string;
}

export interface QuoteItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  category?: string;
  type?: 'product' | 'pricing-tier';
}

export interface Quote {
  id: string;
  referenceNumber: string; // Format: GT-YYYY-NNNN
  items: QuoteItem[];
  customer: Customer;
  subtotal: number;
  total: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  comments?: string;
  createdAt: Date;
  expiresAt: Date;
  lastModifiedAt?: Date;
}

export interface CreateQuoteRequest {
  items: QuoteItem[];
  customer: Customer;
  comments?: string;
}

export interface QuoteResponse {
  success: boolean;
  quote?: Quote;
  referenceNumber?: string;
  message?: string;
}

export interface QuoteSummary {
  subtotal: number;
  total: number;
  itemCount: number;
  currency: string;
}