import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Calendar,
  Phone,
  User,
  Clock,
  ChefHat,
  Trash2,
  FileX2,
  Search,
} from "lucide-react";
import { getAllOrders, deleteOrder } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import AnimatedPage from "../AnimatedPage";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export default function OrderMasterList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const data = await getAllOrders();
      setOrders((data || []).sort((a, b) => b.createdAt - a.createdAt));
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (orderId) => {
    await deleteOrder(orderId);
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));
    showToast("Order deleted", "success");
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getEventDates = (order) => {
    if (!order.days || !order.days.length) return "—";
    const dates = order.days.filter((d) => d.date).map((d) => d.date);
    if (dates.length === 0) return "—";
    if (dates.length === 1) return dates[0];
    return `${dates[0]} → ${dates[dates.length - 1]}`;
  };

  const filtered = orders.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.clientName?.toLowerCase().includes(q) ||
      o.orderNumber?.toLowerCase().includes(q) ||
      o.functionType?.toLowerCase().includes(q) ||
      o.mobile?.includes(q)
    );
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.08, duration: 0.35, ease: "easeOut" },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto px-3 sm:px-6 overflow-x-hidden"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
                <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Order Master List
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
            </p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                         text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
            />
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading orders...</p>
          </div>
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-60 animate-pulse" />
              <div className="relative bg-gradient-to-br from-orange-400 to-amber-500 p-8 rounded-3xl shadow-xl">
                <FileX2 className="w-20 h-20 text-white" strokeWidth={1.5} />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {search ? "No Matching Orders" : "No Orders Yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
              {search
                ? `No orders matching "${search}"`
                : "No orders have been created yet. Create a new order from the sidebar to get started."}
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            <AnimatePresence>
              {filtered.map((order, index) => (
                <motion.div
                  key={order.orderId}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  layout
                  className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {/* Top color bar */}
                  <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

                  <div className="p-4 sm:p-5">
                    {/* Order number + status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                          {order.clientName}
                        </h3>
                        <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
                          {order.orderNumber}
                        </p>
                      </div>
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize shrink-0 ${
                          STATUS_COLORS[order.status] || STATUS_COLORS.pending
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <ChefHat className="w-4 h-4 text-orange-500 shrink-0" />
                        <span className="truncate">{order.orderType}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <User className="w-4 h-4 text-purple-500 shrink-0" />
                        <span className="truncate">{order.functionType}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{order.mobile}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                        <span className="truncate">
                          {order.days?.length || 0} day{(order.days?.length || 0) !== 1 ? "s" : ""} · {getEventDates(order)}
                        </span>
                      </div>

                      {order.createdAt && (
                        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                          <Clock className="w-3.5 h-3.5 shrink-0" />
                          <span>
                            Created {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDelete(order.orderId)}
                        className="px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </AnimatedPage>
  );
}
