import {
  PublicClientApplication,
  type AuthenticationResult,
  type AccountInfo,
  type SilentRequest,
  type RedirectRequest,
  InteractionRequiredAuthError,
} from "@azure/msal-browser";
import { msalConfig, loginRequest, accessTokenRequest as tokenRequest, graphTokenRequest } from "../config/msalConfig";

class MsalAuthService {
  private msalInstance: PublicClientApplication | null = null;
  private account: AccountInfo | null = null;

  setMsalInstance(instance: PublicClientApplication): void {
    this.msalInstance = instance;
  }

  getMsalInstance(): PublicClientApplication | null {
    return this.msalInstance;
  }

  async loginRedirect(): Promise<void> {
    if (!this.msalInstance) throw new Error("MSAL instance not initialized");

    const redirectRequest: RedirectRequest = {
      ...loginRequest,
      redirectStartPage: window.location.href,
    };

    await this.msalInstance.loginRedirect(redirectRequest);
  }

  async acquireToken(): Promise<string> {
    if (!this.msalInstance) throw new Error("MSAL instance not initialized");

    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length === 0) throw new Error("No accounts found");

    this.account = accounts[0];

    const silentRequest: SilentRequest = {
      ...tokenRequest,
      account: this.account,
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      this.storeToken(response.accessToken);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const response = await this.msalInstance.acquireTokenPopup(tokenRequest);
          this.storeToken(response.accessToken);
          return response.accessToken;
        } catch (popupError) {
          console.error("Token acquisition failed:", popupError);
          throw popupError;
        }
      }
      throw error;
    }
  }

  async getGraphToken(): Promise<string> {
    if (!this.msalInstance) throw new Error("MSAL instance not initialized");

    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length === 0) throw new Error("No accounts found");

    this.account = accounts[0];

    const silentRequest: SilentRequest = {
      ...graphTokenRequest,
      account: this.account,
    };

    try {
      const response = await this.msalInstance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      if (error instanceof InteractionRequiredAuthError) {
        try {
          const response = await this.msalInstance.acquireTokenPopup(graphTokenRequest);
          return response.accessToken;
        } catch (popupError) {
          console.error("Graph token acquisition failed:", popupError);
          throw popupError;
        }
      }
      throw error;
    }
  }

  async logout(): Promise<void> {
    if (!this.msalInstance) throw new Error("MSAL instance not initialized");

    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length === 0) return;

    const logoutRequest = {
      account: accounts[0],
      postLogoutRedirectUri: msalConfig.auth.redirectUri,
    };

    this.clearStoredToken();
    await this.msalInstance.logoutRedirect(logoutRequest);
  }

  getAccount(): AccountInfo | null {
    if (!this.msalInstance) return null;
    const accounts = this.msalInstance.getAllAccounts();
    if (accounts.length > 0) {
      this.account = accounts[0];
      return this.account;
    }
    return null;
  }

  isAuthenticated(): boolean {
    if (!this.msalInstance) return false;
    return this.msalInstance.getAllAccounts().length > 0;
  }

  private storeToken(token: string): void {
    localStorage.setItem("msal_access_token", token);
  }

  private clearStoredToken(): void {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("msal")) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }

  getStoredToken(): string | null {
    return localStorage.getItem("msal_access_token");
  }

  async initializeAuth(): Promise<{
    account: AccountInfo | null;
    token: string | null;
  }> {
    if (!this.msalInstance) throw new Error("MSAL instance not initialized");

    try {
      await this.msalInstance.initialize();

      let response: AuthenticationResult | null = null;
      try {
        response = await this.msalInstance.handleRedirectPromise();
      } catch (error: any) {
        if (
          error?.errorCode === "hash_empty_error" ||
          error?.errorMessage?.includes("hash_empty_error")
        ) {
          console.info("[msalAuthService] No auth hash found - normal page load");
          response = null;
        } else {
          throw error;
        }
      }

      if (response) {
        this.account = response.account;
        this.storeToken(response.accessToken);
        return { account: response.account, token: response.accessToken };
      }

      const accounts = this.msalInstance.getAllAccounts();
      if (accounts.length > 0) {
        this.account = accounts[0];
        this.msalInstance.setActiveAccount(this.account);
        try {
          const token = await this.acquireToken();
          return { account: this.account, token };
        } catch (error) {
          console.error("Failed to acquire token:", error);
          return { account: this.account, token: null };
        }
      }

      return { account: null, token: null };
    } catch (error) {
      console.error("Initialize auth error:", error);
      return { account: null, token: null };
    }
  }
}

export const msalAuthService = new MsalAuthService();
