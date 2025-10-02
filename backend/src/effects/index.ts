/**
 * Backend Utilities (Temporary - Effect-TS removed due to compilation issues)
 * 
 * Simple async/await patterns replacing Effect-TS to unblock deployment.
 * TODO: Reimplement with Effect-TS once compilation issues are resolved.
 */

import { ApiResponse, ApiError, HttpStatus } from "@guerilla-teaching/shared-types";

// Simple API response helpers
export const createSuccessResponse = <T>(
  data: T, 
  message?: string
): ApiResponse<T> => ({
  success: true,
  data,
  message: message || "Operation completed successfully",
  timestamp: new Date().toISOString()
});

export const createErrorResponse = (
  code: string,
  message: string,
  statusCode: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR,
  details?: any
): ApiError => ({
  code,
  message,
  details,
  timestamp: new Date().toISOString()
});

// Simple database operation wrapper
export const dbOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw createErrorResponse(
      "DATABASE_ERROR",
      `Database operation failed: ${operationName}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Simple HTTP request wrapper
export const httpRequest = async <T>(
  request: () => Promise<T>,
  requestName: string
): Promise<T> => {
  try {
    return await request();
  } catch (error) {
    throw createErrorResponse(
      "HTTP_REQUEST_ERROR", 
      `HTTP request failed: ${requestName}`,
      HttpStatus.BAD_GATEWAY,
      error
    );
  }
};

// Simple validation
export const validate = <T>(
  data: unknown,
  validator: (data: unknown) => data is T,
  errorMessage: string = "Validation failed"
): T => {
  if (validator(data)) {
    return data;
  }
  throw createErrorResponse("VALIDATION_ERROR", errorMessage, HttpStatus.BAD_REQUEST);
};

// Simple JSON parsing
export const parseJSON = <T>(
  jsonString: string,
  errorMessage: string = "Invalid JSON format"
): T => {
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    throw createErrorResponse(
      "JSON_PARSE_ERROR",
      errorMessage,
      HttpStatus.BAD_REQUEST,
      { input: jsonString }
    );
  }
};

// Simple file operation wrapper
export const fileOperation = async <T>(
  operation: () => Promise<T>,
  filename: string
): Promise<T> => {
  try {
    return await operation();
  } catch (error) {
    throw createErrorResponse(
      "FILE_OPERATION_ERROR",
      `File operation failed: ${filename}`,
      HttpStatus.INTERNAL_SERVER_ERROR,
      error
    );
  }
};

// Simple environment variable helper
export const getEnvVar = (
  name: string,
  defaultValue?: string
): string => {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw createErrorResponse(
      "ENV_VAR_MISSING",
      `Environment variable not found: ${name}`,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
  return value;
};

// Simple fallback helper
export const withFallback = async <T>(
  primaryOperation: () => Promise<T>,
  fallbackOperation: () => Promise<T>
): Promise<T> => {
  try {
    return await primaryOperation();
  } catch (error) {
    console.warn("Primary operation failed, using fallback:", error);
    return await fallbackOperation();
  }
};