import { useState } from "react";
import CreateChefModal from "./CreateUser"
import ChefListModal from "./UsersList";
import ChangePasswordModal from "./ChangePassword";

export default function Settings({ user }) {
  const [modal, setModal] = useState(null);

  if (user.role !== "admin") {
    return <div className="text-red-500 dark:text-red-400">Access Denied</div>;
  }

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
      
      <Card title="➕ Create Chef" onClick={() => setModal("create")} />
      <Card title="👨‍🍳 Chef List" onClick={() => setModal("list")} />
      <Card title="🔐 Change Admin Password" onClick={() => setModal("password")} />

      {modal === "create" && <CreateChefModal onClose={() => setModal(null)} />}
      {modal === "list" && <ChefListModal onClose={() => setModal(null)} />}
      {modal === "password" && (
        <ChangePasswordModal user={user} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

function Card({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition text-center text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 hover:scale-105 active:scale-95"
    >
      {title}
    </div>
  );
}