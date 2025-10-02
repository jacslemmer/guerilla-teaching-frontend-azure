import React from 'react';
import { 
  AppError, 
  ErrorCode, 
  ErrorResponse, 
  ValidationError,
  ErrorHandlerConfig 
} from '@guerilla-teaching/shared-types';
import { logger } from './logger';

export class FrontendError extends Error implements AppError {
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
    this.name = 'FrontendError';
    this.code = code;
    this.details = details;
    this.timestamp = new Date().toISOString();
    this.requestId = requestId;
    this.userId = userId;
  }
}

class FrontendErrorHandler {
  private config: ErrorHandlerConfig;

  constructor(config?: Partial<ErrorHandlerConfig>) {
    this.config = {
      showStackTrace: process.env.NODE_ENV === 'development',
      enableRequestLogging: true,
      environment: (process.env.NODE_ENV as any) || 'development',
      ...config
    };
  }

  public handleApiError = (error: any): AppError => {
    // If the error is already an ErrorResponse from the API
    if (error?.response?.data?.error) {
      return error.response.data.error;
    }

    // If it's a network error
    if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      return {
        code: ErrorCode.INTERNAL_SERVER_ERROR,
        message: 'Network error occurred. Please check your connection.',
        timestamp: new Date().toISOString(),
        details: { originalError: error.message }
      };
    }

    // If it's an HTTP error with a response
    if (error?.response) {
      const status = error.response.status;
      let code: ErrorCode;
      let message: string;

      switch (status) {
        case 400:
          code = ErrorCode.VALIDATION_ERROR;
          message = 'Invalid request data';
          break;
        case 401:
          code = ErrorCode.UNAUTHORIZED;
          message = 'You are not authorized to perform this action';
          break;
        case 403:
          code = ErrorCode.FORBIDDEN;
          message = 'Access denied';
          break;
        case 404:
          code = ErrorCode.NOT_FOUND;
          message = 'The requested resource was not found';
          break;
        case 429:
          code = ErrorCode.RATE_LIMIT_EXCEEDED;
          message = 'Too many requests. Please try again later';
          break;
        case 500:
        default:
          code = ErrorCode.INTERNAL_SERVER_ERROR;
          message = 'An unexpected server error occurred';
      }

      return {
        code,
        message,
        timestamp: new Date().toISOString(),
        details: { 
          status,
          originalError: error.response.data?.message || error.message 
        }
      };
    }

    // Fallback for unknown errors
    return {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error?.message || 'An unknown error occurred',
      timestamp: new Date().toISOString(),
      details: { originalError: error }
    };
  };

  public handleJavaScriptError = (error: Error, errorInfo?: any): AppError => {
    const appError: AppError = {
      code: ErrorCode.UNKNOWN_ERROR,
      message: error.message,
      stack: this.config.showStackTrace ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      details: errorInfo ? { errorInfo } : undefined
    };

    logger.error('JavaScript error occurred', error, {
      errorInfo,
      url: window.location.href,
      userAgent: navigator.userAgent
    });

    return appError;
  };

  public handlePromiseRejection = (event: PromiseRejectionEvent): AppError => {
    const error = event.reason;
    
    let appError: AppError;
    if (error instanceof Error) {
      appError = this.handleJavaScriptError(error);
    } else if (typeof error === 'string') {
      appError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: error,
        timestamp: new Date().toISOString()
      };
    } else {
      appError = {
        code: ErrorCode.UNKNOWN_ERROR,
        message: 'An unhandled promise rejection occurred',
        timestamp: new Date().toISOString(),
        details: { reason: error }
      };
    }

    logger.error('Unhandled promise rejection', error, {
      url: window.location.href
    });

    return appError;
  };

  public showUserFriendlyMessage = (error: AppError): string => {
    switch (error.code) {
      case ErrorCode.UNAUTHORIZED:
        return 'Please log in to continue.';
      case ErrorCode.FORBIDDEN:
        return 'You don\'t have permission to perform this action.';
      case ErrorCode.NOT_FOUND:
        return 'The requested item could not be found.';
      case ErrorCode.VALIDATION_ERROR:
        return 'Please check your input and try again.';
      case ErrorCode.RATE_LIMIT_EXCEEDED:
        return 'Too many requests. Please wait a moment and try again.';
      case ErrorCode.EMAIL_SERVICE_ERROR:
        return 'Email service is temporarily unavailable. Please try again later.';
      case ErrorCode.QUOTE_EXPIRED:
        return 'This quote has expired. Please create a new quote.';
      case ErrorCode.QUOTE_NOT_FOUND:
        return 'Quote not found. Please check the reference number.';
      case ErrorCode.PRODUCT_NOT_AVAILABLE:
        return 'This product is currently not available.';
      default:
        return 'Something went wrong. Please try again later.';
    }
  };
}

// Error Boundary Component
interface ErrorBoundaryState {
  hasError: boolean;
  error?: AppError;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: AppError }>;
  onError?: (error: AppError) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private errorHandler: FrontendErrorHandler;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    this.errorHandler = new FrontendErrorHandler();
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const appError = this.errorHandler.handleJavaScriptError(error, errorInfo);
    this.setState({ error: appError });
    
    if (this.props.onError) {
      this.props.onError(appError);
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return <FallbackComponent error={this.state.error} />;
      }

      return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <p>{this.errorHandler.showUserFriendlyMessage(this.state.error)}</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create singleton error handler instance
export const errorHandler = new FrontendErrorHandler();

// Setup global error handlers
export const setupGlobalErrorHandlers = (): void => {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    errorHandler.handlePromiseRejection(event);
    event.preventDefault(); // Prevent the default browser behavior
  });

  // Handle global JavaScript errors
  window.addEventListener('error', (event) => {
    const error = new Error(event.message);
    error.stack = `${event.filename}:${event.lineno}:${event.colno}`;
    errorHandler.handleJavaScriptError(error);
  });
};

export default errorHandler;