const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error(err));

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("rahul@123", 10);

  await User.create({
    username: "admin",
    password: hashedPassword,
  });

  console.log("✅ Admin user created");
  mongoose.disconnect();
}

createAdmin();