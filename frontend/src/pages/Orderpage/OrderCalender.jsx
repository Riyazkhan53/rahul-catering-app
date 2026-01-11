import { useState } from "react";
import AnimatedPage from "../AnimatedPage";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

/**
 * MOCK DATA (replace with API / IndexedDB later)
 */
const MOCK_ORDERS = {
  "2026-01-06": true,
  "2026-01-08": true,
  "2026-02-12": true,
};

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

export default function OrdersCalender() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  /* 🔄 Month navigation */
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
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

  return (
    <AnimatedPage>
      <div className="card p-6 w-full max-w-6xl text-app">

        {/* 🔝 HEADER CONTROLS */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">

          {/* Month Navigation */}
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 rounded hover:bg-orange-100 dark:hover:bg-white/10">
              <ChevronLeft />
            </button>

            <h2 className="text-xl font-bold">
              {MONTHS[currentMonth]} {currentYear}
            </h2>

            <button onClick={nextMonth} className="p-2 rounded hover:bg-orange-100 dark:hover:bg-white/10">
              <ChevronRight />
            </button>
          </div>

          {/* Manual Select */}
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-orange-400" />

            <select
              value={currentMonth}
              onChange={(e) => setCurrentMonth(Number(e.target.value))}
              className="border rounded px-2 py-1 bg-transparent"
            >
              {MONTHS.map((m, i) => (
                <option key={m} value={i}>{m}</option>
              ))}
            </select>

            <select
              value={currentYear}
              onChange={(e) => setCurrentYear(Number(e.target.value))}
              className="border rounded px-2 py-1 bg-transparent"
            >
              {Array.from({ length: 10 }, (_, i) => today.getFullYear() - 5 + i)
                .map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
            </select>
          </div>
        </div>

        {/* WEEK DAYS */}
        <div className="grid grid-cols-7 text-sm font-semibold opacity-70 mb-2">
          {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            if (!date) return <div key={idx} />;

            const key = date.toISOString().split("T")[0];
            const hasOrder = MOCK_ORDERS[key];

            return (
              <div
                key={key}
                className={`card min-h-[90px] p-2 border cursor-pointer transition
                  ${hasOrder ? "border-orange-400" : "border-transparent"}
                  ${isToday(date) ? "ring-2 ring-orange-500" : ""}
                `}
              >
                <div className="text-sm font-semibold">
                  {date.getDate()}
                </div>

                {hasOrder && (
                  <div className="mt-2 text-xs text-orange-500 font-medium">
                    🔔 Order
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedPage>
  );
}