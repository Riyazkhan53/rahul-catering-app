import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { MessageSquare, Send, ArrowLeft, User, Clock, XCircle, Inbox } from "lucide-react";
import AnimatedPage from "./AnimatedPage";
import { apiRequest, isOfflineMode } from "../api/api";
import MiniLoader from "../Components/MiniLoader";

export default function Messages() {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeChat, setActiveChat] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  // Fetch all chats
  const fetchChats = async () => {
    try {
      if (!isOfflineMode()) {
        const data = await apiRequest("/api/chats");
        setChats(data);
        // Update active chat messages if one is selected
        if (activeChat) {
          const updated = data.find((c) => c._id === activeChat._id);
          if (updated) setActiveChat(updated);
        }
      }
    } catch (err) {
      console.error("Failed to fetch chats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
    pollRef.current = setInterval(fetchChats, 5000);
    return () => clearInterval(pollRef.current);
  }, []);

  // Listen for openChat event from notifications
  useEffect(() => {
    const handler = (e) => {
      const chatId = e.detail?.chatId;
      if (chatId) {
        // Find chat in current list or fetch fresh
        const found = chats.find((c) => c._id === chatId);
        if (found) {
          setActiveChat(found);
        } else {
          // Fetch fresh and select
          (async () => {
            try {
              const data = await apiRequest("/api/chats");
              setChats(data);
              const target = data.find((c) => c._id === chatId);
              if (target) setActiveChat(target);
            } catch {}
          })();
        }
      }
    };
    window.addEventListener("openChat", handler);
    return () => window.removeEventListener("openChat", handler);
  }, [chats]);

  // Re-fetch when activeChat changes to keep polling in sync
  useEffect(() => {
    if (activeChat) {
      // Mark as read
      apiRequest(`/api/chats/${activeChat._id}/read`, { method: "PATCH" }).catch(() => {});
    }
  }, [activeChat?._id]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSendReply = async (e) => {
    e.preventDefault();
    if (!replyText.trim() || sending || !activeChat) return;
    setSending(true);

    try {
      const updated = await apiRequest(`/api/chats/${activeChat._id}/message`, {
        method: "POST",
        body: { text: replyText.trim() },
      });
      setActiveChat(updated);
      setChats((prev) => prev.map((c) => (c._id === updated._id ? updated : c)));
      setReplyText("");
    } catch (err) {
      console.error("Failed to send reply:", err);
    } finally {
      setSending(false);
    }
  };

  const handleCloseChat = async (chatId) => {
    try {
      const updated = await apiRequest(`/api/chats/${chatId}/close`, { method: "PATCH" });
      setChats((prev) => prev.map((c) => (c._id === chatId ? updated : c)));
      if (activeChat?._id === chatId) setActiveChat(updated);
    } catch (err) {
      console.error("Failed to close chat:", err);
    }
  };

  const formatTime = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    if (isToday) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" }) + " " + d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const activeChats = chats.filter((c) => c.status === "active");
  const closedChats = chats.filter((c) => c.status === "closed");

  if (loading) {
    return (
      <AnimatedPage>
        <div className="flex justify-center py-20">
          <MiniLoader variant="inline" />
        </div>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <div className="flex h-[calc(100vh-140px)] bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Chat list sidebar */}
        <div className={`${activeChat ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 lg:w-96 border-r border-gray-100 dark:border-gray-700`}>
          <div className="flex items-center gap-2 px-4 py-3.5 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100">Messages</h2>
            {activeChats.filter((c) => c.unreadAdmin > 0).length > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded-full">
                {activeChats.filter((c) => c.unreadAdmin > 0).length}
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                  <Inbox className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No conversations yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Chats from website visitors will appear here</p>
              </div>
            ) : (
              <>
                {activeChats.length > 0 && (
                  <div>
                    <p className="px-4 pt-3 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Active</p>
                    {activeChats.map((chat) => (
                      <ChatListItem
                        key={chat._id}
                        chat={chat}
                        isActive={activeChat?._id === chat._id}
                        onClick={() => setActiveChat(chat)}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                )}
                {closedChats.length > 0 && (
                  <div>
                    <p className="px-4 pt-4 pb-1 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Closed</p>
                    {closedChats.map((chat) => (
                      <ChatListItem
                        key={chat._id}
                        chat={chat}
                        isActive={activeChat?._id === chat._id}
                        onClick={() => setActiveChat(chat)}
                        formatTime={formatTime}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Chat detail */}
        <div className={`${activeChat ? "flex" : "hidden md:flex"} flex-col flex-1`}>
          {!activeChat ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
              <MessageSquare className="w-12 h-12 mb-3 opacity-30" />
              <p className="text-sm font-medium">Select a conversation</p>
            </div>
          ) : (
            <>
              {/* Chat header */}
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                <button
                  onClick={() => setActiveChat(null)}
                  className="md:hidden p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                </button>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                  {activeChat.visitorName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{activeChat.visitorName}</p>
                  <p className="text-[11px] text-gray-400 dark:text-gray-500">
                    {activeChat.status === "active" ? "Online visitor" : "Chat closed"}
                  </p>
                </div>
                {activeChat.status === "active" && (
                  <button
                    onClick={() => handleCloseChat(activeChat._id)}
                    title="Close chat"
                    className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                {activeChat.messages.map((msg, i) => (
                  <div
                    key={msg._id || i}
                    className={`flex ${msg.sender === "admin" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "admin"
                          ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-md"
                          : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-600 rounded-bl-md"
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.sender === "admin" ? "text-blue-200" : "text-gray-400 dark:text-gray-500"}`}>
                        {formatTime(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Reply input */}
              {activeChat.status === "active" ? (
                <form onSubmit={handleSendReply} className="flex items-center gap-2 px-3 py-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <input
                    type="text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type a reply..."
                    className="flex-1 px-3.5 py-2.5 text-sm bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={sending || !replyText.trim()}
                    className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">This chat has been closed</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </AnimatedPage>
  );
}

function ChatListItem({ chat, isActive, onClick, formatTime }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition hover:bg-gray-50 dark:hover:bg-gray-700/50 ${
        isActive ? "bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue-500" : ""
      }`}
    >
      <div className="relative">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold shrink-0">
          {chat.visitorName.charAt(0).toUpperCase()}
        </div>
        {chat.status === "active" && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{chat.visitorName}</p>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
            {formatTime(chat.updatedAt)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage || "No messages yet"}</p>
          {chat.unreadAdmin > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full shrink-0">
              {chat.unreadAdmin}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
