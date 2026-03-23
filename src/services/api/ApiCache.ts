import type { CacheEntry, CacheLookup } from "./types";

export class ApiCache {
  private readonly store = new Map<string, CacheEntry>();
  private readonly inFlight = new Map<string, Promise<unknown>>();

  get<T>(key: string): CacheLookup<T> {
    const entry = this.store.get(key) as CacheEntry<T> | undefined;
    if (!entry) return { hit: false, stale: false };

    const age = Date.now() - entry.timestamp;
    if (age <= entry.ttl) {
      return { hit: true, stale: false, data: entry.data };
    }

    return { hit: true, stale: true, data: entry.data };
  }

  set<T>(key: string, data: T, ttl: number): void {
    this.store.set(key, {
      key,
      data,
      ttl,
      timestamp: Date.now(),
    });
  }

  getInFlight<T>(key: string): Promise<T> | undefined {
    return this.inFlight.get(key) as Promise<T> | undefined;
  }

  setInFlight<T>(key: string, promise: Promise<T>): Promise<T> {
    this.inFlight.set(key, promise);
    promise.finally(() => {
      this.inFlight.delete(key);
    });
    return promise;
  }

  delete(key: string): void {
    this.store.delete(key);
    this.inFlight.delete(key);
  }

  clear(): void {
    this.store.clear();
    this.inFlight.clear();
  }

  clearPattern(pattern: string | RegExp): void {
    for (const key of this.store.keys()) {
      const matches =
        typeof pattern === "string" ? key.includes(pattern) : pattern.test(key);
      if (matches) this.store.delete(key);
    }

    for (const key of this.inFlight.keys()) {
      const matches =
        typeof pattern === "string" ? key.includes(pattern) : pattern.test(key);
      if (matches) this.inFlight.delete(key);
    }
  }
}