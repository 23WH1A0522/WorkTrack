import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import WorkSpace from "../models/WorkSpace.js";
import User from "../models/User.js";
import { generateId } from "../utils/generateId.js";
import { getSerializedWorkspacesForUser } from "../services/workspaceService.js";
import {
  normalizePriority,
  normalizeProjectStatus,
  normalizeRole,
} from "../utils/normalizers.js";

export const createProject = async (req, res) => {
  try {
    const {
      workspaceId,
      name,
      description,
      status,
      priority,
      startDate,
      endDate,
      teamLeadId,
      teamMemberIds = [],
    } =
      req.body;

    const workspace = await WorkSpace.findOne({ id: workspaceId });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const lead = teamLeadId ? await User.findOne({ Id: teamLeadId }) : req.user;

    const project = await Project.create({
      id: generateId(),
      workspaceId: workspace._id,
      name,
      description,
      status: normalizeProjectStatus(status),
      priority: normalizePriority(priority),
      startDate,
      endDate,
      teamLeadId: lead?._id || req.user._id,
    });

    const memberIds = new Set([req.user._id.toString()]);
    if (lead?._id) {
      memberIds.add(lead._id.toString());
    }

    for (const memberId of teamMemberIds) {
      const user = await User.findOne({ Id: memberId });
      if (user?._id) {
        memberIds.add(user._id.toString());
      }
    }

    await ProjectMember.insertMany(
      Array.from(memberIds).map((userId) => ({
        projectId: project._id,
        userId,
        role:
          lead?._id?.toString() === userId || req.user._id.toString() === userId
            ? "TEAM_LEAD"
            : "CONTRIBUTOR",
      }))
    );

    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    const updatedWorkspace = workspaces.find((item) => item.id === workspaceId);
    const createdProject = updatedWorkspace?.projects?.find((item) => item.id === project.id);

    res.status(201).json({ message: "Project created successfully", project: createdProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const payload = { ...req.body };

    if (payload.status) payload.status = normalizeProjectStatus(payload.status);
    if (payload.priority) payload.priority = normalizePriority(payload.priority);
    if (payload.start_date) payload.startDate = payload.start_date;
    if (payload.end_date) payload.endDate = payload.end_date;
    delete payload.start_date;
    delete payload.end_date;

    const project = await Project.findOneAndUpdate({ id }, payload, { new: true });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    const updatedWorkspace = workspaces.find((item) => item.projects.some((projectItem) => projectItem.id === id));
    const updatedProject = updatedWorkspace?.projects?.find((projectItem) => projectItem.id === id);

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMemberToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { email } = req.body;

    const project = await Project.findOne({ id: projectId });
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = await ProjectMember.findOne({
      projectId: project._id,
      userId: userToAdd._id,
    });

    if (exists) {
      return res.status(400).json({ message: "User already in project" });
    }

    await ProjectMember.create({
      projectId: project._id,
      userId: userToAdd._id,
      role: normalizeRole(req.body.role, "CONTRIBUTOR"),
    });

    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    const updatedWorkspace = workspaces.find((item) => item.projects.some((projectItem) => projectItem.id === projectId));
    const updatedProject = updatedWorkspace?.projects?.find((projectItem) => projectItem.id === projectId);

    res.status(200).json({ message: "Member added to project", project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
