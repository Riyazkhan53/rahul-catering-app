import express from "express";
import auth from "../middleware/auth.js";
import {
  upsertGeneratedMenuPlan,
  getGeneratedMenuPlan,
  getAllGeneratedMenuPlans,
} from "../controllers/generatedMenuPlan.controller.js";

const router = express.Router();

router.post("/", auth, upsertGeneratedMenuPlan);
router.get("/:id", auth, getGeneratedMenuPlan);
router.get("/", auth, getAllGeneratedMenuPlans);

export default router;
