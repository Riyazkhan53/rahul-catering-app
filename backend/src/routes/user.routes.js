import express from "express";
import {
  createChef,
  getChefs,
  updateChef,
  switchRole,
  changePassword,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// Admin only
router.get("/chefs", authMiddleware(), roleMiddleware("admin"), getChefs);
router.post("/create-chef", authMiddleware("admin"), createChef);
router.put("/chef/:id", authMiddleware("admin"), updateChef);

// Any authenticated user
router.post("/switch-role", authMiddleware(), switchRole);

// Admin or self
router.post("/change-password", authMiddleware(), changePassword);

export default router;