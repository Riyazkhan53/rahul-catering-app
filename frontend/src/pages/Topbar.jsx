import { Menu, Wifi, WifiOff } from "lucide-react";
import { useNetworkMode } from "../context/NetworkModeContext";

export default function Topbar({
  greeting,
  onLogout,
  toggleSidebar,
  isDesktop,
}) {
  const { isOnlineMode, toggleMode } = useNetworkMode();

  return (
    <div className="flex justify-between items-center px-3 sm:px-6 py-3 sm:py-4 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <h1 className="text-sm sm:text-xl font-semibold truncate max-w-[150px] sm:max-w-none">
          👋 {greeting}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Online / Offline Toggle */}
        <button
          onClick={toggleMode}
          title={isOnlineMode ? "Online — tap to go offline" : "Offline — tap to go online"}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
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

        <button className="relative text-xl sm:text-2xl hover:scale-110 transition">🔔</button>

        <div className="w-8 h-8 sm:w-9 sm:h-9 bg-orange-500 dark:bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
          C
        </div>

        <button
          onClick={onLogout}
          className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-sm sm:text-base mr-10 sm:mr-12 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}