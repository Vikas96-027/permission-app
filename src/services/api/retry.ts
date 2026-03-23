import type { ApiError, RetryConfig } from "./types";

const DEFAULT_RETRY_ON = [408, 429, 500, 502, 503, 504];
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const shouldRetry = (error: ApiError, retryOn: number[]): boolean => {
  if (error.isAbortError || error.code === "AbortError") return false;
  if (typeof error.status === "number") return retryOn.includes(error.status);
  return true;
};

export async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  config?: RetryConfig
): Promise<T> {
  const attempts = config?.attempts ?? 1;
  const delay = config?.delay ?? 400;
  const exponentialBackoff = config?.exponentialBackoff ?? true;
  const retryOn = config?.retryOn ?? DEFAULT_RETRY_ON;

  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const apiError = error as ApiError;

      if (attempt >= attempts || !shouldRetry(apiError, retryOn)) {
        throw error;
      }

      const waitTime = exponentialBackoff ? delay * 2 ** (attempt - 1) : delay;
      await sleep(waitTime);
    }
  }

  throw lastError;
}