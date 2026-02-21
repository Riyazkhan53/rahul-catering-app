import express from "express";
import { printList, downloadListPDF, printQuotation, downloadQuotationPDF, printMenuPlan, downloadMenuPlanPDF } from "../controllers/print.controller.js";

const router = express.Router();

router.post("/list", printList);
router.get("/list/:id", downloadListPDF);
router.post("/quotation", printQuotation);
router.get("/quotation/:id", downloadQuotationPDF);
router.post("/menuplan", printMenuPlan);
router.get("/menuplan/:id", downloadMenuPlanPDF);

export default router;