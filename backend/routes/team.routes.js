import express from "express";
import { getTeams } from "../controllers/team.controller.js";

const router = express.Router();

router.get("/getteams", getTeams);

// Task routes

export default router;
