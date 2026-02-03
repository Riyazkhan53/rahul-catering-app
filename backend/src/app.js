import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import healthRoutes from "./routes/health.routes.js";
import itemsRoutes from "./routes/item.routes.js";
import picklistRoutes from "./routes/picklist.routes.js";
import printRoutes from "./routes/print.routes.js";
import generatedListRoutes from "./routes/generatedList.routes.js";
import eventDatesRoutes from "./routes/eventDates.routes.js";
import aiRoutes  from "./routes/ai.routes.js";


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", healthRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/picklist", picklistRoutes);
app.use("/api/print", printRoutes);
app.use("/api/generated-lists", generatedListRoutes);
app.use("/api/event-dates", eventDatesRoutes);
app.use("/api/ai", aiRoutes); // AI routes

export default app;