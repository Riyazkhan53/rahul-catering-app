import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, BellOff, MessageSquare } from "lucide-react";
import { apiRequest, isOfflineMode } from "../api/api";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    async function fetchUnread() {
      try {
        if (!isOfflineMode()) {
          const data = await apiRequest("/api/chats");
          setChats(data.filter((c) => c.unreadAdmin > 0));
        }
      } catch {}
    }
    fetchUnread();
    const interval = setInterval(fetchUnread, 8000);
    return () => clearInterval(interval);
  }, []);

  const totalUnread = chats.reduce((sum, c) => sum + c.unreadAdmin, 0);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        {totalUnread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Notifications</h3>
              {totalUnread > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">{totalUnread}</span>
              )}
            </div>

            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                  <BellOff className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No notifications</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700">
                {chats.map((chat) => (
                  <div key={chat._id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
                          New message from {chat.visitorName}
                        </p>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-0.5">{chat.lastMessage}</p>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full shrink-0">
                        {chat.unreadAdmin}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
