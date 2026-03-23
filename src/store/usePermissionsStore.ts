import { create } from "zustand";
import type { PermissionItem, PermissionsListView } from "../types/permission";

interface PermissionsStoreState {
  items: PermissionItem[];
  totalCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  isSubmitting: boolean;
  error: string | null;
  searchTerm: string;
  selectedPermissionId: string | null;
  setPermissions: (payload: PermissionsListView) => void;
  setLoading: (value: boolean) => void;
  setRefreshing: (value: boolean) => void;
  setSubmitting: (value: boolean) => void;
  setError: (value: string | null) => void;
  setSearchTerm: (value: string) => void;
  setSelectedPermissionId: (value: string | null) => void;
  reset: () => void;
}

const initialState = {
  items: [] as PermissionItem[],
  totalCount: 0,
  isLoading: false,
  isRefreshing: false,
  isSubmitting: false,
  error: null as string | null,
  searchTerm: "",
  selectedPermissionId: null as string | null,
};

export const usePermissionsStore = create<PermissionsStoreState>((set) => ({
  ...initialState,

  setPermissions: (payload) =>
    set(() => ({
      items: payload.items,
      totalCount: payload.totalCount,
      error: null,
    })),

  setLoading: (value) => set(() => ({ isLoading: value })),
  setRefreshing: (value) => set(() => ({ isRefreshing: value })),
  setSubmitting: (value) => set(() => ({ isSubmitting: value })),
  setError: (value) => set(() => ({ error: value })),
  setSearchTerm: (value) => set(() => ({ searchTerm: value })),
  setSelectedPermissionId: (value) =>
    set(() => ({ selectedPermissionId: value })),

  reset: () => set(() => ({ ...initialState })),
}));
