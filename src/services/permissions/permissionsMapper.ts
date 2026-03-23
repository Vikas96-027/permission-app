import type {
  PermissionDto,
  PermissionItem,
  PermissionsListView,
} from "../../types/permission";

const slugify = (value?: string): string =>
  (value ?? "").trim().toLowerCase().replace(/\s+/g, "-");

const mapPermission = (item: PermissionDto, index: number): PermissionItem => {
  const name =
    item.name?.trim() || item.key?.trim() || `Permission ${index + 1}`;
  const key = item.key?.trim() || slugify(name);
  const id = item.id?.trim() || `${key}-${index}`;

  return {
    id,
    key,
    name,
    description: item.description?.trim() || "",
  };
};

const extractPermissions = (payload: unknown): PermissionDto[] => {
  if (Array.isArray(payload)) return payload as PermissionDto[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  const candidates = [record.result, record.data, record.items];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate as PermissionDto[];
    }
  }

  return [];
};

export const mapPermissionsResponse = (
  payload: unknown,
): PermissionsListView => {
  const items = extractPermissions(payload).map((item, index) =>
    mapPermission(item, index),
  );

  return {
    items,
    totalCount: items.length,
  };
};

export const mapPermissionResponse = (
  payload: unknown,
): PermissionItem | null => {
  if (!payload || typeof payload !== "object") return null;

  const record = payload as Record<string, unknown>;
  const candidate =
    (record.result as PermissionDto | undefined) ??
    (record.data as PermissionDto | undefined) ??
    (payload as PermissionDto);

  if (!candidate || typeof candidate !== "object") return null;

  return mapPermission(candidate, 0);
};
