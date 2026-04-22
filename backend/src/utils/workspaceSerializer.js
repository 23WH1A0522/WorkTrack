import { STATUS } from "./normalizers.js";

const createAvatarDataUrl = (label, background = "#1d4ed8", color = "#ffffff") => {
  const initial = (label || "?").trim().charAt(0).toUpperCase() || "?";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" rx="32" fill="${background}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="${color}">${initial}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const serializeUser = (user) => ({
  id: user.Id || user.id || user._id.toString(),
  dbId: user._id.toString(),
  name: user.name,
  email: user.email,
  image: createAvatarDataUrl(user.name),
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const serializeComment = (comment) => ({
  id: comment._id.toString(),
  content: comment.content,
  createdAt: comment.createdAt,
  user: comment.userId ? serializeUser(comment.userId) : null,
});

export const serializeTask = (task, assignee, comments = []) => ({
  id: task.id,
  dbId: task._id.toString(),
  projectId: task.projectCode || task.projectId?.id || task.projectId?.toString(),
  title: task.title,
  description: task.description || "",
  status: task.status || STATUS.TODO,
  type: task.type || "TASK",
  priority: task.priority || "MEDIUM",
  assigneeId: assignee?.Id || assignee?._id?.toString() || "",
  due_date: task.dueDate,
  createdAt: task.createdAt,
  updatedAt: task.updatedAt,
  assignee: assignee ? serializeUser(assignee) : null,
  comments,
});

export const serializeProject = (project, members = [], tasks = []) => ({
  id: project.id,
  dbId: project._id.toString(),
  name: project.name,
  description: project.description || "",
  priority: project.priority || "MEDIUM",
  status: project.status || STATUS.PLANNING,
  start_date: project.startDate,
  end_date: project.endDate,
  team_lead: project.teamLeadId?.Id || project.teamLeadId?.toString() || "",
  workspaceId: project.workspaceCode || project.workspaceId?.id || project.workspaceId?.toString(),
  progress: project.progress || 0,
  createdAt: project.createdAt,
  updatedAt: project.updatedAt,
  tasks,
  members,
});

export const serializeWorkspace = (workspace, owner, members = [], projects = []) => ({
  id: workspace.id,
  dbId: workspace._id.toString(),
  name: workspace.name,
  slug: workspace.slug,
  description: workspace.description || null,
  settings: workspace.settings || {},
  ownerId: owner?.Id || owner?._id?.toString() || "",
  image_url: workspace.imageUrl || createAvatarDataUrl(workspace.name, "#e2e8f0", "#0f172a"),
  createdAt: workspace.createdAt,
  updatedAt: workspace.updatedAt,
  members,
  projects,
  owner: owner ? serializeUser(owner) : null,
});

export const serializeWorkspaceMember = (membership, user) => ({
  id: membership._id.toString(),
  userId: user?.Id || user?._id?.toString() || "",
  workspaceId: membership.workspaceId?.id || membership.workspaceId?.toString(),
  role: membership.role || STATUS.MEMBER,
  user: user ? serializeUser(user) : null,
});

export const serializeProjectMember = (membership, user) => ({
  id: membership._id.toString(),
  userId: user?.Id || user?._id?.toString() || "",
  projectId: membership.projectId?.id || membership.projectId?.toString(),
  role: membership.role || STATUS.CONTRIBUTOR,
  user: user ? serializeUser(user) : null,
});
