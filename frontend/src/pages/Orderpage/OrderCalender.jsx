import { useState, useEffect } from "react";
import AnimatedPage from "../AnimatedPage";
import { ChevronLeft, ChevronRight, Calendar, CalendarCheck } from "lucide-react";
import {
  getAllEvents,
  saveEventsByDate,
  deleteEventById
} from "../../db/indexedDB";
import { eventDatesService } from "../../api/service";
import { useToast } from "../../context/ToastContext";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function OrdersCalender() {
  const today = new Date();
  const { showToast } = useToast();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());

  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState("add"); // add | view

  const [events, setEvents] = useState({});
  const [editingEventId, setEditingEventId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    client: "",
    contact: "",
    notes: "",
  });

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

  useEffect(() => {
    getAllEvents().then(setEvents);
  }, []);

  const isPast = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const t = new Date();
    t.setHours(0, 0, 0, 0);

    return d < t;
  };

  const isFuture = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);

    const t = new Date();
    t.setHours(0, 0, 0, 0);

    return d > t;
  };

  return (
    <AnimatedPage>
      <div className="card p-6 w-full max-w-6xl text-app">

        {/* HEADER */}
        <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button onClick={prevMonth} className="p-2 rounded hover:bg-orange-100">
              <ChevronLeft />
            </button>

            <h2 className="text-xl font-bold">
              {MONTHS[currentMonth]} {currentYear}
            </h2>

            <button onClick={nextMonth} className="p-2 rounded hover:bg-orange-100">
              <ChevronRight />
            </button>
          </div>

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
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center">{d}</div>
          ))}
        </div>

        {/* CALENDAR GRID */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((date, idx) => {
            if (!date) return <div key={idx} />;

            const key = date.toISOString().split("T")[0];
            const hasEvent = !!events[key]?.length;

            return (
              <div
                key={key}
                onClick={() => {
                  setSelectedDate(key);
                  setMode(hasEvent ? "view" : "add");
                  setShowModal(true);
                }}
                className={`card relative min-h-[90px] p-2 border cursor-pointer transition
                  ${hasEvent ? "border-orange-400" : "border-transparent"}
                  ${isToday(date) ? "ring-2 ring-orange-500" : ""}
                `}
              >
                {hasEvent && (
                  <span
                    className={`absolute top-1 right-1 w-3 h-3 rounded-full
      ${isToday(date)
                        ? "bg-yellow-400"
                        : isPast(date)
                          ? "bg-green-500"
                          : "bg-red-500"
                      }
      ${isToday(date) ? "animate-pulse" : ""}
    `}
                  />
                )}
                <div className="text-sm font-semibold">{date.getDate()}</div>

                {hasEvent && (
                  <div className="mt-2 text-xs text-orange-500 font-medium flex items-center gap-1">
                    <CalendarCheck size={12} className="text-orange-500" />
                    <span>
                      {events[key][0]?.title}
                      {events[key].length > 1 && ` +${events[key].length - 1}`}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">

            <h3 className="text-lg font-bold mb-4">
              {mode === "add" ? (editingEventId ? "Edit Event" : "Add Event") : `Events on ${selectedDate}`}
            </h3>

            {/* VIEW */}
            {mode === "view" && (
              <div className="space-y-3">
                {(events[selectedDate] || []).map((evt) => (
                  <div key={evt.id} className="border rounded p-3 text-sm">
                    <div className="flex gap-3 mt-2 text-xs">
                      <button
                        className="text-orange-500"
                        onClick={() => {
                          setForm(evt);              // load data into form
                          setEditingEventId(evt.id); // mark editing mode
                          setMode("add");
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="text-red-500"
                        onClick={() => {
                          deleteEventById(selectedDate, evt.id);

                          eventDatesService
                            .deleteEvent(selectedDate, evt.id)
                            .then(() => {
                              showToast("Event deleted successfully", "success");
                            })
                            .catch(() => {
                              showToast("Failed to delete event", "error");
                            });
                          setEvents(prev => ({
                            ...prev,
                            [selectedDate]: prev[selectedDate].filter(e => e.id !== evt.id)
                          }));
                        }}
                      >
                        Delete
                      </button>
                    </div>
                    <div className="font-semibold">{evt.title}</div>
                    <div>{evt.client}</div>
                    <div>{evt.contact}</div>
                    <div className="opacity-70">{evt.notes}</div>
                  </div>
                ))}

                <button
                  onClick={() => {
                    setMode("add")
                    setForm({ title: "", client: "", contact: "", notes: "" })
                    setEditingEventId(null)
                  }}
                  className="text-orange-500 font-semibold"
                >
                  + Add another event
                </button>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}

            {/* ADD */}
            {mode === "add" && (
              <div className="space-y-3">
                <input
                  placeholder="Event name"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  placeholder="Client name"
                  value={form.client}
                  onChange={(e) => setForm({ ...form, client: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
                <input
                  placeholder="Contact"
                  value={form.contact}
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />
                <textarea
                  placeholder="Notes"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border rounded px-3 py-2"
                />

                <div className="flex justify-end gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded border"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const updatedEvents = editingEventId
                        ? events[selectedDate].map(e =>
                          e.id === editingEventId
                            ? { ...e, ...form } // UPDATE
                            : e
                        )
                        : [
                          ...(events[selectedDate] || []),
                          { id: crypto.randomUUID(), ...form } // ADD
                        ];

                      setEvents(prev => ({
                        ...prev,
                        [selectedDate]: updatedEvents
                      }));

                      saveEventsByDate(selectedDate, updatedEvents);

                      eventDatesService
                        .saveByDate(selectedDate, updatedEvents)
                        .then(() => {
                          showToast(
                            editingEventId ? "Event updated successfully" : "Event added successfully",
                            "success"
                          );
                        })
                        .catch(() => {
                          showToast("Failed to save event", "error");
                        });

                      setForm({ title: "", client: "", contact: "", notes: "" });
                      setEditingEventId(null);
                      setMode("view");
                    }}
                    className="px-4 py-2 rounded bg-orange-500 text-white"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </AnimatedPage>
  );
}