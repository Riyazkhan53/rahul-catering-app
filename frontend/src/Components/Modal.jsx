import { createPortal } from "react-dom";

export default function Modal({ title, subtitle, children, onClose }) {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 dark:bg-black/70 px-3 sm:px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white dark:bg-gray-800 shadow-2xl dark:shadow-gray-900/80 animate-scaleIn">
        
        {/* Header */}
        <div className="border-b border-gray-200 dark:border-gray-700 px-5 sm:px-6 py-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Body */}
        <div className="px-5 sm:px-6 py-5 sm:py-6 space-y-4">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 px-5 sm:px-6 py-4">
          <button
            onClick={onClose}
            className="px-4 sm:px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}