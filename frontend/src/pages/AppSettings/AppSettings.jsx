import {
    Settings,
    Moon,
    Sun,
    RefreshCcw,
    AlertTriangle,
} from "lucide-react";

import ConfirmModal from "../../Components/ConfirmModal";
import { appSync, masterSync } from "../../sync/serviceSync";
import { useToast } from "../../context/ToastContext";
import { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { getSyncQCount } from "../../db/indexedDB";

export default function AppSettings() {
    const { showToast } = useToast();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();
    const [pendingCount, setPendingCount] = useState(0);
    const [appSyncing, setAppSyncing] = useState(false);
    const [appSyncStatus, setAppSyncStatus] = useState("");

    useEffect(() => {
        getSyncQCount().then(setPendingCount).catch(() => {});
    }, []);

    const handleAppSync = async () => {
        setAppSyncing(true);
        setAppSyncStatus("");
        try {
            await appSync(setAppSyncStatus);
            showToast("App sync completed", "success");
            setPendingCount(0);
        } catch (e) {
            showToast(e.message, "error");
        } finally {
            setAppSyncing(false);
            // Refresh count
            getSyncQCount().then(setPendingCount).catch(() => {});
        }
    };

    const handleMasterSync = async () => {
        try {
            await masterSync();
            showToast("Master sync completed", "success");
        } catch (e) {
            showToast(e.message, "error");
        } finally {
            setConfirmOpen(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">

            {/* Header */}
            <div className="flex items-center gap-3">
                <Settings className="text-orange-500" />
                <h1 className="text-2xl font-bold">App Settings</h1>
            </div>

            {/* 🎨 Appearance */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                    {isDark ? <Moon /> : <Sun />}
                    <h2 className="text-lg font-semibold">Appearance</h2>
                </div>

                <div className="flex items-center justify-between">
                    <p className="text-sm opacity-70">
                        Switch between light and dark mode
                    </p>

                    <button
                        onClick={toggleTheme}
                        className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition"
                    >
                        {isDark ? "Switch to Light" : "Switch to Dark"}
                    </button>
                </div>
            </div>

            {/* 🔁 App Sync */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6">
                <div className="flex items-center gap-3 mb-4">
                    <RefreshCcw />
                    <h2 className="text-lg font-semibold">App Sync</h2>
                    {pendingCount > 0 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                            {pendingCount} pending
                        </span>
                    )}
                </div>

                <p className="text-sm opacity-70 mb-2">
                    Sync offline data to server. Only enabled when there are pending items.
                </p>

                {appSyncStatus && (
                    <p className="text-xs text-orange-600 dark:text-orange-400 mb-3">
                        {appSyncStatus}
                    </p>
                )}

                <button
                    onClick={handleAppSync}
                    disabled={pendingCount === 0 || appSyncing}
                    className={`flex items-center gap-2 px-5 py-2 rounded-lg transition
                     ${pendingCount === 0 || appSyncing
                        ? "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                     }`}
                >
                    <RefreshCcw size={18} className={appSyncing ? "animate-spin" : ""} />
                    {appSyncing ? "Syncing…" : "Sync Offline Data"}
                </button>
            </div>

            {/* 🔥 Master Sync */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow p-6 border border-red-200 dark:border-red-500/20">
                <div className="flex items-center gap-3 mb-4 text-red-600">
                    <AlertTriangle />
                    <h2 className="text-lg font-semibold">Master Sync</h2>
                </div>

                <p className="text-sm text-red-500 mb-4">
                    This will clear all local data and replace it with server data.
                </p>

                <button
                    onClick={() => setConfirmOpen(true)}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg
                     bg-red-500 text-white hover:bg-red-600 transition"
                >
                    🔥 Reset & Sync from Server
                </button>
            </div>

            {/* Confirm Modal */}
            {confirmOpen && (
                <ConfirmModal
                    title="Reset Local Data?"
                    message="All offline data will be deleted and replaced with server data."
                    confirmText="Yes, Reset & Sync"
                    danger
                    onCancel={() => setConfirmOpen(false)}
                    onConfirm={async (setProgress, setStatusText) => {
                        try {
                            await masterSync(setProgress, setStatusText);
                            showToast("Master sync completed successfully", "success");
                        } catch (err) {
                            showToast(err.message, "error");
                        }
                        setConfirmOpen(false);
                    }}
                />
            )}
        </div>
    );
}