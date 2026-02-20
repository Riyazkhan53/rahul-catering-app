import { Menu, Wifi, WifiOff, LogOut, Moon, Sun } from "lucide-react";
import { useNetworkMode } from "../context/NetworkModeContext";
import { useTheme } from "../context/ThemeContext";

export default function Topbar({
  greeting,
  onLogout,
  toggleSidebar,
  isDesktop,
}) {
  const { isOnlineMode, toggleMode } = useNetworkMode();
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="flex justify-between items-center px-2 sm:px-6 py-2 sm:py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 overflow-hidden">

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

        <div className="w-7 h-7 sm:w-9 sm:h-9 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm">
          C
        </div>

        {/* Logout: icon on mobile, button on desktop */}
        <button
          onClick={onLogout}
          title="Logout"
          className="sm:hidden p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition"
        >
          <LogOut className="w-4 h-4" />
        </button>
        <button
          onClick={onLogout}
          className="hidden sm:block bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-4 py-2 rounded-full text-sm sm:text-base transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}