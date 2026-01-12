import { X } from "lucide-react";

export default function Sidebar({
  user,
  activeTab,
  setActiveTab,
  open,
  setOpen,
  isDesktop,
}) {
  const menu = [
    { key: "dashboard", label: "Dashboard" },
    { key: "orders", label: "Orders" },
    { key: "menu", label: "Menu" },
    { key: "add-order", label: "Add New Order" },
    { key: "list", label: "Master List" },
  ];

  return (
    <>
      {/* Mobile overlay */}
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
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <span className="text-xl font-bold">
            {user?.role === "admin" ? "Admin Panel" : "Chef Panel"}
          </span>

          {/* Close on desktop & mobile */}
          <button
  onClick={() => setOpen(false)}
  className="absolute top-4 right-4"
>
  <X />
</button>
        </div>

        <nav className="p-4 space-y-2">
          {menu.map(item => (
            <div
              key={item.key}
              onClick={() => {
                setActiveTab(item.key);
                if (!isDesktop) setOpen(false);
              }}
              className={`p-3 rounded cursor-pointer
                ${activeTab === item.key
                  ? "bg-orange-500"
                  : "hover:bg-gray-800"}
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