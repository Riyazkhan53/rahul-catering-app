import { useState } from "react";
import { apiRequest } from "../api/api";

function Login({ onLoginSuccess }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
  const data = await apiRequest("/api/auth/login", {
    method: "POST",
    body: { username, password },
  });

  localStorage.setItem("token", data.token);
  onLoginSuccess(data.user);
} catch (err) {
  console.error(err);
  res.status(500).json({ message: "Server error" });
}
};

    return (
        <div className="login-container">
            <form className="login-card" onSubmit={handleLogin}>
                <h1 className="login-title">Rahul Catering</h1>
                <p className="login-subtitle">Login to continue</p>

                <input
                    className="login-input"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    className="login-input"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p className="login-error">{error}</p>}

                <button className="primary-btn" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;