// import {
//   Plus,
//   RefreshCw,
//   Search,
//   ShieldCheck,
//   SquarePen,
//   Trash2,
// } from "lucide-react";
// import { useMemo, useState } from "react";
// import PermissionModal from "../components/permissions/PermissionModal";
// import { usePermissionsController } from "../hooks/usePermissionsController";
// import type { PermissionItem } from "../types/permission";

// const Permissions = () => {
//   const {
//     visibleItems,
//     totalCount,
//     isLoading,
//     isRefreshing,
//     isSubmitting,
//     error,
//     searchTerm,
//     setSearchTerm,
//     refreshPermissions,
//     createPermission,
//     updatePermission,
//     deletePermission,
//     getInitialFormValues,
//   } = usePermissionsController();

//   const [isCreateOpen, setIsCreateOpen] = useState(false);
//   const [editingPermission, setEditingPermission] =
//     useState<PermissionItem | null>(null);

//   const visibleCount = visibleItems.length;
//   const statsLabel = useMemo(
//     () => `${visibleCount} of ${totalCount} permissions`,
//     [visibleCount, totalCount],
//   );

//   const handleCreate = async ({
//     key,
//     name,
//     description,
//   }: {
//     key: string;
//     name: string;
//     description: string;
//   }) => {
//     try {
//       await createPermission({ key, name, description });
//       setIsCreateOpen(false);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleUpdate = async ({
//     key,
//     name,
//     description,
//   }: {
//     key: string;
//     name: string;
//     description: string;
//   }) => {
//     if (!editingPermission) return;

//     try {
//       await updatePermission({
//         id: editingPermission.id,
//         key,
//         name,
//         description,
//       });
//       setEditingPermission(null);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   const handleDelete = async (item: PermissionItem) => {
//     const confirmed = window.confirm(
//       `Are you sure you want to delete "${item.name}"?`,
//     );

//     if (!confirmed) return;

//     try {
//       await deletePermission(item.id);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#eaedf0] pl-56 pt-11">
//       <div className="p-4">
//         <div className="space-y-4">
//           <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
//               <div>
//                 <div className="flex items-center gap-3">
//                   <div className="rounded-md bg-[#e8f1fb] p-2 text-[#004a94]">
//                     <ShieldCheck size={18} />
//                   </div>

//                   <div>
//                     <h1 className="text-xl font-semibold text-slate-900">
//                       Permissions
//                     </h1>
//                     <p className="mt-1 text-sm text-slate-500">
//                       Manage permission keys, names, descriptions, and actions.
//                     </p>
//                   </div>
//                 </div>

//                 <div className="mt-4">
//                   <p className="text-[11px] font-semibold tracking-wide text-slate-500">
//                     TOTAL LOADED PERMISSIONS
//                   </p>
//                   <p className="mt-2 text-4xl font-bold leading-none text-black">
//                     {totalCount}
//                   </p>
//                   <p className="mt-2 text-xs text-slate-500">{statsLabel}</p>
//                 </div>
//               </div>

//               <div className="flex flex-col gap-3 sm:flex-row">
//                 <button
//                   type="button"
//                   onClick={() => void refreshPermissions()}
//                   disabled={isRefreshing || isLoading}
//                   className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
//                 >
//                   <RefreshCw
//                     size={16}
//                     className={isRefreshing ? "animate-spin" : ""}
//                   />
//                   Refresh
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => setIsCreateOpen(true)}
//                   className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#004a94] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#003a75]"
//                 >
//                   <Plus size={16} />
//                   Add Permission
//                 </button>
//               </div>
//             </div>

//             {error ? (
//               <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
//                 {error}
//               </div>
//             ) : null}
//           </div>

//           <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
//             <div className="relative max-w-md">
//               <Search
//                 size={16}
//                 className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//               />
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(event) => setSearchTerm(event.target.value)}
//                 placeholder="Search by name, key, or description"
//                 className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#004a94] focus:ring-2 focus:ring-[#004a94]/10"
//               />
//             </div>
//           </div>

//           <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-slate-200">
//                 <thead className="bg-slate-50">
//                   <tr>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Name
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Key
//                     </th>
//                     <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Description
//                     </th>
//                     <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-200 bg-white">
//                   {isLoading ? (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="px-4 py-10 text-center text-sm text-slate-500"
//                       >
//                         Loading permissions...
//                       </td>
//                     </tr>
//                   ) : visibleItems.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={4}
//                         className="px-4 py-10 text-center text-sm text-slate-500"
//                       >
//                         No permissions found.
//                       </td>
//                     </tr>
//                   ) : (
//                     visibleItems.map((item) => (
//                       <tr key={item.id} className="hover:bg-slate-50">
//                         <td className="px-4 py-4 text-sm font-medium text-slate-900">
//                           {item.name}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-slate-700">
//                           {item.key}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-slate-600">
//                           {item.description || "—"}
//                         </td>
//                         <td className="px-4 py-4">
//                           <div className="flex justify-end gap-2">
//                             <button
//                               type="button"
//                               onClick={() => setEditingPermission(item)}
//                               className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
//                             >
//                               <SquarePen size={14} />
//                               Edit
//                             </button>

//                             <button
//                               type="button"
//                               onClick={() => void handleDelete(item)}
//                               disabled={isSubmitting}
//                               className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
//                             >
//                               <Trash2 size={14} />
//                               Delete
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       </div>

//       <PermissionModal
//         open={isCreateOpen}
//         mode="create"
//         title="Add Permission"
//         initialValues={getInitialFormValues()}
//         isSubmitting={isSubmitting}
//         onClose={() => setIsCreateOpen(false)}
//         onSubmit={handleCreate}
//       />

