import { Request, Response, NextFunction } from 'express';
import { 
  AppError, 
  ErrorCode, 
  ErrorResponse, 
  ValidationError,
  ErrorHandlerConfig 
} from '@guerilla-teaching/shared-types';
import { logger } from '../utils/logger';

export class CustomError extends Error implements AppError {
  code: ErrorCode;
  details?: Record<string, any>;
  timestamp: string;
  requestId?: string;
  userId?: string;

  constructor(
    code: ErrorCode,
    message: string,
    details?: Record<string, any>,
    requestId?: string,
    userId?: string
  ) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    this.userId = userId;
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
}

export class ValidationCustomError extends CustomError implements ValidationError {
  code: ErrorCode.VALIDATION_ERROR;
  details: {
    fields: Array<{
      field: string;
      message: string;
      value?: any;
    }>;
  };

  constructor(
    fields: Array<{ field: string; message: string; value?: any }>,
    requestId?: string,
    userId?: string
  ) {
    super(
      ErrorCode.VALIDATION_ERROR,
      'Validation failed',
      { fields },
      requestId,
      userId
    );
    this.code = ErrorCode.VALIDATION_ERROR;
    this.details = { fields };
  }
}

class ErrorHandler {
  private config: ErrorHandlerConfig;

  constructor(config?: Partial<ErrorHandlerConfig>) {
    this.config = {
      showStackTrace: process.env.NODE_ENV === 'development',
      enableRequestLogging: true,
      environment: (process.env.NODE_ENV as any) || 'development',
      ...config
    };
  }

  private getRequestId(req: Request): string {
    return (req as any).requestId || 'unknown';
  }

  private getUserId(req: Request): string | undefined {
    return (req as any).user?.id;
  }

  private mapHttpStatusToErrorCode(status: number): ErrorCode {
    switch (status) {
      case 400: return ErrorCode.VALIDATION_ERROR;
      case 401: return ErrorCode.UNAUTHORIZED;
      case 403: return ErrorCode.FORBIDDEN;
      case 404: return ErrorCode.NOT_FOUND;
      case 409: return ErrorCode.RESOURCE_CONFLICT;
      case 429: return ErrorCode.RATE_LIMIT_EXCEEDED;
      case 500:
      default:
        return ErrorCode.INTERNAL_SERVER_ERROR;
    }
  }

  private createAppError(error: any, req: Request): AppError {
    const requestId = this.getRequestId(req);
    const userId = this.getUserId(req);

    // If it's already a CustomError, return as is
    if (error instanceof CustomError) {
      return {
        code: error.code,
        message: error.message,
        details: error.details,
        stack: this.config.showStackTrace ? error.stack : undefined,
        timestamp: error.timestamp,
        requestId: error.requestId || requestId,
        userId: error.userId || userId
      };
    }

    // Handle validation errors from express-validator
    if (error.name === 'ValidationError' && error.errors) {
      const fields = Object.keys(error.errors).map(field => ({
        field,
        message: error.errors[field].message,
        value: error.errors[field].value
      }));

      return {
        code: ErrorCode.VALIDATION_ERROR,
        message: 'Validation failed',
        details: { fields },
        stack: this.config.showStackTrace ? error.stack : undefined,
        timestamp: new Date().toISOString(),
        requestId,
        userId
      };
    }

    // Handle other known error types
    let code = ErrorCode.INTERNAL_SERVER_ERROR;
    let message = 'An unexpected error occurred';

    if (error.status || error.statusCode) {
      code = this.mapHttpStatusToErrorCode(error.status || error.statusCode);
      message = error.message || message;
    } else if (error.message) {
      message = error.message;
    }

    return {
      code,
      message,
      stack: this.config.showStackTrace ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      requestId,
      userId
    };
  }

  private getHttpStatus(errorCode: ErrorCode): number {
    switch (errorCode) {
      case ErrorCode.VALIDATION_ERROR:
      case ErrorCode.MISSING_REQUIRED_FIELD:
      case ErrorCode.INVALID_FORMAT:
        return 400;
      case ErrorCode.UNAUTHORIZED:
      case ErrorCode.TOKEN_EXPIRED:
      case ErrorCode.TOKEN_INVALID:
        return 401;
      case ErrorCode.FORBIDDEN:
        return 403;
      case ErrorCode.NOT_FOUND:
      case ErrorCode.QUOTE_NOT_FOUND:
        return 404;
      case ErrorCode.RESOURCE_EXISTS:
      case ErrorCode.RESOURCE_CONFLICT:
        return 409;
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return 429;
      case ErrorCode.INTERNAL_SERVER_ERROR:
      case ErrorCode.DATABASE_ERROR:
      case ErrorCode.EMAIL_SERVICE_ERROR:
      case ErrorCode.PAYMENT_SERVICE_ERROR:
      default:
        return 500;
    }
  }

  public handle = (error: any, req: Request, res: Response, next: NextFunction): void => {
    const appError = this.createAppError(error, req);
    const httpStatus = this.getHttpStatus(appError.code);

    // Log the error
    logger.error(`Error ${appError.code}: ${appError.message}`, error, {
      requestId: appError.requestId,
      userId: appError.userId,
      url: req.url,
      method: req.method,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });

    // Create error response
    const errorResponse: ErrorResponse = {
      success: false,
      error: appError,
      timestamp: new Date().toISOString()
    };

    res.status(httpStatus).json(errorResponse);
  };

  public notFound = (req: Request, res: Response, next: NextFunction): void => {
    const error = new CustomError(
      ErrorCode.NOT_FOUND,
      `Route ${req.originalUrl} not found`,
      { url: req.originalUrl, method: req.method },
      this.getRequestId(req),
      this.getUserId(req)
    );
    next(error);
  };

  public asyncHandler = (fn: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  };
}

// Create singleton error handler instance
const errorHandlerConfig: Partial<ErrorHandlerConfig> = {
  showStackTrace: process.env.SHOW_STACK_TRACE === 'true' || process.env.NODE_ENV === 'development',
  enableRequestLogging: process.env.ENABLE_REQUEST_LOGGING !== 'false',
  environment: (process.env.NODE_ENV as any) || 'development'
};

export const errorHandler = new ErrorHandler(errorHandlerConfig);
export default errorHandler;