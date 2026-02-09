import { useState } from "react";
import Modal from "../../Components/Modal";
import { apiRequest } from "../../api/api";
import { useToast } from "../../context/ToastContext";

export default function ChangePasswordModal({ user, onClose }) {
  const [password, setPassword] = useState("");
   const { showToast } = useToast();

  const submit = async () => {
    await apiRequest("/api/users/change-password", {
      method: "POST",
      body: {
        userId: user.id,
        newPassword: password,
      },
      token: localStorage.getItem("token"),
    });

    showToast("Password updated 🔐","success")
    onClose();
  };

  return (
    <Modal
      title="🔐 Change Admin Password"
      subtitle="Update your admin login password"
      onClose={onClose}
    >
      <input
        type="password"
        className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-2.5 sm:py-3 rounded-xl text-base sm:text-lg font-semibold transition"
      >
        Update Password
      </button>
    </Modal>
  );
}