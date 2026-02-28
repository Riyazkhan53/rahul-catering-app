import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MiniLoader from "../../Components/MiniLoader";
import { Trash2, ClipboardList, Calendar, X, FileText, Package, Clock } from "lucide-react";
import { getAllItemLists, deleteItemList } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import DeleteConfirmModal from "../../Components/DeleteConfirmModal";

export default function ViewSavedLists({ onBack }) {
  const { showToast } = useToast();
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = async () => {
    setLoading(true);
    try {
      const data = await getAllItemLists();
      setLists(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (err) {
      console.error("Failed to load lists:", err);
      showToast("Failed to load lists", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteItemList(id);
      setLists((prev) => prev.filter((l) => l.id !== id));
      showToast("List deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete list:", err);
      showToast("Failed to delete list", "error");
    }
  };

  const handleViewList = (list) => {
    // Create a printable view
    const printWindow = window.open('', '_blank');
    const itemsHTML = list.items
      .map(
        (item, idx) => `
        <tr>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${idx + 1}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.tamilName || "—"}</td>
          <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity} ${item.unit || ""}</td>
          <td style="padding: 8px; border: 1px solid #ddd;">${item.comment || "—"}</td>
        </tr>
      `
      )
      .join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${list.name} - Item List</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 20px;
            max-width: 1000px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #f97316;
            padding-bottom: 20px;
          }
          .header h1 {
            color: #f97316;
            margin: 0;
            font-size: 28px;
          }
          .info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            padding: 15px;
            background: #fff5e6;
            border-radius: 8px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background: #f97316;
            color: white;
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }
          tr:nth-child(even) {
            background: #f9f9f9;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #666;
            font-size: 12px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
          }
          @media print {
            button { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>📋 ${list.name}</h1>
          <p style="color: #666; margin: 5px 0;">Item List</p>
        </div>
        
        <div class="info">
          <div><strong>List ID:</strong> ${list.id}</div>
          <div><strong>Date:</strong> ${new Date(list.date).toLocaleDateString()}</div>
          <div><strong>Total Items:</strong> ${list.items.length}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th style="width: 50px; text-align: center;">#</th>
              <th>Item Name</th>
              <th>Tamil Name</th>
              <th style="width: 150px; text-align: center;">Quantity</th>
              <th>Comments</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="footer">
          <p>Generated on ${new Date(list.createdAt).toLocaleString()}</p>
          <p>Rahul Catering Services</p>
        </div>

        <div style="text-align: center; margin-top: 20px;">
          <button onclick="window.print()" style="padding: 10px 30px; background: #f97316; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
            Print / Save PDF
          </button>
          <button onclick="window.close()" style="padding: 10px 30px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; margin-left: 10px;">
            Close
          </button>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
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
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Card animation variants
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-7xl mx-auto px-3 sm:px-6 overflow-x-hidden"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
              <ClipboardList className="w-7 h-7 text-white" />
            </div>
            Saved Item Lists
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 ml-1">
            {lists.length} {lists.length === 1 ? "list" : "lists"} saved
          </p>
        </div>
        <button
          onClick={onBack}
          className="self-start sm:self-center p-2.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 group"
          title="Go back"
        >
          <X className="w-5 h-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100" />
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <MiniLoader variant="section" message="Loading your lists..." />
      ) : lists.length === 0 ? (
        // Empty State with Beautiful Design
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-16 px-4"
        >
          <div className="relative mb-8">
            {/* Decorative circles */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            
            {/* Main icon */}
            <div className="relative bg-gradient-to-br from-orange-400 to-amber-500 p-8 rounded-3xl shadow-xl">
              <ClipboardList className="w-20 h-20 text-white" strokeWidth={1.5} />
            </div>

            {/* Floating badges */}
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
            You haven't created any item lists yet. Start by generating your first list to organize your ingredients and materials.
          </p>
          
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
          >
            Create Your First List
          </button>
        </motion.div>
      ) : (
        // Lists Grid with Modern Cards
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
                {/* Gradient Header */}
                <div className="h-2 bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500"></div>

                {/* Card Content */}
                <div className="p-5">
                  {/* Title & Icon */}
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

                  {/* Stats */}
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
                      <span>{formatDate(list.date || list.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Created {formatTime(list.createdAt)}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleViewList(list)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <FileText className="w-4 h-4" />
                      View
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(list.id)}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-500 dark:bg-red-900/20 dark:hover:bg-red-500 text-red-600 hover:text-white dark:text-red-400 dark:hover:text-white rounded-xl transition-all duration-200 group/delete"
                      title="Delete list"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
      <DeleteConfirmModal
        open={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={() => handleDelete(deleteConfirmId)}
        title="Delete List"
        message="Are you sure you want to delete this list? This action cannot be undone."
      />
    </motion.div>
  );
}
