import { useEffect, useRef, useCallback } from "react";
import { msalAuthService } from "../services/msalAuthService";

interface UseTokenRefreshOptions {
  refreshInterval?: number;
  enabled?: boolean;
  onRefreshSuccess?: (token: string) => void;
  onRefreshError?: (error: Error) => void;
}

export function useTokenRefresh(options: UseTokenRefreshOptions = {}) {
  const {
    refreshInterval = 15 * 60 * 1000,
    enabled = true,
    onRefreshSuccess,
    onRefreshError,
  } = options;

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isRefreshingRef = useRef(false);

  const refreshToken = useCallback(async () => {
    if (isRefreshingRef.current) return;

    try {
      isRefreshingRef.current = true;
      const token = await msalAuthService.acquireToken();
      if (token) onRefreshSuccess?.(token);
    } catch (error) {
      console.error("[useTokenRefresh] Token refresh failed:", error);
      onRefreshError?.(error instanceof Error ? error : new Error("Token refresh failed"));
    } finally {
      isRefreshingRef.current = false;
    }
  }, [onRefreshSuccess, onRefreshError]);

  useEffect(() => {
    if (!enabled) return;

    refreshToken();

    intervalRef.current = setInterval(() => {
      refreshToken();
    }, refreshInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, refreshInterval, refreshToken]);

  // Refresh on tab visibility change
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") refreshToken();
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [enabled, refreshToken]);

  // Refresh on window focus
  useEffect(() => {
    if (!enabled) return;

    const handleFocus = () => refreshToken();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [enabled, refreshToken]);

  return { refreshToken };
}