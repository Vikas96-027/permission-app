import { ApiCache } from "../api/ApiCache";
import { RequestRegistry } from "../api/RequestRegistry";
import { retryWithBackoff } from "./retry";
import type {
  ApiError,
  HttpClientOptions,
  HttpMethod,
  QueryValue,
  RequestConfig,
  ResponseType,
} from "./types";

type RequestWithUrl = RequestInit & { url: string };
type RequestInterceptor = (config: RequestWithUrl) => Promise<RequestWithUrl> | RequestWithUrl;
type ResponseInterceptor = (response: Response) => Promise<Response> | Response;
type ErrorInterceptor = (error: ApiError) => Promise<ApiError> | ApiError;

export class HttpClient {
  private readonly cache = new ApiCache();
  private readonly requestRegistry = new RequestRegistry();
  private readonly requestInterceptors: RequestInterceptor[] = [];
  private readonly responseInterceptors: ResponseInterceptor[] = [];
  private readonly errorInterceptors: ErrorInterceptor[] = [];

  constructor(private readonly options: HttpClientOptions) {}

  addRequestInterceptor(interceptor: RequestInterceptor): void {
    this.requestInterceptors.push(interceptor);
  }

  addResponseInterceptor(interceptor: ResponseInterceptor): void {
    this.responseInterceptors.push(interceptor);
  }

