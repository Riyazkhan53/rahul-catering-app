import { 
  X, 
  LayoutDashboard, 
  UtensilsCrossed, 
  ClipboardList, 
  PlusCircle, 
  FileText, 
  Receipt, 
  Settings, 
  Wrench,
  Sparkles 
} from "lucide-react";

const MENU_CONFIG = {
  chef: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "menu", label: "Menu Catalogue", icon: UtensilsCrossed },
    { key: "orders", label: "Orders Management", icon: ClipboardList },
    { key: "add-order", label: "New Order", icon: PlusCircle, badge: "⭐" },
    { key: "listcreator", label: "Item/Menu List Creator", icon: FileText },
    { key: "invoice", label: "Invoice & Billing", icon: Receipt },
    { key: "appsettings", label: "App Settings", icon: Sparkles },
  ],
  admin: [
    { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { key: "orders", label: "Orders Management", icon: ClipboardList },
    { key: "menu", label: "Menu & Items Catalogue", icon: UtensilsCrossed },
    { key: "settings", label: "Settings", icon: Settings },
    { key: "setup", label: "Setup", icon: Wrench },
    { key: "appsettings", label: "App Settings", icon: Sparkles },
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
        className={`fixed top-0 left-0 z-40 h-full
        w-64 sm:w-72 md:w-64
        bg-gray-900 dark:bg-gray-950 text-white
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-700 dark:border-gray-800">
          <span className="text-lg sm:text-xl font-bold">
            {role === "admin" ? "Admin Panel" : "Chef Panel"}
          </span>

          {/* Close button (desktop + mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="p-1 rounded hover:bg-gray-800 dark:hover:bg-gray-700"
          >
            <X />
          </button>
        </div>

        {/* Menu */}
        <nav className="p-3 sm:p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 80px)' }}>
          {menu.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            
            return (
              <div
                key={item.key}
                onClick={() => {
                  setActiveTab(item.key);
                  if (!isDesktop) setOpen(false);
                }}
                className={`
                  group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-lg 
                  cursor-pointer transition-all duration-300 text-sm sm:text-base
                  ${isActive
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 shadow-lg scale-105 translate-x-1"
                    : "hover:bg-gray-800 dark:hover:bg-gray-700 hover:translate-x-1 hover:scale-[1.02]"
                  }
                `}
                style={{
                  animationDelay: `${index * 50}ms`,
                  animationFillMode: 'backwards'
                }}
              >
                {/* Icon */}
                {Icon && (
                  <Icon 
                    className={`
                      w-5 h-5 transition-all duration-300
                      ${isActive 
                        ? "text-white scale-110 rotate-3" 
                        : "text-gray-400 group-hover:text-orange-400 group-hover:scale-110"
                      }
                    `}
                  />
                )}

                {/* Label */}
                <span className={`
                  flex-1 font-medium transition-all duration-300
                  ${isActive ? "text-white translate-x-0.5" : "text-gray-200 group-hover:text-white"}
                `}>
                  {item.label}
                </span>

                {/* Badge */}
                {item.badge && (
                  <span className={`
                    text-xs transition-all duration-300
                    ${isActive ? "scale-125 rotate-12" : "group-hover:scale-110 group-hover:rotate-6"}
                  `}>
                    {item.badge}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-l-full animate-pulse" />
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}