import { useState } from "react";
import { apiRequest } from "../api/api";
import { useToast } from "../context/ToastContext";
import NetworkStatusBar from "../Components/NetworkStatusBar";
import useNetworkStatus from "../hooks/useNetworkStatus";
import {
    saveAuthLogin,
    getOfflineAuth,
    isAuthExpired,
} from "../db/indexedDB";

function Login({ onLoginSuccess, handleOnline }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { showToast } = useToast();

    const isOnline = useNetworkStatus();
    const [syncing, setSyncing] = useState(false);

    async function handleManualSync() {
        if (navigator.onLine) {
            handleOnline()
        }
        if (!isOnline) return;

        try {
            setSyncing(true);
            const token = localStorage.getItem("token");
            if (!token) return;

            const data = await apiRequest("/api/auth/me", {
                method: "GET",
                token,
            });

            await saveAuthLogin({
                username: data.user.username,
                token,
            });
            showToast("Login synced successfully", "success");
        } catch {
            showToast("Sync failed", "error");
        } finally {
            setSyncing(false);
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // 🌐 ONLINE LOGIN
            if (isOnline) {
                const data = await apiRequest("/api/auth/login", {
                    method: "POST",
                    body: { username, password },
                });

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                // 💾 Save for offline use
                await saveAuthLogin({
                    username,
                    token: data.token,
                });
                handleOnline();

                onLoginSuccess(data.user);
                showToast("Logged in successfully", "success");
                return;
            }

            // 📴 OFFLINE LOGIN
            const cached = await getOfflineAuth(username);

            if (!cached || isAuthExpired(cached)) {
                throw new Error(
                    "Offline login not available. Please connect to internet."
                );
            }

            // Restore session from cache
            localStorage.setItem("token", cached.token);
            localStorage.setItem(
                "user",
                JSON.stringify({ username })
            );

            onLoginSuccess({ username });
            showToast("Offline login successful", "info");

        } catch (err) {
            setError(err.message || "Login failed");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-3 sm:px-4">
            {/* Network Status */}
            <div
                className="relative w-full max-w-md rounded-2xl shadow-xl p-6 sm:p-8 card"
                style={{ background: "var(--card-bg)" }}
            >
                <NetworkStatusBar
                    isOnline={isOnline}
                    syncing={syncing}
                    onSync={handleManualSync}
                />

                {/* Logo / Title */}
                <div className="text-center mb-6 sm:mb-8">
                    <div className="text-4xl sm:text-5xl mb-3">🍽️</div>
                    <h1 className="text-xl sm:text-2xl font-bold text-app">
                        Rahul Catering & Events
                    </h1>
                    <p className="opacity-70 text-sm sm:text-base">
                        Login to continue
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">

                    {/* Username */}
                    <div>
                        <label className="text-sm font-medium opacity-80">
                            Username
                        </label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="text-sm font-medium opacity-80">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 dark:focus:ring-orange-500 pr-12 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                                required
                            />

                            {/* Show / Hide Button */}
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-3 flex items-center text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 text-sm"
                            >
                                {showPassword ? "🙈" : "👁️"}
                            </button>
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="text-red-500 dark:text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 text-white py-2.5 sm:py-3 rounded-lg font-semibold transition disabled:opacity-60"
                    >
                        {loading
                            ? "Logging in..."
                            : isOnline
                                ? "Login"
                                : "Offline Login"}
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
                    Admin & Chef Access Only
                </div>
            </div>
        </div>
    );
}

export default Login;