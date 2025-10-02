/**
 * CloudFlare Worker for Guerilla Teaching API
 * Replaces the Express.js backend with native CF Workers
 */

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
};

// Helper to create JSON responses with CORS
function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

// Helper to handle CORS preflight
function handleCORS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// Generate unique reference number (GT-YYYY-NNNN format)
function generateReferenceNumber(existingRefs = []) {
  const year = new Date().getFullYear();
  let counter = 1;
  let reference;

  do {
    reference = `GT-${year}-${counter.toString().padStart(4, '0')}`;
    counter++;
  } while (existingRefs.includes(reference));

  return reference;
}

// Generate UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Products API handlers
async function handleProducts(request, env, pathname) {
  const method = request.method;
  const url = new URL(request.url);

  // GET /api/products - List all products with filters
  if (method === 'GET' && pathname === '/api/products') {
    try {
      const category = url.searchParams.get('category');
      const search = url.searchParams.get('search');
      const featured = url.searchParams.get('featured');

      let query = 'SELECT * FROM products WHERE 1=1';
      const params = [];

      if (category && category !== 'all') {
        query += ' AND category = ?';
        params.push(category);
      }

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      if (featured === 'true') {
        query += ' AND featured = 1';
      }

      query += ' ORDER BY created_at DESC';

      const result = await env.DB.prepare(query).bind(...params).all();

      // Parse JSON fields
      const products = result.results.map(product => ({
        ...product,
        tags: JSON.parse(product.tags || '[]'),
        inStock: Boolean(product.in_stock),
        featured: Boolean(product.featured),
      }));

      return jsonResponse(products);
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch products' }, 500);
    }
  }

  // GET /api/products/:id - Get single product
  if (method === 'GET' && pathname.startsWith('/api/products/')) {
    try {
      const productId = pathname.split('/')[3];

      const result = await env.DB.prepare('SELECT * FROM products WHERE id = ?')
        .bind(productId).first();

      if (!result) {
        return jsonResponse({ error: 'Product not found' }, 404);
      }

      const product = {
        ...result,
        tags: JSON.parse(result.tags || '[]'),
        inStock: Boolean(result.in_stock),
        featured: Boolean(result.featured),
      };

      return jsonResponse(product);
    } catch (error) {
      return jsonResponse({ error: 'Failed to fetch product' }, 500);
    }
  }

  // POST /api/products - Create product (admin)
  if (method === 'POST' && pathname === '/api/products') {
    try {
      const body = await request.json();
      const { name, description, price, originalPrice, image, category, inStock, featured, tags } = body;

      if (!name || !description || !price || !category) {
        return jsonResponse({ error: 'Missing required fields' }, 400);
      }

      const productId = generateUUID();

      await env.DB.prepare(`
        INSERT INTO products (id, name, description, price, original_price, image, category, in_stock, featured, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        productId,
        name,
        description,
        parseFloat(price),
        originalPrice ? parseFloat(originalPrice) : null,
        image,
        category,
        inStock ? 1 : 0,
        featured ? 1 : 0,
        JSON.stringify(tags || [])
      ).run();

      const newProduct = {
        id: productId,
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        image,
        category,
        inStock: Boolean(inStock),
        featured: Boolean(featured),
        tags: tags || []
      };

      return jsonResponse(newProduct, 201);
    } catch (error) {
      return jsonResponse({ error: 'Failed to create product' }, 500);
    }
  }

  return jsonResponse({ error: 'Product endpoint not found' }, 404);
}

// Quotes API handlers
async function handleQuotes(request, env, pathname) {
  const method = request.method;
  const url = new URL(request.url);

  // POST /api/quotes - Create new quote
  if (method === 'POST' && pathname === '/api/quotes') {
    try {
      const body = await request.json();
      const { items, customer, comments } = body;

      if (!items || !Array.isArray(items) || items.length === 0) {
        return jsonResponse({
          success: false,
          message: 'Quote must have at least one item'
        }, 400);
      }

      if (!customer) {
        return jsonResponse({
          success: false,
          message: 'Customer information is required'
        }, 400);
      }

      // Get existing references for uniqueness
      const existingRefs = await env.DB.prepare('SELECT reference_number FROM quotes')
        .all();
      const refNumbers = existingRefs.results.map(r => r.reference_number);

      // Calculate total amount
      const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Generate unique reference
      const referenceNumber = generateReferenceNumber(refNumbers);
      const quoteId = generateUUID();

      // Create quote
      await env.DB.prepare(`
        INSERT INTO quotes (id, reference_number, customer_data, items, total_amount, currency, status, comments)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        quoteId,
        referenceNumber,
        JSON.stringify(customer),
        JSON.stringify(items),
        totalAmount,
        'ZAR',
        'pending',
        comments || null
      ).run();

      const quote = {
        id: quoteId,
        referenceNumber,
        customer,
        items,
        totalAmount,
        currency: 'ZAR',
        status: 'pending',
        comments,
        createdAt: new Date().toISOString(),
      };

      // Send email notification using CloudFlare Email Workers
      try {
        const { sendQuoteNotification, sendCustomerConfirmation } = await import('./email.js');
        await sendQuoteNotification(quote, env);
        await sendCustomerConfirmation(quote, env);
        console.log(`✅ Email notifications sent for quote: ${referenceNumber}`);
      } catch (emailError) {
        console.warn(`⚠️ Failed to send email notifications for quote ${referenceNumber}:`, emailError);
        // Don't fail the quote creation if email fails
      }

      return jsonResponse({
        success: true,
        quote,
        message: 'Quote created successfully'
      }, 201);
    } catch (error) {
      return jsonResponse({
        success: false,
        message: 'Failed to create quote'
      }, 500);
    }
  }

  // GET /api/quotes/:reference - Get quote by reference
  if (method === 'GET' && pathname.startsWith('/api/quotes/') && pathname !== '/api/quotes/') {
    try {
      const reference = pathname.split('/')[3];

      // Validate reference format
      if (!/^GT-\\d{4}-\\d{4}$/.test(reference)) {
        return jsonResponse({
          success: false,
          message: 'Invalid reference number format. Expected: GT-YYYY-NNNN'
        }, 400);
      }

      const result = await env.DB.prepare('SELECT * FROM quotes WHERE reference_number = ?')
        .bind(reference).first();

      if (!result) {
        return jsonResponse({
          success: false,
          message: 'Quote not found'
        }, 404);
      }

      const quote = {
        ...result,
        customer: JSON.parse(result.customer_data),
        items: JSON.parse(result.items),
        referenceNumber: result.reference_number,
        totalAmount: result.total_amount,
        createdAt: result.created_at,
      };

      // Remove internal fields
      delete quote.customer_data;
      delete quote.reference_number;
      delete quote.total_amount;
      delete quote.created_at;

      return jsonResponse({
        success: true,
        quote
      });
    } catch (error) {
      return jsonResponse({
        success: false,
        message: 'Failed to retrieve quote'
      }, 500);
    }
  }

  // GET /api/quotes - Get all quotes (admin)
  if (method === 'GET' && pathname === '/api/quotes') {
    try {
      const limit = parseInt(url.searchParams.get('limit')) || 50;
      const offset = parseInt(url.searchParams.get('offset')) || 0;

      if (limit < 1 || limit > 100) {
        return jsonResponse({
          success: false,
          message: 'Limit must be between 1 and 100'
        }, 400);
      }

      const result = await env.DB.prepare(`
        SELECT * FROM quotes
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(limit, offset).all();

      const quotes = result.results.map(quote => ({
        ...quote,
        customer: JSON.parse(quote.customer_data),
        items: JSON.parse(quote.items),
        referenceNumber: quote.reference_number,
        totalAmount: quote.total_amount,
        createdAt: quote.created_at,
      }));

      return jsonResponse({
        success: true,
        quotes,
        pagination: { limit, offset, count: quotes.length }
      });
    } catch (error) {
      return jsonResponse({
        success: false,
        message: 'Failed to retrieve quotes'
      }, 500);
    }
  }

  return jsonResponse({ error: 'Quote endpoint not found' }, 404);
}

// Main worker handler
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return handleCORS();
    }

    // Health check endpoints
    if (pathname === '/' || pathname === '/api/status') {
      return jsonResponse({
        api: 'Guerilla Teaching API',
        version: '2.0.0-cloudflare',
        timestamp: new Date().toISOString(),
        environment: 'cloudflare-workers'
      });
    }

    // Route to appropriate handlers
    if (pathname.startsWith('/api/products')) {
      return handleProducts(request, env, pathname);
    }

    if (pathname.startsWith('/api/quotes')) {
      return handleQuotes(request, env, pathname);
    }

    // 404 for unknown routes
    return jsonResponse({ error: 'Endpoint not found' }, 404);
  },
};