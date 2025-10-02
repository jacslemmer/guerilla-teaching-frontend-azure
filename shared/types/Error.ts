/**
 * Error-related type definitions
 * Shared between frontend and backend
 */

export enum ErrorCode {
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  
  // Authentication errors
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT = 'INVALID_FORMAT',
  
  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  RESOURCE_EXISTS = 'RESOURCE_EXISTS',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  
  // Business logic errors
  QUOTE_EXPIRED = 'QUOTE_EXPIRED',
  QUOTE_NOT_FOUND = 'QUOTE_NOT_FOUND',
  PRODUCT_NOT_AVAILABLE = 'PRODUCT_NOT_AVAILABLE',
  
  // External service errors
  EMAIL_SERVICE_ERROR = 'EMAIL_SERVICE_ERROR',
  PAYMENT_SERVICE_ERROR = 'PAYMENT_SERVICE_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
}

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface AppError {
  code: ErrorCode;
  message: string;
  details?: Record<string, any>;
  stack?: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
}

export interface ValidationErrorDetail {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationError extends AppError {
  code: ErrorCode.VALIDATION_ERROR;
  details: {
    fields: ValidationErrorDetail[];
  };
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  error?: AppError;
}

export interface ErrorResponse {
  success: false;
  error: AppError;
  timestamp: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableFile?: boolean;
  filePath?: string;
  enableJson?: boolean;
  environment: 'development' | 'production' | 'test';
}

export interface ErrorHandlerConfig {
  showStackTrace: boolean;
  enableRequestLogging: boolean;
  environment: 'development' | 'production' | 'test';
}