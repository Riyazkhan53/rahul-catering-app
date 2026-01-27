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
import { useState } from "react";
import { useTheme } from "../../context/ThemeContext";


export default function AppSettings() {
    const { showToast } = useToast();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { isDark, toggleTheme } = useTheme();


    const handleAppSync = async () => {
        try {
            await appSync();
            showToast("App sync completed", "success");
        } catch (e) {
            showToast(e.message, "error");
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
                </div>

                <p className="text-sm opacity-70 mb-4">
                    Sync offline and online data safely without deleting local data.
                </p>

                <button
                    onClick={handleAppSync}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg
                     bg-orange-500 text-white hover:bg-orange-600 transition"
                >
                    <RefreshCcw size={18} />
                    Sync Offline & Online Data
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
                    onConfirm={async (setProgress) => {
                        await masterSync(setProgress);
                        showToast("Master sync completed", "success");
                        setConfirmOpen(false);
                    }}
                />
            )}
        </div>
    );
}