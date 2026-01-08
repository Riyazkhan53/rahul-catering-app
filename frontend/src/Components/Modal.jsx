export default function Modal({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-2xl animate-scaleIn">
        
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          {children}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t px-6 py-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}