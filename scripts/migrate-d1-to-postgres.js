#!/usr/bin/env node

/**
 * Migration Script: Cloudflare D1 to Azure PostgreSQL
 * Exports data from D1 SQLite format and converts to PostgreSQL format
 */

const fs = require('fs');
const path = require('path');

// Configuration
const D1_BACKUP_FILE = process.argv[2] || 'backup.sql';
const POSTGRES_OUTPUT_FILE = process.argv[3] || 'postgres-data.sql';

console.log('🔄 Starting D1 to PostgreSQL migration...');
console.log(`📥 Input file: ${D1_BACKUP_FILE}`);
console.log(`📤 Output file: ${POSTGRES_OUTPUT_FILE}`);

// Check if input file exists
if (!fs.existsSync(D1_BACKUP_FILE)) {
  console.error(`❌ Error: Input file ${D1_BACKUP_FILE} not found.`);
  console.log('Please export your D1 database first:');
  console.log('wrangler d1 export guerilla-teaching-db --output=backup.sql');
  process.exit(1);
}

try {
  // Read the SQLite backup file
  const sqliteContent = fs.readFileSync(D1_BACKUP_FILE, 'utf8');
  console.log('✅ SQLite backup file read successfully');

  // Convert SQLite to PostgreSQL
  let postgresContent = convertSqliteToPostgres(sqliteContent);

  // Write PostgreSQL file
  fs.writeFileSync(POSTGRES_OUTPUT_FILE, postgresContent);
  console.log(`✅ PostgreSQL migration file created: ${POSTGRES_OUTPUT_FILE}`);

  console.log('🎉 Migration completed successfully!');
  console.log('');
  console.log('Next steps:');
  console.log('1. Create your Azure PostgreSQL database');
  console.log('2. Run the migration:');
  console.log(`   psql "postgresql://username:password@server:5432/database?sslmode=require" < ${POSTGRES_OUTPUT_FILE}`);

} catch (error) {
  console.error('❌ Migration failed:', error.message);
  process.exit(1);
}

function convertSqliteToPostgres(sqliteContent) {
  let content = sqliteContent;

  // Add PostgreSQL header
  let postgresContent = `-- PostgreSQL Migration from Cloudflare D1
-- Generated on ${new Date().toISOString()}

-- Drop existing tables if they exist
DROP TABLE IF EXISTS quotes CASCADE;

`;

  // Convert CREATE TABLE statements
  content = content.replace(
    /CREATE TABLE IF NOT EXISTS "?quotes"? \(/g,
    'CREATE TABLE quotes ('
  );

  // Convert column names from camelCase to snake_case
  const columnMappings = {
    referenceNumber: 'reference_number',
    customerData: 'customer_data',
    createdAt: 'created_at',
    expiresAt: 'expires_at',
    lastModifiedAt: 'last_modified_at'
  };

  Object.entries(columnMappings).forEach(([camelCase, snake_case]) => {
    const regex = new RegExp(`"?${camelCase}"?`, 'g');
    content = content.replace(regex, snake_case);
  });

  // Convert SQLite data types to PostgreSQL
  content = content
    // Convert TEXT to appropriate PostgreSQL types
    .replace(/TEXT PRIMARY KEY/g, 'VARCHAR(255) PRIMARY KEY')
    .replace(/TEXT UNIQUE/g, 'VARCHAR(255) UNIQUE')
    .replace(/TEXT NOT NULL/g, 'TEXT NOT NULL')
    .replace(/TEXT,/g, 'TEXT,')
    .replace(/TEXT$/g, 'TEXT')

    // Convert REAL to DECIMAL
    .replace(/REAL/g, 'DECIMAL(10,2)')

    // Convert INTEGER to appropriate types
    .replace(/INTEGER/g, 'BIGINT')

    // Fix timestamp handling
    .replace(/DATETIME/g, 'TIMESTAMP WITH TIME ZONE')

    // Remove SQLite-specific pragmas
    .replace(/PRAGMA.*?;/g, '')

    // Remove SQLite autoincrement
    .replace(/AUTOINCREMENT/g, '')

    // Convert boolean values
    .replace(/'true'/g, 'TRUE')
    .replace(/'false'/g, 'FALSE')

    // Handle CHECK constraints for status enum
    .replace(
      /status VARCHAR\(255\)/g,
      "status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired'))"
    );

  // Extract CREATE TABLE statement
  const createTableMatch = content.match(/CREATE TABLE quotes \([^;]+\);/);
  if (createTableMatch) {
    postgresContent += createTableMatch[0] + '\n\n';
  } else {
    // Fallback table creation
    postgresContent += `CREATE TABLE quotes (
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

`;
  }

  // Add indexes
  postgresContent += `-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_quotes_reference_number ON quotes(reference_number);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at);

`;

  // Convert INSERT statements
  const insertMatches = content.match(/INSERT INTO "?quotes"? VALUES[^;]+;/g);
  if (insertMatches && insertMatches.length > 0) {
    postgresContent += '-- Insert data\n';

    insertMatches.forEach(insertStatement => {
      // Convert column names in INSERT statements
      let convertedInsert = insertStatement.replace(/INSERT INTO "?quotes"?/, 'INSERT INTO quotes');

      // Fix timestamp formats - PostgreSQL expects ISO format
      convertedInsert = convertedInsert.replace(
        /'(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?)'/g,
        "TIMESTAMP WITH TIME ZONE '$1'"
      );

      postgresContent += convertedInsert + '\n';
    });
  } else {
    postgresContent += '-- No data found to migrate\n';
  }

  postgresContent += '\n-- Migration completed\n';

  return postgresContent;
}

// Export function for testing
if (require.main === module) {
  // Script is being run directly
} else {
  module.exports = { convertSqliteToPostgres };
}