//       <PermissionModal
//         open={Boolean(editingPermission)}
//         mode="edit"
//         title="Edit Permission"
//         initialValues={getInitialFormValues(editingPermission)}
//         isSubmitting={isSubmitting}
//         onClose={() => setEditingPermission(null)}
//         onSubmit={handleUpdate}
//       />
//     </div>
//   );
// };

// export default Permissions;
import {
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SquarePen,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import PermissionModal from "../components/permissions/PermissionModal";
import { usePermissionsController } from "../hooks/usePermissionsController";
import type { PermissionItem } from "../types/permission";
import DeleteConfirmationModal from "../components/DeleteConfirmationModal";

const Permissions = () => {
  const {
    visibleItems,
    totalCount,
    isLoading,
    isRefreshing,
    isSubmitting,
    error,
    searchTerm,
    setSearchTerm,
    refreshPermissions,
    createPermission,
    updatePermission,
    deletePermission,
    getInitialFormValues,
  } = usePermissionsController();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingPermission, setEditingPermission] =
    useState<PermissionItem | null>(null);

  const [deletingPermission, setDeletingPermission] =
    useState<PermissionItem | null>(null);

  const visibleCount = visibleItems.length;

  const statsLabel = useMemo(
    () => `${visibleCount} / ${totalCount} permissions`,
    [visibleCount, totalCount],
  );

  const handleCreate = async ({
    key,
    name,
    description,
  }: {
    key: string;
    name: string;
    description: string;
  }) => {
    try {
      await createPermission({ key, name, description });
      setIsCreateOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async ({
    key,
    name,
    description,
  }: {
    key: string;
    name: string;
    description: string;
  }) => {
    if (!editingPermission) return;

    try {
      await updatePermission({
        id: editingPermission.id,
        key,
        name,
        description,
      });
      setEditingPermission(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    if (!deletingPermission) return;

    try {
      await deletePermission(deletingPermission.id);
      setDeletingPermission(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-[#eaedf0] pl-56 pt-11">
      <div className="flex h-full min-h-0 flex-col gap-4 p-4">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="rounded-md bg-[#e8f1fb] p-2 text-[#004a94]">
                  <ShieldCheck size={18} />
                </div>

                <div>
                  <h1 className="text-xl font-semibold text-slate-900">
                    Permissions
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage permission keys, names, descriptions, and actions.
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[11px] font-semibold tracking-wide text-slate-500">
                  TOTAL LOADED PERMISSIONS
                </p>
                <p className="mt-2 text-4xl font-bold leading-none text-black">
                  {totalCount}
                </p>
                <p className="mt-2 text-xs text-slate-500">
                  Showing {statsLabel}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void refreshPermissions()}
                disabled={isRefreshing || isLoading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <RefreshCw
                  size={16}
                  className={isRefreshing ? "animate-spin" : ""}
                />
                Refresh
              </button>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#004a94] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#003a75]"
              >
                <Plus size={16} />
                Add Permission
              </button>
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          ) : null}
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative max-w-md">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by name, key, or description"
              className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm outline-none transition focus:border-[#004a94] focus:ring-2 focus:ring-[#004a94]/10"
            />
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
          <div className="flex h-full min-h-0 flex-col">
            <div className="min-h-0 flex-1 overflow-auto">
              <table className="min-w-full table-fixed border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th className="sticky top-0 z-10 w-[22%] border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Name
                    </th>
                    <th className="sticky top-0 z-10 w-[22%] border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Key
                    </th>
                    <th className="sticky top-0 z-10 border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Description
                    </th>
                    <th className="sticky top-0 z-10 w-[220px] border-b border-slate-200 bg-slate-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-16 text-center text-sm text-slate-500"
                      >
                        Loading permissions...
                      </td>
                    </tr>
                  ) : visibleItems.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-16 text-center text-sm text-slate-500"
                      >
                        No permissions found.
                      </td>
                    </tr>
                  ) : (
                    visibleItems.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="border-b border-slate-200 px-4 py-4 align-top text-sm font-medium text-slate-900">
                          <div className="break-words">{item.name}</div>
                        </td>
                        <td className="border-b border-slate-200 px-4 py-4 align-top text-sm text-slate-700">
                          <div className="break-words">{item.key}</div>
                        </td>
                        <td className="border-b border-slate-200 px-4 py-4 align-top text-sm text-slate-600">
                          <div className="break-words">
                            {item.description || "—"}
                          </div>
                        </td>
                        <td className="border-b border-slate-200 px-4 py-4 align-top">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingPermission(item)}
                              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                            >
                              <SquarePen size={14} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => setDeletingPermission(item)}
                              disabled={isSubmitting}
                              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-4 py-3 text-sm">
              <div className="text-slate-600">
                {searchTerm.trim()
                  ? "Filtered permission results"
                  : "All permissions"}
              </div>

              <div className="font-medium text-slate-900">
                Showing {visibleCount} / {totalCount} permissions
              </div>
            </div>
          </div>
        </div>
      </div>

      <PermissionModal
        open={isCreateOpen}
        mode="create"
        title="Add Permission"
        initialValues={getInitialFormValues()}
        isSubmitting={isSubmitting}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreate}
      />

      <PermissionModal
        open={Boolean(editingPermission)}
        mode="edit"
        title="Edit Permission"
        initialValues={getInitialFormValues(editingPermission)}
        isSubmitting={isSubmitting}
        onClose={() => setEditingPermission(null)}
        onSubmit={handleUpdate}
      />
      <DeleteConfirmationModal
        open={Boolean(deletingPermission)}
        permissionName={deletingPermission?.name}
        isSubmitting={isSubmitting}
        onClose={() => setDeletingPermission(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Permissions;
