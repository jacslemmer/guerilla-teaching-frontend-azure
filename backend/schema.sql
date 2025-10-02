-- CloudFlare D1 Database Schema for Guerilla Teaching
-- Generated: 2025-09-29

-- Products table for course catalog
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    original_price REAL,
    image TEXT,
    category TEXT NOT NULL,
    in_stock INTEGER DEFAULT 1,
    featured INTEGER DEFAULT 0,
    tags TEXT, -- JSON array as text
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Quotes table for customer requests
CREATE TABLE quotes (
    id TEXT PRIMARY KEY,
    reference_number TEXT UNIQUE NOT NULL,
    customer_data TEXT NOT NULL, -- JSON object as text
    items TEXT NOT NULL, -- JSON array as text
    total_amount REAL,
    currency TEXT DEFAULT 'ZAR',
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, expired
    comments TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster quote lookups
CREATE INDEX idx_quotes_reference ON quotes(reference_number);
CREATE INDEX idx_quotes_status ON quotes(status);
CREATE INDEX idx_quotes_created ON quotes(created_at);

-- Index for product searches
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);

-- Insert initial product data (from existing pricing2025Products)
INSERT INTO products (id, name, description, price, image, category, in_stock, featured, tags) VALUES
('pricing-igcse-standard-1', 'Standard Service: 1 IGCSE Subject', 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.', 350, '/images/pricing/igcse-standard.jpg', 'Pricing 2025', 1, 0, '["IGCSE", "Standard", "Self Study", "Monthly"]'),

('pricing-igcse-standard-bundle', 'Standard Service IGCSE Bundle', 'Choose any SIX subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. Six subjects included for comprehensive IGCSE preparation.', 1200, '/images/pricing/igcse-standard-bundle.jpg', 'Pricing 2025', 1, 1, '["IGCSE", "Standard", "Bundle", "Six Subjects", "Monthly"]'),

('pricing-igcse-premium-1', 'Premium Service: 1 IGCSE Subject', 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.', 650, '/images/pricing/igcse-premium.jpg', 'Pricing 2025', 1, 1, '["IGCSE", "Premium", "Expert Assessment", "Mock Exams", "Monthly"]'),

('pricing-igcse-premium-bundle', 'Premium Service IGCSE Bundle', 'Choose any SIX subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support. Six subjects included.', 2999, '/images/pricing/igcse-premium-bundle.jpg', 'Pricing 2025', 1, 1, '["IGCSE", "Premium", "Bundle", "Six Subjects", "Expert Support", "Monthly"]'),

('pricing-as-standard-1', 'Standard Service IAS Level Subject', 'Choose any ONE subject from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. This is the most affordable option for SELF STUDY at your own pace.', 350, '/images/pricing/as-standard.jpg', 'Pricing 2025', 1, 0, '["AS Level", "Standard", "Self Study", "Monthly"]'),

('pricing-as-standard-bundle', 'Standard Service IAS Bundle', 'Choose any FOUR subjects from our choice of courses. Our standard Service includes access to all course material, computer assessed material, and memos for self assessment. Four subjects included for AS Level preparation.', 1200, '/images/pricing/as-standard-bundle.jpg', 'Pricing 2025', 1, 0, '["AS Level", "Standard", "Bundle", "Four Subjects", "Monthly"]'),

('pricing-as-premium-1', 'Premium Service: 1 IAS Subject', 'Choose any ONE subject from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support via the platform\'s messaging systems.', 650, '/images/pricing/as-premium.jpg', 'Pricing 2025', 1, 0, '["AS Level", "Premium", "Expert Assessment", "Mock Exams", "Monthly"]'),

('pricing-as-premium-bundle', 'Premium Service: IAS Bundle', 'Choose any FOUR subjects from our choice of courses. Our Premium Service includes everything as per the standard service, but provides expert assessment, feedback, MOCK examinations, progress tracking, and personalised support. Four subjects included.', 2500, '/images/pricing/as-premium-bundle.jpg', 'Pricing 2025', 1, 1, '["AS Level", "Premium", "Bundle", "Four Subjects", "Expert Support", "Monthly"]');