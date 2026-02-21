import express from "express";
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/role.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// All role routes require admin
router.get("/", authMiddleware(), getRoles);
router.get("/:roleId", authMiddleware(), getRoleById);
router.post("/", authMiddleware(), roleMiddleware("admin"), createRole);
router.put("/:roleId", authMiddleware(), roleMiddleware("admin"), updateRole);
router.delete("/:roleId", authMiddleware(), roleMiddleware("admin"), deleteRole);

export default router;
