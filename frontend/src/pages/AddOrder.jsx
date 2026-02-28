import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MiniLoader from "../Components/MiniLoader";
import {
  UtensilsCrossed,
  FileText,
  ClipboardList,
  SkipForward,
  CheckCircle2,
  User,
  Phone,
  CalendarDays,
  Layers,
  ChevronDown,
  ChevronUp,
  Sunrise,
  Sun,
  Sunset,
  Moon,
  Users,
  UserCog,
  AlertCircle,
  ArrowRight,
  X,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { saveOrder, getEventsByDate, saveEventsByDate } from "../db/indexedDB";
import { eventDatesService } from "../api/service";
import { uuid } from "../utils/uuid";

const ORDER_TYPE = [
  { label: "Total Order", icon: "\u{1F4E6}", desc: "Cooking + Service + Materials" },
  { label: "Cooking & Service", icon: "\u{1F468}\u{200D}\u{1F373}", desc: "Cooking with service staff" },
  { label: "Only Cooking", icon: "\u{1F373}", desc: "Cooking only, no service" },
  { label: "Only Service", icon: "\u{1F935}", desc: "Service staff only, no cooking" },
];
const FUNCTION_TYPE = ["Wedding", "Birthday", "Housewarming", "Corporate Event", "Temple Function", "Church Function", "Puberty Function", "Baby Shower Function"];

const SESSION_META = {
  morning:   { label: "Morning (Breakfast)", icon: Sunrise, color: "text-amber-500" },
  afternoon: { label: "Afternoon (Lunch)",   icon: Sun,     color: "text-orange-500" },
  evening:   { label: "Evening (Snacks)",    icon: Sunset,  color: "text-purple-500" },
  night:     { label: "Night (Dinner)",      icon: Moon,    color: "text-indigo-500" },
};

const needsPax  = (type) => type !== "Only Service";
const needsBoys = (type) => type !== "Only Cooking";

export default function AddOrder({ setActiveTab, prefill, clearPrefill }) {
  const editOrder = prefill?.editOrder || null;
  const isEditing = !!editOrder;

  const [orderType, setOrderType] = useState(editOrder?.orderType || "");
  const [clientName, setClientName] = useState(editOrder?.clientName || prefill?.clientName || "");
  const [mobile, setMobile] = useState(editOrder?.mobile || prefill?.mobile || "");
  const [functionType, setFunctionType] = useState(editOrder?.functionType || "Wedding");
  const [days, setDays] = useState(editOrder?.days?.length || prefill?.days || 0);
  const { showToast } = useToast();

  const [orderDays, setOrderDays] = useState([]);
  const [expandedDay, setExpandedDay] = useState(0);

  // Pre-creation confirm popup
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingOrder, setPendingOrder] = useState(null);
  // Post-creation next-step popup
  const [showNextStep, setShowNextStep] = useState(false);
  const [savedOrderNumber, setSavedOrderNumber] = useState("");
  const [saving, setSaving] = useState(false);

  /* ---------- Apply prefill on mount ---------- */
  useEffect(() => {
    if (editOrder) {
      // Editing: populate day-wise data from existing order
      setOrderDays(editOrder.days || []);
      setExpandedDay(0);
    } else if (prefill?.date && prefill?.days) {
      setDays(prefill.days);
    }
    if (!editOrder && prefill?.clientName) setClientName(prefill.clientName);
    if (!editOrder && prefill?.mobile) setMobile(prefill.mobile);
    return () => { if (clearPrefill) clearPrefill(); };
  }, []);

  /* ---------- Generate Days ---------- */
  useEffect(() => {
    // Skip auto-generation if editing (days are populated from editOrder above)
    if (isEditing) return;
    if (days > 0) {
      const generated = Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        date: i === 0 && prefill?.date ? prefill.date : "",
        enabled: false,
        services: {
          morning:   { pax: "", boys: "" },
          afternoon: { pax: "", boys: "" },
          evening:   { pax: "", boys: "" },
          night:     { pax: "", boys: "" },
        },
      }));
      setOrderDays(generated);
      setExpandedDay(0);
    } else {
      setOrderDays([]);
    }
  }, [days]);

  /* ---------- Validation ---------- */
  const validateForm = () => {
    if (!orderType) return showToast("Select order type", "error");
    if (!clientName.trim()) return showToast("Enter client name", "error");
    if (!/^[6-9]\d{9}$/.test(mobile))
      return showToast("Enter valid 10-digit mobile number", "error");
    if (!functionType) return showToast("Select function type", "error");
    if (days === 0) return showToast("Select number of days", "error");

    for (const d of orderDays) {
      if (!d.date) return showToast(`Select date for Day ${d.day}`, "error");

      if (d.enabled) {
        const hasValid = Object.values(d.services).some((s) => {
          if (needsPax(orderType) && needsBoys(orderType)) return s.pax && s.boys;
          if (needsPax(orderType)) return !!s.pax;
          if (needsBoys(orderType)) return !!s.boys;
          return true;
        });
        if (!hasValid)
          return showToast(`Fill at least one service for Day ${d.day}`, "error");
      }
    }
    return true;
  };

  /* ---------- Build order object ---------- */
  const buildOrder = () => ({
    orderId: isEditing ? editOrder.orderId : uuid(),
    orderNumber: isEditing ? editOrder.orderNumber : `#RCE${Date.now().toString().slice(-6)}`,
    orderType,
    clientName,
    mobile,
    functionType,
    days: orderDays,
    status: isEditing ? editOrder.status : "pending",
    createdAt: isEditing ? editOrder.createdAt : Date.now(),
    updatedAt: isEditing ? Date.now() : undefined,
    attachedDocs: isEditing ? editOrder.attachedDocs : undefined,
  });

  /* ---------- Actually save the order ---------- */
  const confirmAndSave = async (navigateTo) => {
    if (!pendingOrder) return;
    setSaving(true);
    try {
      await saveOrder(pendingOrder);

      // Bookmark each day in the Orders Calendar (only for new orders)
      if (!isEditing) {
        for (const d of pendingOrder.days) {
          if (d.date) {
            try {
              const existing = await getEventsByDate(d.date);
              const calendarEvent = {
                id: crypto.randomUUID(),
                title: `${pendingOrder.functionType} - ${pendingOrder.orderNumber}`,
                client: pendingOrder.clientName,
                contact: pendingOrder.mobile,
                notes: `${pendingOrder.orderType} · Day ${d.day}`,
              };
              const updated = [...existing, calendarEvent];
              await saveEventsByDate(d.date, updated);
              eventDatesService.saveByDate(d.date, updated).catch(() => {});
            } catch (_) {}
          }
        }
      }

      showToast(isEditing ? "Order updated successfully!" : "Order created successfully!", "success");
      setSavedOrderNumber(pendingOrder.orderNumber);
      setShowConfirm(false);

      if (navigateTo) {
        setActiveTab(navigateTo);
      } else {
        setShowNextStep(true);
      }
    } catch (err) {
      showToast("Failed to save order", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ---------- Format date for display ---------- */
  const fmtDate = (d) => {
    if (!d) return "";
    const dt = new Date(d + "T00:00:00");
    return dt.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-t-2xl px-6 py-5 sm:px-8 sm:py-6">
        <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
          <CalendarDays className="w-6 h-6" />
          {isEditing ? `Edit Order ${editOrder.orderNumber}` : "New Order Booking"}
        </h2>
        <p className="text-white/80 text-sm mt-1">{isEditing ? "Update the order details below" : "Fill in the details to create a new catering order"}</p>
      </div>

      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-b-2xl p-5 sm:p-8 space-y-8">

        {/* ── Order Type ── */}
        <div>
          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">
            Order Type *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {ORDER_TYPE.map(({ label, icon, desc }) => (
              <button
                key={label}
                onClick={() => setOrderType(label)}
                className={`relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                  orderType === label
                    ? "border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900/20 shadow-md shadow-orange-200 dark:shadow-orange-900/30"
                    : "border-gray-200 dark:border-gray-600 hover:border-orange-300 dark:hover:border-orange-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
              >
                <span className="text-xl sm:text-2xl">{icon}</span>
                <p className={`font-semibold text-xs sm:text-sm mt-1.5 ${
                  orderType === label ? "text-orange-600 dark:text-orange-400" : "text-gray-800 dark:text-gray-200"
                }`}>
                  {label}
                </p>
                <p className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-500 mt-0.5 hidden sm:block">{desc}</p>
                {orderType === label && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Client Info ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Client Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm transition"
                placeholder="Enter client name"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Mobile Number *
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={mobile}
                onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm transition"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>
        </div>

        {/* ── Function Type + Days ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Function Type *
            </label>
            <div className="relative">
              <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={functionType}
                onChange={(e) => setFunctionType(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm appearance-none transition"
              >
                {FUNCTION_TYPE.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              No of Days *
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={days}
                onChange={(e) => setDays(Number(e.target.value))}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm appearance-none transition"
              >
                {[...Array(15)].map((_, i) => (
                  <option key={i} value={i}>{i === 0 ? "Select days" : i}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* ── Day-wise Cards ── */}
        {orderDays.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Day-wise Schedule
            </h3>
            {orderDays.map((d, index) => {
              const isExpanded = expandedDay === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    isExpanded
                      ? "border-orange-300 dark:border-orange-600 shadow-md shadow-orange-100 dark:shadow-orange-900/20"
                      : "border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {/* Day Header */}
                  <button
                    onClick={() => setExpandedDay(isExpanded ? -1 : index)}
                    className={`w-full flex items-center justify-between px-4 py-3 transition ${
                      isExpanded
                        ? "bg-orange-50 dark:bg-orange-900/20"
                        : "bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isExpanded
                          ? "bg-orange-500 text-white"
                          : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                      }`}>
                        {d.day}
                      </span>
                      <div className="text-left">
                        <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Day {d.day}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {d.date ? fmtDate(d.date) : "No date selected"}
                        </p>
                      </div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </button>

                  {/* Day Body */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 space-y-4 bg-white dark:bg-gray-800">
                          {/* Date Picker */}
                          <div>
                            <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                              Date *
                            </label>
                            <input
                              type="date"
                              value={d.date}
                              onChange={(e) => {
                                const updated = [...orderDays];
                                updated[index].date = e.target.value;
                                setOrderDays(updated);
                              }}
                              className="border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 w-full sm:w-auto bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                            />
                          </div>

                          {/* Toggle Services */}
                          <button
                            onClick={() => {
                              const updated = [...orderDays];
                              updated[index].enabled = !updated[index].enabled;
                              setOrderDays(updated);
                            }}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition ${
                              d.enabled
                                ? "bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                                : "bg-orange-50 dark:bg-orange-900/20 text-orange-500 hover:bg-orange-100 dark:hover:bg-orange-900/30"
                            }`}
                          >
                            {d.enabled ? "− Remove Services" : "+ Add Services"}
                          </button>

                          {/* Service Rows */}
                          {d.enabled && (
                            <div className="space-y-2.5">
                              {Object.entries(SESSION_META).map(([key, meta]) => {
                                const Icon = meta.icon;
                                return (
                                  <div
                                    key={key}
                                    className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-100 dark:border-gray-600/50"
                                  >
                                    <div className="flex items-center gap-2 sm:w-44 shrink-0">
                                      <Icon className={`w-4 h-4 ${meta.color}`} />
                                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {meta.label}
                                      </span>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                      {needsPax(orderType) && (
                                        <div className="relative flex-1">
                                          <Users className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                          <input
                                            placeholder="No of Pax"
                                            value={d.services[key].pax}
                                            onChange={(e) => {
                                              const updated = [...orderDays];
                                              updated[index].services[key].pax = e.target.value;
                                              setOrderDays(updated);
                                            }}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                          />
                                        </div>
                                      )}
                                      {needsBoys(orderType) && (
                                        <div className="relative flex-1">
                                          <UserCog className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                          <input
                                            placeholder="Service Boys"
                                            value={d.services[key].boys}
                                            onChange={(e) => {
                                              const updated = [...orderDays];
                                              updated[index].services[key].boys = e.target.value;
                                              setOrderDays(updated);
                                            }}
                                            className="w-full pl-8 pr-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}

        {/* ── CTA ── */}
        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              if (validateForm()) {
                const order = buildOrder();
                setPendingOrder(order);
                setShowConfirm(true);
              }
            }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white px-7 py-3 rounded-xl text-sm sm:text-base font-bold shadow-lg shadow-orange-200 dark:shadow-orange-900/30 transition-all duration-200"
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ══════════ PRE-CREATION CONFIRMATION POPUP ══════════ */}
      <AnimatePresence>
        {showConfirm && pendingOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
            onClick={(e) => e.target === e.currentTarget && setShowConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              transition={{ type: "spring", duration: 0.35 }}
              className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 px-5 py-4 rounded-t-2xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {isEditing ? "Update Order" : "Confirm Order"}
                  </h3>
                  <p className="text-white/80 text-sm mt-0.5">{pendingOrder.orderNumber}</p>
                </div>
                <button
                  onClick={() => setShowConfirm(false)}
                  className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Order Summary */}
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Order Type</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{pendingOrder.orderType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Client</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{pendingOrder.clientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Mobile</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{pendingOrder.mobile}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Function</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{pendingOrder.functionType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Days</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{pendingOrder.days.length}</span>
                  </div>
                  {pendingOrder.days.map((d) => (
                    <div key={d.day} className="flex justify-between text-xs">
                      <span className="text-gray-400 dark:text-gray-500">Day {d.day}</span>
                      <span className="text-gray-600 dark:text-gray-300">{d.date ? fmtDate(d.date) : "—"}</span>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 text-center font-medium">
                  Do you want to add any of the following to this order?
                </p>

                <div className="space-y-2.5">
                  <button
                    disabled={saving}
                    onClick={() => confirmAndSave("listcreator-menu")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 transition group disabled:opacity-50"
                  >
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-500 group-hover:bg-orange-200 dark:group-hover:bg-orange-800/40 transition">
                      <UtensilsCrossed className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Create Menu List</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Plan dishes for this event</p>
                    </div>
                  </button>

                  <button
                    disabled={saving}
                    onClick={() => confirmAndSave("invoice")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition group disabled:opacity-50"
                  >
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500 group-hover:bg-blue-200 dark:group-hover:bg-blue-800/40 transition">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Create Quotation</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Generate a quotation for the client</p>
                    </div>
                  </button>

                  <button
                    disabled={saving}
                    onClick={() => confirmAndSave("listcreator-list")}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 transition group disabled:opacity-50"
                  >
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-500 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Create Item List</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Generate ingredient & raw material list</p>
                    </div>
                  </button>

                  <div className="border-t border-gray-100 dark:border-gray-700 pt-2.5">
                    <button
                      disabled={saving}
                      onClick={() => confirmAndSave("orders")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md transition disabled:opacity-50"
                    >
                      <SkipForward className="w-4 h-4" />
                      {saving ? (isEditing ? "Updating..." : "Creating...") : isEditing ? "Save & Go to Orders" : "Skip & Create Order"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}