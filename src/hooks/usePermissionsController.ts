import { useCallback, useEffect, useMemo } from "react";
import { permissionsApi } from "../services/permissions/permissionsApi";
import { usePermissionsStore } from "../store/usePermissionsStore";
import type {
  CreatePermissionRequest,
  PermissionFormValues,
  PermissionItem,
  UpdatePermissionRequest,
} from "../types/permission";

const matchesSearch = (item: PermissionItem, term: string): boolean => {
  const searchValue = term.toLowerCase();

  return [item.name, item.key, item.description]
    .join(" ")
    .toLowerCase()
    .includes(searchValue);
};

export const usePermissionsController = () => {
  const {
    items,
    totalCount,
    isLoading,
    isRefreshing,
    isSubmitting,
    error,
    searchTerm,
    selectedPermissionId,
  } = usePermissionsStore((state) => state);

  const setPermissions = usePermissionsStore((state) => state.setPermissions);
  const setLoading = usePermissionsStore((state) => state.setLoading);
  const setRefreshing = usePermissionsStore((state) => state.setRefreshing);
  const setSubmitting = usePermissionsStore((state) => state.setSubmitting);
  const setError = usePermissionsStore((state) => state.setError);
  const setSearchTerm = usePermissionsStore((state) => state.setSearchTerm);
  const setSelectedPermissionId = usePermissionsStore(
    (state) => state.setSelectedPermissionId,
  );

  const loadPermissions = useCallback(
    async (mode: "initial" | "refresh" = "initial") => {
      if (mode === "initial") setLoading(true);
      if (mode === "refresh") setRefreshing(true);

      setError(null);

      try {
        const response = await permissionsApi.getPermissions();
        setPermissions(response);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to load permissions",
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [setError, setLoading, setRefreshing, setPermissions],
  );

  const refreshPermissions = useCallback(async () => {
    await loadPermissions("refresh");
  }, [loadPermissions]);

  const createPermission = useCallback(
    async (payload: CreatePermissionRequest) => {
      setSubmitting(true);
      setError(null);

      try {
        const id = await permissionsApi.createPermission(payload);
        await loadPermissions("refresh");
        return id;
      } finally {
        setSubmitting(false);
      }
    },
    [loadPermissions, setError, setSubmitting],
  );

  const updatePermission = useCallback(
    async (payload: UpdatePermissionRequest) => {
      setSubmitting(true);
      setError(null);

      try {
        await permissionsApi.updatePermission(payload);
        await loadPermissions("refresh");
      } finally {
        setSubmitting(false);
      }
    },
    [loadPermissions, setError, setSubmitting],
  );

  const deletePermission = useCallback(
    async (id: string) => {
      setSubmitting(true);
      setError(null);

      try {
        await permissionsApi.deletePermission(id);
        if (selectedPermissionId === id) {
          setSelectedPermissionId(null);
        }
        await loadPermissions("refresh");
      } finally {
        setSubmitting(false);
      }
    },
    [
      loadPermissions,
      selectedPermissionId,
      setError,
      setSelectedPermissionId,
      setSubmitting,
    ],
  );

  useEffect(() => {
    void loadPermissions("initial");
    return () => permissionsApi.abortListRequests();
  }, [loadPermissions]);

  const visibleItems = useMemo(() => {
    const term = searchTerm.trim();
    if (!term) return items;
    return items.filter((item) => matchesSearch(item, term));
  }, [items, searchTerm]);

  const selectedPermission = useMemo(
    () => items.find((item) => item.id === selectedPermissionId) ?? null,
    [items, selectedPermissionId],
  );

  const getInitialFormValues = useCallback(
    (item?: PermissionItem | null): PermissionFormValues => ({
      key: item?.key ?? "",
      name: item?.name ?? "",
      description: item?.description ?? "",
    }),
    [],
  );

  return {
    items,
    visibleItems,
    totalCount,
    isLoading,
    isRefreshing,
    isSubmitting,
    error,
    searchTerm,
    selectedPermissionId,
    selectedPermission,
    setSearchTerm,
    setSelectedPermissionId,
    loadPermissions,
    refreshPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getInitialFormValues,
  };
};
