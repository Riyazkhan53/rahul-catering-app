import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  Calendar,
  MapPin,
  Users,
  Clock,
  Trash2,
  FileX2,
  Search,
  ChevronDown,
  ChevronUp,
  X,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAllMenuPlans, deleteMenuPlan } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import AnimatedPage from "../AnimatedPage";

const SESSION_LABELS = {
  morning: { label: "Breakfast", icon: "🌅" },
  afternoon: { label: "Lunch", icon: "☀️" },
  evening: { label: "Snacks", icon: "🌆" },
  night: { label: "Dinner", icon: "🌙" },
};

const PER_PAGE = 10;

export default function CreatedMenuList() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadMenus();
  }, []);

  const loadMenus = async () => {
    try {
      const data = await getAllMenuPlans();
      setMenus((data || []).sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    } catch (err) {
      console.error("Failed to load menus:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await deleteMenuPlan(id);
    setMenus((prev) => prev.filter((m) => m.id !== id));
    showToast("Menu deleted", "success");
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    return new Date(ts).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDishCount = (menu) => {
    let count = 0;
    (menu.days || []).forEach((day) => {
      Object.values(day.sessions || {}).forEach((s) => {
        Object.values(s.items || {}).forEach((arr) => {
          count += arr.length;
        });
      });
    });
    return count;
  };

  const getSessionSummary = (menu) => {
    const sessions = new Set();
    (menu.days || []).forEach((day) => {
      Object.entries(day.sessions || {}).forEach(([key, s]) => {
        if (s.enabled) sessions.add(key);
      });
    });
    return [...sessions];
  };

  // Filtering
  const filtered = useMemo(() => {
    return menus.filter((m) => {
      if (search) {
        const q = search.toLowerCase();
        const matchesSearch =
          m.eventName?.toLowerCase().includes(q) ||
          m.clientName?.toLowerCase().includes(q) ||
          m.venue?.toLowerCase().includes(q) ||
          m.planNumber?.toLowerCase().includes(q);
        if (!matchesSearch) return false;
      }
      if (filterDateFrom || filterDateTo) {
        const d = m.eventDate || null;
        if (!d) return false;
        if (filterDateFrom && d < filterDateFrom) return false;
        if (filterDateTo && d > filterDateTo) return false;
      }
      return true;
    });
  }, [menus, search, filterDateFrom, filterDateTo]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedMenus = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

  useEffect(() => { setPage(1); }, [search, filterDateFrom, filterDateTo]);

  const activeFilterCount = [filterDateFrom, filterDateTo].filter(Boolean).length;
  const hasAnyFilter = search || activeFilterCount > 0;

  const clearAllFilters = () => {
    setSearch("");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const selectClass =
    "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 appearance-none";

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.06, duration: 0.3, ease: "easeOut" },
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
                <UtensilsCrossed className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Menu List Manager
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-1">
              {menus.length} {menus.length === 1 ? "menu" : "menus"} saved
              {hasAnyFilter && filtered.length !== menus.length && (
                <span className="ml-1 text-orange-500 font-medium">· {filtered.length} matched</span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search name, client, venue..."
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Event Date From
                    </label>
                    <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className={selectClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Event Date To
                    </label>
                    <input type="date" value={filterDateTo} onChange={(e) => setFilterDateTo(e.target.value)} className={selectClass} />
                  </div>
                </div>

                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
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
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading menus...</p>
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
              {hasAnyFilter ? "No Matching Menus" : "No Menus Yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
              {hasAnyFilter
                ? "No menus match your current filters. Try adjusting or clearing them."
                : "Create a menu from the Menu/List Builder to see it here."}
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
                Showing {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} menu{filtered.length !== 1 ? "s" : ""}
              </span>
              <span>Page {safePage} of {totalPages}</span>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {paginatedMenus.map((menu, index) => {
                  const dishCount = getDishCount(menu);
                  const sessions = getSessionSummary(menu);
                  const isExpanded = expandedId === menu.id;

                  return (
                    <motion.div
                      key={menu.id}
                      custom={index}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                    >
                      {/* Top color bar */}
                      <div className="h-1.5 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500" />

                      <div className="p-4 sm:p-5">
                        {/* Header row */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="min-w-0">
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                              {menu.eventName}
                            </h3>
                            <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
                              {menu.planNumber}
                            </p>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : menu.id)}
                              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition"
                            >
                              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => handleDelete(menu.id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Info row */}
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {menu.clientName && (
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                              {menu.clientName}
                            </span>
                          )}
                          {menu.eventDate && (
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                              {menu.eventDate}
                            </span>
                          )}
                          {menu.venue && (
                            <span className="flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-green-500 shrink-0" />
                              {menu.venue}
                            </span>
                          )}
                          {menu.guests && (
                            <span className="flex items-center gap-1.5">
                              <Users className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                              {menu.guests} guests
                            </span>
                          )}
                        </div>

                        {/* Stats badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          <span className="text-xs bg-orange-100 dark:bg-orange-800/30 text-orange-700 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium">
                            {menu.days?.length || menu.numberOfDays || 1} day{(menu.days?.length || 1) > 1 ? "s" : ""}
                          </span>
                          <span className="text-xs bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full font-medium">
                            {dishCount} dish{dishCount !== 1 ? "es" : ""}
                          </span>
                          {sessions.map((s) => (
                            <span
                              key={s}
                              className="text-xs bg-blue-100 dark:bg-blue-800/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-medium"
                            >
                              {SESSION_LABELS[s]?.icon} {SESSION_LABELS[s]?.label}
                            </span>
                          ))}
                        </div>

                        {/* Created at */}
                        {menu.createdAt && (
                          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500">
                            <Clock className="w-3 h-3 shrink-0" />
                            Created {formatDate(menu.createdAt)} at {formatTime(menu.createdAt)}
                          </div>
                        )}

                        {/* Expanded: show full menu details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 space-y-3">
                                {(menu.days || []).map((day) => (
                                  <div key={day.day} className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                                    <h4 className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-2">
                                      Day {day.day}
                                      {day.date && (
                                        <span className="font-normal text-xs text-gray-500 dark:text-gray-400 ml-2">
                                          {day.date}
                                        </span>
                                      )}
                                    </h4>
                                    {Object.entries(day.sessions || {}).map(([sKey, sData]) => {
                                      if (!sData.enabled) return null;
                                      const itemEntries = Object.entries(sData.items || {}).filter(
                                        ([, arr]) => arr.length > 0
                                      );
                                      if (itemEntries.length === 0) return null;

                                      return (
                                        <div key={sKey} className="mb-2 last:mb-0">
                                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                            <span>{SESSION_LABELS[sKey]?.icon}</span>
                                            {SESSION_LABELS[sKey]?.label}
                                          </p>
                                          <div className="pl-4 space-y-1">
                                            {itemEntries.map(([catKey, items]) => (
                                              <div key={catKey}>
                                                <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                                  {catKey.replace(/_/g, " ")}:
                                                </span>
                                                <div className="flex flex-wrap gap-1 mt-0.5">
                                                  {items.map((item, i) => (
                                                    <span
                                                      key={i}
                                                      className="text-[11px] bg-white dark:bg-gray-600 border border-gray-200 dark:border-gray-500 rounded-full px-2 py-0.5 text-gray-700 dark:text-gray-200"
                                                    >
                                                      {item}
                                                    </span>
                                                  ))}
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
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
      </motion.div>
    </AnimatedPage>
  );
}