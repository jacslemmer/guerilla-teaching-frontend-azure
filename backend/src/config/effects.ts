import { logger } from "../utils/logger";
import { LogLevel } from "@guerilla-teaching/shared-types";

/**
 * Backend Configuration (Temporary - Effect-TS removed)
 * 
 * Simple configuration without Effect-TS to unblock deployment.
 * TODO: Reimplement with Effect-TS once compilation issues are resolved.
 */

// Simple configuration interface
export interface EffectConfig {
  concurrency: number;
  timeout: number;
  retryAttempts: number;
  logLevel: LogLevel;
}

// Default configuration
export const defaultEffectConfig: EffectConfig = {
  concurrency: parseInt(process.env.EFFECT_CONCURRENCY || "10"),
  timeout: parseInt(process.env.EFFECT_TIMEOUT || "30000"),
  retryAttempts: parseInt(process.env.EFFECT_RETRY_ATTEMPTS || "3"),
  logLevel: (process.env.LOG_LEVEL as LogLevel) || ("info" as LogLevel)
};

// Simple async operation runner
export const runEffect = async <T>(operation: () => Promise<T> | T): Promise<T> => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    throw error;
  }
};

// Utility function with error handling
export const runEffectSafe = async <T>(
  operation: () => Promise<T> | T,
  onError?: (error: any) => void
): Promise<T | null> => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    if (onError) onError(error);
    return null;
  }
};

// Configuration getter
export const getConfig = (): EffectConfig => defaultEffectConfig;

// Simple logging utilities
export const logInfo = (message: string, meta?: any): void => {
  logger.info(message, meta);
};

export const logError = (message: string, meta?: any): void => {
  logger.error(message, meta);
};

export const logWarn = (message: string, meta?: any): void => {
  logger.warn(message, meta);
};

export const logDebug = (message: string, meta?: any): void => {
  logger.debug(message, meta);
};