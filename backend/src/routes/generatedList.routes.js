import express from "express";
import auth from "../middleware/auth.js";
import {
  upsertGeneratedList,
  getGeneratedList,
  getAllGeneratedLists
} from "../controllers/generatedList.controller.js";

const router = express.Router();

// save / sync list
router.post("/", auth, upsertGeneratedList);

// fetch for print/download
router.get("/:id", auth, getGeneratedList);
router.get("/", auth, getAllGeneratedLists);

export default router;