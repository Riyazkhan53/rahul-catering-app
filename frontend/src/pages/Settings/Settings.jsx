import { useState } from "react";
import { Settings as SettingsIcon, Users, Shield } from "lucide-react";
import CreateChefModal from "./CreateUser"
import ChefListModal from "./UsersList";
import ChangePasswordModal from "./ChangePassword";
import RoleSettings from "../Setup/RoleSettings";

export default function Settings({ user }) {
  const [modal, setModal] = useState(null);

  if (user.role !== "admin") {
    return <div className="text-red-500 dark:text-red-400">Access Denied</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl">
          <SettingsIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Users/Roles Settings
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
            Manage users and roles
          </p>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Users className="w-4.5 h-4.5 text-blue-500" />
          User Management
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card title="➕ Create Chef" onClick={() => setModal("create")} />
          <Card title="👨‍🍳 Chef List" onClick={() => setModal("list")} />
          <Card title="🔐 Change Admin Password" onClick={() => setModal("password")} />
        </div>
      </div>

      {/* Role Management Section */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-5 sm:p-6 shadow-sm">
        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 mb-4">
          <Shield className="w-4.5 h-4.5 text-orange-500" />
          Role Management
        </h3>
        <RoleSettings />
      </div>

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
      className="cursor-pointer bg-white dark:bg-gray-800 p-5 sm:p-6 rounded-xl shadow-lg dark:shadow-gray-900/50 hover:shadow-xl dark:hover:shadow-gray-900/70 transition text-center text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 hover:scale-105 active:scale-95 border border-gray-100 dark:border-gray-700"
    >
      {title}
    </div>
  );
}