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
        className="w-full border rounded-lg px-4 py-3"
        placeholder="New Password"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={submit}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold"
      >
        Update Password
      </button>
    </Modal>
  );
}