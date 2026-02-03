import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ListPrintRoute from "./print/listPrintRoute";

import { apiRequest } from "./api/api";
import AppLayout from "./Layouts/AppLayout";
import CateringLoader from "./utils/welcomeScreen";
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

      try {
        const data = await apiRequest("/api/auth/me");
        setUser(data.user);
      } catch {
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
    localStorage.clear();
    setUser(null);
    setShowLogin(false);
  };

  if (loading) return <CateringLoader />;

  return (
    <BrowserRouter>
      <AppLayout isDark={isDark}>
        {!user ? (
          showLogin ? (
            <Login onLoginSuccess={setUser} handleOnline={handleOnline} />
          ) : (
            <div className="app-container">
              <div className="app-card">
                <div className="logo-circle">🍽️</div>
                <h1 className="app-title">Rahul Catering & Events</h1>
                <p className="app-tagline">
                  Delicious moments for every occasion
                </p>
                <button
                  className="primary-btn"
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