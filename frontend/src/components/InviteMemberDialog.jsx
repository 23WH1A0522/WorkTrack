import { useState } from "react";
import { Mail, UserPlus } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { upsertWorkspace } from "../features/workspaceSlice";
import { apiRequest } from "../lib/api";
import useAvailableUsers from "../hooks/useAvailableUsers";

const InviteMemberDialog = ({ isDialogOpen, setIsDialogOpen }) => {
  const currentWorkspace = useSelector((state) => state.workspace?.currentWorkspace || null);
  const dispatch = useDispatch();
  const { users: availableUsers } = useAvailableUsers(isDialogOpen);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    role: "org:member",
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const workspace = await apiRequest("/workspaces/add-member", {
        method: "POST",
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          email: formData.email,
          role: formData.role,
        }),
      });
      dispatch(upsertWorkspace(workspace));
      setFormData({ email: "", role: "org:member" });
      setIsDialogOpen(false);
      toast.success("Member added to workspace");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur flex items-center justify-center z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-xl p-6 w-full max-w-md text-zinc-900 dark:text-zinc-200">
        <div className="mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <UserPlus className="size-5 text-zinc-900 dark:text-zinc-200" /> Invite Team Member
          </h2>
          {currentWorkspace && (
            <p className="text-sm text-zinc-700 dark:text-zinc-400">
              Inviting to workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
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
                value={formData.email}
                onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                className="pl-10 mt-1 w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 py-2 focus:outline-none focus:border-blue-500"
                required
              >
                <option value="">Select a user</option>
                {availableUsers
                  .filter((user) => !currentWorkspace?.members?.some((member) => member.user.email === user.email))
                  .map((user) => (
                    <option key={user.id} value={user.email}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-900 dark:text-zinc-200">Role</label>
            <select
              value={formData.role}
              onChange={(event) => setFormData({ ...formData, role: event.target.value })}
              className="w-full rounded border border-zinc-300 dark:border-zinc-700 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-200 py-2 px-3 mt-1 focus:outline-none focus:border-blue-500 text-sm"
            >
              <option value="org:member">Member</option>
              <option value="org:admin">Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-5 py-2 rounded text-sm border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !currentWorkspace}
              className="px-5 py-2 rounded text-sm bg-gradient-to-br from-blue-500 to-blue-600 text-white disabled:opacity-50 hover:opacity-90 transition"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InviteMemberDialog;
