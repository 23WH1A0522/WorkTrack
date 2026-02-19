import express from "express";
import { addComment, getTaskComments } from "../controllers/commentController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, addComment);
router.get("/:taskId", protectRoute, getTaskComments);

export default router;