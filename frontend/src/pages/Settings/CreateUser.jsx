import { useState } from "react";
import Modal from "../../Components/Modal";
import { apiRequest } from "../../api/api";
import { useToast } from "../../context/ToastContext";

export default function CreateChefModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });
  const { showToast } = useToast();

  const submit = async () => {
    await apiRequest("/api/users/create-chef", {
      method: "POST",
      body: form,
      token: localStorage.getItem("token"),
    });

    showToast("Chef created successfully 👨‍🍳","success")
    onClose();
  };

  return (
    <Modal
      title="👨‍🍳 Create Chef Account"
      subtitle="Add a new chef login to the system"
      onClose={onClose}
    >
      <input
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        placeholder="Chef Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        placeholder="Temporary Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={submit}
        className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-semibold transition"
      >
        ➕ Create Chef
      </button>
    </Modal>
  );
}