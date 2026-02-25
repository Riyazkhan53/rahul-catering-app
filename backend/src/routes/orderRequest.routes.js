import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  createOrderRequest,
  getOrderRequests,
  updateOrderRequestStatus,
} from "../controllers/orderRequest.controller.js";

const router = Router();

// PUBLIC — website submits quotation requests here (no auth)
router.post("/", createOrderRequest);

// AUTHENTICATED — catering app fetches & manages requests
router.get("/", auth, getOrderRequests);
router.patch("/:id/status", auth, updateOrderRequestStatus);

export default router;
