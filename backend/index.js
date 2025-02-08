import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import teamRoutes from "./routes/team.routes.js";

const app = express();

const port = process.env.PORT || 8080;

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["*", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/user", userRoutes);
app.use("/api/task", taskRoutes);
app.use("/api/todo", todoRoutes);
app.use("/api/team", teamRoutes);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
