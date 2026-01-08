import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid credentials!!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials!!" });

    const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.json({
        message: "Login successful",
        token,
        user: {
            id: user._id,
            username: user.username,
            name: user.name,
            role: user.role,
        },
    })
};

// One-time admin seed
export const seedAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ username: "admin" });

        if (existingAdmin) {
            console.log("ℹ️ Admin already exists, skipping seed!");
            return;
        }

        const hashedPassword = await bcrypt.hash("admin123", 10);

        await User.create({
            username: "admin",
            password: hashedPassword,
            role: "admin",
            name: "Admin",
        });
        console.log("✅ Default Admin Created (admin / admin123)");
    } catch (err) {
        console.error("❌ seedAdmin error:", err.message);
    }
};