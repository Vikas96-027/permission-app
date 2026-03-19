import { AccountInfo } from "@azure/msal-browser";

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface AuthState {
  isAuthenticated: boolean;
  account: AccountInfo | null;
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface MsalAuthContextValue extends AuthState {
  signIn: () => Promise<void>;
  signInWithMsal: () => Promise<void>;
  signOut: () => Promise<void>;
  getAuthHeaders: () => Promise<{ Authorization: string }>;
  token: string | null;
  profile: AccountInfo | null;
}