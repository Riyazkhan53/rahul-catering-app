import { useState } from "react";

import { motion } from "framer-motion";

import { Plus, Trash2, Download, X, ChevronDown, ChevronUp } from "lucide-react";

import { saveAs } from "file-saver";

import { generateMenuPlanPDF } from "../../../utils/generateMenuPlanPDF";

import { saveMenuPlan } from "../../../db/indexedDB";



// Menu categories

const MENU_CATEGORIES = [

  { id: "starter", label: "Starter", color: "bg-purple-50 dark:bg-purple-900/20" },

  { id: "main", label: "Main Course", color: "bg-orange-50 dark:bg-orange-900/20" },

  { id: "sweet", label: "Sweets", color: "bg-pink-50 dark:bg-pink-900/20" },

  { id: "beverage", label: "Beverages", color: "bg-blue-50 dark:bg-blue-900/20" },

];



// Sessions

const SESSIONS = [

  { id: "morning", label: "Morning (Breakfast)", icon: "🌅" },

  { id: "afternoon", label: "Afternoon (Lunch)", icon: "☀️" },

  { id: "evening", label: "Evening (Snacks)", icon: "🌆" },

  { id: "night", label: "Night (Dinner)", icon: "🌙" },

];



export default function EventMenuPlan({ onBack }) {

  const [formData, setFormData] = useState({

    eventName: "",

    eventDate: "",

    eventVenue: "",

    numberOfGuests: "",

    numberOfDays: 1,

  });



  const [days, setDays] = useState([

    {

      day: 1,

      date: "",

      sessions: {

        morning: { enabled: false, items: {} },

        afternoon: { enabled: false, items: {} },

        evening: { enabled: false, items: {} },

        night: { enabled: false, items: {} },

      },

    },

  ]);



  const [loading, setLoading] = useState(false);

  const [expandedDay, setExpandedDay] = useState(1);



  const handleInputChange = (field, value) => {

    setFormData({ ...formData, [field]: value });

  };



  const handleDaysChange = (numDays) => {

    const num = parseInt(numDays) || 1;

    setFormData({ ...formData, numberOfDays: num });



    const newDays = [];

    for (let i = 0; i < num; i++) {

      newDays.push(

        days[i] || {

          day: i + 1,

          date: "",

          sessions: {

            morning: { enabled: false, items: {} },

            afternoon: { enabled: false, items: {} },

            evening: { enabled: false, items: {} },

            night: { enabled: false, items: {} },

          },

        }

      );

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



  const updateMenuItem = (dayIndex, sessionId, categoryId, itemIndex, value) => {

    const newDays = [...days];

    newDays[dayIndex].sessions[sessionId].items[categoryId][itemIndex] = value;

    setDays(newDays);

  };



  const addCustomCategory = (dayIndex, sessionId, categoryName) => {

    const newDays = [...days];

    if (!newDays[dayIndex].sessions[sessionId].items[categoryName]) {

      newDays[dayIndex].sessions[sessionId].items[categoryName] = [];

    }

    setDays(newDays);

  };



  const updateDayDate = (dayIndex, date) => {

    const newDays = [...days];

    newDays[dayIndex].date = date;

    setDays(newDays);

  };



  const handleGeneratePDF = async () => {

    if (!formData.eventName || !formData.eventDate) {

      alert("Please fill event name and date");

      return;

    }



    const hasMenuItems = days.some((day) =>

      Object.values(day.sessions).some(

        (session) => session.enabled && Object.keys(session.items).length > 0

      )

    );



    if (!hasMenuItems) {

      alert("Please add at least one menu item");

      return;

    }



    setLoading(true);



    try {

      const menuPlanData = {

        ...formData,

        days,

        generatedDate: new Date().toLocaleDateString(),

        planNumber: `MP-${Date.now()}`,

      };



      const pdfBytes = await generateMenuPlanPDF(menuPlanData);

      const blob = new Blob([pdfBytes], { type: "application/pdf" });

      saveAs(blob, `MenuPlan_${formData.eventName}_${Date.now()}.pdf`);



      await saveMenuPlan({

        id: menuPlanData.planNumber,

        ...menuPlanData,

        createdAt: Date.now(),

      });



      alert("Menu Plan saved & PDF generated successfully!");

    } catch (error) {

      console.error("PDF generation error:", error);

      alert("Failed to generate PDF. Please try again.");

    } finally {

      setLoading(false);

    }

  };



  return (

    <motion.div

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}

      className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 md:p-8 max-w-6xl mx-auto overflow-x-hidden"

    >

      {/* Header */}

      <div className="flex justify-between items-center mb-6">

        <div>

          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">

            🗓️ Event Menu Plan

          </h2>

          <p className="text-gray-500 dark:text-gray-400 text-sm">

            Plan detailed menus for multi-day events

          </p>

        </div>

        <button

          onClick={onBack}

          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"

        >

          <X className="w-5 h-5" />

        </button>

      </div>



      {/* Event Details */}

      <div className="mb-8">

        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">

          Event Information

        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input

            type="text"

            placeholder="Event Name *"

            value={formData.eventName}

            onChange={(e) => handleInputChange("eventName", e.target.value)}

            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"

          />

          <input

            type="date"

            placeholder="Event Date *"

            value={formData.eventDate}

            onChange={(e) => handleInputChange("eventDate", e.target.value)}

            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"

          />

          <input

            type="text"

            placeholder="Event Venue"

            value={formData.eventVenue}

            onChange={(e) => handleInputChange("eventVenue", e.target.value)}

            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"

          />

          <input

            type="number"

            placeholder="Number of Guests"

            value={formData.numberOfGuests}

            onChange={(e) => handleInputChange("numberOfGuests", e.target.value)}

            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"

          />

          <div>

            <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">

              Number of Days

            </label>

            <input

              type="number"

              min="1"

              max="15"

              value={formData.numberOfDays}

              onChange={(e) => handleDaysChange(e.target.value)}

              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"

            />

          </div>

        </div>

      </div>



      {/* Days Planning */}

      <div className="space-y-4">

        {days.map((day, dayIndex) => (

          <DayPlan

            key={day.day}

            day={day}

            dayIndex={dayIndex}

            expanded={expandedDay === day.day}

            onToggleExpand={() =>

              setExpandedDay(expandedDay === day.day ? null : day.day)

            }

            onToggleSession={toggleSession}

            onAddMenuItem={addMenuItem}

            onRemoveMenuItem={removeMenuItem}

            onUpdateMenuItem={updateMenuItem}

            onAddCustomCategory={addCustomCategory}

            onUpdateDate={updateDayDate}

          />

        ))}

      </div>



      {/* Actions */}

      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-8">

        <button

          onClick={onBack}

          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"

        >

          Cancel

        </button>

        <button

          onClick={handleGeneratePDF}

          disabled={loading}

          className="px-8 py-3 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-xl transition disabled:opacity-50 flex items-center gap-2"

        >

          {loading ? (

            <>

              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />

              Generating...

            </>

          ) : (

            <>

              <Download className="w-5 h-5" />

              Generate Menu Plan PDF

            </>

          )}

        </button>

      </div>

    </motion.div>

  );

}



// Day Plan Component

function DayPlan({

  day,

  dayIndex,

  expanded,

  onToggleExpand,

  onToggleSession,

  onAddMenuItem,

  onRemoveMenuItem,

  onUpdateMenuItem,

  onAddCustomCategory,

  onUpdateDate,

}) {

  return (

    <div className="border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden">

      {/* Day Header */}

      <div

        onClick={onToggleExpand}

        className="flex flex-wrap justify-between items-center gap-2 p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 cursor-pointer hover:from-orange-100 hover:to-amber-100 dark:hover:from-orange-900/30 dark:hover:to-amber-900/30 transition"

      >

        <div className="flex items-center gap-2 sm:gap-4 min-w-0">

          <h4 className="font-bold text-base sm:text-lg text-gray-900 dark:text-gray-100 shrink-0">

            Day {day.day}

          </h4>

          <input

            type="date"

            value={day.date}

            onChange={(e) => {

              e.stopPropagation();

              onUpdateDate(dayIndex, e.target.value);

            }}

            onClick={(e) => e.stopPropagation()}

            className="border border-gray-300 dark:border-gray-600 rounded px-2 sm:px-3 py-1 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 min-w-0"

          />

        </div>

        {expanded ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}

      </div>



      {/* Day Content */}

      {expanded && (

        <div className="p-4 space-y-4">

          {SESSIONS.map((session) => (

            <SessionPlan

              key={session.id}

              session={session}

              dayIndex={dayIndex}

              sessionData={day.sessions[session.id]}

              onToggleSession={() => onToggleSession(dayIndex, session.id)}

              onAddMenuItem={onAddMenuItem}

              onRemoveMenuItem={onRemoveMenuItem}

              onUpdateMenuItem={onUpdateMenuItem}

              onAddCustomCategory={onAddCustomCategory}

            />

          ))}

        </div>

      )}

    </div>

  );

}



// Session Plan Component

function SessionPlan({

  session,

  dayIndex,

  sessionData,

  onToggleSession,

  onAddMenuItem,

  onRemoveMenuItem,

  onUpdateMenuItem,

  onAddCustomCategory,

}) {

  const [customCategory, setCustomCategory] = useState("");



  const handleAddCustomCategory = () => {

    if (customCategory.trim()) {

      onAddCustomCategory(dayIndex, session.id, customCategory.trim());

      setCustomCategory("");

    }

  };



  return (

    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">

      <div className="flex flex-wrap justify-between items-center gap-2 mb-3">

        <h5 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100 flex items-center gap-2">

          <span className="text-lg sm:text-xl">{session.icon}</span>

          {session.label}

        </h5>

        <button

          onClick={onToggleSession}

          className={`px-3 py-1 rounded-full text-xs sm:text-sm transition shrink-0 ${

            sessionData.enabled

              ? "bg-green-500 text-white"

              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"

          }`}

        >

          {sessionData.enabled ? "Enabled" : "Enable"}

        </button>

      </div>



      {sessionData.enabled && (

        <div className="space-y-4">

          {/* Standard Categories */}

          {MENU_CATEGORIES.map((category) => (

            <CategorySection

              key={category.id}

              category={category}

              items={sessionData.items[category.id] || []}

              dayIndex={dayIndex}

              sessionId={session.id}

              onAddMenuItem={onAddMenuItem}

              onRemoveMenuItem={onRemoveMenuItem}

              onUpdateMenuItem={onUpdateMenuItem}

            />

          ))}



          {/* Custom Categories */}

          {Object.keys(sessionData.items).map((categoryName) => {

            if (!MENU_CATEGORIES.find((c) => c.id === categoryName)) {

              return (

                <CategorySection

                  key={categoryName}

                  category={{

                    id: categoryName,

                    label: categoryName,

                    color: "bg-gray-50 dark:bg-gray-700/50",

                  }}

                  items={sessionData.items[categoryName] || []}

                  dayIndex={dayIndex}

                  sessionId={session.id}

                  onAddMenuItem={onAddMenuItem}

                  onRemoveMenuItem={onRemoveMenuItem}

                  onUpdateMenuItem={onUpdateMenuItem}

                  isCustom

                />

              );

            }

            return null;

          })}



          {/* Add Custom Category */}

          <div className="flex flex-col sm:flex-row gap-2">

            <input

              type="text"

              placeholder="Custom category (e.g., Salads)"

              value={customCategory}

              onChange={(e) => setCustomCategory(e.target.value)}

              onKeyPress={(e) => e.key === "Enter" && handleAddCustomCategory()}

              className="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"

            />

            <button

              onClick={handleAddCustomCategory}

              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded text-sm flex items-center justify-center gap-1 shrink-0"

            >

              <Plus className="w-4 h-4" />

              Add Category

            </button>

          </div>

        </div>

      )}

    </div>

  );

}



// Category Section Component

function CategorySection({

  category,

  items,

  dayIndex,

  sessionId,

  onAddMenuItem,

  onRemoveMenuItem,

  onUpdateMenuItem,

  isCustom = false,

}) {

  const [newItem, setNewItem] = useState("");



  const handleAddItem = () => {

    if (newItem.trim()) {

      onAddMenuItem(dayIndex, sessionId, category.id, newItem.trim());

      setNewItem("");

    }

  };



  return (

    <div className={`${category.color} rounded-lg p-3`}>

      <h6 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100 flex items-center justify-between">

        <span>{category.label}</span>

        {isCustom && (

          <span className="text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">

            Custom

          </span>

        )}

      </h6>



      {/* Items List */}

      <div className="space-y-2 mb-2">

        {items.map((item, index) => (

          <div key={index} className="flex gap-2 items-center">

            <input

              type="text"

              value={item}

              onChange={(e) =>

                onUpdateMenuItem(dayIndex, sessionId, category.id, index, e.target.value)

              }

              className="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded px-2 sm:px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"

            />

            <button

              onClick={() => onRemoveMenuItem(dayIndex, sessionId, category.id, index)}

              className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded shrink-0"

            >

              <Trash2 className="w-4 h-4" />

            </button>

          </div>

        ))}

      </div>



      {/* Add Item */}

      <div className="flex gap-2 items-center">

        <input

          type="text"

          placeholder={`Add ${category.label.toLowerCase()} item...`}

          value={newItem}

          onChange={(e) => setNewItem(e.target.value)}

          onKeyPress={(e) => e.key === "Enter" && handleAddItem()}

          className="flex-1 min-w-0 border border-gray-300 dark:border-gray-600 rounded px-2 sm:px-3 py-1.5 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"

        />

        <button

          onClick={handleAddItem}

          className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded text-sm shrink-0"

        >

          <Plus className="w-4 h-4" />

        </button>

      </div>

    </div>

  );

}

