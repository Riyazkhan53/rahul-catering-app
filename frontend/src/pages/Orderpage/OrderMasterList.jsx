import { useEffect, useState, useMemo } from "react";
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
  Filter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  CalendarDays,
  SlidersHorizontal,
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

const ORDER_TYPES = ["Total Order", "Cooking & Service", "Only Cooking", "Only Service"];
const FUNCTION_TYPES = ["Wedding", "Birthday", "Housewarming", "Corporate Event", "Temple Function", "Church Function", "Puberty Function", "Baby Shower Function"];
const STATUS_OPTIONS = ["pending", "confirmed", "completed", "cancelled"];
const PER_PAGE = 10;

export default function OrderMasterList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attachModal, setAttachModal] = useState(null);
  const [allDocs, setAllDocs] = useState({ itemList: [], menuList: [], menuPlan: [], quotation: [], invoice: [] });
  const { showToast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [filterOrderType, setFilterOrderType] = useState("");
  const [filterFunctionType, setFilterFunctionType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);

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

  const getFirstEventDate = (order) => {
    if (!order.days || !order.days.length) return null;
    const dates = order.days.filter((d) => d.date).map((d) => d.date).sort();
    return dates.length > 0 ? dates[0] : null;
  };

  // Filtering logic
  const filtered = useMemo(() => {
    return orders.filter((o) => {
      // Text search
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          o.clientName?.toLowerCase().includes(q) ||
          o.orderNumber?.toLowerCase().includes(q) ||
          o.functionType?.toLowerCase().includes(q) ||
          o.mobile?.includes(q);
        if (!matchesSearch) return false;
      }
      // Order type filter
      if (filterOrderType && o.orderType !== filterOrderType) return false;
      // Function type filter
      if (filterFunctionType && o.functionType !== filterFunctionType) return false;
      // Status filter
      if (filterStatus && o.status !== filterStatus) return false;
      // Date range filter (based on event dates)
      if (filterDateFrom || filterDateTo) {
        const eventDate = getFirstEventDate(o);
        if (!eventDate) return false;
        if (filterDateFrom && eventDate < filterDateFrom) return false;
        if (filterDateTo && eventDate > filterDateTo) return false;
      }
      return true;
    });
  }, [orders, search, filterOrderType, filterFunctionType, filterStatus, filterDateFrom, filterDateTo]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedOrders = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  // Reset page when filters change
  useEffect(() => { setPage(1); }, [search, filterOrderType, filterFunctionType, filterStatus, filterDateFrom, filterDateTo]);

  const activeFilterCount = [filterOrderType, filterFunctionType, filterStatus, filterDateFrom, filterDateTo].filter(Boolean).length;

  const clearAllFilters = () => {
    setSearch("");
    setFilterOrderType("");
    setFilterFunctionType("");
    setFilterStatus("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const hasAnyFilter = search || activeFilterCount > 0;

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
    }),
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
  };

  const selectClass =
    "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none";

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-7xl mx-auto px-3 sm:px-6 overflow-x-hidden"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
                <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Order Master List
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-1">
              {orders.length} {orders.length === 1 ? "order" : "orders"} total
              {hasAnyFilter && filtered.length !== orders.length && (
                <span className="ml-1 text-orange-500 font-medium">
                  · {filtered.length} matched
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, order#, mobile..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`relative p-2.5 rounded-lg border transition shrink-0 ${
                showFilters || activeFilterCount > 0
                  ? "bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-600 text-orange-600 dark:text-orange-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
            >
              <SlidersHorizontal className="w-4.5 h-4.5" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden mb-4"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Filter className="w-4 h-4 text-orange-500" />
                    Filters
                  </h4>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearAllFilters}
                      className="text-xs text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 font-medium flex items-center gap-1 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      Clear all
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Order Type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Order Type
                    </label>
                    <select value={filterOrderType} onChange={(e) => setFilterOrderType(e.target.value)} className={selectClass}>
                      <option value="">All Types</option>
                      {ORDER_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  {/* Function Type */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Function Type
                    </label>
                    <select value={filterFunctionType} onChange={(e) => setFilterFunctionType(e.target.value)} className={selectClass}>
                      <option value="">All Functions</option>
                      {FUNCTION_TYPES.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Status
                    </label>
                    <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className={selectClass}>
                      <option value="">All Status</option>
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Date From */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Event From
                    </label>
                    <input
                      type="date"
                      value={filterDateFrom}
                      onChange={(e) => setFilterDateFrom(e.target.value)}
                      className={selectClass}
                    />
                  </div>

                  {/* Date To */}
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Event To
                    </label>
                    <input
                      type="date"
                      value={filterDateTo}
                      onChange={(e) => setFilterDateTo(e.target.value)}
                      className={selectClass}
                    />
                  </div>
                </div>

                {/* Active filter chips */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    {filterOrderType && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-700">
                        {filterOrderType}
                        <button onClick={() => setFilterOrderType("")}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {filterFunctionType && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-700">
                        {filterFunctionType}
                        <button onClick={() => setFilterFunctionType("")}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {filterStatus && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-700">
                        {filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                        <button onClick={() => setFilterStatus("")}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {filterDateFrom && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700">
                        From: {filterDateFrom}
                        <button onClick={() => setFilterDateFrom("")}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                    {filterDateTo && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-700">
                        To: {filterDateTo}
                        <button onClick={() => setFilterDateTo("")}><X className="w-3 h-3" /></button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
              {hasAnyFilter ? "No Matching Orders" : "No Orders Yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
              {hasAnyFilter
                ? "No orders match your current filters. Try adjusting or clearing them."
                : "No orders have been created yet. Create a new order from the sidebar to get started."}
            </p>
            {hasAnyFilter && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 border border-orange-200 dark:border-orange-700 transition"
              >
                <RotateCcw className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <>
            {/* Result info bar */}
            <div className="flex items-center justify-between mb-3 text-xs text-gray-500 dark:text-gray-400">
              <span>
                Showing {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} order{filtered.length !== 1 ? "s" : ""}
              </span>
              <span>
                Page {safePage} of {totalPages}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              <AnimatePresence mode="wait">
                {paginatedOrders.map((order, index) => (
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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6 mb-2">
                <button
                  onClick={() => setPage(1)}
                  disabled={safePage === 1}
                  className="px-2.5 py-2 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  First
                </button>
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={safePage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - safePage) <= 1)
                  .reduce((acc, p, i, arr) => {
                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === "..." ? (
                      <span key={`dot-${i}`} className="px-1 text-gray-400 dark:text-gray-500 text-sm">...</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => setPage(item)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                          safePage === item
                            ? "bg-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-900/30"
                            : "border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={safePage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPage(totalPages)}
                  disabled={safePage === totalPages}
                  className="px-2.5 py-2 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Last
                </button>
              </div>
            )}
          </>
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
