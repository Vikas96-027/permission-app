export class RequestRegistry {
  private readonly controllers = new Map<string, Map<string, AbortController>>();

  create(contextId = "global"): { requestId: string; controller: AbortController } {
    const requestId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`;

    const controller = new AbortController();
    const bucket = this.controllers.get(contextId) ?? new Map<string, AbortController>();

    bucket.set(requestId, controller);
    this.controllers.set(contextId, bucket);

    return { requestId, controller };
  }

  complete(contextId: string, requestId: string): void {
    const bucket = this.controllers.get(contextId);
    if (!bucket) return;

    bucket.delete(requestId);
    if (bucket.size === 0) {
      this.controllers.delete(contextId);
    }
  }

  abortContext(contextId: string): void {
    const bucket = this.controllers.get(contextId);
    if (!bucket) return;

    for (const controller of bucket.values()) {
      controller.abort();
    }

    this.controllers.delete(contextId);
  }

  abortAll(): void {
    for (const bucket of this.controllers.values()) {
      for (const controller of bucket.values()) {
        controller.abort();
      }
    }

    this.controllers.clear();
  }
}