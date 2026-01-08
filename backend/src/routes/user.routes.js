import express from "express";
import {
  createChef,
  getChefs,
  changePassword,
} from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import roleMiddleware from "../middleware/role.middleware.js";

const router = express.Router();

// Admin only
router.get("/chefs", authMiddleware(), roleMiddleware("admin"), getChefs);
router.post("/create-chef", authMiddleware("admin"), createChef);

// Admin or self
router.post("/change-password", authMiddleware(), changePassword);

export default router;