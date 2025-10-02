/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// Default ports - can be overridden by environment variables
const FRONTEND_PORT = parseInt(process.env.FRONTEND_PORT || '3000');
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || '3001');
const BACKEND_HOST = process.env.BACKEND_HOST || 'localhost';

export default defineConfig({
  plugins: [react()],
  
  // Path resolution
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // Development server configuration
  server: {
    port: FRONTEND_PORT,
    host: '0.0.0.0', // Allow external connections
    
    // API proxy configuration
    proxy: {
      // Proxy all /api requests to backend
      '/api': {
        target: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
        changeOrigin: true,
        secure: false,
        ws: true, // Enable WebSocket proxying
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Proxying request:', req.method, req.url, '→', proxyReq.path);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Proxy response:', req.url, '→', proxyRes.statusCode);
          });
        },
      },
      
      // Health check endpoint
      '/health': {
        target: `http://${BACKEND_HOST}:${BACKEND_PORT}`,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  
  // Build configuration
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: process.env.NODE_ENV !== 'production',
    rollupOptions: {
      input: './index.html',
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
        }
      }
    },
    // CloudFlare Pages optimizations
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true
  },
  
  // Environment variables prefix
  envPrefix: 'REACT_APP_',
  
  // Development optimizations
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom']
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  }
});