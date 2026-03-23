import type { ApiResponseEnvelope } from "../api/types";
import { ResponseStatus } from "../api/types";
import { sharedApiService } from "../api/sharedApiService";
import type {
  CreatePermissionRequest,
  CreatePermissionResponse,
  DeletePermissionResponse,
  PermissionItem,
  PermissionsListView,
  UpdatePermissionRequest,
  UpdatePermissionResponse,
} from "../../types/permission";
import {
  mapPermissionResponse,
  mapPermissionsResponse,
} from "./permissionsMapper";

const PERMISSIONS_ENDPOINT = "/api/v1/Permissions";
const PERMISSIONS_LIST_CONTEXT = "permissions:list";
const PERMISSIONS_CACHE_KEY = "permissions:list";

export const permissionsApi = {
  async getPermissions(): Promise<PermissionsListView> {
    const response = await sharedApiService.get<unknown>(PERMISSIONS_ENDPOINT, {
      requiresAuth: true,
      contextId: PERMISSIONS_LIST_CONTEXT,
      cache: {
        enabled: true,
        key: PERMISSIONS_CACHE_KEY,
        ttl: 5 * 60 * 1000,
        staleWhileRevalidate: true,
      },
      retry: {
        attempts: 3,
        delay: 400,
        exponentialBackoff: true,
      },
    });

    const envelope = response as ApiResponseEnvelope<unknown>;
    if (
      envelope &&
      typeof envelope === "object" &&
      "status" in envelope &&
      envelope.status !== ResponseStatus.Success
    ) {
      throw new Error(envelope.message || "Failed to fetch permissions");
    }

    return mapPermissionsResponse(response);
  },

  async getPermissionById(id: string): Promise<PermissionItem | null> {
    const response = await sharedApiService.get<unknown>(
      `${PERMISSIONS_ENDPOINT}/${id}`,
      {
        requiresAuth: true,
        contextId: `permissions:detail:${id}`,
        retry: {
          attempts: 2,
          delay: 400,
          exponentialBackoff: true,
        },
      },
    );

    const envelope = response as ApiResponseEnvelope<unknown>;
    if (
      envelope &&
      typeof envelope === "object" &&
      "status" in envelope &&
      envelope.status !== ResponseStatus.Success
    ) {
      throw new Error(envelope.message || "Failed to fetch permission");
    }

    return mapPermissionResponse(response);
  },

  async getPermissionByKey(key: string): Promise<PermissionItem | null> {
    const response = await sharedApiService.get<unknown>(
      `${PERMISSIONS_ENDPOINT}/key/${encodeURIComponent(key)}`,
      {
        requiresAuth: true,
        contextId: `permissions:key:${key}`,
        retry: {
          attempts: 2,
          delay: 400,
          exponentialBackoff: true,
        },
      },
    );

    const envelope = response as ApiResponseEnvelope<unknown>;
    if (
      envelope &&
      typeof envelope === "object" &&
      "status" in envelope &&
      envelope.status !== ResponseStatus.Success
    ) {
      throw new Error(envelope.message || "Failed to fetch permission by key");
    }

    return mapPermissionResponse(response);
  },

  async createPermission(payload: CreatePermissionRequest): Promise<string> {
    const response = await sharedApiService.post<CreatePermissionResponse>(
      PERMISSIONS_ENDPOINT,
      payload,
      {
        requiresAuth: true,
        contextId: "permissions:create",
        retry: {
          attempts: 2,
          delay: 400,
          exponentialBackoff: true,
        },
      },
    );

    if (response.status !== ResponseStatus.Success || !response.result) {
      throw new Error(response.message || "Failed to create permission");
    }

    sharedApiService.clearCachePattern(PERMISSIONS_CACHE_KEY);
    return response.result;
  },

  async updatePermission(payload: UpdatePermissionRequest): Promise<boolean> {
    const response = await sharedApiService.put<UpdatePermissionResponse>(
      `${PERMISSIONS_ENDPOINT}/${payload.id}`,
      payload,
      {
        requiresAuth: true,
        contextId: `permissions:update:${payload.id}`,
        retry: {
          attempts: 2,
          delay: 400,
          exponentialBackoff: true,
        },
      },
    );

    if (response.status !== ResponseStatus.Success || !response.result) {
      throw new Error(response.message || "Failed to update permission");
    }

    sharedApiService.clearCachePattern(PERMISSIONS_CACHE_KEY);
    return true;
  },

  async deletePermission(id: string): Promise<boolean> {
    const response = await sharedApiService.delete<DeletePermissionResponse>(
      `${PERMISSIONS_ENDPOINT}/${id}`,
      {
        requiresAuth: true,
        contextId: `permissions:delete:${id}`,
        retry: {
          attempts: 2,
          delay: 400,
          exponentialBackoff: true,
        },
      },
    );

    if (
      response.status !== ResponseStatus.Success ||
      response.result !== true
    ) {
      throw new Error(response.message || "Failed to delete permission");
    }

    sharedApiService.clearCachePattern(PERMISSIONS_CACHE_KEY);
    return true;
  },

  abortListRequests(): void {
    sharedApiService.abortRequestsByContext(PERMISSIONS_LIST_CONTEXT);
  },
};
