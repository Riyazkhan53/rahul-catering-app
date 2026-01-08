import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import { connectDB } from "./config/db.js";
import { seedAdmin } from "./controllers/auth.controller.js";

const PORT = process.env.PORT || 5000;

connectDB().then(seedAdmin);

app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);