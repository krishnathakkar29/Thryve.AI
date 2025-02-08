import { ErrorHandler, TryCatch } from "../middlewares/error.middleware.js";
import { Task } from "../models/task.model.js";
import { User } from "../models/user.model.js";

export const getTasksAssignedByManager = TryCatch(async (req, res, next) => {
  // Get manager from database
  const manager = await User.findById(req.user);

  if (!manager || manager.role !== "Manager") {
    return next(new ErrorHandler("Only managers can access this route", 403));
  }

  // Get all tasks assigned by this manager
  const tasks = await Task.find({ assignedBy: manager._id })
    .populate("assignedTo", "name email")
    .populate("comments.user", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    tasks,
  });
});

export const getTasksAssignedToUser = TryCatch(async (req, res, next) => {
  // Get user from database
  const user = await User.findById(req.user);

  if (!user || !["Intern", "Employee"].includes(user.role)) {
    return next(
      new ErrorHandler("Only interns/employees can access this route", 403)
    );
  }

  // Get all tasks assigned to this user
  const tasks = await Task.find({ assignedTo: user._id })
    .populate("assignedBy", "name email")
    .populate("comments.user", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    tasks,
  });
});

export const updateTaskStatus = TryCatch(async (req, res, next) => {
  const { status } = req.body;
  const { taskId } = req.params;
  console.count("usfai");
  if (!status) {
    return next(new ErrorHandler("Please provide a status", 400));
  }
  console.count("usfai");
  console.log(status);
  console.log(taskId);

  // Validate status enum
  const validStatuses = ["Open", "InProgress", "Completed", "Blocked"];
  if (!validStatuses.includes(status)) {
    return next(new ErrorHandler("Invalid status value", 400));
    console.count("usfai");
  }

  // Get task and check if it exists
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }
  console.count("usfai");

  // Check if the user is the assigned person
  if (task.assignedTo.toString() !== req.user) {
    return next(
      new ErrorHandler("You can only update tasks assigned to you", 403)
    );
  }
  console.count("usfai");

  // Update the task status
  task.status = status;
  await task.save();
  console.count("usfai");

  res.status(200).json({
    success: true,
    task,
  });
});

export const updateTaskPriority = TryCatch(async (req, res, next) => {
  const { priority } = req.body;
  const { taskId } = req.params;

  if (!priority) {
    return next(new ErrorHandler("Please provide a priority", 400));
  }

  // Validate priority enum
  const validPriorities = ["Low", "Medium", "High"];
  if (!validPriorities.includes(priority)) {
    return next(new ErrorHandler("Invalid priority value", 400));
  }

  // Get task and check if it exists
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  // Check if the user is the manager who assigned the task
  const user = await User.findById(req.user);
  if (
    !user ||
    user.role !== "Manager" ||
    task.assignedBy.toString() !== user._id.toString()
  ) {
    return next(
      new ErrorHandler(
        "Only the assigning manager can update task priority",
        403
      )
    );
  }

  // Update the task priority
  task.priority = priority;
  await task.save();

  res.status(200).json({
    success: true,
    task,
  });
});

export const deleteTask = TryCatch(async (req, res, next) => {
  const { taskId } = req.params;

  // Get task and check if it exists
  const task = await Task.findById(taskId);
  if (!task) {
    return next(new ErrorHandler("Task not found", 404));
  }

  // Check if the user is the manager who assigned the task
  const user = await User.findById(req.user);
  if (
    !user ||
    user.role !== "Manager" ||
    task.assignedBy.toString() !== user._id.toString()
  ) {
    return next(
      new ErrorHandler("Only the assigning manager can delete this task", 403)
    );
  }

  // Delete the task
  await task.deleteOne();

  res.status(200).json({
    success: true,
    message: "Task deleted successfully",
  });
});

export const createTask = TryCatch(async (req, res, next) => {
  const { title, description, assignedTo, dueDate, priority } = req.body;

  // Validate required fields
  if (!title || !assignedTo || !dueDate) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  // Verify that the creator is a manager
  const manager = await User.findById(req.user);
  if (!manager || manager.role !== "Manager") {
    return next(new ErrorHandler("Only managers can create tasks", 403));
  }

  // Verify that the assignee exists and is an intern or employee
  const assignee = await User.findById(assignedTo);
  if (!assignee) {
    return next(new ErrorHandler("Assigned user not found", 404));
  }

  if (!["Intern", "Employee"].includes(assignee.role)) {
    return next(
      new ErrorHandler(
        "Tasks can only be assigned to interns or employees",
        400
      )
    );
  }

  // Validate priority if provided
  if (priority && !["Low", "Medium", "High"].includes(priority)) {
    return next(new ErrorHandler("Invalid priority value", 400));
  }

  // Validate due date
  const dueDateObj = new Date(dueDate);
  if (isNaN(dueDateObj.getTime())) {
    return next(new ErrorHandler("Invalid due date format", 400));
  }

  if (dueDateObj < new Date()) {
    return next(new ErrorHandler("Due date cannot be in the past", 400));
  }

  // Create the task
  const task = await Task.create({
    title,
    description,
    assignedTo,
    assignedBy: manager._id,
    dueDate: dueDateObj,
    priority: priority || "Medium",
    status: "Open",
  });

  // Populate necessary fields for response
  await task.populate([
    { path: "assignedTo", select: "name email" },
    { path: "assignedBy", select: "name email" },
  ]);

  res.status(201).json({
    success: true,
    message: "Task created successfully",
    task,
  });
});
