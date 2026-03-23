import { AlertTriangle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  open: boolean;
  permissionName?: string;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
}

const DeleteConfirmationModal = ({
  open,
  permissionName,
  isSubmitting = false,
  onClose,
  onConfirm,
}: DeleteConfirmationModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-red-100 p-2 text-red-600">
              <AlertTriangle size={18} />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Delete Permission
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Are you sure you want to delete{" "}
                <span className="font-medium text-slate-700">
                  {permissionName || "this permission"}
                </span>
                ?
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4">
          <p className="text-sm text-slate-500">
            This action cannot be undone.
          </p>

          <div className="mt-4 flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => void onConfirm()}
              disabled={isSubmitting}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
