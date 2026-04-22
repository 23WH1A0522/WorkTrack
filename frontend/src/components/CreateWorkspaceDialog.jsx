import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { addWorkspace } from "../features/workspaceSlice";
import { apiRequest } from "../lib/api";

const initialState = {
  name: "",
  slug: "",
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export default function CreateWorkspaceDialog({ isOpen, setIsOpen }) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const workspace = await apiRequest("/workspaces", {
        method: "POST",
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug || slugify(formData.name),
        }),
      });
      dispatch(addWorkspace(workspace));
      setFormData(initialState);
      setIsOpen(false);
      toast.success("Workspace created successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200 relative">
        <button
          className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => setIsOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-medium mb-4">Create Workspace</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Workspace Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData((prev) => ({
                  ...prev,
                  name: event.target.value,
                  slug: prev.slug ? prev.slug : slugify(event.target.value),
                }))
              }
              placeholder="Enter workspace name"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Workspace Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(event) => setFormData({ ...formData, slug: slugify(event.target.value) })}
              placeholder="workspace-slug"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting}
              className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200"
            >
              {isSubmitting ? "Creating..." : "Create Workspace"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
