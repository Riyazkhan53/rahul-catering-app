import { useState, useEffect, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Globe,
  Loader2,
  X,
  Sun,
  Moon as MoonIcon,
  Star,
} from "lucide-react";
import {
  getEventsForDate,
  formatDateKey,
  getTamilMonth,
  tamilMonths,
} from "../../utils/calendarData";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// Category colors
const CAT_COLORS = {
  govt: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-300",
    dot: "bg-red-500",
    border: "border-red-300 dark:border-red-700",
    label: "Government Holiday",
  },
  tamil: {
    bg: "bg-orange-100 dark:bg-orange-900/30",
    text: "text-orange-700 dark:text-orange-300",
    dot: "bg-orange-500",
    border: "border-orange-300 dark:border-orange-700",
    label: "Tamil Festival",
  },
  islamic: {
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
    text: "text-emerald-700 dark:text-emerald-300",
    dot: "bg-emerald-500",
    border: "border-emerald-300 dark:border-emerald-700",
    label: "Islamic Date",
  },
  google: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-300",
    dot: "bg-blue-500",
    border: "border-blue-300 dark:border-blue-700",
    label: "Google Calendar",
  },
};

// ─── Google Calendar Config ───
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY || "";
const GOOGLE_CALENDAR_IDS = [
  "en.indian%23holiday%40group.v.calendar.google.com", // Indian holidays
];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth()); // 0-indexed
  const [selectedDate, setSelectedDate] = useState(null);
  const [googleEvents, setGoogleEvents] = useState({});
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [googleError, setGoogleError] = useState("");

  // ─── Navigation ───
  const goToPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDate(null);
  };

  const goToNextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDate(null);
  };

  const goToToday = () => {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDate(null);
  };

  // ─── Google Calendar Fetch ───
  const fetchGoogleEvents = useCallback(async () => {
    if (!GOOGLE_API_KEY) {
      setGoogleError("No API key configured");
      return;
    }
    if (!navigator.onLine) {
      setGoogleError("Offline");
      return;
    }

    setLoadingGoogle(true);
    setGoogleError("");

    const timeMin = new Date(year, month, 1).toISOString();
    const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();
    const events = {};

    try {
      for (const calId of GOOGLE_CALENDAR_IDS) {
        const url = `https://www.googleapis.com/calendar/v3/calendars/${calId}/events?key=${GOOGLE_API_KEY}&timeMin=${timeMin}&timeMax=${timeMax}&singleEvents=true&orderBy=startTime`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Google API: ${res.status}`);
        const data = await res.json();

        (data.items || []).forEach((ev) => {
          const dateStr = ev.start?.date || ev.start?.dateTime?.slice(0, 10);
          if (dateStr) {
            if (!events[dateStr]) events[dateStr] = [];
            events[dateStr].push({
              name: ev.summary || "Google Event",
              category: "google",
            });
          }
        });
      }
      setGoogleEvents(events);
    } catch (err) {
      console.error("Google Calendar fetch failed:", err);
      setGoogleError(err.message);
    } finally {
      setLoadingGoogle(false);
    }
  }, [year, month]);

  useEffect(() => {
    if (GOOGLE_API_KEY && navigator.onLine) {
      fetchGoogleEvents();
    }
  }, [fetchGoogleEvents]);

  // ─── Calendar Grid ───
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const cells = [];

  // Previous month trailing days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    cells.push({ day: daysInPrevMonth - i, current: false });
  }
  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, current: true });
  }
  // Next month leading days
  const remaining = 42 - cells.length;
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, current: false });
  }

  // ─── Get all events for a day ───
  const getAllEvents = (day) => {
    const dateStr = formatDateKey(year, month + 1, day);
    const local = getEventsForDate(dateStr);
    const google = googleEvents[dateStr] || [];
    return [...local, ...google];
  };

  // ─── Tamil month for current view ───
  const firstDayTamil = getTamilMonth(new Date(year, month, 1));
  const lastDayTamil = getTamilMonth(new Date(year, month + 1, 0));
  const tamilMonthDisplay = firstDayTamil === lastDayTamil
    ? firstDayTamil
    : `${firstDayTamil} – ${lastDayTamil}`;

  // ─── Selected date details ───
  const selectedEvents = selectedDate ? getAllEvents(selectedDate) : [];
  const selectedDateObj = selectedDate ? new Date(year, month, selectedDate) : null;

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <CalendarIcon className="w-6 h-6 text-orange-500" />
        <h1 className="text-2xl font-bold">Calendar</h1>
      </div>

      {/* Tamil Month Bar */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-700/50">
        <Sun className="w-4 h-4 text-orange-500" />
        <span className="text-sm font-semibold text-orange-700 dark:text-orange-300">
          Tamil Month: {tamilMonthDisplay}
        </span>
      </div>

      {/* Calendar Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">

        {/* Month Navigation */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500">
          <button
            onClick={goToPrevMonth}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              {MONTH_NAMES[month]} {year}
            </h2>
            <button
              onClick={goToToday}
              className="text-xs text-white/80 hover:text-white underline underline-offset-2 transition"
            >
              Go to Today
            </button>
          </div>

          <button
            onClick={goToNextMonth}
            className="p-2 rounded-lg bg-white/20 hover:bg-white/30 text-white transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Google Calendar Status */}
        {GOOGLE_API_KEY && (
          <div className="flex items-center gap-2 px-4 py-1.5 text-xs bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
            <Globe className="w-3.5 h-3.5 text-blue-500" />
            {loadingGoogle ? (
              <span className="flex items-center gap-1 text-blue-500">
                <Loader2 className="w-3 h-3 animate-spin" /> Fetching Google Calendar…
              </span>
            ) : googleError ? (
              <span className="text-gray-400">{googleError}</span>
            ) : (
              <span className="text-green-600 dark:text-green-400">Google Calendar synced</span>
            )}
          </div>
        )}

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 text-center text-xs font-bold text-gray-500 dark:text-gray-400 py-2 border-b border-gray-100 dark:border-gray-800">
          {WEEKDAYS.map((d) => (
            <div key={d} className={d === "Sun" ? "text-red-400" : ""}>{d}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {cells.map((cell, idx) => {
            const isToday =
              cell.current &&
              cell.day === today.getDate() &&
              month === today.getMonth() &&
              year === today.getFullYear();
            const isSelected = cell.current && cell.day === selectedDate;
            const isSunday = idx % 7 === 0;
            const events = cell.current ? getAllEvents(cell.day) : [];
            const hasEvents = events.length > 0;

            return (
              <button
                key={idx}
                onClick={() => cell.current && setSelectedDate(cell.day === selectedDate ? null : cell.day)}
                className={`
                  relative min-h-[52px] sm:min-h-[72px] p-1 sm:p-1.5 border-b border-r border-gray-50 dark:border-gray-800/50
                  transition-all duration-150 text-left align-top
                  ${!cell.current ? "opacity-30 cursor-default" : "cursor-pointer hover:bg-orange-50/50 dark:hover:bg-orange-900/10"}
                  ${isSelected ? "bg-orange-50 dark:bg-orange-900/20 ring-2 ring-orange-400 ring-inset" : ""}
                `}
                disabled={!cell.current}
              >
                <span
                  className={`
                    inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full text-xs sm:text-sm font-semibold
                    ${isToday ? "bg-orange-500 text-white shadow-md" : ""}
                    ${isSunday && cell.current && !isToday ? "text-red-500 dark:text-red-400" : ""}
                    ${!isSunday && !isToday ? "text-gray-700 dark:text-gray-300" : ""}
                  `}
                >
                  {cell.day}
                </span>

                {/* Event dots */}
                {hasEvents && (
                  <div className="flex gap-0.5 mt-0.5 flex-wrap">
                    {events.slice(0, 3).map((ev, i) => (
                      <span
                        key={i}
                        className={`w-1.5 h-1.5 rounded-full ${CAT_COLORS[ev.category]?.dot || "bg-gray-400"}`}
                      />
                    ))}
                    {events.length > 3 && (
                      <span className="text-[8px] text-gray-400">+{events.length - 3}</span>
                    )}
                  </div>
                )}

                {/* First event name (desktop only) */}
                {hasEvents && (
                  <div className="hidden sm:block mt-0.5">
                    <span className={`text-[9px] leading-tight line-clamp-2 ${CAT_COLORS[events[0].category]?.text || "text-gray-500"}`}>
                      {events[0].name}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 px-1">
        {Object.entries(CAT_COLORS).map(([key, val]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
            <span className={`w-2.5 h-2.5 rounded-full ${val.dot}`} />
            {val.label}
          </div>
        ))}
      </div>

      {/* Selected Date Detail Panel */}
      {selectedDate && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {selectedDateObj?.toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </h3>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                Tamil: {getTamilMonth(selectedDateObj)}
              </p>
            </div>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          {selectedEvents.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-500 italic">No events on this day</p>
          ) : (
            <div className="space-y-2">
              {selectedEvents.map((ev, i) => {
                const cat = CAT_COLORS[ev.category] || CAT_COLORS.govt;
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border ${cat.bg} ${cat.border}`}
                  >
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${cat.dot}`} />
                    <div>
                      <p className={`text-sm font-semibold ${cat.text}`}>{ev.name}</p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {cat.label}
                        {ev.type === "national" && " • National"}
                        {ev.type === "state" && " • Tamil Nadu"}
                        {ev.hijriMonth && ` • ${ev.hijriMonth}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
