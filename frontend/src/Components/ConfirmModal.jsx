import { createPortal } from "react-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useState } from "react";

export default function ConfirmModal({
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  danger = false,
}) {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      setProgress(10);

      await onConfirm(setProgress); // 
      setProgress(100);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm rounded-2xl shadow-xl p-5 sm:p-6
                   bg-white dark:bg-gray-900"
      >
        {/* Title */}
        <h2 className="text-base sm:text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">{title}</h2>

        {/* Message */}
        <p className="text-sm opacity-70 mb-4 text-gray-700 dark:text-gray-300">{message}</p>

        {/* Progress Bar */}
        {loading && (
          <div className="mb-4">
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div
                className={`h-full ${
                  danger ? "bg-red-500" : "bg-orange-500"
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut", duration: 0.4 }}
              />
            </div>
            <p className="text-xs mt-1 text-right opacity-60">
              {progress}%
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 sm:gap-3">
          <button
            disabled={loading}
            onClick={onCancel}
            className="px-3 sm:px-4 py-2 rounded-lg text-sm
                       bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300
                       disabled:opacity-50 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={handleConfirm}
            className={`px-3 sm:px-4 py-2 rounded-lg text-sm text-white
              flex items-center gap-2 transition disabled:opacity-50
              ${
                danger
                  ? "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                  : "bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
              }`}
          >
            {loading && (
              <Loader2 className="animate-spin" size={16} />
            )}
            {loading ? "Syncing..." : confirmText}
          </button>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}