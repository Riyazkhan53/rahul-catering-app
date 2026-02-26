import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["visitor", "admin"], required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  sessionId: { type: String, required: true, unique: true },
  status: { type: String, enum: ["active", "closed"], default: "active" },
  messages: [MessageSchema],
  lastMessage: { type: String, default: "" },
  unreadAdmin: { type: Number, default: 0 },
  unreadVisitor: { type: Number, default: 0 },
}, { timestamps: true, collection: "chats" });

export default mongoose.model("Chat", ChatSchema);
