import { motion } from "framer-motion";

export default function ConfirmModal({
    title = "Are you sure?",
    message = "This action cannot be undone.",
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    danger = false,
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
            />

            {/* Modal */}
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative w-full max-w-sm rounded-2xl shadow-xl p-6 bg-white dark:bg-gray-900"
            >
                {/* Title */}
                <h2 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
                    {title}
                </h2>

                {/* Message */}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {message}
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 rounded-lg text-sm font-medium
                       bg-gray-100 hover:bg-gray-200
                       dark:bg-gray-800 dark:hover:bg-gray-700
                       transition"
                    >
                        {cancelText}
                    </button>

                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition
              ${danger
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-orange-500 hover:bg-orange-600"
                            }`}
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </div>
    );
}