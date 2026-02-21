import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Download, X, ChevronDown, ChevronRight, CalendarPlus } from "lucide-react";
import { generateQuotationPDF } from "../../../utils/generateQuotationPDF";
import { savePdfFile } from "../../../utils/savePdf";
import { saveQuotation } from "../../../db/indexedDB";
import { useToast } from "../../../context/ToastContext";

const SHIFTS = ["Breakfast", "Lunch", "Snacks", "Dinner"];

const CATEGORIZED_DISHES = {
  "Starters": [
    { id: "s1", name: "Masala Papad", price: 50 },
    { id: "s2", name: "Paneer Tikka", price: 150 },
    { id: "s3", name: "Veg Manchurian", price: 130 },
    { id: "s4", name: "Gobi 65", price: 120 },
    { id: "s5", name: "Spring Rolls", price: 100 },
  ],
  "Main Course": [
    { id: "m1", name: "Veg Biryani", price: 150 },
    { id: "m2", name: "Chicken Biryani", price: 200 },
    { id: "m3", name: "Paneer Butter Masala", price: 180 },
    { id: "m4", name: "Dal Makhani", price: 120 },
    { id: "m5", name: "Mutton Curry", price: 280 },
    { id: "m6", name: "Chole Masala", price: 110 },
    { id: "m7", name: "Egg Curry", price: 130 },
  ],
  "Breads": [
    { id: "b1", name: "Butter Naan", price: 40 },
    { id: "b2", name: "Tandoori Roti", price: 25 },
    { id: "b3", name: "Garlic Naan", price: 50 },
    { id: "b4", name: "Kulcha", price: 45 },
  ],
  "Rice": [
    { id: "r1", name: "Steamed Rice", price: 60 },
    { id: "r2", name: "Jeera Rice", price: 80 },
    { id: "r3", name: "Pulao", price: 90 },
  ],
  "Side Dishes": [
    { id: "sd1", name: "Raita", price: 50 },
    { id: "sd2", name: "Green Salad", price: 60 },
    { id: "sd3", name: "Pickle & Papad", price: 30 },
    { id: "sd4", name: "Curd", price: 40 },
  ],
  "Desserts": [
    { id: "d1", name: "Gulab Jamun", price: 80 },
    { id: "d2", name: "Ice Cream", price: 70 },
    { id: "d3", name: "Rasmalai", price: 100 },
    { id: "d4", name: "Kheer", price: 75 },
    { id: "d5", name: "Jalebi", price: 60 },
  ],
  "Beverages": [
    { id: "bv1", name: "Tea", price: 20 },
    { id: "bv2", name: "Coffee", price: 30 },
    { id: "bv3", name: "Buttermilk", price: 25 },
    { id: "bv4", name: "Fresh Juice", price: 50 },
  ],
};

const ADDITIONAL_SERVICES = [
  { id: "service", name: "Service Staff", price: 500 },
  { id: "utensils", name: "Utensils & Crockery", price: 300 },
  { id: "decoration", name: "Table Decoration", price: 800 },
  { id: "furniture", name: "Tables & Chairs", price: 1000 },
  { id: "tent", name: "Tent/Canopy", price: 1500 },
  { id: "lighting", name: "Lighting Setup", price: 1200 },
  { id: "generator", name: "Generator", price: 2000 },
  { id: "waiter", name: "Additional Waiters", price: 400 },
];

const inputClass =
  "w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm sm:text-base focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 outline-none";

