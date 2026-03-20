import React, { useState, useCallback, useEffect, useContext, createContext } from "react";
import { MsalProvider, useMsal } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "../config/msalConfig";
import { msalAuthService } from "./msalAuthService";
import { useAuthStore } from "../store/useAuthStore";
import { useTokenRefresh } from "../hooks/useTokenRefresh";
import type { MsalAuthContextValue, AuthState } from "../types/auth";

// Singleton MSAL instance
let msalInstance: PublicClientApplication | null = null;

export function getMsalInstance(): PublicClientApplication {
  if (!msalInstance) {
    msalInstance = new PublicClientApplication(msalConfig);
    msalAuthService.setMsalInstance(msalInstance);
  }
  return msalInstance;
}

// Auth Context
const MsalAuthContext = createContext<MsalAuthContextValue | undefined>(undefined);

// Inner provider (has access to useMsal)
const MsalAuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { instance } = useMsal();
  const { setAccount, setIsAuthenticated } = useAuthStore();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    account: null,
    user: null,
    loading: true,
    error: null,
  });
  const [token, setToken] = useState<string | null>(null);
  const [pendingTokenRefresh, setPendingTokenRefresh] = useState(false);

  const initializeAuth = useCallback(async () => {
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));

      const result = await msalAuthService.initializeAuth();

      setAccount(result.account);
      setIsAuthenticated(!!result.account);

      if (result.account) {
        setPendingTokenRefresh(false); // No need to wait since we have a token
        setAuthState({
          isAuthenticated: true,
          account: result.account,
          user: result.account as any,
          loading: false,
          error: null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          account: null,
          user: null,
          loading: false,
          error: null,
        });
      }

      setToken(result.token);
    } catch (error) {
      console.error("Auth initialization failed:", error);

      const errorMessage = error instanceof Error ? error.message : "Authentication failed";
      const isHashError =
        errorMessage.includes("hash_empty_error") ||
        errorMessage.includes("Hash value cannot be processed");

      if (isHashError) {
        console.info("[AuthProvider] Ignoring hash_empty_error - normal page load");
        setAuthState({
          isAuthenticated: false,
          account: null,
          user: null,
          loading: false,
          error: null,
        });
        return;
      }

      setAccount(null);
      setIsAuthenticated(false);
      setAuthState({
        isAuthenticated: false,
        account: null,
        user: null,
        loading: false,
        error: errorMessage,
      });
    }
  }, [instance, setAccount, setIsAuthenticated]);

  const signInWithMsal = useCallback(async () => {
    console.log("sign in with msal");
    try {
      setAuthState((prev) => ({ ...prev, loading: true, error: null }));
      await msalAuthService.loginRedirect();
      console.log("msal auth service", msalAuthService)
    } catch (error) {
      console.error("Sign in failed:", error);

      const errorMessage = error instanceof Error ? error.message : "Sign in failed";
      const isHashError =
        errorMessage.includes("hash_empty_error") ||
        errorMessage.includes("Hash value cannot be processed");

      if (isHashError) {
        setAuthState((prev) => ({ ...prev, loading: false, error: null }));
        return;
      }

      setAuthState((prev) => ({ ...prev, loading: false, error: errorMessage }));
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await msalAuthService.logout();
      setAccount(null);
      setIsAuthenticated(false);
      setAuthState({
        isAuthenticated: false,
        account: null,
        user: null,
        loading: false,
        error: null,
      });
      setToken(null);
    } catch (error) {
      console.error("Sign out failed:", error);
      setAuthState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Sign out failed",
      }));
    }
  }, [setAccount, setIsAuthenticated]);

  const getAuthHeaders = useCallback(async (): Promise<{ Authorization: string }> => {
    const accessToken = await msalAuthService.acquireToken();
    return { Authorization: `Bearer ${accessToken}` };
  }, []);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // Auto-refresh token every 59 minutes
  useTokenRefresh({
    enabled: authState.isAuthenticated,
    refreshInterval: 59 * 60 * 1000,
    onRefreshSuccess: (newToken) => {
      setToken(newToken);
      if (pendingTokenRefresh) {
        setPendingTokenRefresh(false);
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    },
    onRefreshError: (error) => {
      console.error("[AuthProvider] Token refresh failed:", error);
      if (pendingTokenRefresh) {
        setPendingTokenRefresh(false);
        setAuthState((prev) => ({ ...prev, loading: false }));
      }
    },
  });

  const contextValue: MsalAuthContextValue = {
    ...authState,
    signIn: signInWithMsal,
    signInWithMsal,
    signOut,
    getAuthHeaders,
    token,
    profile: authState.account,
  };

  if (authState.loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{
          background: "linear-gradient(to bottom, #09162C, #0F2C50)",
        }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          <span className="text-slate-300 font-medium">Initializing...</span>
        </div>
      </div>
    );
  }

  return (
    <MsalAuthContext.Provider value={contextValue}>
      {children}
    </MsalAuthContext.Provider>
  );
};

// Outer provider (wraps with MsalProvider)
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const instance = getMsalInstance();

  return (
    <MsalProvider instance={instance}>
      <MsalAuthProviderInner>{children}</MsalAuthProviderInner>
    </MsalProvider>
  );
};

// Hook to consume auth context
export const useAuth = (): MsalAuthContextValue => {
  const context = useContext(MsalAuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};