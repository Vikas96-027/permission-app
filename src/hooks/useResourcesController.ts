import { useCallback, useEffect, useMemo } from "react";
import { resourcesApi } from "../services/resources/resourcesApi";
import { useResourcesStore } from "../store/useResourcesStore";
import type { CreateResourceRequest, ResourceItem } from "../types/resource";

const matchesSearch = (item: ResourceItem, term: string): boolean => {
  const searchValue = term.toLowerCase();

  return [
    item.name,
    item.key,
    item.path,
    item.actions.join(" "),
    item.pathMappings
      .map((mapping) => `${mapping.method} ${mapping.path} ${mapping.action}`)
      .join(" "),
  ]
    .join(" ")
    .toLowerCase()
    .includes(searchValue);
};

export const useResourcesController = () => {
  //   const items = useResourcesStore((state) => state.items);
  //   const flatItems = useResourcesStore((state) => state.flatItems);
  //   const totalCount = useResourcesStore((state) => state.totalCount);
  //   const isLoading = useResourcesStore((state) => state.isLoading);
  //   const isRefreshing = useResourcesStore((state) => state.isRefreshing);
  //   const error = useResourcesStore((state) => state.error);
  //   const searchTerm = useResourcesStore((state) => state.searchTerm);
  //   const selectedResourceId = useResourcesStore((state) => state.selectedResourceId);

  const {
    items,
    flatItems,
    totalCount,
    isLoading,
    isRefreshing,
    error,
    searchTerm,
    selectedResourceId,
  } = useResourcesStore((state) => state);

  const setResources = useResourcesStore((state) => state.setResources);
  const setLoading = useResourcesStore((state) => state.setLoading);
  const setRefreshing = useResourcesStore((state) => state.setRefreshing);
  const setError = useResourcesStore((state) => state.setError);
  const setSearchTerm = useResourcesStore((state) => state.setSearchTerm);
  const setSelectedResourceId = useResourcesStore(
    (state) => state.setSelectedResourceId,
  );

  const loadResources = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError(null);

      try {
        const response = await resourcesApi.getResources();
        setResources(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load resources",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [setError, setLoading, setRefreshing, setResources],
  );

  const refreshResources = useCallback(async () => {
    await loadResources("refresh");
  }, [loadResources]);

  const createResource = useCallback(
    async (payload: CreateResourceRequest) => {
      const id = await resourcesApi.createResource(payload);
      await loadResources("refresh");
      return id;
    },
    [loadResources],
  );

  useEffect(() => {
    void loadResources("initial");
    return () => resourcesApi.abortListRequests();
  }, [loadResources]);

  const visibleItems = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return flatItems;
    return flatItems.filter((item) => matchesSearch(item, term));
  }, [flatItems, searchTerm]);

  const selectedResource = useMemo(
    () => flatItems.find((item) => item.id === selectedResourceId) ?? null,
    [flatItems, selectedResourceId],
  );

  return {
    items,
    flatItems,
    visibleItems,
    totalCount,
    isLoading,
    isRefreshing,
    error,
    searchTerm,
    selectedResourceId,
    selectedResource,
    setSearchTerm,
    setSelectedResourceId,
    loadResources,
    refreshResources,
    createResource,
  };
};
