import express from "express";
import auth from "../middleware/auth.middleware.js";
import {
  getPicklist,
  addPicklistItem,
  updatePicklistItem,
  deletePicklistItem,
} from "../controllers/picklist.controller.js";

const router = express.Router();

router.get("/:picklist", auth, getPicklist);
router.post("/:picklist", auth, addPicklistItem);
router.put("/:picklist/:id", auth, updatePicklistItem);
router.delete("/:picklist/:id", auth, deletePicklistItem);

export default router;