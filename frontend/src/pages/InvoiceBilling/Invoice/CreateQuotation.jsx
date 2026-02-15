import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Download, X } from "lucide-react";
import { generateQuotationPDF } from "../../../utils/generateQuotationPDF";
import { savePdfFile } from "../../../utils/savePdf";
import { saveQuotation } from "../../../db/indexedDB";
import { useToast } from "../../../context/ToastContext";

// Sample dishes for catering
const SAMPLE_DISHES = [
  { id: 1, name: "Veg Biryani", category: "Main Course", price: 150 },
  { id: 2, name: "Chicken Biryani", category: "Main Course", price: 200 },
  { id: 3, name: "Paneer Butter Masala", category: "Main Course", price: 180 },
  { id: 4, name: "Dal Makhani", category: "Main Course", price: 120 },
  { id: 5, name: "Butter Naan", category: "Bread", price: 40 },
  { id: 6, name: "Tandoori Roti", category: "Bread", price: 25 },
  { id: 7, name: "Raita", category: "Side Dish", price: 50 },
  { id: 8, name: "Green Salad", category: "Side Dish", price: 60 },
  { id: 9, name: "Gulab Jamun", category: "Dessert", price: 80 },
  { id: 10, name: "Ice Cream", category: "Dessert", price: 70 },
  { id: 11, name: "Masala Papad", category: "Starter", price: 50 },
  { id: 12, name: "Paneer Tikka", category: "Starter", price: 150 },
];

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

export default function CreateQuotation({ onBack }) {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    customerName: "",
    customerPhone: "",
    customerAddress: "",
    eventDate: "",
    eventType: "Wedding",
    numberOfGuests: "",
  });

  const [selectedDishes, setSelectedDishes] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const addDish = (dish) => {
    const existing = selectedDishes.find((d) => d.id === dish.id);
    if (existing) {
      setSelectedDishes(
        selectedDishes.map((d) =>
          d.id === dish.id ? { ...d, quantity: d.quantity + 1 } : d
        )
      );
    } else {
      setSelectedDishes([...selectedDishes, { ...dish, quantity: 1 }]);
    }
  };

  const removeDish = (dishId) => {
    setSelectedDishes(selectedDishes.filter((d) => d.id !== dishId));
  };

  const updateQuantity = (dishId, quantity) => {
    if (quantity <= 0) {
      removeDish(dishId);
      return;
    }
    setSelectedDishes(
      selectedDishes.map((d) =>
        d.id === dishId ? { ...d, quantity: parseInt(quantity) } : d
      )
    );
  };

  const toggleService = (service) => {
    const existing = selectedServices.find((s) => s.id === service.id);
    if (existing) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, { ...service, quantity: 1 }]);
    }
  };

  const updateServiceQuantity = (serviceId, quantity) => {
    if (quantity <= 0) {
      setSelectedServices(selectedServices.filter((s) => s.id !== serviceId));
      return;
    }
    setSelectedServices(
      selectedServices.map((s) =>
        s.id === serviceId ? { ...s, quantity: parseInt(quantity) } : s
      )
    );
  };

  const calculateTotal = () => {
    const dishTotal = selectedDishes.reduce(
      (sum, dish) => sum + dish.price * dish.quantity,
      0
    );
    const serviceTotal = selectedServices.reduce(
      (sum, service) => sum + service.price * service.quantity,
      0
    );
    return dishTotal + serviceTotal;
  };

  const handleGeneratePDF = async () => {
    if (!formData.customerName || !formData.eventDate || selectedDishes.length === 0) {
      showToast("Please fill customer name, event date and select at least one dish", "error");
      return;
    }

    setLoading(true);

    try {
      const quotationData = {
        ...formData,
        dishes: selectedDishes,
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

      showToast("Quotation saved & PDF generated successfully!", "success");
    } catch (error) {
      console.error("PDF generation error:", error);
      showToast("Failed to generate PDF. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            📋 Create Quotation
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Generate professional catering quotation
          </p>
        </div>
        <button
          onClick={onBack}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Customer Details */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Customer Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name *"
            value={formData.customerName}
            onChange={(e) => handleInputChange("customerName", e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.customerPhone}
            onChange={(e) => handleInputChange("customerPhone", e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          />
          <input
            type="text"
            placeholder="Address"
            value={formData.customerAddress}
            onChange={(e) => handleInputChange("customerAddress", e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          />
          <input
            type="date"
            placeholder="Event Date *"
            value={formData.eventDate}
            onChange={(e) => handleInputChange("eventDate", e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          />
          <select
            value={formData.eventType}
            onChange={(e) => handleInputChange("eventType", e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          >
            <option>Wedding</option>
            <option>Birthday</option>
            <option>Corporate Event</option>
            <option>Party</option>
            <option>Anniversary</option>
            <option>Other</option>
          </select>
          <input
            type="number"
            placeholder="Number of Guests"
            value={formData.numberOfGuests}
            onChange={(e) => handleInputChange("numberOfGuests", e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          />
        </div>
      </div>

      {/* Dishes Selection */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Select Dishes
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
          {SAMPLE_DISHES.map((dish) => (
            <button
              key={dish.id}
              onClick={() => addDish(dish)}
              className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/20 transition text-left"
            >
              <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                {dish.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {dish.category}
              </div>
              <div className="text-orange-600 dark:text-orange-400 font-semibold mt-1">
                ₹{dish.price}
              </div>
            </button>
          ))}
        </div>

        {/* Selected Dishes */}
        {selectedDishes.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
              Selected Dishes
            </h4>
            <div className="space-y-2">
              {selectedDishes.map((dish) => (
                <div
                  key={dish.id}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {dish.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                      @ ₹{dish.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={dish.quantity}
                      onChange={(e) => updateQuantity(dish.id, e.target.value)}
                      className="w-20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      min="1"
                    />
                    <span className="font-semibold text-orange-600 dark:text-orange-400 w-24 text-right">
                      ₹{dish.price * dish.quantity}
                    </span>
                    <button
                      onClick={() => removeDish(dish.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Additional Services */}
      <div className="mb-8">
        <h3 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Additional Services
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          {ADDITIONAL_SERVICES.map((service) => {
            const isSelected = selectedServices.find((s) => s.id === service.id);
            return (
              <button
                key={service.id}
                onClick={() => toggleService(service)}
                className={`p-3 border rounded-lg transition text-left ${
                  isSelected
                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/30 dark:border-orange-600"
                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <div className="font-medium text-sm text-gray-900 dark:text-gray-100">
                  {service.name}
                </div>
                <div className="text-orange-600 dark:text-orange-400 font-semibold mt-1">
                  ₹{service.price}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Services */}
        {selectedServices.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h4 className="font-medium mb-3 text-gray-900 dark:text-gray-100">
              Selected Services
            </h4>
            <div className="space-y-2">
              {selectedServices.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg"
                >
                  <div className="flex-1">
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {service.name}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">
                      @ ₹{service.price}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={service.quantity}
                      onChange={(e) =>
                        updateServiceQuantity(service.id, e.target.value)
                      }
                      className="w-20 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      min="1"
                    />
                    <span className="font-semibold text-orange-600 dark:text-orange-400 w-24 text-right">
                      ₹{service.price * service.quantity}
                    </span>
                    <button
                      onClick={() => toggleService(service)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 rounded-lg p-6 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Total Amount
          </span>
          <span className="text-3xl font-bold text-orange-600 dark:text-orange-400">
            ₹{calculateTotal().toLocaleString()}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleGeneratePDF}
          disabled={loading || selectedDishes.length === 0}
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
              Generate & Download PDF
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
