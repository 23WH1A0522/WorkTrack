import WorkSpace from "../models/WorkSpace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import User from "../models/User.js";
import { generateId } from "../utils/generateId.js";
import { getSerializedWorkspacesForUser } from "../services/workspaceService.js";
import { normalizeRole } from "../utils/normalizers.js";

export const getWorkspaces = async (req, res) => {
  try {
    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    res.status(200).json(workspaces);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createWorkspace = async (req, res) => {
  try {
    const { name, slug } = req.body;
    const normalizedSlug =
      slug ||
      name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const workspace = await WorkSpace.create({
      id: generateId(),
      name,
      slug: normalizedSlug,
      ownerId: req.user._id,
    });

    await WorkspaceMember.create({
      workspaceId: workspace._id,
      userId: req.user._id,
      role: "ADMIN",
    });

    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    const createdWorkspace = workspaces.find((item) => item.id === workspace.id);
    res.status(201).json(createdWorkspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMemberToWorkspace = async (req, res) => {
  try {
    const { workspaceId, email, role } = req.body;

    const workspace = await WorkSpace.findOne({ id: workspaceId });
    if (!workspace) {
      return res.status(404).json({ message: "Workspace not found" });
    }

    const userToAdd = await User.findOne({ email });
    if (!userToAdd) {
      return res.status(404).json({ message: "User not found" });
    }

    const exists = await WorkspaceMember.findOne({
      workspaceId: workspace._id,
      userId: userToAdd._id,
    });

    if (exists) {
      return res.status(400).json({ message: "User already in workspace" });
    }

    await WorkspaceMember.create({
      workspaceId: workspace._id,
      userId: userToAdd._id,
      role: normalizeRole(role, "MEMBER"),
    });

    const workspaces = await getSerializedWorkspacesForUser(req.user._id);
    const updatedWorkspace = workspaces.find((item) => item.id === workspaceId);
    res.status(200).json(updatedWorkspace);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
