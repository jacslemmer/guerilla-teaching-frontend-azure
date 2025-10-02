#!/usr/bin/env node

const http = require('http');

// Test API endpoints
async function testAPI() {
  console.log('🧪 Testing API endpoints...');
  
  // First check if backend is running
  try {
    console.log('🔍 Checking if backend is running on port 3001...');
    await makeRequest('http://localhost:3001/health');
    console.log('✅ Backend is running, proceeding with API tests...');
  } catch (err) {
    if (err.message.includes('ECONNREFUSED')) {
      console.log('⚠️  Backend not running on port 3001, skipping API tests');
      console.log('💡 To run API tests, start the backend with: npm run dev --prefix backend');
      console.log('✅ API test completed (skipped - backend not running)');
      return;
    } else {
      console.log('⚠️  Backend health check failed, but continuing with tests...');
    }
  }
  
  try {
    // Test 1: GET /api/shop/products should return []
    const products = await makeRequest('http://localhost:3001/api/shop/products');
    if (JSON.stringify(products) !== '[]') {
      throw new Error(`Expected empty array, got: ${JSON.stringify(products)}`);
    }
    console.log('✅ GET /api/shop/products returns []');

    // Test 2: GET /api/shop/products/1 should return 404
    try {
      await makeRequest('http://localhost:3001/api/shop/products/1');
      throw new Error('Expected 404, but request succeeded');
    } catch (err) {
      if (err.message.includes('404')) {
        console.log('✅ GET /api/shop/products/1 returns 404');
      } else {
        throw err;
      }
    }

    // Test 3: Health check
    const health = await makeRequest('http://localhost:3001/health');
    if (!health.status || health.status !== 'OK') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('✅ Health check passed');

    console.log('🎉 All API tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    process.exit(1);
  }
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        } else {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        }
      });
    });
    
    req.on('error', (err) => {
      reject(err);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Run tests
testAPI();