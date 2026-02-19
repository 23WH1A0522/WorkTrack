import express from "express";
import { createWorkspace, getWorkspaces, addMemberToWorkspace } from "../controllers/workspaceController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protectRoute, getWorkspaces);
router.post("/", protectRoute, createWorkspace);
router.post("/add-member", protectRoute, addMemberToWorkspace);

export default router;