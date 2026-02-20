import express from "express";
import { login } from "../controllers/auth.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import User from "../models/User.js";

const router = express.Router();
router.post("/login", login);

router.get("/me", authMiddleware(), async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Use the active role from the JWT token (may differ from DB after switch-role)
    res.json({
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: req.user.role,
        additional_roles: user.additional_roles || [],
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;