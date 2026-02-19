import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ListPrintRoute from "./print/listPrintRoute";

import { apiRequest, isOfflineMode } from "./api/api";
import AppLayout from "./Layouts/AppLayout";
import CateringLoader from "./Components/CateringLoader";
import UpdatePrompt from "./Components/UpdatePrompt";
import { syncPendingItems, pullItemsFromServer } from "./sync/itemSync";

const getInitialTheme = () =>
  localStorage.getItem("theme") === "dark";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isDark, setIsDark] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      // In offline mode, restore user from localStorage without API call
      if (isOfflineMode() || !navigator.onLine) {
        try {
          const cached = JSON.parse(localStorage.getItem("user"));
          if (cached) {
            setUser(cached);
          }
        } catch {}
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me");
        setUser(data.user);
      } catch {
        // If API fails but we have a cached user, use it instead of clearing
        try {
          const cached = JSON.parse(localStorage.getItem("user"));
          if (cached) {
            setUser(cached);
            setLoading(false);
            return;
          }
        } catch {}
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleOnline = () => {
    syncPendingItems();
    // pullItemsFromServer();
  };

  const handleLogout = () => {
    const networkMode = localStorage.getItem("networkMode");
    const theme = localStorage.getItem("theme");
    localStorage.clear();
    if (networkMode) localStorage.setItem("networkMode", networkMode);
    if (theme) localStorage.setItem("theme", theme);
    setUser(null);
    setShowLogin(false);
  };

  if (loading) {
    return (
      <div className="fade-in">
        <CateringLoader />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <UpdatePrompt />
      <AppLayout isDark={isDark}>
        {!user ? (
          showLogin ? (
            <Login onLoginSuccess={setUser} handleOnline={handleOnline} />
          ) : (
            <div className="app-container min-h-screen flex items-center justify-center px-4">
              <div className="app-card card p-8 sm:p-12 max-w-lg w-full text-center rounded-3xl shadow-2xl">
                <div className="logo-circle text-6xl sm:text-7xl mb-6">🍽️</div>
                <h1 className="app-title text-3xl sm:text-4xl font-bold mb-4 text-app">Rahul Catering & Events</h1>
                <p className="app-tagline text-base sm:text-lg opacity-80 mb-8 text-app">
                  Delicious moments for every occasion
                </p>
                <button
                  className="primary-btn bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-all hover:scale-105"
                  onClick={() => setShowLogin(true)}
                >
                  Enter App →
                </button>
              </div>
            </div>
          )
        ) : (
          <Routes>
            {/* Existing dashboard */}
            <Route
              path="/*"
              element={<Dashboard user={user} onLogout={handleLogout} />}
            />

            {/* PRINT PREVIEW ROUTE */}
            <Route
              path="/print/list/:id"
              element={<ListPrintRoute />}
            />
          </Routes>
        )}
      </AppLayout>
    </BrowserRouter>
  );
}

export default App;