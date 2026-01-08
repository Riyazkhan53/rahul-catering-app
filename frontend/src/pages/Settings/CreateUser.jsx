import { useState } from "react";
import Modal from "../../Components/Modal";
import { apiRequest } from "../../api/api";

export default function CreateChefModal({ onClose }) {
  const [form, setForm] = useState({
    name: "",
    username: "",
    password: "",
  });

  const submit = async () => {
    await apiRequest("/api/users/create-chef", {
      method: "POST",
      body: form,
      token: localStorage.getItem("token"),
    });

    alert("Chef created successfully 👨‍🍳");
    onClose();
  };

  return (
    <Modal
      title="👨‍🍳 Create Chef Account"
      subtitle="Add a new chef login to the system"
      onClose={onClose}
    >
      <input
        className="w-full border rounded-lg px-4 py-3"
        placeholder="Chef Name"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className="w-full border rounded-lg px-4 py-3"
        placeholder="Username"
        onChange={(e) => setForm({ ...form, username: e.target.value })}
      />

      <input
        type="password"
        className="w-full border rounded-lg px-4 py-3"
        placeholder="Temporary Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button
        onClick={submit}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl text-lg font-semibold"
      >
        ➕ Create Chef
      </button>
    </Modal>
  );
}