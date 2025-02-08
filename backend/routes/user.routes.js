import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
  updateProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { multerUpload } from "../lib/cloudinary.js";

const router = express.Router();

router.post("/new", newUser);
router.post("/login", login);

router.use(isAuthenticated);

router.get("/me", getMyProfile);
router.put("/profile", multerUpload.single("profileImage"), updateProfile);

router.get("/logout", logout);

export default router;
