import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { updateProject } from "../features/workspaceSlice";
import { apiRequest } from "../lib/api";
import useAvailableUsers from "../hooks/useAvailableUsers";

const AddProjectMember = ({ isDialogOpen, setIsDialogOpen }) => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
  const dispatch = useDispatch();
  const { users: availableUsers } = useAvailableUsers(isDialogOpen);

  const project = currentWorkspace?.projects.find((item) => item.id === id);
  const projectMembersEmails = project?.members.map((member) => member.user.email) || [];

  const [email, setEmail] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsAdding(true);
    try {
      const response = await apiRequest(`/projects/${id}/add-member`, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      dispatch(updateProject(response.project));
      setEmail("");
      setIsDialogOpen(false);
      toast.success("Member added to project");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200">
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Add Member to Project
          </h2>
          {currentWorkspace && (
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              Adding to Project: <span className="text-blue-600 dark:text-blue-400">{project.name}</span>
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-zinc-900 dark:text-zinc-200">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 dark:text-zinc-400 w-4 h-4" />
              <select
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="pl-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a member</option>
                {availableUsers
                  .filter((user) => currentWorkspace?.members?.some((member) => member.user.email === user.email))
                  .filter((user) => !projectMembersEmails.includes(user.email))
                  .map((user) => (
                    <option key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-5 py-2 text-sm rounded border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAdding || !currentWorkspace}
              className="px-5 py-2 text-sm rounded bg-gradient-to-br from-blue-500 to-blue-600 hover:opacity-90 text-white disabled:opacity-50 transition"
            >
              {isAdding ? "Adding..." : "Add Member"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectMember;
