import Task from "../models/Task.js";
import Project from "../models/Project.js";
import User from "../models/User.js";
import { generateId } from "../utils/generateId.js";
import { getSerializedWorkspacesForUser } from "../services/workspaceService.js";
import {
  normalizePriority,
  normalizeTaskStatus,
  normalizeTaskType,
} from "../utils/normalizers.js";

export const createTask = async (req, res) => {
  try {
    const { projectId, title, description, type, priority, status, dueDate, assigneeId } = req.body;

    const project = await Project.findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const assignee = assigneeId ? await User.findOne({ Id: assigneeId }) : null;

    const task = await Task.create({
      id: generateId(),
      projectId: project._id,
      assignerId: req.user._id,
      assigneeId: assignee?._id,
      title,
      description,
      type: normalizeTaskType(type),
      priority: normalizePriority(priority),
      status: normalizeTaskStatus(status),
      dueDate,
    });

    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    const updatedWorkspace = workspaces.find((item) => item.projects.some((projectItem) => projectItem.id === projectId));
    const updatedProject = updatedWorkspace?.projects?.find((projectItem) => projectItem.id === projectId);
    const createdTask = updatedProject?.tasks?.find((taskItem) => taskItem.id === task.id);

    res.status(201).json(createdTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.type) payload.type = normalizeTaskType(payload.type);
    if (payload.priority) payload.priority = normalizePriority(payload.priority);
    if (payload.status) payload.status = normalizeTaskStatus(payload.status);
    if (payload.due_date) payload.dueDate = payload.due_date;
    if (payload.assigneeId) {
      const assignee = await User.findOne({ Id: payload.assigneeId });
      payload.assigneeId = assignee?._id;
    }
    delete payload.due_date;

    const task = await Task.findOneAndUpdate({ id }, payload, { new: true });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.projectId);
    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    const updatedWorkspace = workspaces.find((item) => item.projects.some((projectItem) => projectItem.id === project.id));
    const updatedProject = updatedWorkspace?.projects?.find((projectItem) => projectItem.id === project.id);
    const updatedTask = updatedProject?.tasks?.find((taskItem) => taskItem.id === id);

    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { taskIds } = req.body;
    await Task.deleteMany({ id: { $in: taskIds } });
    res.status(200).json({ message: "Tasks deleted successfully", taskIds });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
