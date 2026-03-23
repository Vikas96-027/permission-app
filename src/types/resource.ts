export type ResourceHttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | string;

export interface ResourcePathMapping {
  method: ResourceHttpMethod;
  path: string;
  action: string;
}

export interface ResourceNodeDto {
  id?: string;
  parentId?: string | null;
  name: string;
  key?: string;
  path: string;
  actions?: string[];
  paths?: ResourcePathMapping[];
  children?: ResourceNodeDto[];
}

export interface CreateResourceRequest {
  name: string;
  key: string;
  path: string;
  actions: string[];
  paths: ResourcePathMapping[];
  children: CreateResourceRequest[];
}

export interface CreateResourceResponse {
  result?: string;
  status: string;
  message?: string;
}

export interface ResourceItem {
  id: string;
  parentId: string | null;
  name: string;
  key: string;
  path: string;
  actions: string[];
  pathMappings: ResourcePathMapping[];
  children: ResourceItem[];
  depth: number;
  childrenCount: number;
}

export interface ResourcesListView {
  items: ResourceItem[];
  flatItems: ResourceItem[];
  totalCount: number;
}