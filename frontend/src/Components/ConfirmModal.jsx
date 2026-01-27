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

      await onConfirm(setProgress); // 👈 pass progress setter
      setProgress(100);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative w-full max-w-sm rounded-2xl shadow-xl p-6
                   bg-white dark:bg-gray-900"
      >
        {/* Title */}
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        {/* Message */}
        <p className="text-sm opacity-70 mb-4">{message}</p>

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
        <div className="flex justify-end gap-3">
          <button
            disabled={loading}
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm
                       bg-gray-100 dark:bg-gray-800
                       disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg text-sm text-white
              flex items-center gap-2
              ${
                danger
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {loading && (
              <Loader2 className="animate-spin" size={16} />
            )}
            {loading ? "Syncing..." : confirmText}
          </button>
        </div>
      </motion.div>
    </div>
  );
}