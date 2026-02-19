import { createContext, useContext, useState, useEffect } from "react";

const NetworkModeContext = createContext();

export function NetworkModeProvider({ children }) {
  const [isOnlineMode, setIsOnlineMode] = useState(() => {
    const saved = localStorage.getItem("networkMode");
    if (saved === "offline") return false;
    if (saved === "online") return true;
    return navigator.onLine;
  });

  // Auto-switch to offline if internet drops
  useEffect(() => {
    const goOffline = () => {
      setIsOnlineMode(false);
      localStorage.setItem("networkMode", "offline");
    };
    const goOnline = () => {
      // Only auto-switch to online if user hasn't manually forced offline
      const saved = localStorage.getItem("networkMode");
      if (saved !== "offline") {
        setIsOnlineMode(true);
        localStorage.setItem("networkMode", "online");
      }
    };

    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);

    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  const toggleMode = () => {
    setIsOnlineMode((prev) => {
      const next = !prev;
      localStorage.setItem("networkMode", next ? "online" : "offline");
      return next;
    });
  };

  const setMode = (online) => {
    setIsOnlineMode(online);
    localStorage.setItem("networkMode", online ? "online" : "offline");
  };

  return (
    <NetworkModeContext.Provider value={{ isOnlineMode, toggleMode, setMode }}>
      {children}
    </NetworkModeContext.Provider>
  );
}

export function useNetworkMode() {
  const ctx = useContext(NetworkModeContext);
  if (!ctx) throw new Error("useNetworkMode must be used within NetworkModeProvider");
  return ctx;
}
