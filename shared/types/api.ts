/**
 * API-related type definitions
 * Shared between frontend and backend
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginationRequest {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedApiResponse<T = any> extends ApiResponse<T[]> {
  pagination?: PaginationResponse;
}

// HTTP Status Codes
export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  CONFLICT = 409,
  UNPROCESSABLE_ENTITY = 422,
  INTERNAL_SERVER_ERROR = 500,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503
}

// API Endpoints
export interface ApiEndpoints {
  products: '/api/products';
  quotes: '/api/quotes';
  customers: '/api/customers';
  shop: '/api/shop';
  pricing: '/api/pricing';
}

export interface RequestHeaders {
  'Content-Type'?: string;
  'Authorization'?: string;
  'User-Agent'?: string;
  'Accept'?: string;
}