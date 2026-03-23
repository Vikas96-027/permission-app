import { msalAuthService } from "../msalAuthService";
import type { ApiAuthProvider, ApiError } from "./types";

export class MsalApiAuthProvider implements ApiAuthProvider {
  async getToken(): Promise<string | null> {
    try {
      return await msalAuthService.acquireToken();
    } catch (error) {
      console.warn("[MsalApiAuthProvider] acquireToken failed, using stored token", error);
      return msalAuthService.getStoredToken();
    }
  }

  isAuthenticated(): boolean {
    return msalAuthService.isAuthenticated();
  }

  async handleAuthError(error: ApiError): Promise<void> {
    if (error.status === 401) {
      console.warn("[MsalApiAuthProvider] Unauthorized request");
    }
  }
}