import express from "express";
import { createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, createTask);
router.put("/:id", protectRoute, updateTask);
router.post("/delete", protectRoute, deleteTask);

export default router;