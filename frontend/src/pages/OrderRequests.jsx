import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Inbox,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  User,
  Phone,
  Users,
  UtensilsCrossed,
  Sparkles,
  ArrowRight,
  RefreshCw,
  ChefHat,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { orderRequestService } from "../api/service";
import MiniLoader from "../Components/MiniLoader";

const STATUS_CONFIG = {
  new: { label: "New", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300", icon: Sparkles },
  viewed: { label: "Viewed", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300", icon: Eye },
  accepted: { label: "Accepted", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300", icon: CheckCircle2 },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300", icon: XCircle },
};

const FILTER_OPTIONS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "viewed", label: "Viewed" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

export default function OrderRequests({ setActiveTab, setOrderPrefill }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const { showToast } = useToast();

  const fetchRequests = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const data = await orderRequestService.getAll();
      setRequests(data);
    } catch (err) {
      if (!silent && err.message !== "Offline mode") {
        showToast("Failed to load order requests", "error");
      }
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(() => fetchRequests(true), 10000);
    return () => clearInterval(interval);
  }, [fetchRequests]);

  const updateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      const updated = await orderRequestService.updateStatus(id, status);
      setRequests((prev) => prev.map((r) => (r._id === id ? updated : r)));
      showToast(`Request marked as ${status}`, "success");
    } catch {
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateOrder = (req) => {
    // Map website request data → AddOrder prefill format
    setOrderPrefill({
      clientName: req.name,
      mobile: req.contact,
      functionType: req.functionType,
      paxCount: req.paxCount,
      dishes: req.dishes || [],
      services: req.services || [],
      fromRequest: req._id,
    });
    setActiveTab("add-order");
  };

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);

  const newCount = requests.filter((r) => r.status === "new").length;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <MiniLoader message="Loading order requests..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Inbox className="w-7 h-7 text-orange-500" />
            Order Requests
            {newCount > 0 && (
              <span className="px-2.5 py-1 text-xs font-bold bg-red-500 text-white rounded-full animate-pulse">
                {newCount} new
              </span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Quotation requests from the website
          </p>
        </div>
        <button
          onClick={fetchRequests}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const count =
            opt.key === "all"
              ? requests.length
              : requests.filter((r) => r.status === opt.key).length;
          return (
            <button
              key={opt.key}
              onClick={() => setFilter(opt.key)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                filter === opt.key
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
            >
              {opt.label}
              <span className="ml-1.5 opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Request Cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <Inbox className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
            No {filter === "all" ? "" : filter} requests found
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Quotation requests from the website will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((req) => {
              const isExpanded = expandedId === req._id;
              const statusCfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.new;
              const StatusIcon = statusCfg.icon;

              return (
                <motion.div
                  key={req._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`bg-white dark:bg-gray-800 border rounded-2xl overflow-hidden transition-shadow ${
                    req.status === "new"
                      ? "border-blue-200 dark:border-blue-800 shadow-md shadow-blue-50 dark:shadow-blue-900/20"
                      : "border-gray-100 dark:border-gray-700 shadow-sm"
                  }`}
                >
                  {/* Card header — always visible */}
                  <div
                    className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    onClick={() => {
                      setExpandedId(isExpanded ? null : req._id);
                      if (req.status === "new") {
                        updateStatus(req._id, "viewed");
                      }
                    }}
                  >
                    {/* Icon */}
                    <div className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white shadow-md">
                      <ChefHat className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">
                          {req.name}
                        </h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${statusCfg.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusCfg.label}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {req.functionType} · {req.paxCount} pax · {req.contact}
                      </p>
                    </div>

                    {/* Time */}
                    <div className="shrink-0 text-right hidden sm:block">
                      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(req.createdAt)}
                      </p>
                    </div>

                    {/* Expand arrow */}
                    <div className="shrink-0">
                      <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                        <ArrowRight className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 space-y-4 border-t border-gray-100 dark:border-gray-700">
                          {/* Details grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1">
                                <User className="w-3 h-3" /> Name
                              </p>
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1">{req.name}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1">
                                <Phone className="w-3 h-3" /> Contact
                              </p>
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1">{req.contact}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">Function</p>
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1">{req.functionType}</p>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3">
                              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold flex items-center gap-1">
                                <Users className="w-3 h-3" /> Pax Count
                              </p>
                              <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 mt-1">{req.paxCount}</p>
                            </div>
                          </div>

                          {/* Dishes */}
                          {req.dishes && req.dishes.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                                <UtensilsCrossed className="w-3.5 h-3.5" /> Dishes Requested
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {req.dishes.map((dish, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1.5 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-lg text-xs font-medium border border-orange-100 dark:border-orange-800/30"
                                  >
                                    {dish}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Services */}
                          {req.services && req.services.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                Additional Services
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {req.services.map((svc, i) => (
                                  <span
                                    key={i}
                                    className="px-3 py-1.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium border border-purple-100 dark:border-purple-800/30"
                                  >
                                    {svc}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Mobile time */}
                          <p className="text-xs text-gray-400 dark:text-gray-500 sm:hidden flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(req.createdAt)}
                          </p>

                          {/* Actions */}
                          <div className="flex flex-wrap gap-2 pt-2">
                            {req.status !== "accepted" && (
                              <button
                                onClick={() => updateStatus(req._id, "accepted")}
                                disabled={updatingId === req._id}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                Accept
                              </button>
                            )}
                            {req.status !== "rejected" && (
                              <button
                                onClick={() => updateStatus(req._id, "rejected")}
                                disabled={updatingId === req._id}
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4" />
                                Reject
                              </button>
                            )}
                            <button
                              onClick={() => handleCreateOrder(req)}
                              className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-md transition-all"
                            >
                              <ArrowRight className="w-4 h-4" />
                              Create Order
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
