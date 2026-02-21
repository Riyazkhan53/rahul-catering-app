import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  Save,
  ChevronDown,
  ChevronUp,
  UtensilsCrossed,
  Search,
  X,
  Check,
  ListPlus,
  ChefHat,
} from "lucide-react";
import { createPortal } from "react-dom";
import { saveMenuPlan, getAllDishes } from "../../db/indexedDB";
import { useToast } from "../../context/ToastContext";
import { dishCategories } from "../../utils/picklist";
import AnimatedPage from "../AnimatedPage";

const SESSIONS = [
  { id: "morning", label: "Breakfast", icon: "", color: "from-amber-400 to-orange-400" },
  { id: "afternoon", label: "Lunch", icon: "", color: "from-orange-400 to-red-400" },
  { id: "evening", label: "Snacks", icon: "", color: "from-purple-400 to-pink-400" },
  { id: "night", label: "Dinner", icon: "", color: "from-indigo-400 to-blue-400" },
];

const CATEGORY_COLORS = {
  starter: "bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700",
  main_course: "bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-700",
  bread: "bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-700",
  rice: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700",
  side_dish: "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700",
  dessert: "bg-pink-50 dark:bg-pink-900/20 border-pink-200 dark:border-pink-700",
  beverage: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700",
  snack: "bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700",
  chutney_raita: "bg-lime-50 dark:bg-lime-900/20 border-lime-200 dark:border-lime-700",
  salad: "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700",
};

