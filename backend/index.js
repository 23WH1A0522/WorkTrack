import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./src/config/connect.js";
import cors from "cors";
import { seedDemoData } from "./src/utils/seedDemoData.js";
import { ensureIndexes } from "./src/utils/ensureIndexes.js";

// Routes Import
import authRoutes from "./src/routes/authRoutes.js";
import workspaceRoutes from "./src/routes/workspaceRoutes.js";
import projectRoutes from "./src/routes/projectRoutes.js";
import taskRoutes from "./src/routes/taskRoutes.js";
import commentRoutes from "./src/routes/commentRoutes.js";

dotenv.config({ path: new URL("./.env", import.meta.url) });
dotenv.config({ path: new URL("../.env", import.meta.url), override: false });

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL?.split(",") || true }));

app.get("/api/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

// API Endpoints
app.use("/api/auth", authRoutes);
app.use("/api/workspaces", workspaceRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  await ensureIndexes();
  await seedDemoData();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
