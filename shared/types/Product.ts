/**
 * Product-related type definitions
 * Shared between frontend and backend
 */

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  featured?: boolean;
  tags: string[];
}

export interface ProductCategory {
  id: string;
  name: string;
  icon: string;
}

export interface ProductFilter {
  category?: string;
  searchTerm?: string;
  sortBy?: 'name' | 'price-low' | 'price-high';
  inStockOnly?: boolean;
  featured?: boolean;
}

export interface PricingTier {
  id: string;
  title: string;
  price: string;
  description: string;
  features: string[];
  popular?: boolean;
  category: 'IGCSE' | 'AS Level';
  type: 'Standard' | 'Premium';
  subjects: number;
}