import cookieParser from "cookie-parser";
import "dotenv/config";
import express from "express";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import { connectDB } from "./lib/db.js";
const app = express();

const port = process.env.PORT || 8080;

// connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
