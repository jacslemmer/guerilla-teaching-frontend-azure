import { LogLevel, LogEntry, LoggerConfig } from '@guerilla-teaching/shared-types';

class FrontendLogger {
  private config: LoggerConfig;

  constructor(config?: Partial<LoggerConfig>) {
    this.config = {
      level: LogLevel.INFO,
      enableConsole: true,
      enableJson: false,
      environment: (process.env.NODE_ENV as any) || 'development',
      ...config
    };
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    const currentLevelIndex = levels.indexOf(this.config.level);
    const messageLevelIndex = levels.indexOf(level);
    return messageLevelIndex <= currentLevelIndex;
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

  private formatLogMessage(logEntry: LogEntry): string {
    if (this.config.enableJson) {
      return JSON.stringify(logEntry);
    }

    const { timestamp, level, message, metadata } = logEntry;
    const metaStr = metadata && Object.keys(metadata).length > 0 
      ? ` | ${JSON.stringify(metadata)}` 
      : '';
    
    return `[${timestamp}] ${level.toUpperCase()}: ${message}${metaStr}`;
  }

  private logToConsole(logEntry: LogEntry): void {
    if (!this.config.enableConsole || !this.shouldLog(logEntry.level)) {
      return;
    }

    const formattedMessage = this.formatLogMessage(logEntry);

    switch (logEntry.level) {
      case LogLevel.ERROR:
        console.error(formattedMessage, logEntry.error);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      default:
        console.log(formattedMessage);
    }
  }

  private sendToExternalService(logEntry: LogEntry): void {
    // In a real application, you might send logs to an external service
    // like LogRocket, Sentry, or a custom logging endpoint
    if (this.config.environment === 'production' && logEntry.level === LogLevel.ERROR) {
      // Example: Send to logging service
      // fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(logEntry)
      // }).catch(() => {
      //   // Fail silently to avoid logging loops
      // });
    }
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

    this.logToConsole(logEntry);
    this.sendToExternalService(logEntry);
  }

  public warn(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.WARN, message, metadata);
    this.logToConsole(logEntry);
    this.sendToExternalService(logEntry);
  }

  public info(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.INFO, message, metadata);
    this.logToConsole(logEntry);
    this.sendToExternalService(logEntry);
  }

  public debug(message: string, metadata?: Record<string, any>): void {
    const logEntry = this.createLogEntry(LogLevel.DEBUG, message, metadata);
    this.logToConsole(logEntry);
    this.sendToExternalService(logEntry);
  }

  public setUserId(userId: string): void {
    // Store user ID for subsequent logs
    (window as any).__LOGGER_USER_ID__ = userId;
  }

  public setRequestId(requestId: string): void {
    // Store request ID for subsequent logs
    (window as any).__LOGGER_REQUEST_ID__ = requestId;
  }

  private getStoredUserId(): string | undefined {
    return (window as any).__LOGGER_USER_ID__;
  }

  private getStoredRequestId(): string | undefined {
    return (window as any).__LOGGER_REQUEST_ID__;
  }
}

// Create singleton logger instance
const loggerConfig: Partial<LoggerConfig> = {
  level: (process.env.REACT_APP_LOG_LEVEL as LogLevel) || LogLevel.INFO,
  enableConsole: process.env.REACT_APP_LOG_CONSOLE !== 'false',
  enableJson: process.env.REACT_APP_LOG_JSON === 'true',
  environment: (process.env.NODE_ENV as any) || 'development'
};

export const logger = new FrontendLogger(loggerConfig);
export default logger;