import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Eye, Printer, ClipboardList, Calendar, Package, Clock, Pencil } from "lucide-react";
import { getAllLists, getListById } from "../../db/indexedDB";
import AnimatedPage from "../AnimatedPage";
import ListPreviewModal from "./ListPreviewModal";
import ListPrintView from "../../print/listPrintView";
import { useNavigate } from "react-router-dom";

export default function CreatedItemLists() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewList, setPreviewList] = useState(null);
  const [printList, setPrintList] = useState(null);
  const navigate = useNavigate();

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

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            Created Item Lists
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-1">
            {lists.length} {lists.length === 1 ? "list" : "lists"} created
          </p>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400 text-lg">Loading your lists...</p>
          </div>
        ) : lists.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-16 px-4"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
              
              <div className="relative bg-gradient-to-br from-orange-400 to-amber-500 p-8 rounded-3xl shadow-xl">
                <ClipboardList className="w-20 h-20 text-white" strokeWidth={1.5} />
              </div>

              <div className="absolute -top-2 -right-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg animate-bounce">
                <Package className="w-5 h-5 text-orange-500" />
              </div>
              <div className="absolute -bottom-2 -left-2 bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg animate-bounce" style={{ animationDelay: "0.2s" }}>
                <FileText className="w-5 h-5 text-amber-500" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
              No Lists Yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
              You haven't created any item lists yet. Start by generating your first list from the Item List Creator.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <AnimatePresence>
              {lists.map((list, index) => (
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
                        onClick={async () => {
                          const data = await getListById(list.id);
                          setPreviewList(data);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                        title="Preview list"
                      >
                        <Eye className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => navigate(`/print/list/${list.id}`)}
                        className="px-4 py-2.5 bg-green-50 hover:bg-green-500 dark:bg-green-900/20 dark:hover:bg-green-500 text-green-600 hover:text-white dark:text-green-400 dark:hover:text-white rounded-xl transition-all duration-200"
                        title="Print list"
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
        )}

        {previewList && (
          <ListPreviewModal
            list={previewList}
            onClose={() => setPreviewList(null)}
          />
        )}

        {printList && <ListPrintView list={printList} />}
      </motion.div>
    </AnimatedPage>
  );
}