import { Router } from "express";
import auth from "../middleware/auth.js";
import {
  startOrResumeChat,
  visitorSendMessage,
  getVisitorMessages,
  getAllChats,
  adminSendMessage,
  markChatRead,
  closeChat,
  deleteChat,
  deleteAllChats,
} from "../controllers/chat.controller.js";

const router = Router();

// Public — website visitor endpoints
router.post("/start", startOrResumeChat);
router.post("/visitor/:sessionId/message", visitorSendMessage);
router.get("/visitor/:sessionId", getVisitorMessages);

// Authenticated — catering app admin endpoints
router.get("/", auth, getAllChats);
router.delete("/all", auth, deleteAllChats);
router.post("/:chatId/message", auth, adminSendMessage);
router.patch("/:chatId/read", auth, markChatRead);
router.patch("/:chatId/close", auth, closeChat);
router.delete("/:chatId", auth, deleteChat);

export default router;
