import { ErrorHandler, TryCatch } from "../middlewares/error.middleware.js";
import { Todo } from "../models/todo.model.js";

export const getTodos = TryCatch(async (req, res, next) => {
  const todos = await Todo.findOne({ user: req.user._id });
  if (!todos) {
    return next(new ErrorHandler("No todos found", 404));
  }
  return res.status(200).json({ success: true, todos });
});

export const addTodo = TryCatch(async (req, res, next) => {
  const { content } = req.body;

  if (!content) {
    return next(new ErrorHandler("Content is required", 400));
  }

  let todoList = await Todo.findOne({ user: req.user._id });
  if (!todoList) {
    todoList = await Todo.create({ user: req.user._id, todos: [] });
  }

  todoList.todos.push({ content });
  await todoList.save();

  res.status(201).json({ success: true, message: "Todo added successfully" });
});
