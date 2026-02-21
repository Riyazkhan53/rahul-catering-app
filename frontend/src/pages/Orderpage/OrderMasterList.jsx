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
  Paperclip,
  X,
  Check,
  FileText,
  UtensilsCrossed,
  ScrollText,
  Receipt,
  ListChecks,
} from "lucide-react";
import { createPortal } from "react-dom";
import {
  getAllOrders,
  deleteOrder,
  saveOrder,
  getAllLists,
  getAllMenuPlans,
  getAllQuotations,
} from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import AnimatedPage from "../AnimatedPage";

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  confirmed: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  completed: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

const DOC_TYPES = [
  { key: "itemList", label: "Item List", icon: ListChecks, color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-900/20" },
  { key: "menuList", label: "Menu List", icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-900/20" },
  { key: "menuPlan", label: "Menu Plan", icon: ScrollText, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-900/20" },
  { key: "quotation", label: "Quotation", icon: FileText, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-900/20" },
  { key: "invoice", label: "Invoice", icon: Receipt, color: "text-pink-500", bg: "bg-pink-50 dark:bg-pink-900/20" },
];

export default function OrderMasterList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [attachModal, setAttachModal] = useState(null); // orderId
  const [allDocs, setAllDocs] = useState({ itemList: [], menuList: [], menuPlan: [], quotation: [], invoice: [] });
  const { showToast } = useToast();

  useEffect(() => {
    loadOrders();
    loadAllDocs();
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

  const loadAllDocs = async () => {
    try {
      const [itemLists, menuPlans, quotations] = await Promise.all([
        getAllLists().catch(() => []),
        getAllMenuPlans().catch(() => []),
        getAllQuotations().catch(() => []),
      ]);
      setAllDocs({
        itemList: (itemLists || []).map((l) => ({ id: l.id, name: l.name || `List ${l.id}`, date: l.date })),
        menuList: (menuPlans || []).filter((m) => !m.planNumber?.startsWith("MP-")).map((m) => ({ id: m.id, name: m.eventName || `Menu ${m.id}`, date: m.createdAt })),
        menuPlan: (menuPlans || []).filter((m) => m.planNumber?.startsWith("MP-")).map((m) => ({ id: m.id, name: m.eventName || `Plan ${m.id}`, date: m.createdAt })),
        quotation: (quotations || []).map((q) => ({ id: q.id, name: q.quotationNumber || q.clientName || `Quotation ${q.id}`, date: q.createdAt })),
        invoice: [],
      });
    } catch (err) {
      console.error("Failed to load docs:", err);
    }
  };

  const handleAttachDoc = async (orderId, docType, docId, docName) => {
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return;
    const docs = order.attachedDocs || [];
    if (docs.some((d) => d.type === docType && d.id === docId)) return;
    const updated = { ...order, attachedDocs: [...docs, { type: docType, id: docId, name: docName }] };
    await saveOrder(updated);
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
    showToast("Document attached", "success");
  };

  const handleDetachDoc = async (orderId, docType, docId) => {
    const order = orders.find((o) => o.orderId === orderId);
    if (!order) return;
    const updated = { ...order, attachedDocs: (order.attachedDocs || []).filter((d) => !(d.type === docType && d.id === docId)) };
    await saveOrder(updated);
    setOrders((prev) => prev.map((o) => (o.orderId === orderId ? updated : o)));
    showToast("Document removed", "success");
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

                    {/* Attached Docs Badges */}
                    {(order.attachedDocs || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {(order.attachedDocs || []).map((doc, di) => {
                          const dt = DOC_TYPES.find((t) => t.key === doc.type);
                          const Icon = dt?.icon || FileText;
                          return (
                            <span
                              key={di}
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${dt?.bg || "bg-gray-50 dark:bg-gray-700"} border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300`}
                            >
                              <Icon className={`w-3 h-3 ${dt?.color || "text-gray-500"}`} />
                              <span className="truncate max-w-[100px]">{doc.name}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDetachDoc(order.orderId, doc.type, doc.id);
                                }}
                                className="ml-0.5 text-gray-400 hover:text-red-500 transition"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => setAttachModal(order.orderId)}
                        className="px-3 py-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition text-sm flex items-center gap-1"
                      >
                        <Paperclip className="w-4 h-4" />
                        Attach Docs
                      </button>
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

        {/* Attach Doc Modal */}
        {attachModal && (
          <AttachDocModal
            order={orders.find((o) => o.orderId === attachModal)}
            allDocs={allDocs}
            onAttach={(docType, docId, docName) => handleAttachDoc(attachModal, docType, docId, docName)}
            onDetach={(docType, docId) => handleDetachDoc(attachModal, docType, docId)}
            onClose={() => setAttachModal(null)}
          />
        )}
      </motion.div>
    </AnimatedPage>
  );
}

/* ─── Attach Doc Modal ─── */
function AttachDocModal({ order, allDocs, onAttach, onDetach, onClose }) {
  const [activeTab, setActiveTab] = useState(DOC_TYPES[0].key);

  if (!order) return null;

  const attached = order.attachedDocs || [];
  const docs = allDocs[activeTab] || [];
  const activeType = DOC_TYPES.find((t) => t.key === activeTab);

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-gradient-to-r from-blue-500 to-indigo-500">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Paperclip className="w-5 h-5" />
              Attach Documents
            </h3>
            <p className="text-white/80 text-xs">
              {order.clientName} · {order.orderNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50 dark:bg-gray-800">
          {DOC_TYPES.map((dt) => {
            const Icon = dt.icon;
            const count = attached.filter((d) => d.type === dt.key).length;
            return (
              <button
                key={dt.key}
                onClick={() => setActiveTab(dt.key)}
                className={`flex items-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  activeTab === dt.key
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                <Icon className={`w-4 h-4 ${dt.color}`} />
                {dt.label}
                {count > 0 && (
                  <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {docs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {activeType && <activeType.icon className={`w-12 h-12 ${activeType.color} opacity-30 mb-3`} />}
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                No {activeType?.label || "documents"} available
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                {activeTab === "invoice" ? "Invoice feature coming soon" : "Create one first from the respective section"}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {docs.map((doc) => {
                const isAttached = attached.some((d) => d.type === activeTab && d.id === doc.id);
                const Icon = activeType?.icon || FileText;
                return (
                  <div
                    key={doc.id}
                    className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition ${
                      isAttached
                        ? "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-900/20"
                        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-300 dark:hover:border-blue-600"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${activeType?.bg || "bg-gray-100 dark:bg-gray-700"}`}>
                        <Icon className={`w-4 h-4 ${activeType?.color || "text-gray-500"}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {doc.name}
                        </p>
                        {doc.date && (
                          <p className="text-xs text-gray-400 dark:text-gray-500">
                            {new Date(doc.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                          </p>
                        )}
                      </div>
                    </div>
                    {isAttached ? (
                      <button
                        onClick={() => onDetach(activeTab, doc.id)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 border border-red-200 dark:border-red-700 transition flex items-center gap-1 shrink-0"
                      >
                        <X className="w-3 h-3" />
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => onAttach(activeTab, doc.id, doc.name)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-700 transition flex items-center gap-1 shrink-0"
                      >
                        <Paperclip className="w-3 h-3" />
                        Attach
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {attached.length} document{attached.length !== 1 ? "s" : ""} attached
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-blue-500 hover:bg-blue-600 rounded-xl shadow-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
