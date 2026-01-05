const MENU_CONFIG = {
  chef: [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "orders", label: "🧾 Orders" },
    { key: "menu", label: "🍽 Menu" },
    { key: "add-order", label: "➕ Add New Order" }
  ],
  admin: [
    { key: "dashboard", label: "📊 Dashboard" },
    { key: "orders", label: "🧾 Orders" },
    { key: "menu", label: "🍽 Menu" },
    { key: "settings", label: "⚙️ Settings" },
    { key: "setup", label: "🛠 Setup" },
  ],
};

export default function Sidebar({ activeTab, setActiveTab, open, setOpen }) {
  const role = localStorage.getItem("role") || "chef";
  const items = MENU_CONFIG[role];

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed md:static z-30 w-64 h-full bg-gray-900 text-white
        ${open ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform`}
      >
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          👨‍🍳 Chef Panel
        </div>

        <nav className="p-4 space-y-2">
          {items.map(item => (
            <div
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                setOpen(false);
              }}
              className={`p-2 rounded cursor-pointer transition
                ${
                  activeTab === item.key
                    ? "bg-orange-500"
                    : "hover:bg-gray-800"
                }`}
            >
              {item.label}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}