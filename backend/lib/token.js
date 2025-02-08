import jwt from "jsonwebtoken";
import { cookieOptions } from "../constants/cookie-options.js";

export const sendToken = (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("auth-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};
