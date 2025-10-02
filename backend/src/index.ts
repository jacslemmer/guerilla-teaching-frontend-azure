import express from 'express';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import ServerConfigurator from './config/server';
import productsRoutes from './routes/products';
import quotesRoutes from './routes/quotes';

// Load environment variables
dotenv.config();

const app = express();
const serverConfig = new ServerConfigurator();

// Configure middleware using the server configurator
serverConfig.configureMiddleware(app);

// Routes
app.get('/', (req, res) => {
  const config = serverConfig.getConfig();
  res.json({ 
    message: 'Guerilla Teaching API',
    version: '1.0.0',
    status: 'running',
    environment: config.environment,
    port: config.port
  });
});

// API Routes (health check is handled by ServerConfigurator)
app.get('/api/status', (req, res) => {
  res.json({ 
    api: 'Guerilla Teaching API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: serverConfig.getConfig().environment
  });
});

// Products API routes
app.use('/api/products', productsRoutes);

// Quotes API routes
app.use('/api/quotes', quotesRoutes);

// 404 handler - must come before error handler
app.use('*', errorHandler.notFound);

// Centralized error handling middleware - must be last
app.use(errorHandler.handle);

// Start server using the configurator
serverConfig.startServer(app).catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
}); 