import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Clock, Wallet, MessageSquare, ClipboardList, Inbox, Check, X, Eye, Users, UtensilsCrossed, Phone } from "lucide-react";
import AnimatedPage from "./AnimatedPage";
import { apiRequest, isOfflineMode } from "../api/api";
import MiniLoader from "../Components/MiniLoader";

export default function DashboardHome() {
  const [orderRequests, setOrderRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);

  const stats = [
    { title: "Today's Orders", value: "24", icon: TrendingUp, color: "text-blue-500 dark:text-blue-400" },
    { title: "Pending Orders", value: "6", icon: Clock, color: "text-yellow-500 dark:text-yellow-400" },
    { title: "Revenue", value: "₹18,500", icon: Wallet, color: "text-green-500 dark:text-green-400" },
  ];

  useEffect(() => {
    async function fetchRequests() {
      try {
        if (!isOfflineMode()) {
          const data = await apiRequest("/api/order-requests");
          setOrderRequests(data);
        }
      } catch (err) {
        console.error("Failed to fetch order requests:", err);
      } finally {
        setLoadingRequests(false);
      }
    }
    fetchRequests();
  }, []);

  useEffect(() => {
    async function fetchChats() {
      try {
        if (!isOfflineMode()) {
          const data = await apiRequest("/api/chats");
          setChats(data);
        }
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      } finally {
        setLoadingChats(false);
      }
    }
    fetchChats();
    const interval = setInterval(fetchChats, 10000);
    return () => clearInterval(interval);
  }, []);

  const unreadChatsCount = chats.filter((c) => c.unreadAdmin > 0).length;

  const updateStatus = async (id, status) => {
    try {
      await apiRequest(`/api/order-requests/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
      setOrderRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const newRequests = orderRequests.filter((r) => r.status === "new" || r.status === "viewed");
  const newCount = orderRequests.filter((r) => r.status === "new").length;

  return (
    <AnimatedPage>
      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 w-full max-w-5xl">
        {stats.map((stat, index) => (
          <Stat 
            key={stat.title}
            {...stat}
            delay={index * 0.1}
          />
        ))}
      </div>

      {/* Messages & Order Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-5xl mt-6">

        {/* Messages Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-900/10 dark:to-transparent">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <MessageSquare className="w-4.5 h-4.5 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Messages</h3>
            {unreadChatsCount > 0 ? (
              <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-blue-500 text-white rounded-full">{unreadChatsCount} new</span>
            ) : (
              <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500">{chats.length} chats</span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {loadingChats ? (
              <div className="flex justify-center py-10">
                <MiniLoader variant="inline" />
              </div>
            ) : chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                  <Inbox className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No messages yet</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Website visitor chats will appear here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {chats.slice(0, 5).map((chat) => (
                  <div key={chat._id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="relative shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-400 flex items-center justify-center text-white text-xs font-bold">
                          {chat.visitorName.charAt(0).toUpperCase()}
                        </div>
                        {chat.status === "active" && (
                          <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-400 border-2 border-white dark:border-gray-800 rounded-full" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{chat.visitorName}</p>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 shrink-0">
                            {new Date(chat.updatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{chat.lastMessage || "No messages yet"}</p>
                          {chat.unreadAdmin > 0 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-500 text-white rounded-full shrink-0">{chat.unreadAdmin}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* New Order Requests Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg dark:shadow-gray-900/50 overflow-hidden border border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-transparent dark:from-orange-900/10 dark:to-transparent">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <ClipboardList className="w-4.5 h-4.5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">New Order Requests</h3>
            {newCount > 0 && (
              <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-orange-500 text-white rounded-full">{newCount} new</span>
            )}
            {newCount === 0 && (
              <span className="ml-auto text-xs font-medium text-gray-400 dark:text-gray-500">{newRequests.length} pending</span>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loadingRequests ? (
              <div className="flex justify-center py-10">
                <MiniLoader variant="inline" />
              </div>
            ) : newRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4">
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-full mb-3">
                  <ClipboardList className="w-6 h-6 text-gray-400 dark:text-gray-500" />
                </div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No new order requests</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Incoming orders will show up here</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {newRequests.map((req) => (
                  <div key={req._id} className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{req.name}</p>
                          {req.status === "new" && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded">NEW</span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{req.contact}</span>
                          <span className="flex items-center gap-1"><UtensilsCrossed className="w-3 h-3" />{req.functionType}</span>
                          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{req.paxCount} pax</span>
                        </div>
                        {req.dishes?.length > 0 && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                            {req.dishes.join(", ")}
                          </p>
                        )}
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">
                          {new Date(req.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {req.status === "new" && (
                          <button
                            onClick={() => updateStatus(req._id, "viewed")}
                            title="Mark as viewed"
                            className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => updateStatus(req._id, "accepted")}
                          title="Accept"
                          className="p-1.5 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/40 transition"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => updateStatus(req._id, "rejected")}
                          title="Reject"
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

      </div>
    </AnimatedPage>
  );
}

function Stat({ title, value, icon: Icon, color, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-gray-900/50 p-4 sm:p-6 text-center transition-all hover:scale-105 hover:shadow-xl dark:hover:shadow-gray-900/70 group cursor-pointer"
    >
      <div className="flex justify-center mb-3">
        <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 group-hover:scale-110 transition-transform duration-300 ${color}`}>
          <Icon className="w-6 h-6 sm:w-7 sm:h-7 group-hover:animate-bounce" />
        </div>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">{title}</p>
      <p className="text-2xl sm:text-3xl font-bold text-orange-500 dark:text-orange-400 mt-2">{value}</p>
    </motion.div>
  );
}