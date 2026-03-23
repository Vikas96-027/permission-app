export enum ResponseStatus {
  Success = "Success",
  Unauthorized = "Unauthorized",
  ValidationError = "ValidationError",
  BizFailure = "BizFailure",
  Failure = "Failure",
  AbortError = "AbortError",
}

export type QueryValue = string | number | boolean | null | undefined;
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type ResponseType = "json" | "text" | "blob";

export interface ApiResponseEnvelope<T = unknown> {
  status: ResponseStatus | string;
  message?: string;
  result?: T;
  data?: T;
  items?: T;
  documents?: T;
  details?: unknown;
}

export interface ApiError extends Error {
  status?: number;
  statusText?: string;
  code?: string;
  details?: unknown;
  url?: string;
  isAbortError?: boolean;
}

export interface CacheConfig {
  enabled?: boolean;
  ttl?: number;
  key?: string;
  staleWhileRevalidate?: boolean;
}

export interface RetryConfig {
  attempts?: number;
  delay?: number;
  exponentialBackoff?: boolean;
  retryOn?: number[];
}

export interface RequestConfig {
  headers?: Record<string, string>;
  requiresAuth?: boolean;
  timeout?: number;
  cache?: CacheConfig;
  retry?: RetryConfig;
  contextId?: string;
  responseType?: ResponseType;
  signal?: AbortSignal;
  queryParams?: Record<string, QueryValue>;
}

export interface ApiAuthProvider {
  getToken(): Promise<string | null>;
  isAuthenticated(): boolean;
  handleAuthError?(error: ApiError): Promise<void> | void;
}

export interface HttpClientOptions {
  baseUrl: string;
  timeout: number;
  cacheTTL: number;
  authProvider?: ApiAuthProvider;
  enableLogging?: boolean;
}

export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  timestamp: number;
  ttl: number;
}

export interface CacheLookup<T = unknown> {
  hit: boolean;
  stale: boolean;
  data?: T;
}