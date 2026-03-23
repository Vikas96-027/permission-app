import { FolderTree, RefreshCw, Search } from "lucide-react";
import { useResourcesController } from "../hooks/useResourcesController";

const Resources = () => {
  const {
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
    refreshResources,
  } = useResourcesController();

  const visibleCount = visibleItems.length;

  return (
    <div className="min-h-screen bg-[#eaedf0] pl-56 pt-11">
      <div className="space-y-4 p-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-lg font-semibold text-slate-900">Resources</h1>
              <p className="text-sm text-slate-500">
                Fetching data from <span className="font-medium">/api/v1/Resources</span>
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <label className="relative">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search resources"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-[#004a94] focus:ring-2 focus:ring-[#004a94]/10 sm:w-72"
                />
              </label>

              <button
                type="button"
                onClick={() => void refreshResources()}
                disabled={isRefreshing}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCw size={16} className={isRefreshing ? "animate-spin" : ""} />
                {isRefreshing ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                TOTAL LOADED RESOURCES
              </p>
              <p className="mt-2 text-4xl font-bold leading-none text-black">
                {totalCount}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                Visible results: {visibleCount}
              </p>
            </div>

            <div className="rounded-md bg-[#e8f1fb] p-2 text-[#004a94]">
              <FolderTree size={18} />
            </div>
          </div>

          {error ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Resource List</h2>
            </div>

            <div className="max-h-[65vh] overflow-y-auto p-3">
              {isLoading ? (
                <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">
                  Loading resources...
                </div>
              ) : visibleItems.length === 0 ? (
                <div className="flex min-h-[240px] items-center justify-center text-sm text-slate-500">
                  No resources found.
                </div>
              ) : (
                <div className="space-y-2">
                  {visibleItems.map((item) => {
                    const isSelected = selectedResourceId === item.id;
                    const actionCount = item.actions?.length ?? 0;
                    const childCount = item.childrenCount ?? item.children?.length ?? 0;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedResourceId(item.id)}
                        className={`w-full rounded-lg border px-3 py-3 text-left transition ${
                          isSelected
                            ? "border-[#004a94] bg-[#e8f1fb]"
                            : "border-slate-200 bg-white hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="mt-1 truncate text-xs text-slate-500">
                              {item.path || item.key || "No path available"}
                            </p>
                          </div>

                          <div className="shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                            {actionCount} actions
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500">
                          <span className="rounded-full bg-slate-100 px-2 py-1">
                            {childCount} children
                          </span>
                          <span className="truncate rounded-full bg-slate-100 px-2 py-1">
                            {item.key}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-4 py-3">
              <h2 className="text-sm font-semibold text-slate-900">Resource Details</h2>
            </div>

            <div className="p-4">
              {!selectedResource ? (
                <div className="flex min-h-[320px] items-center justify-center text-sm text-slate-500">
                  Select a resource from the list to view details.
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">
                        {selectedResource.name}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedResource.path || selectedResource.key || "No path available"}
                      </p>
                    </div>

                    <span className="inline-flex w-fit items-center rounded-full bg-[#e8f1fb] px-3 py-1 text-xs font-semibold text-[#004a94]">
                      {selectedResource.actions?.length ?? 0} actions
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                        RESOURCE ID
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-slate-900">
                        {selectedResource.id}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                        RESOURCE KEY
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-slate-900">
                        {selectedResource.key}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                        RESOURCE PATH
                      </p>
                      <p className="mt-2 break-all text-sm font-medium text-slate-900">
                        {selectedResource.path || "-"}
                      </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                        CHILD RESOURCES
                      </p>
                      <p className="mt-2 text-sm font-medium text-slate-900">
                        {selectedResource.childrenCount ?? selectedResource.children.length}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">
                      Actions
                    </h4>

                    {(selectedResource.actions?.length ?? 0) === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        No actions available for this resource.
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {selectedResource.actions.map((action, index) => (
                          <span
                            key={`${selectedResource.id}-${action}-${index}`}
                            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium uppercase text-slate-700"
                          >
                            {action}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">
                      Path Mappings
                    </h4>

                    {(selectedResource.pathMappings?.length ?? 0) === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        No path mappings available.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedResource.pathMappings.map((mapping, index) => (
                          <div
                            key={`${selectedResource.id}-mapping-${index}`}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-3"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded bg-[#e8f1fb] px-2 py-1 text-[11px] font-semibold text-[#004a94]">
                                {mapping.method}
                              </span>
                              <span className="text-sm font-medium text-slate-900">
                                {mapping.path}
                              </span>
                            </div>
                            <p className="mt-2 text-xs text-slate-500">
                              Action: {mapping.action}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <h4 className="mb-3 text-sm font-semibold text-slate-900">
                      Child Resources
                    </h4>

                    {(selectedResource.children?.length ?? 0) === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                        No child resources available.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedResource.children.map((child) => (
                          <button
                            key={child.id}
                            type="button"
                            onClick={() => setSelectedResourceId(child.id)}
                            className="flex w-full items-start justify-between rounded-lg border border-slate-200 bg-white px-3 py-3 text-left transition hover:bg-slate-50"
                          >
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-900">
                                {child.name}
                              </p>
                              <p className="mt-1 truncate text-xs text-slate-500">
                                {child.path || child.key || "No path available"}
                              </p>
                            </div>

                            <span className="ml-3 shrink-0 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                              {child.actions?.length ?? 0} actions
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Resources;