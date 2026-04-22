import WorkSpace from "../models/WorkSpace.js";
import WorkspaceMember from "../models/WorkspaceMember.js";
import Project from "../models/Project.js";
import ProjectMember from "../models/ProjectMember.js";
import Task from "../models/Task.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

const dropIndexIfExists = async (model, indexName) => {
  try {
    const indexes = await model.collection.indexes();
    const exists = indexes.some((index) => index.name === indexName);
    if (exists) {
      await model.collection.dropIndex(indexName);
    }
  } catch (_error) {
    // Ignore missing indexes so startup remains resilient.
  }
};

export const ensureIndexes = async () => {
  await dropIndexIfExists(WorkspaceMember, "workspaceId_1_Id_1");
  await dropIndexIfExists(WorkSpace, "name_1");
  await dropIndexIfExists(WorkSpace, "slug_1");
  await dropIndexIfExists(Project, "name_1");

  await User.syncIndexes();
  await WorkSpace.syncIndexes();
  await WorkspaceMember.syncIndexes();
  await Project.syncIndexes();
  await ProjectMember.syncIndexes();
  await Task.syncIndexes();
  await Comment.syncIndexes();
};
