import express from "express";
import { printList, downloadListPDF } from "../controllers/print.controller.js";

const router = express.Router();

router.post("/list", printList);
router.get("/list/:id", downloadListPDF);


export default router;