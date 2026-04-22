import { useState } from "react";
import { XIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { addProject } from "../features/workspaceSlice";
import { apiRequest } from "../lib/api";
import useAvailableUsers from "../hooks/useAvailableUsers";

const initialState = {
  name: "",
  description: "",
  status: "PLANNING",
  priority: "MEDIUM",
  start_date: "",
  end_date: "",
  team_members: [],
  team_lead: "",
  progress: 0,
};

const CreateProjectDialog = ({ isDialogOpen, setIsDialogOpen }) => {
  const { currentWorkspace } = useSelector((state) => state.workspace);
  const dispatch = useDispatch();
  const { users: availableUsers } = useAvailableUsers(isDialogOpen);
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentWorkspace) return;

    setIsSubmitting(true);
    try {
      const teamLeadId =
        currentWorkspace.members.find((member) => member.user.email === formData.team_lead)?.user.id || "";
      const teamMemberIds = currentWorkspace.members
        .filter((member) => formData.team_members.includes(member.user.email))
        .map((member) => member.user.id);

      const response = await apiRequest("/projects", {
        method: "POST",
        body: JSON.stringify({
          workspaceId: currentWorkspace.id,
          name: formData.name,
          description: formData.description,
          status: formData.status,
          priority: formData.priority,
          startDate: formData.start_date || null,
          endDate: formData.end_date || null,
          teamLeadId,
          teamMemberIds,
        }),
      });

      dispatch(addProject({ workspaceId: currentWorkspace.id, project: response.project }));
      setFormData(initialState);
      setIsDialogOpen(false);
      toast.success("Project created successfully");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeTeamMember = (email) => {
    setFormData((prev) => ({
      ...prev,
      team_members: prev.team_members.filter((memberEmail) => memberEmail !== email),
    }));
  };

  if (!isDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/20 dark:bg-black/60 backdrop-blur flex items-center justify-center text-left z-50">
      <div className="bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 w-full max-w-lg text-zinc-900 dark:text-zinc-200 relative">
        <button
          className="absolute top-3 right-3 text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
          onClick={() => setIsDialogOpen(false)}
        >
          <XIcon className="size-5" />
        </button>

        <h2 className="text-xl font-medium mb-1">Create New Project</h2>
        {currentWorkspace && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
            In workspace: <span className="text-blue-600 dark:text-blue-400">{currentWorkspace.name}</span>
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Project Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(event) => setFormData({ ...formData, name: event.target.value })}
              placeholder="Enter project name"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(event) => setFormData({ ...formData, description: event.target.value })}
              placeholder="Describe your project"
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm h-20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(event) => setFormData({ ...formData, status: event.target.value })}
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              >
                <option value="PLANNING">Planning</option>
                <option value="ACTIVE">Active</option>
                <option value="COMPLETED">Completed</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(event) => setFormData({ ...formData, priority: event.target.value })}
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-1">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(event) => setFormData({ ...formData, start_date: event.target.value })}
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(event) => setFormData({ ...formData, end_date: event.target.value })}
                min={formData.start_date || undefined}
                className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-1">Project Lead</label>
            <select
              value={formData.team_lead}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  team_lead: event.target.value,
                  team_members: event.target.value
                    ? [...new Set([...formData.team_members, event.target.value])]
                    : formData.team_members,
                })
              }
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
            >
              <option value="">No lead</option>
              {currentWorkspace?.members?.map((member) => (
                <option key={member.user.email} value={member.user.email}>
                  {member.user.name} ({member.user.email})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Team Members</label>
            <select
              className="w-full px-3 py-2 rounded dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 mt-1 text-zinc-900 dark:text-zinc-200 text-sm"
              onChange={(event) => {
                if (event.target.value && !formData.team_members.includes(event.target.value)) {
                  setFormData((prev) => ({
                    ...prev,
                    team_members: [...prev.team_members, event.target.value],
                  }));
                }
              }}
            >
              <option value="">Add team members</option>
              {availableUsers
                .filter((user) => currentWorkspace?.members?.some((member) => member.user.email === user.email))
                .filter((user) => !formData.team_members.includes(user.email))
                .map((user) => (
                  <option key={user.email} value={user.email}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>

            {formData.team_members.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.team_members.map((email) => (
                  <div
                    key={email}
                    className="flex items-center gap-1 bg-blue-200/50 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 px-2 py-1 rounded-md text-sm"
                  >
                    {email}
                    <button
                      type="button"
                      onClick={() => removeTeamMember(email)}
                      className="ml-1 hover:bg-blue-300/30 dark:hover:bg-blue-500/30 rounded"
                    >
                      <XIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2 text-sm">
            <button
              type="button"
              onClick={() => setIsDialogOpen(false)}
              className="px-4 py-2 rounded border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              disabled={isSubmitting || !currentWorkspace}
              className="px-4 py-2 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white dark:text-zinc-200"
            >
              {isSubmitting ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectDialog;
