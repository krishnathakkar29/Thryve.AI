import mongoose from "mongoose";
import { User } from "./models/user.model.js";
import { Team } from "./models/team.model.js";
import { Todo } from "./models/todo.model.js";
import { connectDB } from "./lib/db.js";
import bcrypt from "bcrypt";
import { Task } from "./models/task.model.js";

// Connect to the database

// Function to seed the database
const seedDatabase = async () => {
  try {
    await connectDB();
    // Clear existing data
    await User.deleteMany({});
    await Team.deleteMany({});
    await Todo.deleteMany({});

    // Create users with different roles
    const intern1 = await User.create({
      name: "Intern One",
      email: "intern1@example.com",
      password: "password",
      role: "Intern",
    });

    const intern2 = await User.create({
      name: "Intern Two",
      email: "intern2@example.com",
      password: "password",
      role: "Intern",
    });

    const intern3 = await User.create({
      name: "Intern Three",
      email: "intern3@example.com",
      password: "password",
      role: "Intern",
    });

    const employee1 = await User.create({
      name: "Employee One",
      email: "employee1@example.com",
      password: "password",
      role: "Employee",
    });

    const employee2 = await User.create({
      name: "Employee Two",
      email: "employee2@example.com",
      password: "password",
      role: "Employee",
    });

    const manager1 = await User.create({
      name: "Manager One",
      email: "manager1@example.com",
      password: "password",
      role: "Manager",
    });

    const manager2 = await User.create({
      name: "Manager Two",
      email: "manager2@example.com",
      password: "password",
      role: "Manager",
    });

    const manager3 = await User.create({
      name: "Manager Three",
      email: "manager3@example.com",
      password: "password",
      role: "Manager",
    });

    const hr = await User.create({
      name: "HR Representative",
      email: "hr@example.com",
      password: "password",
      role: "HR",
    });

    const ceo = await User.create({
      name: "CEO",
      email: "ceo@example.com",
      password: "password",
      role: "CEO",
    });

    // Create teams and assign members
    const team1 = await Team.create({
      name: "Team Alpha",
      teamIcon: "😋",
      manager: manager1._id,
      members: [intern1._id, intern2._id, employee1._id],
    });

    const team2 = await Team.create({
      name: "Team Beta",
      teamIcon: "😂",
      manager: manager2._id,
      members: [intern3._id, employee2._id],
    });

    const team3 = await Team.create({
      name: "Team Gamma",
      teamIcon: "icon3.png",
      manager: manager3._id,
      members: [intern2._id, employee1._id],
    });

    // Create todos for users
    const todo1 = await Todo.create({
      user: intern1._id,
      todos: [
        { content: "Learn React", completed: false },
        { content: "Complete assignment", completed: true },
      ],
    });

    const todo2 = await Todo.create({
      user: employee1._id,
      todos: [
        { content: "Fix bugs in the code", completed: false },
        { content: "Write documentation", completed: false },
      ],
    });

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

export const seedTasks = async () => {
  try {
    const managerId = "67a795a267e9b517a78dd494";
    const internId = "67a795a167e9b517a78dd48a";

    // Define the tasks
    const tasks = [
      {
        title: "Create API Documentation",
        description:
          "Document all the REST API endpoints using Swagger/OpenAPI specification. Include request/response examples and authentication details.",
        assignedTo: internId,
        assignedBy: managerId,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        priority: "High",
        status: "Open",
      },
      {
        title: "Implement User Dashboard",
        description:
          "Develop the frontend components for the user dashboard including profile section, activity feed, and notification panel using React.",
        assignedTo: internId,
        assignedBy: managerId,
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        priority: "Medium",
        status: "Open",
      },
      {
        title: "Unit Test Coverage",
        description:
          "Write comprehensive unit tests for the backend services. Aim for at least 80% coverage using Jest testing framework.",
        assignedTo: internId,
        assignedBy: managerId,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        priority: "Low",
        status: "Open",
      },
    ];

    await connectDB();

    // Clear existing tasks for these users (optional)
    await Task.deleteMany({
      assignedTo: internId,
      assignedBy: managerId,
    });

    // Create all tasks
    const createdTasks = await Task.create(tasks);

    // Populate the tasks with user details
    const populatedTasks = await Task.populate(createdTasks, [
      { path: "assignedTo", select: "name email" },
      { path: "assignedBy", select: "name email" },
    ]);

    console.log("Tasks created successfully:", populatedTasks);
    return populatedTasks;
  } catch (error) {
    console.error("Error seeding tasks:", error);
    throw error;
  }
};

// Run the seeder
// seedDatabase();
seedTasks();
