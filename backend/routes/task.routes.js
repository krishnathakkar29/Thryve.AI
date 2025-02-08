import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  createTask,
  deleteTask,
  getTasksAssignedByManager,
  getTasksAssignedToUser,
  updateTaskPriority,
  updateTaskStatus,
} from "../controllers/task.controller.js";

const router = express.Router();

router.use(isAuthenticated);

// Task routes
router.get("/assigned-by-me", getTasksAssignedByManager);
router.get("/assigned-to-me", getTasksAssignedToUser);
router.put("/:taskId/status", updateTaskStatus);
router.put("/:taskId/priority", updateTaskPriority);
router.delete("/:taskId", deleteTask);
router.post("/create", createTask);

export default router;
