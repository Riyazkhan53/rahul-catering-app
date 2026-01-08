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
      setUser(null);
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
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  checkAuth();
}, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");   // 👈 THIS WAS MISSING
  setUser(null);
};

  if (loading) return <p>Loading...</p>;

  // ✅ USER LOGGED IN → DASHBOARD
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
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