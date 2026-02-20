import { useState, useRef, useEffect } from "react";
import { Menu, Wifi, WifiOff, Moon, Sun, LogOut, User, ArrowLeftRight } from "lucide-react";
import { useNetworkMode } from "../context/NetworkModeContext";
import { useTheme } from "../context/ThemeContext";

export default function Topbar({
  greeting,
  user,
  onLogout,
  onSwitchRole,
  onViewProfile,
  toggleSidebar,
  isDesktop,
}) {
  const { isOnlineMode, toggleMode } = useNetworkMode();
  const { isDark, toggleTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    if (profileOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [profileOpen]);

  const initial = (user?.name || user?.username || "U").charAt(0).toUpperCase();

  return (
    <div className="relative flex justify-between items-center px-2 sm:px-6 py-2 sm:py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">

      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
        <button
          onClick={toggleSidebar}
          className="p-1.5 sm:p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition shrink-0"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h1 className="text-xs sm:text-xl font-semibold truncate">
          👋 {greeting}
        </h1>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
        {/* Online / Offline Toggle */}
        <button
          onClick={toggleMode}
          title={isOnlineMode ? "Online — tap to go offline" : "Offline — tap to go online"}
          className={`flex items-center gap-1 px-2 py-1.5 sm:px-2.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            isOnlineMode
              ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
              : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600"
          }`}
        >
          {isOnlineMode ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
          <span className="hidden sm:inline">{isOnlineMode ? "Online" : "Offline"}</span>
        </button>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="p-1.5 sm:p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          {isDark ? (
            <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
          ) : (
            <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
          )}
        </button>

        <button className="relative text-lg sm:text-2xl hover:scale-110 transition">🔔</button>

        {/* Profile Icon + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen((v) => !v)}
            className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm hover:ring-2 hover:ring-orange-300 dark:hover:ring-orange-400 transition"
          >
            {initial}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-50 animate-in fade-in slide-in-from-top-2">
              {/* User info header */}
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                <p className="text-sm font-semibold truncate">{user?.name || user?.username || "User"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || "user"}</p>
              </div>

              {/* View Profile */}
              <button
                onClick={() => { setProfileOpen(false); onViewProfile?.(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
              >
                <User className="w-4 h-4 text-gray-500" />
                View Profile
              </button>

              {/* Switch Role */}
              <button
                onClick={() => { setProfileOpen(false); onSwitchRole?.(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition text-left"
              >
                <ArrowLeftRight className="w-4 h-4 text-gray-500" />
                Switch Role
              </button>

              <div className="border-t border-gray-100 dark:border-gray-700 my-1" />

              {/* Sign Out */}
              <button
                onClick={() => { setProfileOpen(false); onLogout(); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}