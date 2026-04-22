import bcrypt from "bcryptjs";
import User from "../models/User.js";
import WorkSpace from "../models/WorkSpace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Task from "../models/Task.js";
import Comment from "../models/Comment.js";
import { generateId } from "./generateId.js";
import { STATUS } from "./normalizers.js";

export const seedDemoData = async () => {
  const existingUsers = await User.countDocuments();
  if (existingUsers > 0) {
    return;
  }

  const password = await bcrypt.hash("demo12345", 10);
  const users = await User.insertMany([
    { Id: "user_demo_1", name: "Alex Smith", email: "alex@worktrack.demo", password },
    { Id: "user_demo_2", name: "Priya Nair", email: "priya@worktrack.demo", password },
    { Id: "user_demo_3", name: "Oliver Watts", email: "oliver@worktrack.demo", password },
  ]);

  const workspace = await WorkSpace.create({
    id: "org_demo_1",
    name: "WorkTrack Demo Workspace",
    slug: "worktrack-demo-workspace",
    ownerId: users[0]._id,
  });

  await WorkspaceMember.insertMany(
    users.map((user, index) => ({
      workspaceId: workspace._id,
      userId: user._id,
      role: index === 0 ? STATUS.ADMIN : STATUS.MEMBER,
    }))
  );

  const project = await Project.create({
    id: "proj_demo_1",
    workspaceId: workspace._id,
    name: "Frontend Backend Integration",
    description: "Connect the React dashboard to the Express API and stabilize the demo project.",
    status: STATUS.ACTIVE,
    priority: "HIGH",
    progress: 68,
    startDate: new Date("2026-03-20"),
    endDate: new Date("2026-04-12"),
    teamLeadId: users[0]._id,
  });

  await ProjectMember.insertMany([
    { projectId: project._id, userId: users[0]._id, role: STATUS.TEAM_LEAD },
    { projectId: project._id, userId: users[1]._id, role: STATUS.CONTRIBUTOR },
    { projectId: project._id, userId: users[2]._id, role: STATUS.CONTRIBUTOR },
  ]);

  const tasks = await Task.insertMany([
    {
      id: generateId(),
      projectId: project._id,
      assignerId: users[0]._id,
      assigneeId: users[1]._id,
      title: "Connect dashboard cards to API data",
      description: "Replace dummy counts with real workspace metrics from the backend.",
      type: "FEATURE",
      status: STATUS.IN_PROGRESS,
      priority: "HIGH",
      dueDate: new Date("2026-04-02"),
    },
    {
      id: generateId(),
      projectId: project._id,
      assignerId: users[0]._id,
      assigneeId: users[2]._id,
      title: "Fix project and task creation flows",
      description: "Ensure forms post correctly and update the UI without refresh issues.",
      type: "BUG",
      status: STATUS.TODO,
      priority: "MEDIUM",
      dueDate: new Date("2026-04-04"),
    },
    {
      id: generateId(),
      projectId: project._id,
      assignerId: users[0]._id,
      assigneeId: users[0]._id,
      title: "Polish README and run verification",
      description: "Document setup and verify the project builds cleanly.",
      type: "TASK",
      status: STATUS.DONE,
      priority: "LOW",
      dueDate: new Date("2026-03-29"),
    },
  ]);

  await Comment.create({
    taskId: tasks[0]._id,
    userId: users[0]._id,
    content: "API contract is ready. Frontend can switch over to live data now.",
  });
};
