import type { ApiResponseEnvelope } from "../api/types";
import { ResponseStatus } from "../api/types";
import { sharedApiService } from "../api/sharedApiService";
import type {
  CreateResourceRequest,
  CreateResourceResponse,
  ResourcesListView,
} from "../../types/resource";
import { mapResourcesResponse } from "./resourcesMapper";

const RESOURCES_ENDPOINT = "/api/v1/Resources";
const RESOURCES_LIST_CONTEXT = "resources:list";
const RESOURCES_CACHE_KEY = "resources:list";

export const resourcesApi = {
  async getResources(): Promise<ResourcesListView> {
    const response = await sharedApiService.get<unknown>(RESOURCES_ENDPOINT, {
      requiresAuth: true,
      contextId: RESOURCES_LIST_CONTEXT,
      cache: {
        enabled: true,
        key: RESOURCES_CACHE_KEY,
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
      throw new Error(envelope.message || "Failed to fetch resources");
    }

    return mapResourcesResponse(response);
  },

  async createResource(payload: CreateResourceRequest): Promise<string> {
    const response = await sharedApiService.post<CreateResourceResponse>(
      RESOURCES_ENDPOINT,
      payload,
      {
        requiresAuth: true,
        contextId: "resources:create",
        retry: {
          attempts: 2,
          delay: 400,
          exponentialBackoff: true,
        },
      }
    );

    if (response.status !== ResponseStatus.Success || !response.result) {
      throw new Error(response.message || "Failed to create resource");
    }

    sharedApiService.clearCachePattern(RESOURCES_CACHE_KEY);
    return response.result;
  },

  abortListRequests(): void {
    sharedApiService.abortRequestsByContext(RESOURCES_LIST_CONTEXT);
  },
};