export default function CreateQuotation({ onBack }) {
  const { showToast } = useToast();

  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    eventType: "Wedding",
    numberOfGuests: "",
  });

  // eventDates: [{ date: "", shifts: { Breakfast: { dishes: [{...dish, quantity}] }, ... } }]
  const [eventDates, setEventDates] = useState([
    { date: "", shifts: {} },
  ]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);
  // Track which shift picker is open: "dateIdx-shift"
  const [activePicker, setActivePicker] = useState(null);
  // Track expanded categories inside the picker
  const [expandedCats, setExpandedCats] = useState({});

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  // --- Date management ---
  const addDate = () => {
    setEventDates([...eventDates, { date: "", shifts: {} }]);
  };

  const removeDate = (idx) => {
    if (eventDates.length <= 1) return;
    setEventDates(eventDates.filter((_, i) => i !== idx));
  };

  const updateDate = (idx, value) => {
    setEventDates(eventDates.map((d, i) => (i === idx ? { ...d, date: value } : d)));
  };

  // --- Shift toggle ---
  const toggleShift = (dateIdx, shift) => {
    setEventDates(
      eventDates.map((d, i) => {
        if (i !== dateIdx) return d;
        const shifts = { ...d.shifts };
        if (shifts[shift]) {
          delete shifts[shift];
          if (activePicker === `${dateIdx}-${shift}`) setActivePicker(null);
        } else {
          shifts[shift] = { dishes: [] };
        }
        return { ...d, shifts };
      })
    );
  };

  // --- Dish management per shift ---
  const addDishToShift = (dateIdx, shift, dish) => {
    setEventDates(
      eventDates.map((d, i) => {
        if (i !== dateIdx) return d;
        const shiftData = { ...d.shifts[shift] };
        const existing = shiftData.dishes.find((dd) => dd.id === dish.id);
        if (existing) {
          shiftData.dishes = shiftData.dishes.map((dd) =>
            dd.id === dish.id ? { ...dd, quantity: dd.quantity + 1 } : dd
          );
        } else {
          shiftData.dishes = [...shiftData.dishes, { ...dish, quantity: 1 }];
        }
        return { ...d, shifts: { ...d.shifts, [shift]: shiftData } };
      })
    );
  };

  const removeDishFromShift = (dateIdx, shift, dishId) => {
    setEventDates(
      eventDates.map((d, i) => {
        if (i !== dateIdx) return d;
        const shiftData = { ...d.shifts[shift] };
        shiftData.dishes = shiftData.dishes.filter((dd) => dd.id !== dishId);
        return { ...d, shifts: { ...d.shifts, [shift]: shiftData } };
      })
    );
  };

  const updateDishQty = (dateIdx, shift, dishId, quantity) => {
    const val = quantity === "" ? "" : Math.max(0, parseInt(quantity) || 0);
    setEventDates(
      eventDates.map((d, i) => {
        if (i !== dateIdx) return d;
        const shiftData = { ...d.shifts[shift] };
        shiftData.dishes = shiftData.dishes.map((dd) =>
          dd.id === dishId ? { ...dd, quantity: val } : dd
        );
        return { ...d, shifts: { ...d.shifts, [shift]: shiftData } };
      })
    );
  };

  // --- Services ---
  const toggleService = (service) => {
    const existing = selectedServices.find((s) => s.id === service.id);
    if (existing) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
    }
  };

  const updateServiceQuantity = (serviceId, quantity) => {
    const val = quantity === "" ? "" : Math.max(0, parseInt(quantity) || 0);
    setSelectedServices(
      selectedServices.map((s) => (s.id === serviceId ? { ...s, quantity: val } : s))
    );
  };

  // --- Totals ---
  const calculateDishTotal = () => {
    let total = 0;
    eventDates.forEach((ed) => {
      Object.values(ed.shifts).forEach((shiftData) => {
        shiftData.dishes.forEach((dish) => {
          total += dish.price * (parseInt(dish.quantity) || 0);
        });
      });
    });
    return total;
  };

  const calculateServiceTotal = () =>
    selectedServices.reduce((sum, s) => sum + s.price * (parseInt(s.quantity) || 0), 0);

  const calculateTotal = () => calculateDishTotal() + calculateServiceTotal();

  // --- Count total dishes selected ---
  const totalDishCount = () => {
    let count = 0;
    eventDates.forEach((ed) => {
      Object.values(ed.shifts).forEach((shiftData) => {
        count += shiftData.dishes.length;
      });
    });
    return count;
  };

  // --- Category toggle in picker ---
  const toggleCategory = (key) => {
    setExpandedCats((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // --- PDF ---
  const handleGeneratePDF = async () => {
    if (!formData.customerName) {
      showToast("Please fill customer name", "error");
      return;
    }
    const hasDate = eventDates.some((ed) => ed.date);
    if (!hasDate) {
      showToast("Please add at least one event date", "error");
      return;
    }
    if (totalDishCount() === 0) {
      showToast("Please select at least one dish", "error");
      return;
    }

    // Validate quantities
    for (const ed of eventDates) {
      for (const [shift, shiftData] of Object.entries(ed.shifts)) {
        for (const dish of shiftData.dishes) {
          if (!dish.quantity && dish.quantity !== 0) {
            showToast(`Enter quantity for "${dish.name}" in ${shift} on ${ed.date}`, "error");
            return;
          }
          if (parseInt(dish.quantity) === 0) {
            showToast(`Quantity for "${dish.name}" cannot be 0`, "error");
            return;
          }
        }
      }
    }
    for (const s of selectedServices) {
      if (!s.quantity && s.quantity !== 0) {
        showToast(`Enter quantity for "${s.name}"`, "error");
        return;
      }
      if (parseInt(s.quantity) === 0) {
        showToast(`Quantity for "${s.name}" cannot be 0`, "error");
        return;
      }
    }

    setLoading(true);
    try {
      const quotationData = {
        ...formData,
        eventDates,
        services: selectedServices,
        total: calculateTotal(),
        quotationNumber: `QT-${Date.now()}`,
        date: new Date().toLocaleDateString(),
      };

      const pdfBytes = await generateQuotationPDF(quotationData);
      await savePdfFile(pdfBytes, `Quotation_${formData.customerName}_${Date.now()}.pdf`);

      await saveQuotation({
        id: quotationData.quotationNumber,
        ...quotationData,
        createdAt: Date.now(),
      });

      showToast("Quotation saved & PDF generated!", "success");
    } catch (error) {
      console.error("PDF generation error:", error);
      showToast("Failed to generate PDF", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- Helpers for dish picker ---
  const isPickerOpen = (dateIdx, shift) => activePicker === `${dateIdx}-${shift}`;
  const openPicker = (dateIdx, shift) => {
    setActivePicker(activePicker === `${dateIdx}-${shift}` ? null : `${dateIdx}-${shift}`);
    setExpandedCats({});
  };

  const getShiftDishIds = (dateIdx, shift) => {
    const shiftData = eventDates[dateIdx]?.shifts?.[shift];
    return shiftData ? shiftData.dishes.map((d) => d.id) : [];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-3 mb-5 sm:mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">
            Create Quotation
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-0.5">
            Generate professional catering quotation
          </p>
        </div>
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition shrink-0"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Customer Details */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
          Customer Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input type="text" placeholder="Customer Name *" value={formData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)} className={inputClass} />
          <input type="tel" placeholder="Phone Number" value={formData.customerPhone}
            onChange={(e) => handleInputChange("customerPhone", e.target.value)} className={inputClass} />
          <input type="text" placeholder="Address" value={formData.customerAddress}
            onChange={(e) => handleInputChange("customerAddress", e.target.value)} className={inputClass} />
          <select value={formData.eventType}
            onChange={(e) => handleInputChange("eventType", e.target.value)} className={inputClass}>
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Corporate Event</option>
            <option>Party</option>
            <option>Anniversary</option>
            <option>Other</option>
          </select>
          <input type="number" placeholder="Number of Guests" value={formData.numberOfGuests}
            onChange={(e) => handleInputChange("numberOfGuests", e.target.value)} className={inputClass} />
        </div>
      </div>

      {/* Event Dates & Shifts */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
            Event Dates & Menu
          </h3>
          <button onClick={addDate}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition">
            <CalendarPlus className="w-4 h-4" /> Add Date
          </button>
        </div>

        <div className="space-y-4">
          {eventDates.map((ed, dateIdx) => (
            <div key={dateIdx} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
              {/* Date header */}
              <div className="flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-gray-50 dark:bg-gray-700/50">
                <input type="date" value={ed.date}
                  onChange={(e) => updateDate(dateIdx, e.target.value)}
                  className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm focus:ring-2 focus:ring-orange-500 outline-none" />
                {ed.date && (
                  <span className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 hidden sm:inline">
                    {new Date(ed.date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" })}
                  </span>
                )}
                {eventDates.length > 1 && (
                  <button onClick={() => removeDate(dateIdx)}
                    className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition">
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Shift toggles */}
              <div className="p-3 sm:p-4">
                <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">Select Shifts</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {SHIFTS.map((shift) => (
                    <button key={shift} onClick={() => toggleShift(dateIdx, shift)}
                      className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition ${
                        ed.shifts[shift]
                          ? "bg-orange-500 dark:bg-orange-600 text-white border-orange-500 dark:border-orange-600"
                          : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-orange-400"
                      }`}>
                      {shift}
                      {ed.shifts[shift] && ed.shifts[shift].dishes.length > 0 && (
                        <span className="ml-1.5 bg-white/30 px-1.5 rounded-full text-[10px]">
                          {ed.shifts[shift].dishes.length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Per-shift dish selection */}
                {Object.entries(ed.shifts).map(([shift, shiftData]) => (
                  <div key={shift} className="mb-3 last:mb-0">
                    <button onClick={() => openPicker(dateIdx, shift)}
                      className="flex items-center gap-2 w-full text-left p-2.5 sm:p-3 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition">
                      {isPickerOpen(dateIdx, shift) ? <ChevronDown className="w-4 h-4 text-orange-500" /> : <ChevronRight className="w-4 h-4 text-orange-500" />}
                      <span className="font-medium text-sm text-orange-700 dark:text-orange-300">{shift}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
                        {shiftData.dishes.length} dish{shiftData.dishes.length !== 1 ? "es" : ""}
                      </span>
                    </button>

                    {/* Dish picker (categorized) */}
                    {isPickerOpen(dateIdx, shift) && (
                      <div className="mt-2 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        {Object.entries(CATEGORIZED_DISHES).map(([category, dishes]) => {
                          const catKey = `${dateIdx}-${shift}-${category}`;
                          const isExpanded = expandedCats[catKey];
                          const selectedIds = getShiftDishIds(dateIdx, shift);
                          const selectedInCat = dishes.filter((d) => selectedIds.includes(d.id)).length;
                          return (
                            <div key={category}>
                              <button onClick={() => toggleCategory(catKey)}
                                className="flex items-center gap-2 w-full text-left px-3 py-2.5 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700 transition">
                                {isExpanded ? <ChevronDown className="w-3.5 h-3.5 text-gray-500" /> : <ChevronRight className="w-3.5 h-3.5 text-gray-500" />}
                                <span className="font-medium text-xs sm:text-sm text-gray-800 dark:text-gray-200">{category}</span>
                                {selectedInCat > 0 && (
                                  <span className="ml-auto text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded-full">{selectedInCat}</span>
                                )}
                              </button>
                              {isExpanded && (
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-2.5">
                                  {dishes.map((dish) => {
                                    const isSelected = selectedIds.includes(dish.id);
                                    return (
                                      <button key={dish.id} onClick={() => addDishToShift(dateIdx, shift, dish)}
                                        className={`p-2 sm:p-2.5 border rounded-lg text-left transition text-xs sm:text-sm ${
                                          isSelected
                                            ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-600 ring-1 ring-orange-400"
                                            : "border-gray-200 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                        }`}>
                                        <div className="font-medium text-gray-900 dark:text-gray-100 truncate">{dish.name}</div>
                                        <div className="text-orange-600 dark:text-orange-400 font-semibold mt-0.5">₹{dish.price}</div>
                                      </button>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Selected dishes for this shift */}
                    {shiftData.dishes.length > 0 && (
                      <div className="mt-2 space-y-1.5">
                        {shiftData.dishes.map((dish) => (
                          <div key={dish.id}
                            className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-2 sm:p-2.5 rounded-lg">
                            <div className="flex-1 min-w-0">
                              <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate block">{dish.name}</span>
                              <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">@ ₹{dish.price}</span>
                            </div>
                            <input type="number" value={dish.quantity}
                              onChange={(e) => updateDishQty(dateIdx, shift, dish.id, e.target.value)}
                              className="w-14 sm:w-16 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-1 text-center text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                              min="1" />
                            <span className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 w-16 sm:w-20 text-right">
                              ₹{dish.price * (parseInt(dish.quantity) || 0)}
                            </span>
                            <button onClick={() => removeDishFromShift(dateIdx, shift, dish.id)}
                              className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded shrink-0">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Services */}
      <div className="mb-6">
        <h3 className="font-semibold mb-3 text-gray-900 dark:text-gray-100 text-sm sm:text-base">
          Additional Services
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 mb-3">
          {ADDITIONAL_SERVICES.map((service) => {
            const isSelected = selectedServices.find((s) => s.id === service.id);
            return (
              <button key={service.id} onClick={() => toggleService(service)}
                className={`p-2.5 sm:p-3 border rounded-lg transition text-left ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-600"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}>
                <div className="font-medium text-xs sm:text-sm text-gray-900 dark:text-gray-100">{service.name}</div>
                <div className="text-orange-600 dark:text-orange-400 font-semibold mt-0.5 text-xs sm:text-sm">₹{service.price}</div>
              </button>
            );
          })}
        </div>

        {selectedServices.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 sm:p-4 space-y-1.5">
            {selectedServices.map((service) => (
              <div key={service.id}
                className="flex items-center gap-2 bg-white dark:bg-gray-800 p-2 sm:p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex-1 min-w-0">
                  <span className="text-xs sm:text-sm font-medium text-gray-900 dark:text-gray-100">{service.name}</span>
                  <span className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 ml-1.5">@ ₹{service.price}</span>
                </div>
                <input type="number" value={service.quantity}
                  onChange={(e) => updateServiceQuantity(service.id, e.target.value)}
                  className="w-14 sm:w-16 border border-gray-300 dark:border-gray-600 rounded px-1.5 py-1 text-center text-xs sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  min="1" />
                <span className="text-xs sm:text-sm font-semibold text-orange-600 dark:text-orange-400 w-16 sm:w-20 text-right">
                  ₹{service.price * (parseInt(service.quantity) || 0)}
                </span>
                <button onClick={() => toggleService(service)}
                  className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded shrink-0">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl p-4 sm:p-6 mb-5">
        <div className="flex justify-between items-center">
          <span className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-gray-100">Total</span>
          <span className="text-xl sm:text-3xl font-bold text-orange-600 dark:text-orange-400">
            ₹{calculateTotal().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button onClick={onBack}
          className="px-5 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition text-sm sm:text-base">
          Cancel
        </button>
        <button onClick={handleGeneratePDF}
          disabled={loading || totalDishCount() === 0}
          className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base font-semibold">
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 sm:w-5 sm:h-5" />
              Generate & Download PDF
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
