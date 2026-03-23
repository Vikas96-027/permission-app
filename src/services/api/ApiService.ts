import { MsalApiAuthProvider } from "./authProvider";
import { getApiEnvironmentConfig } from "./environmentConfig";
import { HttpClient } from "./HttpClient";
import type { ApiError, RequestConfig } from "./types";

export class ApiService {
  private readonly httpClient: HttpClient;

  constructor() {
    const config = getApiEnvironmentConfig();

    this.httpClient = new HttpClient({
      baseUrl: config.apiBaseUrl,
      timeout: config.defaultTimeout,
      cacheTTL: config.defaultCacheTTL,
      authProvider: new MsalApiAuthProvider(),
      enableLogging: config.enableLogging,
    });

    this.httpClient.addErrorInterceptor(async (error: ApiError) => {
      if (config.enableLogging) {
        console.error("[ApiService]", error);
      }

      if (error.status === 401) {
        console.warn("[ApiService] 401 Unauthorized");
      }

      if (error.status === 403) {
        console.warn("[ApiService] 403 Forbidden");
      }

      return error;
    });
  }

  get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.httpClient.get<T>(endpoint, config);
  }

  post<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.httpClient.post<T>(endpoint, body, config);
  }

  put<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.httpClient.put<T>(endpoint, body, config);
  }

  patch<T>(endpoint: string, body?: unknown, config?: RequestConfig): Promise<T> {
    return this.httpClient.patch<T>(endpoint, body, config);
  }

  delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    return this.httpClient.delete<T>(endpoint, config);
  }

  clearCache(): void {
    this.httpClient.clearCache();
  }

  clearCachePattern(pattern: string | RegExp): void {
    this.httpClient.clearCachePattern(pattern);
  }

  abortRequestsByContext(contextId: string): void {
    this.httpClient.abortRequestsByContext(contextId);
  }

  abortAllRequests(): void {
    this.httpClient.abortAllRequests();
  }
}