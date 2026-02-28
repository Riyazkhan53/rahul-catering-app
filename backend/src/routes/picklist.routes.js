import express from "express";
import auth from "../middleware/auth.js";
import {
  getAllPicklists,
  getPicklist,
  addPicklistItem,
  updatePicklistItem,
  reorderPicklist,
  deletePicklistItem,
} from "../controllers/picklist.controller.js";

const router = express.Router();

router.get("/", auth, getAllPicklists);
router.get("/:picklist", auth, getPicklist);
router.post("/:picklist", auth, addPicklistItem);
router.put("/:picklist/reorder", auth, reorderPicklist);
router.put("/:picklist/:id", auth, updatePicklistItem);
router.delete("/:picklist/:id", auth, deletePicklistItem);

export default router;