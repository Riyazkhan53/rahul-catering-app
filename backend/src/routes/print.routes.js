import express from "express";
import { printList } from "../controllers/print.controller.js";

const router = express.Router();

router.post("/list", printList);

export default router;