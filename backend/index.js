import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { connectDB } from "./lib/db.js";
import { v2 as cloudinary } from "cloudinary";
import userRoutes from "./routes/user.routes.js";
import taskRoutes from "./routes/task.routes.js";
import todoRoutes from "./routes/todo.routes.js";
import teamRoutes from "./routes/team.routes.js";
import chatRoutes from "./routes/chatmessage.routes.js";
import { isAuthenticated } from "./middlewares/auth.middleware.js";
import { multerUpload } from "./lib/cloudinary.js";
import { downS3, uploadS3 } from "./common.js";

const app = express();

const port = process.env.PORT || 8080;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
app.use("/api/chat", chatRoutes);

app.post("/upload/s3", multerUpload.single("file"), isAuthenticated, uploadS3);
app.get("/download/s3/:file_key", isAuthenticated, downS3);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
