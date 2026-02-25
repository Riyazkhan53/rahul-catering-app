import { useState } from "react";
import { motion } from "framer-motion";
import ChefLoader from "../../Components/ChefLoader";
import CateringLoader from "../../Components/CateringLoader";
import AnimatedPage from "../AnimatedPage";
import { Play, Pause, RotateCcw, RefreshCw } from "lucide-react";

export default function LoaderDemo() {
  const [size, setSize] = useState("default");
  const [message, setMessage] = useState("Loading...");
  const [showLoader, setShowLoader] = useState(true);
  const [showOverlay, setShowOverlay] = useState(false);
  const [activeTab, setActiveTab] = useState("catering"); // "catering" | "chef"
  const [cateringKey, setCateringKey] = useState(0);

  const messages = [
    "Loading...",
    "Preparing your order...",
    "Cooking something special...",
    "Getting ingredients ready...",
    "Setting up the kitchen...",
    "Preparing delicious moments...",
  ];

  return (
    <AnimatedPage>
      <div className="w-full max-w-5xl mx-auto p-6 space-y-6">

        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Loader Preview
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Switch between the two loaders to compare
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl w-fit mx-auto">
          <button
            onClick={() => setActiveTab("catering")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "catering"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            ✨ Brand Loader
          </button>
          <button
            onClick={() => setActiveTab("chef")}
            className={`px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
              activeTab === "chef"
                ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-md"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            🧑‍🍳 Chef Loader
          </button>
        </div>

        {/* ── BRAND LOADER TAB ── */}
        {activeTab === "catering" && (
          <div className="space-y-4">
            {/* Replay button */}
            <div className="flex justify-end">
              <button
                onClick={() => setCateringKey((k) => k + 1)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-medium text-sm transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Replay Animation
              </button>
            </div>

            {/* Preview */}
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-xl">
              <div className="relative min-h-[500px]">
                <CateringLoader key={cateringKey} />
              </div>
            </div>

            <p className="text-center text-xs text-gray-400 dark:text-gray-500">
              This plays on every app startup. Click "Replay Animation" to restart it.
            </p>
          </div>
        )}

        {/* ── CHEF LOADER TAB ── */}
        {activeTab === "chef" && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="card p-5 space-y-5">
              <div className="flex flex-wrap gap-4 items-end">
                {/* Size */}
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Size
                  </label>
                  <div className="flex gap-2">
                    {["small", "default", "large"].map((s) => (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                          size === s
                            ? "bg-orange-500 text-white shadow scale-105"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wide">
                    Message
                  </label>
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 text-sm"
                    placeholder="Enter loading message..."
                  />
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowLoader(false); setTimeout(() => setShowLoader(true), 50); }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gray-500 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Restart
                  </button>
                  <button
                    onClick={() => setShowOverlay(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
                  >
                    Full Screen
                  </button>
                </div>
              </div>

              {/* Preset messages */}
              <div className="flex flex-wrap gap-2">
                {messages.map((msg) => (
                  <button
                    key={msg}
                    onClick={() => setMessage(msg)}
                    className="px-3 py-1 text-xs rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 hover:bg-orange-200 transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="flex items-center justify-center min-h-[380px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700">
              {showLoader ? (
                <ChefLoader size={size} message={message} />
              ) : (
                <div className="text-center text-gray-400">
                  <p>Loader hidden</p>
                  <button onClick={() => setShowLoader(true)} className="mt-2 text-orange-500 text-sm underline">Show it</button>
                </div>
              )}
            </div>

            {/* Size Comparison */}
            <div className="card p-5">
              <h3 className="font-bold text-gray-800 dark:text-gray-200 mb-4">All Sizes</h3>
              <div className="grid grid-cols-3 gap-4">
                {["small", "default", "large"].map((s) => (
                  <div key={s} className="text-center space-y-3">
                    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">{s}</p>
                    <div className="flex items-center justify-center min-h-[200px] bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <ChefLoader size={s} message={s} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Full Screen Overlay for Chef Loader */}
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center z-50"
          onClick={() => setShowOverlay(false)}
        >
          <ChefLoader size="large" message={message} />
          <p className="mt-10 text-gray-400 text-sm">Tap anywhere to close</p>
        </motion.div>
      )}
    </AnimatedPage>
  );
}
