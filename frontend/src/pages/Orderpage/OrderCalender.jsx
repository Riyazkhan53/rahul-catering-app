import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedPage from "../AnimatedPage";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  CalendarCheck,
  Plus,
  Pencil,
  Trash2,
  X,
  User,
  Phone,
  FileText,
  Tag,
  ClipboardPlus,
  CheckSquare,
  Square,
  StickyNote,
  ListTodo,
} from "lucide-react";
import {
  getAllEvents,
  saveEventsByDate,
  deleteEventById,
  saveTodosForDate,
  getAllCalendarTodos,
  saveNoteForDate,
  getAllCalendarNotes,
} from "../../db/indexedDB";
import { eventDatesService } from "../../api/service";
import { useToast } from "../../context/ToastContext";
import { getEventsForDate, formatDateKey, getTamilMonth } from "../../utils/calendarData";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const SHORT_MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

export default function OrdersCalender({ onCreateOrder }) {
  const today = new Date();
  const { showToast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | view

  const [events, setEvents] = useState({});
  const [editingEventId, setEditingEventId] = useState(null);
  const [direction, setDirection] = useState(0); // -1 = prev, 1 = next
  const touchStartX = useRef(null);

  const [form, setForm] = useState({
    title: "",
    client: "",
    contact: "",
    notes: "",
  });

  const [allTodos, setAllTodos] = useState({});
  const [allNotes, setAllNotes] = useState({});
  const [modalTodos, setModalTodos] = useState([]);
  const [modalNote, setModalNote] = useState("");
  const [newTodoText, setNewTodoText] = useState("");

  /* Month navigation */
  const prevMonth = useCallback(() => {
    setDirection(-1);
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }, [currentMonth]);

  const nextMonth = useCallback(() => {
    setDirection(1);
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }, [currentMonth]);

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  /* 📆 Calendar calculations */
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let d = 1; d <= lastDate; d++) {
    days.push(new Date(currentYear, currentMonth, d));
  }

  const isToday = (date) =>
    date?.toDateString() === new Date().toDateString();

  useEffect(() => {
    getAllEvents().then(setEvents);
    getAllCalendarTodos().then(setAllTodos);
    getAllCalendarNotes().then(setAllNotes);
  }, []);

  const isPast = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    return d < t;
  };

  const formatSelectedDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const eventCount = Object.values(events).reduce((sum, arr) => sum + (arr?.length || 0), 0);

  /* 👆 Touch swipe handlers */
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    touchStartX.current = null;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextMonth();
      else prevMonth();
    }
  };

  /* Animation variants for month transition */
  const gridVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
    }),
  };

  return (
    <AnimatedPage>
      <div className="w-full max-w-6xl text-app overflow-x-hidden">

        {/* HEADER CARD */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 rounded-2xl p-4 sm:p-6 mb-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Month nav */}
            <div className="flex items-center gap-1 sm:gap-2">
              <button
                onClick={prevMonth}
                className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <h2 className="text-lg sm:text-2xl font-bold text-white px-1 sm:px-3 min-w-0">
                <span className="hidden sm:inline">{MONTHS[currentMonth]}</span>
                <span className="sm:hidden">{SHORT_MONTHS[currentMonth]}</span>
                {" "}{currentYear}
              </h2>

              <button
                onClick={nextMonth}
                className="p-1.5 sm:p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={goToToday}
                className="px-3 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium transition"
              >
                Today
              </button>

              <select
                value={currentMonth}
                onChange={(e) => setCurrentMonth(Number(e.target.value))}
                className="hidden sm:block border-0 rounded-lg px-2 py-1.5 bg-white/20 text-white text-sm font-medium cursor-pointer [&>option]:text-gray-900"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>{m}</option>
                ))}
              </select>

              <select
                value={currentYear}
                onChange={(e) => setCurrentYear(Number(e.target.value))}
                className="hidden sm:block border-0 rounded-lg px-2 py-1.5 bg-white/20 text-white text-sm font-medium cursor-pointer [&>option]:text-gray-900"
              >
                {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i)
                  .map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
              </select>
            </div>
          </div>

          {/* Stats + Tamil month */}
          <div className="flex flex-wrap gap-3 sm:gap-4 mt-3 text-white/80 text-xs sm:text-sm">
            <span className="flex items-center gap-1">
              <CalendarCheck className="w-3.5 h-3.5" />
              {eventCount} event{eventCount !== 1 ? "s" : ""} total
            </span>
            <span className="flex items-center gap-1 text-white/90 font-medium">
              {(() => {
                const t1 = getTamilMonth(new Date(currentYear, currentMonth, 1));
                const t2 = getTamilMonth(new Date(currentYear, currentMonth + 1, 0));
                return t1 === t2 ? t1 : `${t1} – ${t2}`;
              })()}
            </span>
          </div>
        </div>

        {/* CALENDAR CARD */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">

          {/* WEEK DAYS HEADER */}
          <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-750 border-b border-gray-100 dark:border-gray-700">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d, i) => (
              <div
                key={d}
                className={`text-center py-2 sm:py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider
                  ${i === 0 ? "text-red-400" : "text-gray-500 dark:text-gray-400"}`}
              >
                <span className="hidden sm:inline">{d}</span>
                <span className="sm:hidden">{d.charAt(0)}</span>
              </div>
            ))}
          </div>

          {/* CALENDAR GRID with swipe + animation */}
          <div
            className="relative overflow-hidden"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={`${currentYear}-${currentMonth}`}
                custom={direction}
                variants={gridVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ type: "tween", duration: 0.25, ease: "easeInOut" }}
                className="grid grid-cols-7"
              >
                {days.map((date, idx) => {
                  if (!date) {
                    return (
                      <div
                        key={`empty-${idx}`}
                        className="min-h-[48px] sm:min-h-[80px] md:min-h-[100px] border-b border-r border-gray-50 dark:border-gray-700/50 bg-gray-50/50 dark:bg-gray-800/50"
                      />
                    );
                  }

                  const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
                  const orderEvts = events[key] || [];
                  const hasEvent = orderEvts.length > 0;
                  const evtCount = orderEvts.length;
                  const isSunday = date.getDay() === 0;
                  const holidays = getEventsForDate(key);
                  const hasHoliday = holidays.length > 0;
                  const hasTodo = (allTodos[key] || []).length > 0;
                  const hasNote = !!(allNotes[key]);
                  const hasAnything = hasEvent || hasHoliday || hasTodo || hasNote;

                  return (
                    <div
                      key={key}
                      onClick={() => {
                        setSelectedDate(key);
                        setForm({ title: "", client: "", contact: "", notes: "" });
                        setEditingEventId(null);
                        setModalTodos(allTodos[key] || []);
                        setModalNote(allNotes[key] || "");
                        setNewTodoText("");
                        setMode(hasEvent ? "view" : "add");
                        setShowModal(true);
                      }}
                      className={`relative min-h-[48px] sm:min-h-[80px] md:min-h-[100px] p-1 sm:p-2 border-b border-r border-gray-100 dark:border-gray-700/50 cursor-pointer transition-all duration-200
                        ${isToday(date)
                          ? "bg-orange-50 dark:bg-orange-900/20"
                          : hasEvent
                            ? "bg-amber-50/50 dark:bg-amber-900/10 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                            : hasHoliday
                              ? "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                              : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                        }
                      `}
                    >
                      {/* Date number */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-semibold
                            ${isToday(date)
                              ? "bg-orange-500 text-white shadow-md"
                              : isSunday
                                ? "text-red-400"
                                : isPast(key)
                                  ? "text-gray-400 dark:text-gray-500"
                                  : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {date.getDate()}
                        </span>

                        {/* Dot indicators (mobile) */}
                        {hasAnything && (
                          <span className="sm:hidden flex gap-0.5 flex-wrap justify-end">
                            {orderEvts.slice(0, 2).map((_, i) => (
                              <span
                                key={`o${i}`}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isToday(date) ? "bg-orange-500" : isPast(key) ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                            ))}
                            {holidays.slice(0, 2).map((h, i) => (
                              <span
                                key={`h${i}`}
                                className={`w-1.5 h-1.5 rounded-full ${
                                  h.category === "govt" ? "bg-purple-500"
                                  : h.category === "tamil" ? "bg-yellow-500"
                                  : "bg-emerald-500"
                                }`}
                              />
                            ))}
                            {hasTodo && <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                            {hasNote && <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />}
                          </span>
                        )}
                      </div>

                      {/* Event + Holiday preview (desktop) */}
                      {hasAnything && (
                        <div className="hidden sm:block mt-1 space-y-0.5 overflow-hidden">
                          {holidays.slice(0, hasEvent ? 1 : 2).map((h, i) => (
                            <div
                              key={`hol-${i}`}
                              className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate font-medium
                                ${h.category === "govt"
                                  ? "bg-purple-100 dark:bg-purple-800/30 text-purple-700 dark:text-purple-300"
                                  : h.category === "tamil"
                                    ? "bg-yellow-100 dark:bg-yellow-800/30 text-yellow-700 dark:text-yellow-300"
                                    : "bg-emerald-100 dark:bg-emerald-800/30 text-emerald-700 dark:text-emerald-300"
                                }`}
                            >
                              {h.name}
                            </div>
                          ))}
                          {orderEvts.slice(0, hasHoliday ? 1 : 2).map((evt, i) => (
                            <div
                              key={evt.id || i}
                              className={`text-[10px] md:text-xs px-1.5 py-0.5 rounded truncate font-medium
                                ${isToday(date)
                                  ? "bg-orange-100 dark:bg-orange-800/40 text-orange-700 dark:text-orange-300"
                                  : isPast(key)
                                    ? "bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300"
                                    : "bg-red-100 dark:bg-red-800/30 text-red-700 dark:text-red-300"
                                }`}
                            >
                              {evt.title}
                            </div>
                          ))}
                          {(evtCount + holidays.length) > 2 && (
                            <div className="text-[10px] text-gray-400 dark:text-gray-500 px-1 font-medium">
                              +{(evtCount + holidays.length) - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 px-3 sm:px-5 py-2.5 sm:py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-100 dark:border-gray-700 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Past Event
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Upcoming
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Govt Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" /> Tamil Festival
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Islamic
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" /> Todo
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" /> Note
            </span>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-0 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div className="bg-white dark:bg-gray-800 rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">

            {/* Modal Header */}
            <div className="sticky top-0 bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 px-5 py-4 rounded-t-2xl sm:rounded-t-2xl flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white">
                  {mode === "add"
                    ? editingEventId ? "Edit Event" : "New Event"
                    : "Events"
                  }
                </h3>
                <p className="text-white/80 text-xs sm:text-sm mt-0.5">
                  {formatSelectedDate(selectedDate)}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>

            <div className="p-4 sm:p-5">
              {/* Tamil month + Holiday/Festival cards for selected date */}
              {selectedDate && (() => {
                const selDateObj = new Date(selectedDate + "T00:00:00");
                const tamilM = getTamilMonth(selDateObj);
                const hols = getEventsForDate(selectedDate);
                if (!tamilM && hols.length === 0) return null;
                return (
                  <div className="mb-4 space-y-2">
                    {tamilM && (
                      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50">
                        <span className="text-xs">☀️</span>
                        <span className="text-xs font-semibold text-orange-700 dark:text-orange-300">{tamilM}</span>
                      </div>
                    )}
                    {hols.map((h, i) => (
                      <div
                        key={`modal-hol-${i}`}
                        className={`flex items-start gap-2.5 px-3 py-2 rounded-xl border text-sm
                          ${h.category === "govt"
                            ? "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/50"
                            : h.category === "tamil"
                              ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50"
                              : "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50"
                          }`}
                      >
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          h.category === "govt" ? "bg-purple-500"
                          : h.category === "tamil" ? "bg-yellow-500"
                          : "bg-emerald-500"
                        }`} />
                        <div>
                          <p className={`font-semibold text-xs ${
                            h.category === "govt" ? "text-purple-700 dark:text-purple-300"
                            : h.category === "tamil" ? "text-yellow-700 dark:text-yellow-300"
                            : "text-emerald-700 dark:text-emerald-300"
                          }`}>{h.name}</p>
                          <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">
                            {h.category === "govt" ? (h.type === "national" ? "National Holiday" : "TN State Holiday")
                              : h.category === "tamil" ? "Tamil Festival"
                              : `Islamic${h.hijriMonth ? ` • ${h.hijriMonth}` : ""}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* VIEW MODE */}
              {mode === "view" && (
                <div className="space-y-3">
                  {(events[selectedDate] || []).map((evt) => (
                    <div
                      key={evt.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-xl p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 min-w-0 truncate">
                          {evt.title}
                        </h4>
                        <div className="flex gap-1 shrink-0">
                          <button
                            className="p-1.5 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-500 transition"
                            onClick={() => {
                              setForm(evt);
                              setEditingEventId(evt.id);
                              setMode("add");
                            }}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition"
                            onClick={() => {
                              const remaining = (events[selectedDate] || []).filter(e => e.id !== evt.id);
                              setEvents(prev => ({ ...prev, [selectedDate]: remaining }));
                              saveEventsByDate(selectedDate, remaining);
                              eventDatesService
                                .deleteEvent(selectedDate, evt.id)
                                .catch(() => {});
                              showToast("Event deleted", "success");
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        {evt.client && (
                          <div className="flex items-center gap-2">
                            <User className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                            <span className="truncate">{evt.client}</span>
                          </div>
                        )}
                        {evt.contact && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            <span>{evt.contact}</span>
                          </div>
                        )}
                        {evt.notes && (
                          <div className="flex items-start gap-2">
                            <FileText className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                            <span className="text-gray-500 dark:text-gray-400">{evt.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      setMode("add");
                      setForm({ title: "", client: "", contact: "", notes: "" });
                      setEditingEventId(null);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-orange-300 dark:border-orange-600 text-orange-500 dark:text-orange-400 font-semibold text-sm hover:bg-orange-50 dark:hover:bg-orange-900/20 transition"
                  >
                    <Plus className="w-4 h-4" />
                    Add another event
                  </button>

                  {onCreateOrder && (
                    <button
                      onClick={() => {
                        const firstEvt = (events[selectedDate] || [])[0];
                        setShowModal(false);
                        onCreateOrder(selectedDate, firstEvt?.client || "", firstEvt?.contact || "");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md transition"
                    >
                      <ClipboardPlus className="w-4 h-4" />
                      Create New Order
                    </button>
                  )}
                </div>
              )}

              {/* ADD / EDIT MODE */}
              {mode === "add" && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                      Event Name *
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        placeholder="e.g. Wedding Reception"
                        value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                      Client Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        placeholder="Client name"
                        value={form.client}
                        onChange={(e) => setForm({ ...form, client: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                      Contact
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        placeholder="Phone number"
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 uppercase tracking-wider">
                      Notes
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        placeholder="Additional notes..."
                        rows={3}
                        value={form.notes}
                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 outline-none text-sm resize-none"
                      />
                    </div>
                  </div>

                  {onCreateOrder && !editingEventId && (
                    <button
                      onClick={() => {
                        setShowModal(false);
                        onCreateOrder(selectedDate, form.client || "", form.contact || "");
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold text-sm shadow-md transition"
                    >
                      <ClipboardPlus className="w-4 h-4" />
                      Create New Order
                    </button>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (events[selectedDate]?.length) {
                          setMode("view");
                        } else {
                          setShowModal(false);
                        }
                        setEditingEventId(null);
                        setForm({ title: "", client: "", contact: "", notes: "" });
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        const updatedEvents = editingEventId
                          ? events[selectedDate].map(e =>
                            e.id === editingEventId
                              ? { ...e, ...form }
                              : e
                          )
                          : [
                            ...(events[selectedDate] || []),
                            { id: crypto.randomUUID(), ...form }
                          ];

                        setEvents(prev => ({
                          ...prev,
                          [selectedDate]: updatedEvents
                        }));

                        saveEventsByDate(selectedDate, updatedEvents);

                        showToast(
                          editingEventId ? "Event updated" : "Event added",
                          "success"
                        );

                        eventDatesService
                          .saveByDate(selectedDate, updatedEvents)
                          .catch(() => {});

                        setForm({ title: "", client: "", contact: "", notes: "" });
                        setEditingEventId(null);
                        setMode("view");
                      }}
                      className="flex-1 px-4 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white transition text-sm font-semibold shadow-md"
                    >
                      {editingEventId ? "Update" : "Save Event"}
                    </button>
                  </div>
                </div>
              )}

              {/* ─── TODO LIST ─── */}
              {selectedDate && (
                <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <ListTodo className="w-4 h-4 text-cyan-500" />
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">To-Do List</h4>
                    {modalTodos.length > 0 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600 dark:text-cyan-400 font-semibold">
                        {modalTodos.filter(t => t.done).length}/{modalTodos.length}
                      </span>
                    )}
                  </div>

                  {/* Add todo input */}
                  <div className="flex gap-2 mb-2">
                    <input
                      placeholder="Add a task..."
                      value={newTodoText}
                      onChange={(e) => setNewTodoText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && newTodoText.trim()) {
                          const updated = [...modalTodos, { id: crypto.randomUUID(), text: newTodoText.trim(), done: false }];
                          setModalTodos(updated);
                          setAllTodos(prev => ({ ...prev, [selectedDate]: updated }));
                          saveTodosForDate(selectedDate, updated);
                          setNewTodoText("");
                        }
                      }}
                      className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 outline-none text-sm"
                    />
                    <button
                      onClick={() => {
                        if (!newTodoText.trim()) return;
                        const updated = [...modalTodos, { id: crypto.randomUUID(), text: newTodoText.trim(), done: false }];
                        setModalTodos(updated);
                        setAllTodos(prev => ({ ...prev, [selectedDate]: updated }));
                        saveTodosForDate(selectedDate, updated);
                        setNewTodoText("");
                      }}
                      className="px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 text-white transition text-sm font-medium"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Todo items */}
                  {modalTodos.length > 0 && (
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {modalTodos.map((todo) => (
                        <div
                          key={todo.id}
                          className="flex items-center gap-2 group px-2 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                        >
                          <button
                            onClick={() => {
                              const updated = modalTodos.map(t => t.id === todo.id ? { ...t, done: !t.done } : t);
                              setModalTodos(updated);
                              setAllTodos(prev => ({ ...prev, [selectedDate]: updated }));
                              saveTodosForDate(selectedDate, updated);
                            }}
                            className="shrink-0"
                          >
                            {todo.done
                              ? <CheckSquare className="w-4 h-4 text-cyan-500" />
                              : <Square className="w-4 h-4 text-gray-400" />
                            }
                          </button>
                          <span className={`flex-1 text-sm ${todo.done ? "line-through text-gray-400 dark:text-gray-500" : "text-gray-700 dark:text-gray-300"}`}>
                            {todo.text}
                          </span>
                          <button
                            onClick={() => {
                              const updated = modalTodos.filter(t => t.id !== todo.id);
                              setModalTodos(updated);
                              setAllTodos(prev => ({ ...prev, [selectedDate]: updated }));
                              saveTodosForDate(selectedDate, updated);
                            }}
                            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-400 transition"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {modalTodos.length === 0 && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic">No tasks yet. Add one above.</p>
                  )}
                </div>
              )}

              {/* ─── NOTES SCRIBBLE ─── */}
              {selectedDate && (
                <div className="mt-5 border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <StickyNote className="w-4 h-4 text-pink-500" />
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Notes / Scribble</h4>
                  </div>

                  <textarea
                    placeholder="Jot down anything for this date..."
                    rows={4}
                    value={modalNote}
                    onChange={(e) => {
                      const val = e.target.value;
                      setModalNote(val);
                      if (val.trim()) {
                        setAllNotes(prev => ({ ...prev, [selectedDate]: val }));
                      } else {
                        setAllNotes(prev => {
                          const copy = { ...prev };
                          delete copy[selectedDate];
                          return copy;
                        });
                      }
                      saveNoteForDate(selectedDate, val);
                    }}
                    className="w-full px-3 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-pink-500 outline-none text-sm resize-none"
                  />
                  {modalNote.trim() && (
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Auto-saved</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}