import { motion } from "framer-motion";

export default function AddOrder({ setActiveTab }) {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md"
    >
      <div className="text-6xl mb-4">📝</div>

      <h2 className="text-2xl font-bold mb-2">
        Create a New Catering Order
      </h2>

      <p className="text-gray-500 mb-6">
        Plan, organize & manage catering orders with ease 👨‍🍳
      </p>

      <button
        onClick={() => setActiveTab("create-order")}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full text-lg transition"
      >
        ➕ Add New Order
      </button>
    </motion.div>
  );
}