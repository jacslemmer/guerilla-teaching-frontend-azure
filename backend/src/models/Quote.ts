/**
 * Quote Model
 * Business logic for quote operations including reference number generation and validation
 */

import { v4 as uuidv4 } from 'uuid';
import { 
  Quote, 
  QuoteItem, 
  Customer, 
  CreateQuoteRequest,
  QuoteResponse 
} from '@guerilla-teaching/shared-types';

// Quote creation parameters
export interface CreateQuoteParams {
  items: QuoteItem[];
  customer: Customer;
  comments?: string;
  currency?: string;
}

// Quote database entity (for storage)
export interface QuoteEntity {
  id: string;
  referenceNumber: string;
  customerData: string; // JSON string
  items: string; // JSON string
  subtotal: number;
  total: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  comments?: string;
  createdAt: string; // ISO 8601
  expiresAt: string; // ISO 8601
  lastModifiedAt?: string; // ISO 8601
}

// Quote model class with business logic
export class QuoteModel {
  
  /**
   * Generate unique reference number in format GT-YYYY-NNNN
   * @param existingNumbers Array of existing reference numbers to avoid duplicates
   * @returns Unique reference number
   */
  static generateReferenceNumber(existingNumbers: string[] = []): string {
    const currentYear = new Date().getFullYear();
    const prefix = `GT-${currentYear}-`;
    
    // Find the highest existing number for current year
    const yearNumbers = existingNumbers
      .filter(ref => ref.startsWith(prefix))
      .map(ref => {
        const numberPart = ref.split('-')[2];
        return parseInt(numberPart, 10) || 0;
      })
      .sort((a, b) => b - a);
    
    const nextNumber = (yearNumbers[0] || 0) + 1;
    const paddedNumber = nextNumber.toString().padStart(4, '0');
    
    return `${prefix}${paddedNumber}`;
  }

  /**
   * Calculate quote totals from items
   * @param items Quote items array
   * @returns Subtotal and total calculations
   */
  static calculateTotals(items: QuoteItem[]): { subtotal: number; total: number } {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // For now, total equals subtotal (no taxes or fees)
    // This can be extended later for VAT calculations
    const total = subtotal;
    
    return { subtotal, total };
  }

  /**
   * Calculate expiration date (1 month from creation)
   * @param createdAt Creation date
   * @returns Expiration date
   */
  static calculateExpirationDate(createdAt: Date = new Date()): Date {
    const expiresAt = new Date(createdAt);
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    return expiresAt;
  }

  /**
   * Validate quote items
   * @param items Quote items to validate
   * @throws Error if validation fails
   */
  static validateQuoteItems(items: QuoteItem[]): void {
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("Quote must have at least one item");
    }

    for (const item of items) {
      if (!item.id || !item.name || typeof item.price !== 'number' || typeof item.quantity !== 'number') {
        throw new Error(`Invalid item: ${item.name || 'Unknown'} - missing required fields`);
      }

      if (item.price <= 0) {
        throw new Error(`Invalid price for item ${item.name}: ${item.price}`);
      }

      if (item.quantity <= 0) {
        throw new Error(`Invalid quantity for item ${item.name}: ${item.quantity}`);
      }
    }
  }

  /**
   * Validate customer information
   * @param customer Customer data to validate
   * @throws Error if validation fails
   */
  static validateCustomer(customer: Customer): void {
    if (!customer.firstName?.trim()) {
      throw new Error("Customer first name is required");
    }

    if (!customer.lastName?.trim()) {
      throw new Error("Customer last name is required");
    }

    if (!customer.email?.trim()) {
      throw new Error("Customer email is required");
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      throw new Error("Invalid email format");
    }

    if (!customer.phone?.trim()) {
      throw new Error("Customer phone is required");
    }
  }

  /**
   * Create a new quote from request parameters
   * @param params Quote creation parameters
   * @param existingReferences Existing reference numbers for uniqueness
   * @returns New quote object
   */
  static createQuote(
    params: CreateQuoteParams,
    existingReferences: string[] = []
  ): Quote {
    // Validate inputs
    this.validateQuoteItems(params.items);
    this.validateCustomer(params.customer);

    // Generate unique reference
    const referenceNumber = this.generateReferenceNumber(existingReferences);
    
    // Calculate totals
    const { subtotal, total } = this.calculateTotals(params.items);
    
    // Create timestamps
    const now = new Date();
    const expiresAt = this.calculateExpirationDate(now);

    // Create quote object
    const quote: Quote = {
      id: uuidv4(),
      referenceNumber,
      items: params.items,
      customer: params.customer,
      subtotal,
      total,
      currency: params.currency || 'ZAR',
      status: 'pending',
      comments: params.comments,
      createdAt: now,
      expiresAt,
      lastModifiedAt: now
    };

    return quote;
  }

  /**
   * Convert Quote to database entity
   * @param quote Quote object to convert
   * @returns Database entity for storage
   */
  static toEntity(quote: Quote): QuoteEntity {
    return {
      id: quote.id,
      referenceNumber: quote.referenceNumber,
      customerData: JSON.stringify(quote.customer),
      items: JSON.stringify(quote.items),
      subtotal: quote.subtotal,
      total: quote.total,
      currency: quote.currency,
      status: quote.status,
      comments: quote.comments,
      createdAt: quote.createdAt.toISOString(),
      expiresAt: quote.expiresAt.toISOString(),
      lastModifiedAt: quote.lastModifiedAt?.toISOString()
    };
  }

  /**
   * Convert database entity to Quote object
   * @param entity Database entity to convert
   * @returns Quote object
   */
  static fromEntity(entity: QuoteEntity): Quote {
    try {
      const customer = JSON.parse(entity.customerData) as Customer;
      const items = JSON.parse(entity.items) as QuoteItem[];
      
      const quote: Quote = {
        id: entity.id,
        referenceNumber: entity.referenceNumber,
        items,
        customer,
        subtotal: entity.subtotal,
        total: entity.total,
        currency: entity.currency,
        status: entity.status,
        comments: entity.comments,
        createdAt: new Date(entity.createdAt),
        expiresAt: new Date(entity.expiresAt),
        lastModifiedAt: entity.lastModifiedAt ? new Date(entity.lastModifiedAt) : undefined
      };

      return quote;
    } catch (error) {
      throw new Error(`Failed to parse quote entity: ${error}`);
    }
  }

  /**
   * Check if quote is expired
   * @param quote Quote to check
   * @returns True if expired
   */
  static isExpired(quote: Quote): boolean {
    return new Date() > quote.expiresAt;
  }

  /**
   * Create a successful quote response
   * @param quote Quote object
   * @returns Quote response object
   */
  static createSuccessResponse(quote: Quote): QuoteResponse {
    return {
      success: true,
      quote,
      referenceNumber: quote.referenceNumber,
      message: "Quote created successfully"
    };
  }

  /**
   * Create an error quote response
   * @param message Error message
   * @returns Quote response object
   */
  static createErrorResponse(message: string): QuoteResponse {
    return {
      success: false,
      message
    };
  }
}