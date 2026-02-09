import { Wifi, WifiOff, RefreshCw } from "lucide-react";

export default function NetworkStatusBar({
  isOnline,
  syncing,
  onSync,
}) {
  return (
    <div className="absolute top-4 right-4 flex items-center gap-3">
      {/* Network Icon */}
      {isOnline ? (
        <Wifi
          size={20}
          className="text-green-600 dark:text-green-500"
          title="Online"
        />
      ) : (
        <WifiOff
          size={20}
          className="text-gray-400 dark:text-gray-500"
          title="Offline"
        />
      )}

      {/* Sync Button */}
      <button
        onClick={onSync}
        disabled={!isOnline || syncing}
        title="Sync login"
        className={`p-1 rounded-md transition 
          ${isOnline
            ? "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
            : "text-gray-300 dark:text-gray-600 cursor-not-allowed"}`}
      >
        <RefreshCw
          size={18}
          className={syncing ? "animate-spin" : ""}
        />
      </button>
    </div>
  );
}