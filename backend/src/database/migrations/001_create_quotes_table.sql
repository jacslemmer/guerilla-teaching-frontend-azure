-- Migration: Create quotes table
-- Description: Initial quote storage table with reference numbers, customer data, and expiration tracking
-- Version: 001
-- Created: 2025-01-06

-- Create quotes table
CREATE TABLE IF NOT EXISTS quotes (
    id TEXT PRIMARY KEY,
    referenceNumber TEXT UNIQUE NOT NULL,
    customerData TEXT NOT NULL, -- JSON string containing customer information
    items TEXT NOT NULL, -- JSON string containing quote items
    subtotal REAL NOT NULL,
    total REAL NOT NULL,
    currency TEXT NOT NULL DEFAULT 'ZAR',
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    comments TEXT,
    createdAt TEXT NOT NULL, -- ISO 8601 timestamp
    expiresAt TEXT NOT NULL, -- ISO 8601 timestamp (1 month from creation)
    lastModifiedAt TEXT
);

-- Create index for fast reference number lookups
CREATE INDEX IF NOT EXISTS idx_quotes_reference ON quotes(referenceNumber);

-- Create index for status queries
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);

-- Create index for expiration tracking
CREATE INDEX IF NOT EXISTS idx_quotes_expires_at ON quotes(expiresAt);

-- Create index for creation date ordering
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(createdAt);

-- Insert initial test data for development (will be removed in production)
-- This helps verify the table structure works correctly
INSERT OR IGNORE INTO quotes (
    id,
    referenceNumber,
    customerData,
    items,
    subtotal,
    total,
    currency,
    status,
    comments,
    createdAt,
    expiresAt
) VALUES (
    'test-quote-001',
    'GT-2025-0001',
    '{"firstName":"Test","lastName":"Customer","email":"test@example.com","phone":"+27123456789"}',
    '[{"id":"test-item","name":"Test Product","price":100,"quantity":1,"category":"Test"}]',
    100.0,
    100.0,
    'ZAR',
    'pending',
    'Test quote for development',
    datetime('now'),
    datetime('now', '+1 month')
);