  addErrorInterceptor(interceptor: ErrorInterceptor): void {
    this.errorInterceptors.push(interceptor);
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("GET", endpoint, undefined, config);
  }

  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>("POST", endpoint, body, config);
  }

  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>("PUT", endpoint, body, config);
  }

  patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.request<T>("PATCH", endpoint, body, config);
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.request<T>("DELETE", endpoint, undefined, config);
  }

  clearCache(): void {
    this.cache.clear();
  }

  clearCachePattern(pattern: string | RegExp): void {
    this.cache.clearPattern(pattern);
  }

  abortRequestsByContext(contextId: string): void {
    this.requestRegistry.abortContext(contextId);
  }

  abortAllRequests(): void {
    this.requestRegistry.abortAll();
  }

  private async request<T>(
    method: HttpMethod,
    endpoint: string,
    body?: unknown,
    config: RequestConfig = {}
  ): Promise<T> {
    const url = this.buildUrl(endpoint, config.queryParams);
    const cacheKey = config.cache?.key ?? `${method}:${url}`;

    if (method === "GET" && config.cache?.enabled) {
      const cached = this.cache.get<T>(cacheKey);
      if (cached.hit && !cached.stale) {
        return cached.data as T;
      }

      const pending = this.cache.getInFlight<T>(cacheKey);
      if (pending) {
        return pending;
      }

      if (cached.hit && cached.stale && config.cache.staleWhileRevalidate) {
        void this.executeRequest<T>(method, url, body, config, cacheKey).catch(() => undefined);
        return cached.data as T;
      }

      const promise = this.executeRequest<T>(method, url, body, config, cacheKey);
      return this.cache.setInFlight(cacheKey, promise);
    }

    return this.executeRequest<T>(method, url, body, config, cacheKey);
  }

  private async executeRequest<T>(
    method: HttpMethod,
    url: string,
    body: unknown,
    config: RequestConfig,
    cacheKey: string
  ): Promise<T> {
    const contextId = config.contextId ?? "global";
    const { requestId, controller } = this.requestRegistry.create(contextId);
    const timeout = config.timeout ?? this.options.timeout;
    const timeoutId = window.setTimeout(() => controller.abort(), timeout);

    if (config.signal) {
      if (config.signal.aborted) {
        controller.abort();
      } else {
        config.signal.addEventListener("abort", () => controller.abort(), { once: true });
      }
    }

    try {
      const token =
        config.requiresAuth === false || !this.options.authProvider
          ? null
          : await this.options.authProvider.getToken();

      let requestConfig: RequestWithUrl = {
        url,
        method,
        headers: this.buildHeaders(token, config.headers, body),
        body: this.serializeBody(body),
        signal: controller.signal,
      };

      for (const interceptor of this.requestInterceptors) {
        requestConfig = await interceptor(requestConfig);
      }

      const response = await retryWithBackoff(async () => {
        const { url: requestUrl, ...requestInit } = requestConfig;
        const rawResponse = await fetch(requestUrl, requestInit);

        let nextResponse = rawResponse;
        for (const interceptor of this.responseInterceptors) {
          nextResponse = await interceptor(nextResponse);
        }

        if (!nextResponse.ok) {
          throw await this.toApiError(nextResponse, requestUrl);
        }

        return nextResponse;
      }, config.retry);

      const parsed = await this.parseResponse<T>(response, config.responseType);

      if (method === "GET" && config.cache?.enabled) {
        this.cache.set(cacheKey, parsed, config.cache.ttl ?? this.options.cacheTTL);
      }

      return parsed;
    } catch (error) {
      const normalized = await this.runErrorInterceptors(this.normalizeError(error, url));
      if (normalized.status === 401) {
        await this.options.authProvider?.handleAuthError?.(normalized);
      }
      throw normalized;
    } finally {
      clearTimeout(timeoutId);
      this.requestRegistry.complete(contextId, requestId);
    }
  }

  private buildUrl(endpoint: string, queryParams?: Record<string, QueryValue>): string {
    const absolute = /^https?:\/\//i.test(endpoint);
    const base = this.options.baseUrl.replace(/\/$/, "");
    const path = endpoint.replace(/^\//, "");
    const url = absolute ? endpoint : `${base}/${path}`;
    const finalUrl = new URL(url);

    if (queryParams) {
      Object.entries(queryParams).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          finalUrl.searchParams.set(key, String(value));
        }
      });
    }

    return finalUrl.toString();
  }

  private buildHeaders(
    token: string | null,
    headers?: Record<string, string>,
    body?: unknown
  ): Headers {
    const finalHeaders = new Headers(headers);

    if (!finalHeaders.has("Accept")) {
      finalHeaders.set("Accept", "application/json");
    }

    const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
    if (body !== undefined && body !== null && !isFormData && !finalHeaders.has("Content-Type")) {
      finalHeaders.set("Content-Type", "application/json");
    }

    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }

    return finalHeaders;
  }

  private serializeBody(body?: unknown): BodyInit | undefined {
    if (body === undefined || body === null) return undefined;
    if (typeof body === "string" || body instanceof Blob || body instanceof FormData) {
      return body;
    }
    return JSON.stringify(body);
  }

  private async parseResponse<T>(response: Response, responseType: ResponseType = "json"): Promise<T> {
    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return undefined as T;
    }

    if (responseType === "text") {
      return (await response.text()) as T;
    }

    if (responseType === "blob") {
      return (await response.blob()) as T;
    }

    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      return (await response.text()) as T;
    }

    return (await response.json()) as T;
  }

  private async toApiError(response: Response, url: string): Promise<ApiError> {
    let details: unknown;

    try {
      details = await response.clone().json();
    } catch {
      try {
        details = await response.text();
      } catch {
        details = undefined;
      }
    }

    const error = new Error(
      (details as any)?.message || response.statusText || "API request failed"
    ) as ApiError;

    error.status = response.status;
    error.statusText = response.statusText;
    error.details = details;
    error.url = url;

    return error;
  }

  private normalizeError(error: unknown, url: string): ApiError {
    if ((error as any)?.name === "AbortError") {
      const abortError = new Error("Request aborted") as ApiError;
      abortError.code = "AbortError";
      abortError.isAbortError = true;
      abortError.url = url;
      return abortError;
    }

    if (error instanceof Error) {
      const apiError = error as ApiError;
      apiError.url = apiError.url ?? url;
      return apiError;
    }

    const unknownError = new Error("Unknown API error") as ApiError;
    unknownError.url = url;
    return unknownError;
  }

  private async runErrorInterceptors(error: ApiError): Promise<ApiError> {
    let nextError = error;
    for (const interceptor of this.errorInterceptors) {
      nextError = await interceptor(nextError);
    }
    return nextError;
  }
}