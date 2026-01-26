import express from "express";
import auth from "../middleware/auth.js";
import {
  upsertItem,
  updateItem,
  deleteItem,
  getItems,
} from "../controllers/item.controller.js";

const router = express.Router();

router.get("/", auth, getItems);
router.post("/", auth, upsertItem);
router.put("/:code", auth, updateItem);
router.delete("/:code", auth, deleteItem);

export default router;