import express from "express";
import { printList, downloadListPDF, printQuotation } from "../controllers/print.controller.js";

const router = express.Router();

router.post("/list", printList);
router.get("/list/:id", downloadListPDF);
router.post("/quotation", printQuotation);

export default router;