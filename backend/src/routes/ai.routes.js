import express from "express";
import { autoGenerateItem } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate-item", autoGenerateItem);

export default router;