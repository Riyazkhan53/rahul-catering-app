import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * 👨‍🍳 Create Chef (Admin only)
 */
export const createChef = async (req, res) => {
  const { username, name, password, additional_roles } = req.body;

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
    additional_roles: additional_roles || [],
  });

  res.json({
    message: "Chef created successfully",
    chef: {
      id: chef._id,
      username: chef.username,
      name: chef.name,
      role: chef.role,
      additional_roles: chef.additional_roles,
    },
  });
};

/**
 * 📋 List Chefs
 */
export const getChefs = async (req, res) => {
  const chefs = await User.find({ role: "chef" }).select("-password");
  res.json(chefs);
};

/**
 * ✏️ Update Chef (Admin only) — password + additional_roles
 */
export const updateChef = async (req, res) => {
  const { id } = req.params;
  const { name, password, additional_roles } = req.body;

  const chef = await User.findById(id);
  if (!chef || chef.role !== "chef") {
    return res.status(404).json({ message: "Chef not found" });
  }

  if (name) chef.name = name;
  if (password) chef.password = await bcrypt.hash(password, 10);
  if (additional_roles !== undefined) chef.additional_roles = additional_roles;

  await chef.save();

  res.json({
    message: "Chef updated successfully",
    chef: {
      id: chef._id,
      username: chef.username,
      name: chef.name,
      role: chef.role,
      additional_roles: chef.additional_roles,
    },
  });
};

/**
 * 🔄 Switch Role — re-issue token with the new active role
 */
export const switchRole = async (req, res) => {
  const { targetRole } = req.body;
  const userId = req.user.id;

  const user = await User.findById(userId).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });

  // Collect all roles this user can use
  const allRoles = [user.role, ...(user.additional_roles || [])];
  if (!allRoles.includes(targetRole)) {
    return res.status(403).json({ message: "You do not have access to this role" });
  }

  // Issue new token with the target role
  const token = jwt.sign(
    { id: user._id, role: targetRole },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  // Return all available roles so frontend can always switch back
  const availableRoles = [...new Set([user.role, ...(user.additional_roles || [])])];

  res.json({
    message: `Switched to ${targetRole} role`,
    token,
    user: {
      id: user._id,
      username: user.username,
      name: user.name,
      role: targetRole,
      additional_roles: availableRoles.filter(r => r !== targetRole),
    },
  });
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