import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * 👨‍🍳 Create Chef (Admin only)
 */
export const createChef = async (req, res) => {
  const { username, name, password } = req.body;

  if (!username || !name || !password) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = await User.findOne({ username });
  if (exists) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);

  const chef = await User.create({
    username,
    name,
    password: hashed,
    role: "chef",
  });

  res.json({
    message: "Chef created successfully",
    chef: {
      id: chef._id,
      username: chef.username,
      name: chef.name,
      role: chef.role,
    },
  });
};

/**
 * 📋 List Chefs
 */
export const getChefs = async (req, res) => {
  console.log("🔥 getChefs called by:", req.user);

  const chefs = await User.find({ role: "chef" }).select("-password");

  console.log("👨‍🍳 chefs found:", chefs.length);

  res.json(chefs);
};

/**
 * 🔐 Change Password (Admin OR Self)
 */
export const changePassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  // Admin can change anyone
  // Chef can only change self
  if (
    req.user.role !== "admin" &&
    req.user.id !== userId
  ) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const hashed = await bcrypt.hash(newPassword, 10);

  await User.findByIdAndUpdate(userId, { password: hashed });

  res.json({ message: "Password updated successfully" });
};