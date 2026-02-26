import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, enum: ["visitor", "admin"], required: true },
  text: { type: String, required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const ChatSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  sessionId: { type: String, required: true },
  status: { type: String, enum: ["active", "closed"], default: "active" },
  messages: [MessageSchema],
  lastMessage: { type: String, default: "" },
  unreadAdmin: { type: Number, default: 0 },
  unreadVisitor: { type: Number, default: 0 },
}, { timestamps: true, collection: "chats" });

const Chat = mongoose.model("Chat", ChatSchema);

// Drop legacy unique index on sessionId if it exists
Chat.collection.dropIndex("sessionId_1").catch(() => {});

export default Chat;
