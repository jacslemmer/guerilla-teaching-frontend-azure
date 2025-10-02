/**
 * Azure PostgreSQL Database Configuration
 * Replaces Cloudflare D1 with Azure Database for PostgreSQL
 */

import { Pool, PoolClient } from 'pg';

// Quote storage interface (same as before)
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

// PostgreSQL connection pool
let pgPool: Pool | null = null;

// Initialize PostgreSQL connection
export const initializePostgreSQL = (connectionString?: string) => {
  const dbUrl = connectionString || process.env.DATABASE_URL;

  if (!dbUrl) {
    throw new Error('DATABASE_URL environment variable is required for PostgreSQL connection');
  }

  pgPool = new Pool({
    connectionString: dbUrl,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });

  // Handle pool errors
  pgPool.on('error', (err) => {
    console.error('PostgreSQL pool error:', err);
  });
};

// Get database client
const getClient = async (): Promise<PoolClient> => {
  if (!pgPool) {
    throw new Error('PostgreSQL pool not initialized. Call initializePostgreSQL() first.');
  }
  return await pgPool.connect();
};

// Fallback in-memory storage for development when PostgreSQL is not available
const devQuoteStorage: QuoteStorage[] = [];

// Database service interface (same as before)
export interface DatabaseService {
  createQuote: (quote: QuoteStorage) => Promise<QuoteStorage>;
  findQuoteByReference: (reference: string) => Promise<QuoteStorage | null>;
  findQuoteById: (id: string) => Promise<QuoteStorage | null>;
  updateQuoteStatus: (id: string, status: 'pending' | 'approved' | 'rejected' | 'expired') => Promise<QuoteStorage | null>;
  getAllReferences: () => Promise<string[]>;
  getAllQuotes: (limit?: number, offset?: number) => Promise<QuoteStorage[]>;
  deleteQuote: (id: string) => Promise<boolean>;
}

// PostgreSQL Database service implementation with development fallback
export const createDatabaseService = (): DatabaseService => ({
  createQuote: async (quote: QuoteStorage) => {
    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query(
          `INSERT INTO quotes
           (id, reference_number, customer_data, items, subtotal, total, currency, status, comments, created_at, expires_at, last_modified_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
           RETURNING *`,
          [
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
          ]
        );

        if (result.rows.length > 0) {
          return convertRowToQuote(result.rows[0]);
        }
        throw new Error('Failed to create quote in PostgreSQL');
      } finally {
        client.release();
      }
    } else {
      // Fallback to in-memory storage for development
      devQuoteStorage.push(quote);
      return quote;
    }
  },

  findQuoteByReference: async (reference: string) => {
    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query(
          'SELECT * FROM quotes WHERE reference_number = $1',
          [reference]
        );
        return result.rows.length > 0 ? convertRowToQuote(result.rows[0]) : null;
      } finally {
        client.release();
      }
    } else {
      return devQuoteStorage.find(q => q.referenceNumber === reference) || null;
    }
  },

  findQuoteById: async (id: string) => {
    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query(
          'SELECT * FROM quotes WHERE id = $1',
          [id]
        );
        return result.rows.length > 0 ? convertRowToQuote(result.rows[0]) : null;
      } finally {
        client.release();
      }
    } else {
      return devQuoteStorage.find(q => q.id === id) || null;
    }
  },

  updateQuoteStatus: async (id: string, status: 'pending' | 'approved' | 'rejected' | 'expired') => {
    const lastModifiedAt = new Date().toISOString();

    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query(
          'UPDATE quotes SET status = $1, last_modified_at = $2 WHERE id = $3 RETURNING *',
          [status, lastModifiedAt, id]
        );
        return result.rows.length > 0 ? convertRowToQuote(result.rows[0]) : null;
      } finally {
        client.release();
      }
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
    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query('SELECT reference_number FROM quotes');
        return result.rows.map(row => row.reference_number);
      } finally {
        client.release();
      }
    } else {
      return devQuoteStorage.map(q => q.referenceNumber);
    }
  },

  getAllQuotes: async (limit = 50, offset = 0) => {
    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query(
          'SELECT * FROM quotes ORDER BY created_at DESC LIMIT $1 OFFSET $2',
          [limit, offset]
        );
        return result.rows.map(convertRowToQuote);
      } finally {
        client.release();
      }
    } else {
      return devQuoteStorage.slice(offset, offset + limit);
    }
  },

  deleteQuote: async (id: string) => {
    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query(
          'DELETE FROM quotes WHERE id = $1',
          [id]
        );
        return (result.rowCount || 0) > 0;
      } finally {
        client.release();
      }
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

// Convert PostgreSQL row to QuoteStorage interface (handles snake_case to camelCase)
const convertRowToQuote = (row: any): QuoteStorage => ({
  id: row.id,
  referenceNumber: row.reference_number,
  customerData: row.customer_data,
  items: row.items,
  subtotal: row.subtotal,
  total: row.total,
  currency: row.currency,
  status: row.status,
  comments: row.comments,
  createdAt: row.created_at,
  expiresAt: row.expires_at,
  lastModifiedAt: row.last_modified_at
});

// Health check for database
export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (pgPool) {
      const client = await getClient();
      try {
        const result = await client.query('SELECT 1 as test');
        return result.rows.length > 0 && result.rows[0].test === 1;
      } finally {
        client.release();
      }
    } else {
      // For development, just verify in-memory storage is accessible
      return Array.isArray(devQuoteStorage);
    }
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

// Create database tables (migration script)
export const createTables = async (): Promise<boolean> => {
  if (!pgPool) {
    console.log('PostgreSQL not initialized, skipping table creation');
    return true;
  }

  const client = await getClient();
  try {
    // Create quotes table
    await client.query(`
      CREATE TABLE IF NOT EXISTS quotes (
        id VARCHAR(255) PRIMARY KEY,
        reference_number VARCHAR(255) UNIQUE NOT NULL,
        customer_data TEXT NOT NULL,
        items TEXT NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        total DECIMAL(10,2) NOT NULL,
        currency VARCHAR(3) NOT NULL DEFAULT 'USD',
        status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
        comments TEXT,
        created_at TIMESTAMP WITH TIME ZONE NOT NULL,
        expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
        last_modified_at TIMESTAMP WITH TIME ZONE
      );
    `);

    // Create indexes for better performance
    await client.query('CREATE INDEX IF NOT EXISTS idx_quotes_reference_number ON quotes(reference_number);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);');
    await client.query('CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);');

    console.log('PostgreSQL tables created successfully');
    return true;
  } catch (error) {
    console.error('Failed to create PostgreSQL tables:', error);
    return false;
  } finally {
    client.release();
  }
};

// Close database connection (for graceful shutdown)
export const closeDatabaseConnection = async (): Promise<void> => {
  if (pgPool) {
    await pgPool.end();
    pgPool = null;
  }
};