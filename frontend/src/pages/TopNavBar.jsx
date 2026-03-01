import { useState, useRef, useEffect } from "react";
import {
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
  Wifi,
  WifiOff,
  Moon,
  Sun,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";
import { useNetworkMode } from "../context/NetworkModeContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import MiniLoader from "../Components/MiniLoader";
import NotificationDropdown from "../Components/NotificationDropdown";
import { getRoleLabel } from "../utils/roleLabel";

const ALL_MENU_ITEMS = [
  { key: "dashboard", label: "Dashboard", shortLabel: "Home", icon: LayoutDashboard },
  { key: "order-requests", label: "Requests", shortLabel: "Requests", icon: Inbox },
  { key: "orders", label: "Orders", shortLabel: "Orders", icon: ClipboardList },
  { key: "menu", label: "Menu", shortLabel: "Menu", icon: UtensilsCrossed },
  { key: "add-order", label: "New Order", shortLabel: "New", icon: PlusCircle },
  { key: "listcreator", label: "List Creator", shortLabel: "Lists", icon: FileText },
  { key: "invoice", label: "Invoice", shortLabel: "Invoice", icon: Receipt },
  { key: "settings", label: "Settings", shortLabel: "Settings", icon: Settings },
  { key: "setup", label: "Setup", shortLabel: "Setup", icon: Wrench },
  { key: "appsettings", label: "App Settings", shortLabel: "App", icon: Sparkles },
];

const FALLBACK_TABS = {
  admin: ["dashboard", "order-requests", "orders", "menu", "settings", "setup", "appsettings"],
  chef: ["dashboard", "order-requests", "menu", "orders", "add-order", "listcreator", "invoice", "appsettings"],
};

export default function TopNavBar({
  user,
  activeTab,
  setActiveTab,
  onLogout,
  onViewProfile,
  onSwitchRole,
  allowedTabs,
}) {
  const { isOnlineMode, toggleMode } = useNetworkMode();
  const { isDark, toggleTheme } = useTheme();
  const { showToast } = useToast();
  const [profileOpen, setProfileOpen] = useState(false);
  const [switchingRole, setSwitchingRole] = useState(null);
  const dropdownRef = useRef(null);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const role = user?.role === "admin" ? "admin" : "chef";
  const rawTabs = allowedTabs && allowedTabs.length > 0
    ? allowedTabs
    : FALLBACK_TABS[role] || FALLBACK_TABS.chef;
  const tabKeys = rawTabs.includes("order-requests")
    ? rawTabs
    : (() => {
        const copy = [...rawTabs];
        const msgIdx = copy.indexOf("messages");
        copy.splice(msgIdx >= 0 ? msgIdx + 1 : 1, 0, "order-requests");
        return copy;
      })();

  const menu = tabKeys
    .map((key) => ALL_MENU_ITEMS.find((item) => item.key === key))
    .filter(Boolean);

  const initial = (user?.name || user?.username || "U").charAt(0).toUpperCase();
  const allRoles = [user?.role, ...(user?.additional_roles || [])];
  const switchableRoles = [...new Set(allRoles)].filter(r => r && r !== user?.role);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      if (el) el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, []);

  const scrollBy = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 160, behavior: "smooth" });
  };

  return (
    <div className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 shadow-sm">
      {switchingRole && (
        <MiniLoader variant="overlay" message={`Switching to ${getRoleLabel(switchingRole)}...`} />
      )}
      {/* Top row: branding + controls */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-1.5 sm:py-2">
        <span className="text-sm sm:text-base font-bold bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent truncate">
          {role === "admin" ? "Admin Panel" : "Chef Panel"}
        </span>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Online/Offline */}
          <button
            onClick={toggleMode}
            title={isOnlineMode ? "Online" : "Offline"}
            className={`flex items-center gap-1 px-2 py-1 sm:px-2.5 rounded-full text-xs font-semibold transition-all duration-200 ${
              isOnlineMode
                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
            }`}
          >
            {isOnlineMode ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isOnlineMode ? "Online" : "Offline"}</span>
          </button>

          {/* Theme */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {isDark
              ? <Moon className="w-4 h-4 text-indigo-400" />
              : <Sun className="w-4 h-4 text-orange-400" />
            }
          </button>

          <NotificationDropdown />

          {/* Profile */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProfileOpen(v => !v)}
              className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs hover:ring-2 hover:ring-orange-300 transition"
            >
              {initial}
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                  <p className="text-sm font-semibold truncate">{user?.name || user?.username || "User"}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{getRoleLabel(user?.role)}</p>
                </div>
                <button
                  onClick={() => { setProfileOpen(false); onViewProfile?.(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                >
                  <User className="w-4 h-4 text-gray-500" /> View Profile
                </button>
                {switchableRoles.map((r) => (
                  <button
                    key={r}
                    onClick={async () => {
                      setProfileOpen(false);
                      setSwitchingRole(r);
                      try { await onSwitchRole?.(r); showToast(`Switched to ${getRoleLabel(r)}`, "success"); }
                      catch { showToast("Failed to switch role", "error"); }
                      finally { setSwitchingRole(null); }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-gray-500" />
                    Switch to {getRoleLabel(r)}
                  </button>
                ))}
                <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                <button
                  onClick={() => { setProfileOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tab row: horizontally scrollable */}
      <div className="relative flex items-center">
        {canScrollLeft && (
          <button
            onClick={() => scrollBy(-1)}
            className="absolute left-0 z-10 p-1 bg-white/90 dark:bg-gray-900/90 border-r border-gray-200 dark:border-gray-700 shadow-sm rounded-r-lg"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex items-center gap-0.5 sm:gap-1 px-2 sm:px-3 pb-1.5 pt-0.5 overflow-x-auto hide-scrollbar w-full"
        >
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 shrink-0
                  ${isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                  }`}
              >
                <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? "text-white" : ""}`} />
                <span className="hidden sm:inline">{item.label}</span>
                <span className="sm:hidden">{item.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {canScrollRight && (
          <button
            onClick={() => scrollBy(1)}
            className="absolute right-0 z-10 p-1 bg-white/90 dark:bg-gray-900/90 border-l border-gray-200 dark:border-gray-700 shadow-sm rounded-l-lg"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>
    </div>
  );
}
