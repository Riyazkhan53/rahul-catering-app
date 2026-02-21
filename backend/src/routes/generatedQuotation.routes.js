import express from "express";
import auth from "../middleware/auth.js";
import {
  upsertGeneratedQuotation,
  getGeneratedQuotation,
  getAllGeneratedQuotations,
} from "../controllers/generatedQuotation.controller.js";

const router = express.Router();

router.post("/", auth, upsertGeneratedQuotation);
router.get("/:id", auth, getGeneratedQuotation);
router.get("/", auth, getAllGeneratedQuotations);

export default router;
