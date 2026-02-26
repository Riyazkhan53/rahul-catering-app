import Chat from "../models/Chat.js";

// PUBLIC — visitor starts or resumes a chat session
export async function startOrResumeChat(req, res) {
  try {
    const { visitorName, sessionId } = req.body;
    if (!visitorName || !sessionId) {
      return res.status(400).json({ message: "visitorName and sessionId are required" });
    }

    let chat = await Chat.findOne({ sessionId });
    if (!chat) {
      chat = await Chat.create({ visitorName, sessionId });
    }
    res.json(chat);
  } catch (err) {
    console.error("Error starting chat:", err);
    res.status(500).json({ message: err.message });
  }
}

// PUBLIC — visitor sends a message
export async function visitorSendMessage(req, res) {
  try {
    const { sessionId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "text is required" });

    const chat = await Chat.findOne({ sessionId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ sender: "visitor", text });
    chat.lastMessage = text;
    chat.unreadAdmin += 1;
    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error("Error sending visitor message:", err);
    res.status(500).json({ message: err.message });
  }
}

// PUBLIC — visitor polls for messages
export async function getVisitorMessages(req, res) {
  try {
    const { sessionId } = req.params;
    const chat = await Chat.findOne({ sessionId });
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    // Mark admin messages as read for visitor
    let changed = false;
    chat.messages.forEach((m) => {
      if (m.sender === "admin" && !m.read) {
        m.read = true;
        changed = true;
      }
    });
    if (changed) {
      chat.unreadVisitor = 0;
      await chat.save();
    }

    res.json(chat);
  } catch (err) {
    console.error("Error fetching visitor messages:", err);
    res.status(500).json({ message: err.message });
  }
}

// AUTHENTICATED — get all chats for admin dashboard
export async function getAllChats(req, res) {
  try {
    const chats = await Chat.find().sort({ updatedAt: -1 });
    res.json(chats);
  } catch (err) {
    console.error("Error fetching chats:", err);
    res.status(500).json({ message: err.message });
  }
}

// AUTHENTICATED — admin sends a reply
export async function adminSendMessage(req, res) {
  try {
    const { chatId } = req.params;
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "text is required" });

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.push({ sender: "admin", text });
    chat.lastMessage = text;
    chat.unreadVisitor += 1;
    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error("Error sending admin message:", err);
    res.status(500).json({ message: err.message });
  }
}

// AUTHENTICATED — mark all visitor messages as read
export async function markChatRead(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });

    chat.messages.forEach((m) => {
      if (m.sender === "visitor" && !m.read) {
        m.read = true;
      }
    });
    chat.unreadAdmin = 0;
    await chat.save();

    res.json(chat);
  } catch (err) {
    console.error("Error marking chat read:", err);
    res.status(500).json({ message: err.message });
  }
}

// AUTHENTICATED — close a chat
export async function closeChat(req, res) {
  try {
    const { chatId } = req.params;
    const chat = await Chat.findByIdAndUpdate(chatId, { status: "closed" }, { new: true });
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
  } catch (err) {
    console.error("Error closing chat:", err);
    res.status(500).json({ message: err.message });
  }
}
