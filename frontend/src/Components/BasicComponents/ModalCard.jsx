export default function ModalCard({ title, onClose, children, footer }) {
  return (
    <div
      className="
        flex flex-col
        w-full max-h-[90vh]
        rounded-2xl
        bg-white/90 dark:bg-slate-900/80
        border border-white/40 dark:border-white/10
        shadow-[0_25px_50px_rgba(0,0,0,0.25)]
        backdrop-blur-md
      "
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>

        <button
          onClick={onClose}
          className="text-xl opacity-60 hover:opacity-100 transition"
        >
          ✕
        </button>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}