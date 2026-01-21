import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { apiRequest } from "./api/api";
import AppLayout from "./Layouts/AppLayout";
import ThemeToggle from "./Components/ThemeToggle";
import CateringLoader from "./utils/welcomeScreen";

const getInitialTheme = () =>
  localStorage.getItem("theme") === "dark";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);
  const [isDark, setIsDark] = useState(getInitialTheme);

  // 🌗 GLOBAL THEME EFFECT
  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  // 🔐 AUTH CHECK
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me", {
          method: "GET",
          token,
        });
        setUser(data.user);
        localStorage.setItem("user", JSON.stringify(data.user));
      } catch {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    setShowLogin(false);
  };

  if (loading) return <CateringLoader />;

  return (
    <AppLayout>
      <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />

      {user ? (
        <Dashboard user={user} onLogout={handleLogout} />
      ) : showLogin ? (
        <Login onLoginSuccess={setUser} />
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
      )}
    </AppLayout>
  );
}

export default App;