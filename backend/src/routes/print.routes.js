import express from "express";
import { printList, downloadListPDF, printQuotation, printMenuPlan } from "../controllers/print.controller.js";

const router = express.Router();

router.post("/list", printList);
router.get("/list/:id", downloadListPDF);
router.post("/quotation", printQuotation);
router.post("/menuplan", printMenuPlan);

export default router;