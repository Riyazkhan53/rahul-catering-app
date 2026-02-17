import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  UtensilsCrossed,
  FileText,
  ClipboardList,
  SkipForward,
  CheckCircle2,
} from "lucide-react";
import { useToast } from "../context/ToastContext";
import { saveOrder, getEventsByDate, saveEventsByDate } from "../db/indexedDB";
import { eventDatesService } from "../api/service";
import { uuid } from "../utils/uuid";

const ORDER_TYPE = ["Total Order", "Cooking & Service", "Only Cooking", "Only Service"]
const FUNCTION_TYPE = ["Wedding","Birthday","Housewarming","Corporate Event","Temple Function", "Church Function", "Puberty Function","Baby Shower Function"]

export default function AddOrder({ setActiveTab, prefill, clearPrefill }) {
  const [orderType, setOrderType] = useState("");
  const [clientName, setClientName] = useState("");
  const [mobile, setMobile] = useState("");
  const [functionType, setFunctionType] = useState("Wedding");
  const [days, setDays] = useState(prefill?.days || 0);
  const { showToast } = useToast();

  const [orderDays, setOrderDays] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savedOrderNumber, setSavedOrderNumber] = useState("");

  /* ---------- Apply prefill on mount ---------- */
  useEffect(() => {
    if (prefill?.date && prefill?.days) {
      setDays(prefill.days);
    }
    return () => { if (clearPrefill) clearPrefill(); };
  }, []);

  /* ---------- Generate Days ---------- */
  useEffect(() => {
    if (days > 0) {
      const generated = Array.from({ length: days }, (_, i) => ({
        day: i + 1,
        date: i === 0 && prefill?.date ? prefill.date : "",
        enabled: false,
        services: {
          morning: { pax: "", boys: "" },
          afternoon: { pax: "", boys: "" },
          evening: { pax: "", boys: "" },
          night: { pax: "", boys: "" }
        }
      }));
      setOrderDays(generated);
    } else {
      setOrderDays([]);
    }
  }, [days]);

  /* ---------- Validation ---------- */
  const validateForm = () => {
    if (!orderType) return showToast("Select order type", "error");
    if (!clientName.trim()) return showToast("Enter client name", "error");
    if (!/^[6-9]\d{9}$/.test(mobile))
      return showToast("Enter valid mobile number", "error");
    if (!functionType) return showToast("Select function type", "error");
    if (days === 0) return showToast("Select number of days", "error");

    for (const d of orderDays) {
      if (!d.date)
        return showToast(`Select date for Day ${d.day}`, "error");

      if (d.enabled) {
        const validService = Object.values(d.services).some(
          (s) => s.pax && s.boys
        );
        if (!validService)
          return showToast(`Add services for Day ${d.day}`, "error");
      }
    }

    return true;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 sm:p-8"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900 dark:text-gray-100">📝 New Order Booking</h2>

      {/* Order Type */}
      <div className="mb-6">
        <label className="block font-semibold mb-2 text-gray-900 dark:text-gray-100">Order Type *</label>
        <div className="flex gap-2 sm:gap-3 flex-wrap">
          {ORDER_TYPE.map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-3 sm:px-4 py-2 rounded-full border text-sm sm:text-base transition ${orderType === type
                  ? "bg-orange-500 dark:bg-orange-600 text-white border-orange-500 dark:border-orange-600"
                  : "border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Client Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-1 text-gray-900 dark:text-gray-100">Client Name *</label>
          <input
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
            placeholder="Enter client name"
          />
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-900 dark:text-gray-100">Mobile Number *</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
            placeholder="Enter mobile number"
          />
        </div>
      </div>

      {/* Function + Days */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div>
          <label className="block font-semibold mb-1 text-gray-900 dark:text-gray-100">Function Type *</label>
          <select
            value={functionType}
            onChange={(e) => setFunctionType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          >
            {FUNCTION_TYPE.map((_obj)=>(
              <option key={_obj}>{_obj}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-semibold mb-1 text-gray-900 dark:text-gray-100">No of Days *</label>
          <select
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          >
            {[...Array(15)].map((_, i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Day-wise Dates & Services */}
      {orderDays.map((d, index) => (
        <div key={index} className="border border-gray-300 dark:border-gray-600 rounded-xl p-3 sm:p-4 mb-4 bg-gray-50 dark:bg-gray-700/50">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">Day {d.day}</h4>
            <button
              onClick={() => {
                const updated = [...orderDays];
                updated[index].enabled = !updated[index].enabled;
                setOrderDays(updated);
              }}
              className="text-orange-500 dark:text-orange-400 font-semibold text-sm sm:text-base hover:text-orange-600 dark:hover:text-orange-300 transition"
            >
              {d.enabled ? "− Remove Services" : "+ Add Services"}
            </button>
          </div>

          {/* Date */}
          <div className="mb-4">
            <label className="block font-medium mb-1 text-gray-900 dark:text-gray-100">Date *</label>
            <input
              type="date"
              value={d.date}
              onChange={(e) => {
                const updated = [...orderDays];
                updated[index].date = e.target.value;
                setOrderDays(updated);
              }}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full md:w-1/3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
            />
          </div>

          {/* Services */}
          {d.enabled && (
            <div className="grid gap-2 sm:gap-3">
              {["morning", "afternoon", "evening", "night"].map((s) => (
                <div
                  key={s}
                  className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-3 items-center"
                >
                  <div className="capitalize font-medium text-gray-900 dark:text-gray-100">{s}</div>

                  <input
                    placeholder="No of Pax"
                    value={d.services[s].pax}
                    onChange={(e) => {
                      const updated = [...orderDays];
                      updated[index].services[s].pax = e.target.value;
                      setOrderDays(updated);
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                  />

                  {orderType!="Only Cooking" &&<input
                    placeholder="Service Boys"
                    value={d.services[s].boys}
                    onChange={(e) => {
                      const updated = [...orderDays];
                      updated[index].services[s].boys = e.target.value;
                      setOrderDays(updated);
                    }}
                    className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
                  />}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* CTA */}
      <div className="flex justify-end mt-6">
        <button
          onClick={async () => {
            if (validateForm()) {
              const order = {
                orderId: uuid(),
                orderNumber: `#RCE${Date.now().toString().slice(-6)}`,
                orderType,
                clientName,
                mobile,
                functionType,
                days: orderDays,
                status: "pending",
                createdAt: Date.now(),
              };
              await saveOrder(order);

              // Bookmark each day in the Orders Calendar
              try {
                for (const d of orderDays) {
                  if (d.date) {
                    const existing = await getEventsByDate(d.date);
                    const calendarEvent = {
                      id: crypto.randomUUID(),
                      title: `${functionType} - ${order.orderNumber}`,
                      client: clientName,
                      contact: mobile,
                      notes: `${orderType} · Day ${d.day}`,
                    };
                    const updated = [...existing, calendarEvent];
                    await saveEventsByDate(d.date, updated);
                    eventDatesService.saveByDate(d.date, updated).catch(() => {});
                  }
                }
              } catch (err) {
                console.error("Failed to bookmark order in calendar:", err);
              }

              showToast("Order saved successfully", "success");
              setSavedOrderNumber(order.orderNumber);
              setShowConfirm(true);
            }
          }}
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-base sm:text-lg transition font-semibold"
        >
          Continue →
        </button>
      </div>

      {/* ── Post-Creation Confirmation Popup ── */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              {/* Popup Header */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 px-5 py-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-white mx-auto mb-2" />
                <h3 className="text-lg font-bold text-white">Order Created!</h3>
                <p className="text-white/80 text-sm mt-0.5">{savedOrderNumber}</p>
              </div>

              <div className="p-5">
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
                  What would you like to do next?
                </p>

                <div className="space-y-2.5">
                  <button
                    onClick={() => { setShowConfirm(false); setActiveTab("listcreator"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 transition group"
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
                    onClick={() => { setShowConfirm(false); setActiveTab("invoice"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-600 transition group"
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
                    onClick={() => { setShowConfirm(false); setActiveTab("listcreator"); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20 hover:border-green-300 dark:hover:border-green-600 transition group"
                  >
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-500 group-hover:bg-green-200 dark:group-hover:bg-green-800/40 transition">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">Create Item List</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Generate ingredient & raw material list</p>
                    </div>
                  </button>

                  <button
                    onClick={() => { setShowConfirm(false); setActiveTab("orders"); }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 transition mt-1"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span className="font-medium text-sm">Skip & Go to Orders</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}