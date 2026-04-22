import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import { serializeComment } from "../utils/workspaceSerializer.js";

export const addComment = async (req, res) => {
  try {
    const { taskId, content } = req.body;

    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comment = await Comment.create({
      taskId: task._id,
      userId: req.user._id,
      content,
    });

    const populatedComment = await Comment.findById(comment._id).populate("userId");
    res.status(201).json(serializeComment(populatedComment));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findOne({ id: taskId });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const comments = await Comment.find({ taskId: task._id })
      .populate("userId")
      .sort({ createdAt: 1 });

    res.status(200).json(comments.map((comment) => serializeComment(comment)));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
