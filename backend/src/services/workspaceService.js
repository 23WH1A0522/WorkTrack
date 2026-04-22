import WorkSpace from "../models/WorkSpace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";
import User from "../models/User.js";
import {
  serializeComment,
  serializeProject,
  serializeProjectMember,
  serializeTask,
  serializeWorkspace,
  serializeWorkspaceMember,
} from "../utils/workspaceSerializer.js";

export const getSerializedWorkspacesForUser = async (userDbId) => {
  const memberships = await WorkspaceMember.find({ userId: userDbId }).lean();
  const workspaceIds = memberships.map((membership) => membership.workspaceId);

  const workspaces = await WorkSpace.find({ _id: { $in: workspaceIds } })
    .populate("ownerId")
    .lean();

  const workspaceMemberships = await WorkspaceMember.find({ workspaceId: { $in: workspaceIds } })
    .populate("userId")
    .lean();

  const projects = await Project.find({ workspaceId: { $in: workspaceIds } })
    .populate("teamLeadId")
    .lean();
  const projectIds = projects.map((project) => project._id);

  const projectMemberships = await ProjectMember.find({ projectId: { $in: projectIds } })
    .populate("userId")
    .lean();

  const tasks = await Task.find({ projectId: { $in: projectIds } })
    .populate("assigneeId")
    .lean();
  const taskIds = tasks.map((task) => task._id);

  const comments = await Comment.find({ taskId: { $in: taskIds } })
    .populate("userId")
    .sort({ createdAt: 1 })
    .lean();

  return workspaces.map((workspace) => {
    const members = workspaceMemberships
      .filter((membership) => membership.workspaceId.toString() === workspace._id.toString())
      .map((membership) => serializeWorkspaceMember(membership, membership.userId));

    const workspaceProjects = projects
      .filter((project) => project.workspaceId.toString() === workspace._id.toString())
      .map((project) => {
        const membersForProject = projectMemberships
          .filter((membership) => membership.projectId.toString() === project._id.toString())
          .map((membership) => serializeProjectMember(membership, membership.userId));

        const tasksForProject = tasks
          .filter((task) => task.projectId.toString() === project._id.toString())
          .map((task) => {
            const commentsForTask = comments
              .filter((comment) => comment.taskId.toString() === task._id.toString())
              .map((comment) => serializeComment(comment));

            return serializeTask(task, task.assigneeId, commentsForTask);
          });

        return serializeProject(project, membersForProject, tasksForProject);
      });

    return serializeWorkspace(workspace, workspace.ownerId, members, workspaceProjects);
  });
};

export const findUserByIdentity = async (identity) => {
  return User.findOne({
    $or: [{ Id: identity }, { _id: identity }],
  });
};
