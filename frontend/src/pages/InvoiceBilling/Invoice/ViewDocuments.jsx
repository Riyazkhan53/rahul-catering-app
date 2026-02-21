import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trash2, FileText, Calendar, X, Eye, Printer, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveAs } from "file-saver";
import {
  getAllQuotations,
  deleteQuotation,
  getAllMenuPlans,
  deleteMenuPlan,
} from "../../../db/indexedDB";
import { generateMenuPlanPDF } from "../../../utils/generateMenuPlanPDF";

export default function ViewDocuments({ onBack }) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("quotations");
  const [quotations, setQuotations] = useState([]);
  const [menuPlans, setMenuPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDocuments();
  }, []);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const [q, m] = await Promise.all([getAllQuotations(), getAllMenuPlans()]);
      setQuotations(q.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
      setMenuPlans(m.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)));
    } catch (err) {
      console.error("Failed to load documents:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuotation = async (id) => {
    if (!confirm("Delete this quotation?")) return;
    await deleteQuotation(id);
    setQuotations((prev) => prev.filter((q) => q.id !== id));
  };

  const handleDeleteMenuPlan = async (id) => {
    if (!confirm("Delete this menu plan?")) return;
    await deleteMenuPlan(id);
    setMenuPlans((prev) => prev.filter((m) => m.id !== id));
  };

  const handleRedownloadMenuPlan = async (plan) => {
    try {
      const pdfBytes = await generateMenuPlanPDF(plan);
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      saveAs(blob, `MenuPlan_${plan.eventName}_${plan.id}.pdf`);
    } catch (err) {
      console.error("PDF re-generation error:", err);
      alert("Failed to generate PDF.");
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "—";
    return new Date(timestamp).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-5xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Saved Documents
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            View and manage your quotations & menu plans
          </p>
        </div>
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("quotations")}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
            tab === "quotations"
              ? "bg-orange-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Quotations ({quotations.length})
        </button>
        <button
          onClick={() => setTab("menu-plans")}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition ${
            tab === "menu-plans"
              ? "bg-orange-500 text-white shadow-md"
              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          }`}
        >
          Menu Plans ({menuPlans.length})
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400">
          Loading documents...
        </div>
      ) : tab === "quotations" ? (
        quotations.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-16 border-dashed border-4 border-gray-200 dark:border-gray-700 rounded-xl">
            No quotations saved yet.
          </div>
        ) : (
          <div className="space-y-3">
            {quotations.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg shrink-0">
                    <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {q.customerName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {q.id} &middot; {q.eventType} &middot; {q.numberOfGuests || "—"} guests
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Event: {q.eventDates ? q.eventDates.filter(ed => ed.date).map(ed => ed.date).join(", ") || "—" : q.eventDate || "—"}
                      </span>
                      <span>Created: {formatDate(q.createdAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1 shrink-0 ml-2">
                  <span className="font-bold text-orange-600 dark:text-orange-400 mr-2 hidden sm:block">
                    ₹{(q.total || 0).toLocaleString()}
                  </span>
                  <button
                    onClick={() => navigate(`/print/quotation/${q.id}`)}
                    className="p-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition"
                    title="View"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/print/quotation/${q.id}?download=true`)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                    title="Download PDF"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuotation(q.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : menuPlans.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-16 border-dashed border-4 border-gray-200 dark:border-gray-700 rounded-xl">
          No menu plans saved yet.
        </div>
      ) : (
        <div className="space-y-3">
          {menuPlans.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg shrink-0">
                  <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {m.eventName}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {m.id} &middot; {m.numberOfDays || 1} day(s) &middot;{" "}
                    {m.numberOfGuests || "—"} guests
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Event: {m.eventDate || "—"}
                    </span>
                    <span>Created: {formatDate(m.createdAt)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0 ml-2">
                <button
                  onClick={() => handleRedownloadMenuPlan(m)}
                  className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition"
                  title="Re-download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteMenuPlan(m.id)}
                  className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
