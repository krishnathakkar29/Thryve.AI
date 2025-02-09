import express from "express";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import {
  getChatHistory,
  storeMessage,
} from "../controllers/chatmessage.controller.js";

const router = express.Router();

router.use(isAuthenticated);
router.post("/store", isAuthenticated, storeMessage);
router.get("/history", isAuthenticated, getChatHistory);

export default router;
