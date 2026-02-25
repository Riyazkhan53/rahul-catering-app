import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MiniLoader from "../../Components/MiniLoader";
import {
  FileText,
  Eye,
  Printer,
  ClipboardList,
  Calendar,
  Package,
  Clock,
  Pencil,
  Loader2,
  Search,
  X,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  FileX2,
} from "lucide-react";
import { getAllLists, getListById } from "../../db/indexedDB";
import AnimatedPage from "../AnimatedPage";
import ListPrintView from "../../print/listPrintView";
import EditListModal from "./EditListModal";
import { useNavigate } from "react-router-dom";
import { pdf } from "@react-pdf/renderer";
import ListPDF from "../../pdf/listPDF";
import { useToast } from "../../context/ToastContext";

const PER_PAGE = 10;

export default function CreatedItemLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [printList, setPrintList] = useState(null);
  const [downloadingId, setDownloadingId] = useState(null);
  const [editList, setEditList] = useState(null);
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Filters
  const [search, setSearch] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);

  const reloadLists = async () => {
    const data = await getAllLists();
    setLists((data || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const handleDirectDownload = async (listItem) => {
    try {
      setDownloadingId(listItem.id);
      const data = await getListById(listItem.id);
      const blob = await pdf(<ListPDF items={data} />).toBlob();
      const fileURL = URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `${data.name || "item-list"}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(fileURL), 1000);
      showToast("PDF downloaded", "success");
    } catch (err) {
      showToast("Failed to download PDF", "error");
    } finally {
      setDownloadingId(null);
    }
  };

  useEffect(() => {
    async function loadLists() {
      const data = await getAllLists();
      setLists((data || []).sort((a, b) => new Date(b.date) - new Date(a.date)));
      setLoading(false);
    }
    loadLists();
  }, []);

  useEffect(() => {
    if (!printList) return;

    const timer = setTimeout(() => {
      window.print();
    }, 500);

    window.onafterprint = () => {
      setPrintList(null);
      window.onafterprint = null;
    };

    return () => clearTimeout(timer);
  }, [printList]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filtering
  const filtered = useMemo(() => {
    return lists.filter((l) => {
      if (search) {
        const q = search.toLowerCase();
        if (!l.name?.toLowerCase().includes(q) && !l.id?.toLowerCase().includes(q)) return false;
      }
      if (filterDateFrom || filterDateTo) {
        const d = l.date ? new Date(l.date).toISOString().slice(0, 10) : null;
        if (!d) return false;
        if (filterDateFrom && d < filterDateFrom) return false;
        if (filterDateTo && d > filterDateTo) return false;
      }
      return true;
    });
  }, [lists, search, filterDateFrom, filterDateTo]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginatedLists = filtered.slice((safePage - 1) * PER_PAGE, safePage * PER_PAGE);

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
      transition: {
        delay: i * 0.06,
        duration: 0.3,
        ease: "easeOut",
      },
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
                <ClipboardList className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
              </div>
              Created Item Lists
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 ml-1">
              {lists.length} {lists.length === 1 ? "list" : "lists"} created
              {hasAnyFilter && filtered.length !== lists.length && (
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
                placeholder="Search list name..."
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
                      Date From
                    </label>
                    <input type="date" value={filterDateFrom} onChange={(e) => setFilterDateFrom(e.target.value)} className={selectClass} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                      Date To
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
          <MiniLoader variant="section" message="Loading your lists..." />
        ) : filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-orange-400 to-amber-500 p-8 rounded-3xl shadow-xl">
                {hasAnyFilter ? (
                  <FileX2 className="w-20 h-20 text-white" strokeWidth={1.5} />
                ) : (
                  <ClipboardList className="w-20 h-20 text-white" strokeWidth={1.5} />
                )}
              </div>

              {!hasAnyFilter && (
                <>
                  <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg animate-bounce">
                    <Package className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="absolute -bottom-2 -left-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg animate-bounce" style={{ animationDelay: "0.2s" }}>
                    <FileText className="w-5 h-5 text-amber-500" />
                  </div>
                </>
              )}
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              {hasAnyFilter ? "No Matching Lists" : "No Lists Yet"}
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-4">
              {hasAnyFilter
                ? "No lists match your current filters. Try adjusting or clearing them."
                : "You haven't created any item lists yet. Start by generating your first list from the Item List Creator."}
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
                Showing {(safePage - 1) * PER_PAGE + 1}–{Math.min(safePage * PER_PAGE, filtered.length)} of {filtered.length} list{filtered.length !== 1 ? "s" : ""}
              </span>
              <span>Page {safePage} of {totalPages}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="wait">
                {paginatedLists.map((list, index) => (
                  <motion.div
                    key={list.id}
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500"></div>

                    <div className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0 pr-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate mb-1 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
                            {list.name}
                          </h3>
                          <p className="text-xs font-mono text-gray-400 dark:text-gray-500">
                            {list.id}
                          </p>
                        </div>
                        <div className="flex-shrink-0 p-2.5 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl">
                          <ClipboardList className="w-5 h-5 text-orange-500 dark:text-orange-400" />
                        </div>
                      </div>

                      <div className="space-y-2 mb-5">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Package className="w-4 h-4 text-emerald-500" />
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {list.items?.length || 0}
                          </span>
                          <span>items</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                          <Calendar className="w-4 h-4 text-blue-500" />
                          <span>{formatDate(list.date)}</span>
                        </div>
                        
                        {list.createdAt && (
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Created {formatTime(list.createdAt)}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => navigate(`/print/list/${list.id}`)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                          title="View list"
                        >
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                        <button
                          onClick={async () => {
                            const data = await getListById(list.id);
                            setEditList(data);
                          }}
                          className="px-4 py-2.5 bg-amber-50 hover:bg-amber-500 dark:bg-amber-900/20 dark:hover:bg-amber-500 text-amber-600 hover:text-white dark:text-amber-400 dark:hover:text-white rounded-xl transition-all duration-200"
                          title="Edit list"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/print/list/${list.id}`)}
                          className="px-4 py-2.5 bg-green-50 hover:bg-green-500 dark:bg-green-900/20 dark:hover:bg-green-500 text-green-600 hover:text-white dark:text-green-400 dark:hover:text-white rounded-xl transition-all duration-200"
                          title="Preview PDF"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
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

        {printList && <ListPrintView list={printList} />}

        {editList && (
          <EditListModal
            list={editList}
            onClose={() => setEditList(null)}
            onSaved={reloadLists}
          />
        )}
      </motion.div>
    </AnimatedPage>
  );
}