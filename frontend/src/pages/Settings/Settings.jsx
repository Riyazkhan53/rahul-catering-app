import { useState } from "react";
import CreateChefModal from "./CreateUser"
import ChefListModal from "./UsersList";
import ChangePasswordModal from "./ChangePassword";

export default function Settings({ user }) {
  const [modal, setModal] = useState(null);

  if (user.role !== "admin") {
    return <div className="text-red-500">Access Denied</div>;
  }

  

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      
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
      className="cursor-pointer bg-white p-6 rounded-xl shadow hover:shadow-lg transition text-center text-lg font-semibold"
    >
      {title}
    </div>
  );
}