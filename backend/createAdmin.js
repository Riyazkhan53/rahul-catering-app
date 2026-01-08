import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import { connectDB } from "./src/config/db.js";

await connectDB();

const hashed = await bcrypt.hash("admin123", 10);

await User.findOneAndUpdate(
  { username: "admin" },
  { password: hashed, name: "Admin", role: "admin" },
  { upsert: true }
);

console.log("✅ Admin password reset to admin123");
process.exit();