import { ErrorHandler, TryCatch } from "../middlewares/error.middleware.js";
import { ChatMessage } from "../models/chatmessage.model.js";

export const storeMessage = TryCatch(async (req, res, next) => {
  const { text, sender } = req.body;
  const userId = req.user; // From auth middleware

  if (!text || !sender) {
    return next(new ErrorHandler("Please provide all required fields", 400));
  }

  if (!["user", "bot"].includes(sender)) {
    return next(new ErrorHandler("Invalid sender type", 400));
  }

  const message = await ChatMessage.create({
    userId,
    text,
    sender,
  });

  res.status(201).json({
    success: true,
    message,
  });
});

export const getChatHistory = TryCatch(async (req, res, next) => {
  const userId = req.user;
  console.log(userId);
  const messages = await ChatMessage.find({ userId })
    .sort({ createdAt: -1 })
    .limit(15)
    .lean();
  console.log(messages);
  res.status(200).json({
    success: true,
    data: messages,
  });
});
