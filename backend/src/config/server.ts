import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { logger } from '../utils/logger';

export interface ServerConfig {
  port: number;
  host: string;
  corsOrigins: string[];
  environment: 'development' | 'production' | 'test';
  enableLogging: boolean;
  enableHelmet: boolean;
}

export class ServerConfigurator {
  private config: ServerConfig;

  constructor(config?: Partial<ServerConfig>) {
    this.config = {
      port: parseInt(process.env.PORT || process.env.BACKEND_PORT || '3001'),
      host: process.env.HOST || '0.0.0.0',
      corsOrigins: this.parseCorsOrigins(),
      environment: (process.env.NODE_ENV as any) || 'development',
      enableLogging: process.env.DISABLE_LOGGING !== 'true',
      enableHelmet: process.env.DISABLE_HELMET !== 'true',
      ...config
    };
  }

  private parseCorsOrigins(): string[] {
    const defaultOrigins = [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://127.0.0.1:3000',
      'http://127.0.0.1:3001'
    ];

    if (process.env.CORS_ORIGINS) {
      return process.env.CORS_ORIGINS.split(',').map(origin => origin.trim());
    }

    // Add frontend port from environment
    const frontendPort = process.env.FRONTEND_PORT || '3000';
    const frontendHost = process.env.FRONTEND_HOST || 'localhost';
    
    return [
      ...defaultOrigins,
      `http://${frontendHost}:${frontendPort}`,
      `http://127.0.0.1:${frontendPort}`
    ];
  }

  public configureMiddleware(app: express.Application): void {
    // Security middleware
    if (this.config.enableHelmet) {
      app.use(helmet({
        crossOriginEmbedderPolicy: false, // Allow cross-origin requests for development
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
          },
        },
      }));
    }

    // CORS configuration
    app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);
        
        if (this.config.corsOrigins.includes(origin)) {
          return callback(null, true);
        } else {
          logger.warn(`CORS blocked origin: ${origin}`, {
            allowedOrigins: this.config.corsOrigins,
            requestOrigin: origin
          });
          return callback(new Error('Not allowed by CORS'), false);
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
    }));

    // Logging middleware
    if (this.config.enableLogging) {
      app.use(morgan('combined', {
        stream: {
          write: (message: string) => {
            logger.http(message.trim());
          }
        }
      }));
    }

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.json({ 
        status: 'OK', 
        timestamp: new Date().toISOString(),
        environment: this.config.environment,
        port: this.config.port
      });
    });

    logger.info('Server middleware configured', {
      port: this.config.port,
      host: this.config.host,
      environment: this.config.environment,
      corsOrigins: this.config.corsOrigins,
      enableLogging: this.config.enableLogging,
      enableHelmet: this.config.enableHelmet
    });
  }

  public startServer(app: express.Application): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = app.listen(this.config.port, this.config.host, () => {
        logger.info(`🚀 Server running on ${this.config.host}:${this.config.port}`);
        logger.info(`📡 API available at http://${this.config.host}:${this.config.port}`);
        logger.info(`🌍 Environment: ${this.config.environment}`);
        logger.info(`🔗 CORS Origins: ${this.config.corsOrigins.join(', ')}`);
        resolve();
      });

      server.on('error', (error: any) => {
        if (error.code === 'EADDRINUSE') {
          logger.error(`❌ Port ${this.config.port} is already in use`);
          reject(new Error(`Port ${this.config.port} is already in use`));
        } else {
          logger.error('❌ Server startup error:', error);
          reject(error);
        }
      });
    });
  }

  public getConfig(): ServerConfig {
    return { ...this.config };
  }
}

export default ServerConfigurator;