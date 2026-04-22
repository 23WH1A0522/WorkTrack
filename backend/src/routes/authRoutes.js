import express from "express";
import { registerUser, loginUser, getCurrentUser, getAllUsers } from "../controllers/authController.js";
import { protectRoute } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectRoute, getCurrentUser);
router.get("/users", protectRoute, getAllUsers);

export default router;
