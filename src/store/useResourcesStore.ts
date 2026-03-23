import { create } from "zustand";
import type { ResourceItem, ResourcesListView } from "../types/resource";

interface ResourcesStoreState {
  items: ResourceItem[];
  flatItems: ResourceItem[];
  totalCount: number;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  searchTerm: string;
  selectedResourceId: string | null;
  expandedIds: string[];
  setResources: (payload: ResourcesListView) => void;
  setLoading: (value: boolean) => void;
  setRefreshing: (value: boolean) => void;
  setError: (value: string | null) => void;
  setSearchTerm: (value: string) => void;
  setSelectedResourceId: (value: string | null) => void;
  toggleExpanded: (resourceId: string) => void;
  collapseAll: () => void;
  reset: () => void;
}

const initialState = {
  items: [],
  flatItems: [],
  totalCount: 0,
  isLoading: false,
  isRefreshing: false,
  error: null,
  searchTerm: "",
  selectedResourceId: null,
  expandedIds: [] as string[],
};

export const useResourcesStore = create<ResourcesStoreState>((set) => ({
  ...initialState,

  setResources: (payload) =>
    set(() => ({
      items: payload.items,
      flatItems: payload.flatItems,
      totalCount: payload.totalCount,
      expandedIds: payload.items.map((item) => item.id),
      error: null,
    })),

  setLoading: (value) => set(() => ({ isLoading: value })),
  setRefreshing: (value) => set(() => ({ isRefreshing: value })),
  setError: (value) => set(() => ({ error: value })),
  setSearchTerm: (value) => set(() => ({ searchTerm: value })),
  setSelectedResourceId: (value) => set(() => ({ selectedResourceId: value })),

  toggleExpanded: (resourceId) =>
    set((state) => ({
      expandedIds: state.expandedIds.includes(resourceId)
        ? state.expandedIds.filter((id) => id !== resourceId)
        : [...state.expandedIds, resourceId],
    })),

  collapseAll: () => set(() => ({ expandedIds: [] })),

  reset: () => set(() => ({ ...initialState })),
}));