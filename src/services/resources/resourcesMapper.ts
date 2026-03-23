import type {
  ResourceItem,
  ResourceNodeDto,
  ResourcesListView,
} from "../../types/resource";

const slugify = (value?: string): string =>
  (value ?? "").trim().toLowerCase().replace(/\s+/g, "-");

const createFallbackId = (
  node: ResourceNodeDto,
  parentId: string | null,
  depth: number,
): string =>
  [parentId ?? "root", node.key ?? slugify(node.name), node.path ?? depth].join(
    ":",
  );

const mapNode = (
  node: ResourceNodeDto,
  depth = 0,
  parentId: string | null = null,
): ResourceItem => {
  const id = node.id ?? createFallbackId(node, parentId, depth);
  const children = Array.isArray(node.children)
    ? node.children.map((child) => mapNode(child, depth + 1, id))
    : [];

  return {
    id,
    parentId: node.parentId ?? parentId,
    name: node.name,
    key: node.key ?? slugify(node.name),
    path: node.path,
    actions: Array.isArray(node.actions)
      ? node.actions.map((item) => item.toLowerCase())
      : [],
    pathMappings: Array.isArray(node.paths) ? node.paths : [],
    children,
    depth,
    childrenCount: children.length,
  };
};

const flattenTree = (items: ResourceItem[]): ResourceItem[] =>
  items.flatMap((item) => [item, ...flattenTree(item.children)]);

const extractNodes = (payload: unknown): ResourceNodeDto[] => {
  if (Array.isArray(payload)) return payload as ResourceNodeDto[];
  if (!payload || typeof payload !== "object") return [];

  const record = payload as Record<string, unknown>;
  const candidates = [
    record.result,
    record.data,
    record.items,
    record.documents,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate as ResourceNodeDto[];

    if (candidate && typeof candidate === "object") {
      const nested = candidate as Record<string, unknown>;
      const nestedCandidates = [
        nested.items,
        nested.data,
        nested.children,
        nested.result,
      ];
      for (const nestedCandidate of nestedCandidates) {
        if (Array.isArray(nestedCandidate)) {
          return nestedCandidate as ResourceNodeDto[];
        }
      }
    }
  }

  return [];
};

export const mapResourcesResponse = (payload: unknown): ResourcesListView => {
  const items = extractNodes(payload).map((node) => mapNode(node));
  const flatItems = flattenTree(items);

  return {
    items,
    flatItems,
    totalCount: flatItems.length,
  };
};
