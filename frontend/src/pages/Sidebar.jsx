import { X } from "lucide-react";

const MENU_CONFIG = {
  chef: [
    { key: "dashboard", label: "Dashboard" },
    { key: "menu", label: "Menu Catalogue"  },
    { key: "orders", label: "Orders Management" },
    
    { key: "add-order", label: "New Order ⭐" },
    { key: "listcreator", label: "Item/Menu List Creator" },
    {key: "invoice",label:"Invoice & Billing"}
  ],
  admin: [
    { key: "dashboard", label: "Dashboard" },
    { key: "orders", label: "Orders Management" },
    { key: "menu", label: "Menu & Items Catalogue" },
    { key: "settings", label: "Settings" },
    { key: "setup", label: "Setup" },
  ],
};

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  open,
  setOpen,
  isDesktop,
}) {
  const role = user?.role === "admin" ? "admin" : "chef";
  const menu = MENU_CONFIG[role];

  return (
    <>
      {/* Overlay for mobile only */}
      {!isDesktop && open && (
        <div
          className="fixed inset-0 bg-black/40 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64
        bg-gray-900 text-white
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <span className="text-xl font-bold">
            {role === "admin" ? "Admin Panel" : "Chef Panel"}
          </span>

          {/* Close button (desktop + mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-gray-800"
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2">
          {menu.map(item => (
            <div
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                if (!isDesktop) setOpen(false);
              }}
              className={`p-3 rounded cursor-pointer transition
                ${
                  activeTab === item.key
                    ? "bg-orange-500"
                    : "hover:bg-gray-800"
                }
              `}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}