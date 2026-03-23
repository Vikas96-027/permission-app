export interface PermissionDto {
  id?: string;
  key?: string;
  name?: string;
  description?: string;
}

export interface PermissionItem {
  id: string;
  key: string;
  name: string;
  description: string;
}

export interface PermissionsListView {
  items: PermissionItem[];
  totalCount: number;
}

export interface CreatePermissionRequest {
  key: string;
  name: string;
  description: string;
}

export interface UpdatePermissionRequest {
  id: string;
  key: string;
  name: string;
  description: string;
}

export type CreatePermissionResponse = {
  result?: string;
  status?: string;
  message?: string;
};

export type UpdatePermissionResponse = {
  result?: boolean;
  status?: string;
  message?: string;
};

export type DeletePermissionResponse = {
  result?: boolean;
  status?: string;
  message?: string;
};

export interface PermissionFormValues {
  key: string;
  name: string;
  description: string;
}