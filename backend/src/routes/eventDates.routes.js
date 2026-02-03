import express from "express";
import {
  getAllEventDates,
  getEventsByDate,
  saveEventsByDate,
  deleteEventById
} from "../controllers/eventDates.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.get("/", auth, getAllEventDates);
router.get("/:date", auth, getEventsByDate);
router.post("/:date", auth, saveEventsByDate);
router.delete("/:date/:eventId", auth, deleteEventById);

export default router;