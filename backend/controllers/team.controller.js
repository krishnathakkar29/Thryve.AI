import { TryCatch } from "../middlewares/error.middleware.js";
import { Team } from "../models/team.model.js";

export const getTeams = TryCatch(async (req, res, next) => {
  const teams = await Team.find({}, "name _id");
  return res.status(200).json({ success: true, teams });
});
