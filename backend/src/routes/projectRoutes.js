import express from "express";
import { createProject, updateProject, addMemberToProject } from "../controllers/projectController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protectRoute, createProject);
router.put("/:id", protectRoute, updateProject);
router.post("/:projectId/add-member", protectRoute, addMemberToProject);

export default router;