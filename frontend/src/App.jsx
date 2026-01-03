import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { apiRequest } from "./api/api";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  // 🔐 Check auth on page refresh
  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await apiRequest("/api/auth/me", {
          token,
        });
        setUser(data.user);
      } catch (err) {
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowLogin(false);
  };

  if (loading) return <p>Loading...</p>;

  // ✅ USER LOGGED IN → DASHBOARD
  if (user) {
    return <Dashboard onLogout={handleLogout} />;
  }

  // 🔐 LOGIN PAGE
  if (showLogin) {
    return <Login onLoginSuccess={setUser} />;
  }

  // 🌟 LANDING PAGE
  return (
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
  );
}

export default App;