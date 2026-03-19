import { AccountInfo } from "@azure/msal-browser";
import { create } from "zustand";

interface AuthStoreState {
  account: AccountInfo | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;

  setAccount: (account: AccountInfo | null) => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  account: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

export const useAuthStore = create<AuthStoreState>((set) => ({
  ...initialState,

  setAccount: (account) =>
    set((state) => ({
      account,
      isAuthenticated: !!account,
      error: account ? null : state.error,
    })),

  setIsAuthenticated: (isAuthenticated) => set(() => ({ isAuthenticated })),

  setLoading: (loading) => set(() => ({ loading })),

  setError: (error) => set(() => ({ error })),

  reset: () => set(() => ({ ...initialState, loading: false })),
}));

// Selector hooks
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useAccount = () => useAuthStore((s) => s.account);
