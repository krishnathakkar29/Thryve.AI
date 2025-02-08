import express from "express";
import { getTodos, addTodo } from "../controllers/todo.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(isAuthenticated);

router.get("/todos", getTodos);
router.post("/todos", addTodo);

export default router;
