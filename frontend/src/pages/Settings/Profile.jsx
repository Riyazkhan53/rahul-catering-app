import Modal from "../../Components/Modal";

export default function ProfileModal({ user, onClose }) {
  const initial = (user?.name || user?.username || "U").charAt(0).toUpperCase();

  return (
    <Modal title="My Profile" onClose={onClose}>
      <div className="flex flex-col items-center gap-4 py-2">
        {/* Avatar */}
        <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center text-white font-bold text-3xl shadow-lg">
          {initial}
        </div>

        {/* Info */}
        <div className="w-full space-y-3">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              Name
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {user?.name || "—"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              Login ID
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {user?.username || "—"}
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-4 py-3">
            <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
              Role
            </p>
            <p className="text-base font-semibold text-gray-900 dark:text-gray-100 capitalize">
              {user?.role || "—"}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
