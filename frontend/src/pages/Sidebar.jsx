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
  Sparkles,
  LogOut,
  User,
  ArrowLeftRight,
} from "lucide-react";
import { useToast } from "../context/ToastContext";

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
    { key: "settings", label: "Users/Roles Settings", icon: Settings },
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
  onLogout,
  onViewProfile,
  onSwitchRole,
}) {
  const { showToast } = useToast();
  const role = user?.role === "admin" ? "admin" : "chef";
  const menu = MENU_CONFIG[role];
  const initial = (user?.name || user?.username || "U").charAt(0).toUpperCase();
  const allRoles = [user?.role, ...(user?.additional_roles || [])];
  const switchableRoles = [...new Set(allRoles)].filter(r => r && r !== user?.role);

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
        className={`fixed top-0 left-0 z-40 h-full flex flex-col
        w-64 sm:w-72 md:w-64
        bg-gray-900/80 dark:bg-gray-950/85 text-white
        backdrop-blur-xl backdrop-saturate-150
        border-r border-white/10
        shadow-[4px_0_24px_rgba(0,0,0,0.3)]
        transition-transform duration-300
        ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-white/10 bg-gradient-to-r from-orange-500/20 to-transparent">
          <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-orange-400 to-orange-200 bg-clip-text text-transparent">
            {role === "admin" ? "Admin Panel" : "Chef Panel"}
          </span>

          {/* Close button (desktop + mobile) */}
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 p-3 sm:p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 160px)' }}>
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
                  group relative flex items-center gap-3 p-2.5 sm:p-3 rounded-xl 
                  cursor-pointer transition-all duration-300 text-sm sm:text-base
                  ${isActive
                    ? "bg-gradient-to-r from-orange-500/90 to-orange-600/90 shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-105 translate-x-1 backdrop-blur-sm"
                    : "hover:bg-white/10 hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] hover:translate-x-1 hover:scale-[1.02]"
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
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-orange-300 to-white rounded-l-full shadow-[0_0_8px_rgba(255,255,255,0.6)]" />
                )}
              </div>
            );
          })}
        </nav>

        {/* Profile Section at bottom */}
        <div className="border-t border-white/10 p-3 sm:p-4">
          {/* User info */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{user?.name || user?.username || "User"}</p>
              <p className="text-xs text-gray-400 capitalize">{user?.role || "user"}</p>
            </div>
          </div>

          {/* Profile actions */}
          <div className="space-y-1">
            <button
              onClick={() => {
                onViewProfile?.();
                if (!isDesktop) setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
            >
              <User className="w-4 h-4 text-gray-400" />
              View Profile
            </button>
            {switchableRoles.map((r) => (
              <button
                key={r}
                onClick={async () => {
                  try {
                    await onSwitchRole?.(r);
                    showToast(`Switched to ${r}`, "success");
                  } catch {
                    showToast("Failed to switch role", "error");
                  }
                  if (!isDesktop) setOpen(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              >
                <ArrowLeftRight className="w-4 h-4 text-gray-400" />
                Switch to {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
            <button
              onClick={() => onLogout?.()}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}