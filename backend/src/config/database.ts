/**
 * D1 Database Configuration
 * Cloudflare D1 database setup and connection management
 */

// D1 Database interface for quotes
interface QuoteStorage {
  id: string;
  referenceNumber: string;
  customerData: string;
  items: string;
  subtotal: number;
  total: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  comments?: string;
  createdAt: string;
  expiresAt: string;
  lastModifiedAt?: string;
}

// D1 Database connection (will be injected in production)
let d1Database: any = null;

// Initialize D1 database connection
export const initializeD1 = (database: any) => {
  d1Database = database;
};

// Fallback in-memory storage for development when D1 is not available
const devQuoteStorage: QuoteStorage[] = [];

// Database service interface (simplified)
export interface DatabaseService {
  createQuote: (quote: QuoteStorage) => Promise<QuoteStorage>;
  findQuoteByReference: (reference: string) => Promise<QuoteStorage | null>;
  findQuoteById: (id: string) => Promise<QuoteStorage | null>;
  updateQuoteStatus: (id: string, status: 'pending' | 'approved' | 'rejected' | 'expired') => Promise<QuoteStorage | null>;
  getAllReferences: () => Promise<string[]>;
  getAllQuotes: (limit?: number, offset?: number) => Promise<QuoteStorage[]>;
  deleteQuote: (id: string) => Promise<boolean>;
}

// D1 Database service implementation with development fallback
export const createDatabaseService = (): DatabaseService => ({
  createQuote: async (quote: QuoteStorage) => {
    if (d1Database) {
      // Use D1 database in production
      const result = await d1Database.prepare(
        'INSERT INTO quotes (id, referenceNumber, customerData, items, subtotal, total, currency, status, comments, createdAt, expiresAt, lastModifiedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        quote.id,
        quote.referenceNumber,
        quote.customerData,
        quote.items,
        quote.subtotal,
        quote.total,
        quote.currency,
        quote.status,
        quote.comments || null,
        quote.createdAt,
        quote.expiresAt,
        quote.lastModifiedAt || null
      ).run();
      
      if (result.success) {
        return quote;
      }
      throw new Error('Failed to create quote in D1');
    } else {
      // Fallback to in-memory storage for development
      devQuoteStorage.push(quote);
      return quote;
    }
  },

  findQuoteByReference: async (reference: string) => {
    if (d1Database) {
      const result = await d1Database.prepare(
        'SELECT * FROM quotes WHERE referenceNumber = ?'
      ).bind(reference).first();
      return result || null;
    } else {
      return devQuoteStorage.find(q => q.referenceNumber === reference) || null;
    }
  },

  findQuoteById: async (id: string) => {
    if (d1Database) {
      const result = await d1Database.prepare(
        'SELECT * FROM quotes WHERE id = ?'
      ).bind(id).first();
      return result || null;
    } else {
      return devQuoteStorage.find(q => q.id === id) || null;
    }
  },

  updateQuoteStatus: async (id: string, status: 'pending' | 'approved' | 'rejected' | 'expired') => {
    const lastModifiedAt = new Date().toISOString();
    
    if (d1Database) {
      const result = await d1Database.prepare(
        'UPDATE quotes SET status = ?, lastModifiedAt = ? WHERE id = ? RETURNING *'
      ).bind(status, lastModifiedAt, id).first();
      return result || null;
    } else {
      const quote = devQuoteStorage.find(q => q.id === id);
      if (quote) {
        quote.status = status;
        quote.lastModifiedAt = lastModifiedAt;
        return quote;
      }
      return null;
    }
  },

  getAllReferences: async () => {
    if (d1Database) {
      const result = await d1Database.prepare(
        'SELECT referenceNumber FROM quotes'
      ).all();
      return result.results.map((row: any) => row.referenceNumber);
    } else {
      return devQuoteStorage.map(q => q.referenceNumber);
    }
  },

  getAllQuotes: async (limit = 50, offset = 0) => {
    if (d1Database) {
      const result = await d1Database.prepare(
        'SELECT * FROM quotes ORDER BY createdAt DESC LIMIT ? OFFSET ?'
      ).bind(limit, offset).all();
      return result.results;
    } else {
      return devQuoteStorage.slice(offset, offset + limit);
    }
  },

  deleteQuote: async (id: string) => {
    if (d1Database) {
      const result = await d1Database.prepare(
        'DELETE FROM quotes WHERE id = ?'
      ).bind(id).run();
      return result.success && result.changes > 0;
    } else {
      const index = devQuoteStorage.findIndex(q => q.id === id);
      if (index >= 0) {
        devQuoteStorage.splice(index, 1);
        return true;
      }
      return false;
    }
  }
});

// Health check for database
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (d1Database) {
      // Test D1 connection with a simple query
      const result = await d1Database.prepare('SELECT 1').first();
      return result !== null;
    } else {
      // For development, just verify in-memory storage is accessible
      return Array.isArray(devQuoteStorage);
    }
  } catch (error) {
    return false;
  }
};