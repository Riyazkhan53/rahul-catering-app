import { useEffect, useState } from "react";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setUser({ username: "admin" });
    }
    setLoading(false);
  }, []);

  if (loading) return <p>Loading...</p>;

  if (showLogin && !user) {
    return <Login onLoginSuccess={setUser} />;
  }

  if (user) {
    return <Dashboard onLogout={() => setUser(null)} />;
  }

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