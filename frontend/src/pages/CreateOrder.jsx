import { useState } from "react";
import { motion } from "framer-motion";

const DISHES = ["Idli", "Dosa", "Sambar", "Biryani", "Paneer Curry"];
const SERVICES = ["Morning", "Afternoon", "Evening", "Night"];

export default function CreateOrder({ setActiveTab }) {
  const [date, setDate] = useState("");
  const [pax, setPax] = useState("");
  const [services, setServices] = useState([]);
  const [dishes, setDishes] = useState([]);

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
      alert("Please fill all mandatory fields");
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

    alert(`Order ${newOrder.id} created`);
    setActiveTab("orders");
  }

  return (
    <motion.div
      initial={{ x: 20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full"
    >
      <h2 className="text-2xl font-bold mb-6">🧾 New Order Details</h2>

      {/* Date */}
      <label className="block mb-4">
        <span className="font-medium">Order Date *</span>
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      {/* Pax */}
      <label className="block mb-4">
        <span className="font-medium">Total Pax *</span>
        <input
          type="number"
          value={pax}
          onChange={e => setPax(e.target.value)}
          className="w-full mt-1 p-2 border rounded"
        />
      </label>

      {/* Services */}
      <div className="mb-4">
        <p className="font-medium mb-2">Services *</p>
        <div className="flex flex-wrap gap-2">
          {SERVICES.map(s => (
            <button
              key={s}
              onClick={() => toggle(s, services, setServices)}
              className={`px-3 py-1 rounded-full border ${
                services.includes(s)
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Dishes */}
      <div className="mb-6">
        <p className="font-medium mb-2">Select Dishes *</p>
        <div className="flex flex-wrap gap-2">
          {DISHES.map(d => (
            <button
              key={d}
              onClick={() => toggle(d, dishes, setDishes)}
              className={`px-3 py-1 rounded-full border ${
                dishes.includes(d)
                  ? "bg-green-500 text-white"
                  : "bg-gray-100"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleCreate}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-lg text-lg"
      >
        ✅ Create Order
      </button>
    </motion.div>
  );
}