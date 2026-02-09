import { useState } from "react";
import { motion } from "framer-motion";
import { useToast } from "../context/ToastContext";

const DISHES = ["Idli", "Dosa", "Sambar", "Biryani", "Paneer Curry"];
const SERVICES = ["Morning", "Afternoon", "Evening", "Night"];

export default function CreateOrder({ setActiveTab }) {
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("");
  const [services, setServices] = useState([]);
  const [dishes, setDishes] = useState([]);
  const { showToast } = useToast();

  function toggle(value, list, setList) {
    setList(
      list.includes(value)
        ? list.filter(v => v !== value)
        : [...list, value]
    );
  }

  function generateOrderId() {
    return "#RCE" + Math.floor(1000 + Math.random() * 9000);
  }

  function handleCreate() {
    if (!date || !pax || services.length === 0 || dishes.length === 0) {
      showToast("Please fill Mandatory fields","error")
      return;
    }

    const newOrder = {
      id: generateOrderId(),
      date,
      pax,
      services,
      dishes,
    };

    const existing = JSON.parse(localStorage.getItem("orders")) || [];
    localStorage.setItem("orders", JSON.stringify([...existing, newOrder]));

    showToast(`Order ${newOrder.id} created`,"success")
    setActiveTab("orders");
  }

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="card p-6 sm:p-8 text-app shadow-xl max-w-xl w-full"
    >
      <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">🧾 New Order Details</h2>

      {/* Date */}
      <label className="block mb-4">
        <span className="font-medium text-gray-900 dark:text-gray-100">Order Date *</span>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        />
      </label>

      {/* Pax */}
      <label className="block mb-4">
        <span className="font-medium text-gray-900 dark:text-gray-100">Total Pax *</span>
        <input
          type="number"
          value={pax}
          onChange={e => setPax(e.target.value)}
          className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        />
      </label>

      {/* Services */}
      <div className="mb-4">
        <p className="font-medium mb-2 text-gray-900 dark:text-gray-100">Services *</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map(s => (
            <button
              key={s}
              onClick={() => toggle(s, services, setServices)}
              className={`px-3 py-1.5 rounded-full border text-sm sm:text-base transition ${
                services.includes(s)
                  ? "bg-orange-500 dark:bg-orange-600 text-white border-orange-500 dark:border-orange-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-orange-50 dark:hover:bg-orange-900/20"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes */}
      <div className="mb-6">
        <p className="font-medium mb-2 text-gray-900 dark:text-gray-100">Select Dishes *</p>
        <div className="flex flex-wrap gap-2">
          {DISHES.map(d => (
            <button
              key={d}
              onClick={() => toggle(d, dishes, setDishes)}
              className={`px-3 py-1.5 rounded-full border text-sm sm:text-base transition ${
                dishes.includes(d)
                  ? "bg-green-500 dark:bg-green-600 text-white border-green-500 dark:border-green-600"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-green-50 dark:hover:bg-green-900/20"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-2.5 sm:py-3 rounded-lg text-base sm:text-lg transition font-semibold"
      >
        ✅ Create Order
      </button>
    </motion.div>
  );
}