import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { PermissionFormValues } from "../../types/permission";

interface PermissionModalProps {
  open: boolean;
  mode: "create" | "edit";
  title: string;
  initialValues: PermissionFormValues;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: PermissionFormValues) => Promise<void> | void;
}

const emptyErrors = {
  key: "",
  name: "",
  description: "",
};

const PermissionModal = ({
  open,
  mode,
  title,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: PermissionModalProps) => {
  const [values, setValues] = useState<PermissionFormValues>(initialValues);
  const [errors, setErrors] = useState(emptyErrors);

  useEffect(() => {
    if (open) {
      setValues(initialValues);
      setErrors(emptyErrors);
    }
  }, [initialValues, open]);

  if (!open) return null;

  const validate = () => {
    const nextErrors = {
      key: values.key.trim() ? "" : "Key is required",
      name: values.name.trim() ? "" : "Name is required",
      description: values.description.trim() ? "" : "Description is required",
    };

    setErrors(nextErrors);
    return !nextErrors.key && !nextErrors.name && !nextErrors.description;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validate()) return;

    await onSubmit({
      key: values.key.trim(),
      name: values.name.trim(),
      description: values.description.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 px-4">
      <div className="w-full max-w-xl rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">
              {mode === "create"
                ? "Add a new permission for your application."
                : "Update the selected permission details."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-5 py-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Key <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.key}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, key: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#004a94] focus:ring-2 focus:ring-[#004a94]/10"
              placeholder="permission_key"
            />
            {errors.key ? (
              <p className="mt-1 text-xs text-red-600">{errors.key}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={values.name}
              onChange={(event) =>
                setValues((prev) => ({ ...prev, name: event.target.value }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#004a94] focus:ring-2 focus:ring-[#004a94]/10"
              placeholder="Permission name"
            />
            {errors.name ? (
              <p className="mt-1 text-xs text-red-600">{errors.name}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              value={values.description}
              onChange={(event) =>
                setValues((prev) => ({
                  ...prev,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#004a94] focus:ring-2 focus:ring-[#004a94]/10"
              placeholder="Describe what this permission allows"
            />
            {errors.description ? (
              <p className="mt-1 text-xs text-red-600">{errors.description}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-[#004a94] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#003a75] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Add Permission"
                  : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PermissionModal;
