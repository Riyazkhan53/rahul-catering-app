import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function ProtectedRoute({ user, onLoginSuccess, children }) {
  const token = localStorage.getItem("token");

  if (!token || !user) {
    return <Login onLoginSuccess={onLoginSuccess} />;
  }

  return children;
}

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ username: "admin" }); // later decode token
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setShowLogin(false);
  };

  if (loading) return <p>Loading...</p>;

  // 1️⃣ DASHBOARD (logged in)
  if (user) {
    return (
      <ProtectedRoute user={user} onLoginSuccess={setUser}>
        <Dashboard onLogout={handleLogout} />
      </ProtectedRoute>
    );
  }

  // 2️⃣ LOGIN SCREEN
  if (showLogin) {
    return <Login onLoginSuccess={setUser} />;
  }

  // 3️⃣ LANDING / START PAGE
  return (
    <div className="app-container">
      <div className="app-card">
        <div className="logo-circle">🍽️</div>

        <h1 className="app-title">Rahul Catering</h1>
        <h2 className="app-subtitle">& Events</h2>

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