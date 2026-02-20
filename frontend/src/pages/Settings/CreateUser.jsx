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
  const [hasAdminRole, setHasAdminRole] = useState(false);
  const { showToast } = useToast();

  const submit = async () => {
    try {
      await apiRequest("/api/users/create-chef", {
        method: "POST",
        body: {
          ...form,
          additional_roles: hasAdminRole ? ["admin"] : [],
        },
        token: localStorage.getItem("token"),
      });
      showToast("Chef created successfully 👨‍🍳", "success");
      onClose();
    } catch (err) {
      showToast(err.message || "Failed to create chef", "error");
    }
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
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        placeholder="Temporary Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <label className="flex items-center gap-3 cursor-pointer px-1">
        <input
          type="checkbox"
          checked={hasAdminRole}
          onChange={(e) => setHasAdminRole(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-400 cursor-pointer"
        />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Also grant Admin role
        </span>
      </label>

      <button
        onClick={submit}
        className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-semibold transition"
      >
        ➕ Create Chef
      </button>
    </Modal>
  );
}