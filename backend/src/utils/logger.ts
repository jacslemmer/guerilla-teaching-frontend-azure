import * as winston from 'winston';
import { LogLevel, LogEntry, LoggerConfig } from '@guerilla-teaching/shared-types';

class Logger {
  private winston: winston.Logger;
  private config: LoggerConfig;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableFile: false,
      enableJson: process.env.NODE_ENV === 'production',
      environment: (process.env.NODE_ENV as any) || 'development',
      ...config
    };

    this.winston = this.createWinstonLogger();
  }

  private createWinstonLogger(): winston.Logger {
    const transports: winston.transport[] = [];

    // Console transport
    if (this.config.enableConsole) {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            this.config.enableJson 
              ? winston.format.json()
              : winston.format.printf(({ timestamp, level, message, ...meta }) => {
                  const metaStr = Object.keys(meta).length > 0 ? `\n${JSON.stringify(meta, null, 2)}` : '';
                  return `${timestamp} [${level}]: ${message}${metaStr}`;
                })
          )
        })
      );
    }

    // File transport
    if (this.config.enableFile && this.config.filePath) {
      transports.push(
        new winston.transports.File({
          filename: this.config.filePath,
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.json()
          )
        })
      );
    }

    return winston.createLogger({
      level: this.config.level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true })
      ),
      transports,
      exceptionHandlers: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.errors({ stack: true }),
            winston.format.printf(({ timestamp, level, message, stack }) => {
              return `${timestamp} [${level}]: ${message}\n${stack}`;
            })
          )
        })
      ]
    });
  }

  private createLogEntry(level: LogLevel, message: string, metadata?: Record<string, any>): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      requestId: metadata?.requestId,
      userId: metadata?.userId,
      metadata: metadata ? { ...metadata } : undefined
    };
  }

  public error(message: string, error?: Error, metadata?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.ERROR, message, metadata);
    
    if (error) {
      logEntry.error = {
        code: 'UNKNOWN_ERROR' as any,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
        details: metadata
      };
    }

    this.winston.error(logEntry);
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.WARN, message, metadata);
    this.winston.warn(logEntry);
  }

  public info(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.INFO, message, metadata);
    this.winston.info(logEntry);
  }

  public debug(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.DEBUG, message, metadata);
    this.winston.debug(logEntry);
  }

  public http(message: string, metadata?: Record<string, any>): void {
    this.winston.http(message, metadata);
  }
}

// Create singleton logger instance
const loggerConfig: Partial<LoggerConfig> = {
  level: (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO,
  enableConsole: process.env.LOG_CONSOLE !== 'false',
  enableFile: process.env.LOG_FILE === 'true',
  filePath: process.env.LOG_FILE_PATH || './logs/app.log',
  enableJson: process.env.LOG_JSON === 'true',
  environment: (process.env.NODE_ENV as any) || 'development'
};

export const logger = new Logger(loggerConfig);
export default logger;