export default function GenerateSingleMenu() {
  const { showToast } = useToast();
  const [saving, setSaving] = useState(false);
  const [allDishes, setAllDishes] = useState([]);

  const [formData, setFormData] = useState({
    eventName: "",
    clientName: "",
    eventDate: "",
    venue: "",
    guests: "",
    numberOfDays: 1,
  });

  const [days, setDays] = useState([createEmptyDay(1)]);
  const [expandedDay, setExpandedDay] = useState(1);

  useEffect(() => {
    getAllDishes()
      .then((d) => setAllDishes(d || []))
      .catch(() => {});
  }, []);

  function createEmptyDay(dayNum) {
    return {
      day: dayNum,
      date: "",
      sessions: {
        morning: { enabled: false, items: {} },
        afternoon: { enabled: false, items: {} },
        evening: { enabled: false, items: {} },
        night: { enabled: false, items: {} },
      },
    };
  }

  const handleDaysChange = (numDays) => {
    const num = Math.max(1, Math.min(15, parseInt(numDays) || 1));
    setFormData({ ...formData, numberOfDays: num });
    const newDays = [];
    for (let i = 0; i < num; i++) {
      newDays.push(days[i] || createEmptyDay(i + 1));
    }
    setDays(newDays);
  };

  const toggleSession = (dayIndex, sessionId) => {
    const newDays = [...days];
    newDays[dayIndex].sessions[sessionId].enabled =
      !newDays[dayIndex].sessions[sessionId].enabled;
    setDays(newDays);
  };

  const addMenuItem = (dayIndex, sessionId, categoryId, item) => {
    const newDays = [...days];
    const category = newDays[dayIndex].sessions[sessionId].items[categoryId] || [];
    newDays[dayIndex].sessions[sessionId].items[categoryId] = [...category, item];
    setDays(newDays);
  };

  const removeMenuItem = (dayIndex, sessionId, categoryId, itemIndex) => {
    const newDays = [...days];
    newDays[dayIndex].sessions[sessionId].items[categoryId] =
      newDays[dayIndex].sessions[sessionId].items[categoryId].filter((_, i) => i !== itemIndex);
    setDays(newDays);
  };

  const updateDayDate = (dayIndex, date) => {
    const newDays = [...days];
    newDays[dayIndex].date = date;
    setDays(newDays);
  };

  const handleSave = async () => {
    if (!formData.eventName.trim()) return showToast("Enter event/menu name", "error");
    if (!formData.clientName.trim()) return showToast("Enter client name", "error");

    const hasItems = days.some((day) =>
      Object.values(day.sessions).some(
        (s) => s.enabled && Object.values(s.items).some((arr) => arr.length > 0)
      )
    );
    if (!hasItems) return showToast("Add at least one dish", "error");

    setSaving(true);
    try {
      const menuPlan = {
        id: `MP-${Date.now()}`,
        ...formData,
        days,
        generatedDate: new Date().toLocaleDateString(),
        planNumber: `MP-${Date.now()}`,
        createdAt: Date.now(),
      };
      await saveMenuPlan(menuPlan);
      showToast("Menu saved successfully!", "success");

      // Reset form
      setFormData({ eventName: "", clientName: "", eventDate: "", venue: "", guests: "", numberOfDays: 1 });
      setDays([createEmptyDay(1)]);
      setExpandedDay(1);
    } catch (err) {
      console.error("Save menu error:", err);
      showToast("Failed to save menu", "error");
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    "w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none placeholder-gray-400 dark:placeholder-gray-500";

  return (
    <AnimatedPage>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden"
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-orange-500 to-amber-500 dark:from-orange-600 dark:to-amber-600 px-4 sm:px-6 py-5">
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            Generate Menu
          </h2>
          <p className="text-white/80 text-sm mt-1 ml-1">
            Plan dishes for each session across multiple days
          </p>
        </div>

        <div className="p-4 sm:p-6">
          {/* Event Details */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Event Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Menu / Event Name *
                </label>
                <input
                  placeholder="e.g. Wedding Reception"
                  value={formData.eventName}
                  onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Client Name *
                </label>
                <input
                  placeholder="Client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Event Date
                </label>
                <input
                  type="date"
                  value={formData.eventDate}
                  onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Venue
                </label>
                <input
                  placeholder="Event venue"
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  No. of Guests
                </label>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                  No. of Days
                </label>
                <select
                  value={formData.numberOfDays}
                  onChange={(e) => handleDaysChange(e.target.value)}
                  className={inputClass}
                >
                  {Array.from({ length: 15 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Days */}
          <div className="space-y-3">
            {days.map((day, dayIndex) => (
              <DaySection
                key={day.day}
                day={day}
                dayIndex={dayIndex}
                expanded={expandedDay === day.day}
                onToggleExpand={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                onToggleSession={toggleSession}
                onAddMenuItem={addMenuItem}
                onRemoveMenuItem={removeMenuItem}
                onUpdateDate={updateDayDate}
                allDishes={allDishes}
              />
            ))}
          </div>

          {/* Save Button */}
          <div className="flex justify-end mt-6">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl transition disabled:opacity-50 flex items-center gap-2 font-semibold shadow-lg text-sm sm:text-base"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Menu
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatedPage>
  );
}

/* ─── Day Section ─── */
function DaySection({
  day,
  dayIndex,
  expanded,
  onToggleExpand,
  onToggleSession,
  onAddMenuItem,
  onRemoveMenuItem,
  onUpdateDate,
  allDishes,
}) {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Day Header */}
      <div
        onClick={onToggleExpand}
        className="flex flex-wrap justify-between items-center gap-2 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 cursor-pointer hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 transition"
      >
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-orange-400 to-amber-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {day.day}
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100">
              Day {day.day}
            </h4>
            {day.date && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(day.date + "T00:00:00").toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            )}
          </div>
          <input
            type="date"
            value={day.date}
            onChange={(e) => {
              e.stopPropagation();
              onUpdateDate(dayIndex, e.target.value);
            }}
            onClick={(e) => e.stopPropagation()}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-w-0"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Session count badge */}
          {(() => {
            const enabledCount = Object.values(day.sessions).filter((s) => s.enabled).length;
            return enabledCount > 0 ? (
              <span className="text-xs bg-orange-100 dark:bg-orange-800/40 text-orange-600 dark:text-orange-300 px-2 py-0.5 rounded-full font-medium">
                {enabledCount} session{enabledCount > 1 ? "s" : ""}
              </span>
            ) : null;
          })()}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-500" />
          )}
        </div>
      </div>

      {/* Day Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="p-3 sm:p-4 space-y-3">
              {SESSIONS.map((session) => (
                <SessionSection
                  key={session.id}
                  session={session}
                  dayIndex={dayIndex}
                  sessionData={day.sessions[session.id]}
                  onToggleSession={() => onToggleSession(dayIndex, session.id)}
                  onAddMenuItem={onAddMenuItem}
                  onRemoveMenuItem={onRemoveMenuItem}
                  allDishes={allDishes}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Session Section ─── */
function SessionSection({
  session,
  dayIndex,
  sessionData,
  onToggleSession,
  onAddMenuItem,
  onRemoveMenuItem,
  allDishes,
}) {
  const [showDishPicker, setShowDishPicker] = useState(false);

  const totalItems = Object.values(sessionData.items).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const handlePickerAdd = (dish) => {
    onAddMenuItem(dayIndex, session.id, dish.category, dish.name);
  };

  // Collect already-added dish names for this session
  const addedDishNames = Object.values(sessionData.items).flat();

  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      {/* Session Header */}
      <div className="flex flex-wrap justify-between items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-lg">{session.icon}</span>
          <h5 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
            {session.label}
          </h5>
          {sessionData.enabled && totalItems > 0 && (
            <span className="text-[10px] bg-green-100 dark:bg-green-800/30 text-green-700 dark:text-green-300 px-1.5 py-0.5 rounded-full font-medium">
              {totalItems} dish{totalItems > 1 ? "es" : ""}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {sessionData.enabled && (
            <button
              onClick={() => setShowDishPicker(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200 dark:border-blue-700 transition"
            >
              <ListPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add from Dishes</span>
              <span className="sm:hidden">+ Dishes</span>
            </button>
          )}
          <button
            onClick={onToggleSession}
            className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition ${
              sessionData.enabled
                ? "bg-green-500 text-white shadow-sm"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {sessionData.enabled ? "✓ Enabled" : "Enable"}
          </button>
        </div>
      </div>

      {/* Session Content */}
      <AnimatePresence>
        {sessionData.enabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-2.5">
              {dishCategories.map((cat) => (
                <CategorySection
                  key={cat.value}
                  category={cat}
                  items={sessionData.items[cat.value] || []}
                  dayIndex={dayIndex}
                  sessionId={session.id}
                  onAddMenuItem={onAddMenuItem}
                  onRemoveMenuItem={onRemoveMenuItem}
                  allDishes={allDishes.filter((d) => d.category === cat.value)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dish Picker Modal */}
      {showDishPicker && (
        <DishPickerModal
          allDishes={allDishes}
          addedDishNames={addedDishNames}
          onAdd={handlePickerAdd}
          onClose={() => setShowDishPicker(false)}
          sessionLabel={session.label}
        />
      )}
    </div>
  );
}

/* ─── Category Section ─── */
function CategorySection({
  category,
  items,
  dayIndex,
  sessionId,
  onAddMenuItem,
  onRemoveMenuItem,
  allDishes,
}) {
  const [newItem, setNewItem] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const colorClass = CATEGORY_COLORS[category.value] || "bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600";

  const suggestions = newItem.trim()
    ? allDishes.filter(
        (d) =>
          d.name?.toLowerCase().includes(newItem.toLowerCase()) &&
          !items.includes(d.name)
      )
    : [];

  const handleAdd = (name) => {
    const val = name || newItem.trim();
    if (val) {
      onAddMenuItem(dayIndex, sessionId, category.value, val);
      setNewItem("");
      setShowSuggestions(false);
    }
  };

  return (
    <div className={`rounded-lg border p-2.5 sm:p-3 ${colorClass}`}>
      <div className="flex items-center justify-between mb-2">
        <h6 className="font-semibold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
          {category.label}
        </h6>
        {items.length > 0 && (
          <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
            {items.length} item{items.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Items */}
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-2">
          {items.map((item, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full px-2.5 py-1 text-xs text-gray-800 dark:text-gray-200 group"
            >
              {item}
              <button
                onClick={() => onRemoveMenuItem(dayIndex, sessionId, category.value, index)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Add Item */}
      <div className="relative">
        <div className="flex gap-1.5">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={`Add ${category.label.toLowerCase()}...`}
              value={newItem}
              onChange={(e) => {
                setNewItem(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-400 outline-none"
            />
          </div>
          <button
            onClick={() => handleAdd()}
            className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs shrink-0 transition"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 left-0 right-10 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg max-h-32 overflow-y-auto">
            {suggestions.slice(0, 6).map((d) => (
              <button
                key={d.dishId}
                onMouseDown={() => handleAdd(d.name)}
                className="w-full text-left px-3 py-1.5 text-xs sm:text-sm text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition flex items-center gap-2"
              >
                <Check className="w-3 h-3 text-orange-500 shrink-0" />
                {d.name}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Dish Picker Modal ─── */
const PICKER_CATEGORY_ICONS = {
  starter: "🥗",
  main_course: "🍛",
  bread: "🫓",
  rice: "🍚",
  side_dish: "🥘",
  dessert: "🍮",
  beverage: "🥤",
  snack: "🍿",
  chutney_raita: "🫙",
  salad: "🥬",
};

function DishPickerModal({ allDishes, addedDishNames, onAdd, onClose, sessionLabel }) {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");

  const getCategoryCount = (catValue) =>
    allDishes.filter((d) => d.category === catValue).length;

  const getCategoryDishes = () => {
    if (!selectedCategory) return [];
    let filtered = allDishes.filter((d) => d.category === selectedCategory);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (d) =>
          d.name?.toLowerCase().includes(q) ||
          d.tamilName?.toLowerCase().includes(q)
      );
    }
    return filtered;
  };

  const categoryLabel =
    dishCategories.find((c) => c.value === selectedCategory)?.label || "";

  const categoryDishes = getCategoryDishes();

  return createPortal(
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0 bg-gradient-to-r from-orange-500 to-amber-500">
          <div>
            <h3 className="text-lg font-bold text-white">
              {selectedCategory ? categoryLabel : "Select Dishes"}
            </h3>
            <p className="text-white/80 text-xs">
              {sessionLabel} — tap a dish to add it
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selectedCategory && (
              <button
                onClick={() => { setSelectedCategory(null); setSearch(""); }}
                className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition"
              >
                All Categories
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 transition"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {!selectedCategory ? (
            /* Category Cards Grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {dishCategories.map((cat) => {
                const count = getCategoryCount(cat.value);
                return (
                  <button
                    key={cat.value}
                    onClick={() => setSelectedCategory(cat.value)}
                    className="p-4 sm:p-5 text-left rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition group"
                  >
                    <div className="text-3xl sm:text-4xl mb-2">
                      {PICKER_CATEGORY_ICONS[cat.value] || "🍽️"}
                    </div>
                    <h3 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                      {cat.label}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {count === 0
                        ? "No dishes yet"
                        : `${count} dish${count > 1 ? "es" : ""}`}
                    </p>
                    <div className="mt-2 h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-400 to-amber-400 rounded-full transition-all"
                        style={{ width: `${Math.min(count * 10, 100)}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Dishes in selected category */
            <div className="space-y-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder={`Search ${categoryLabel}...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>

              {categoryDishes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <ChefHat className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {search
                      ? `No dishes matching "${search}"`
                      : `No dishes in ${categoryLabel}`}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {categoryDishes.map((dish) => {
                    const isAdded = addedDishNames.includes(dish.name);
                    return (
                      <button
                        key={dish.dishId}
                        onClick={() => {
                          if (!isAdded) onAdd(dish);
                        }}
                        disabled={isAdded}
                        className={`p-3 sm:p-4 rounded-xl border text-left transition ${
                          isAdded
                            ? "border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20 opacity-70 cursor-not-allowed"
                            : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-orange-400 dark:hover:border-orange-500 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1">
                          <h4 className="font-semibold text-sm text-gray-900 dark:text-gray-100 leading-tight">
                            {dish.name}
                          </h4>
                          {isAdded && (
                            <Check className="w-4 h-4 text-green-500 shrink-0" />
                          )}
                        </div>
                        {dish.tamilName && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                            {dish.tamilName}
                          </p>
                        )}
                        {dish.description && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5 truncate">
                            {dish.description}
                          </p>
                        )}
                        {dish.costPerPerson && (
                          <p className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-1.5">
                            ₹{dish.costPerPerson}
                            <span className="font-normal text-gray-400 dark:text-gray-500"> /person</span>
                          </p>
                        )}
                        {isAdded && (
                          <p className="text-[10px] text-green-600 dark:text-green-400 font-medium mt-1">
                            Already added
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-gray-200 dark:border-gray-700 shrink-0 bg-gray-50 dark:bg-gray-800">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {addedDishNames.length} dish{addedDishNames.length !== 1 ? "es" : ""} added to {sessionLabel}
          </p>
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}