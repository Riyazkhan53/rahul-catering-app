export default function Topbar({ greeting, onLogout, setSidebarOpen }) {
  return (
    <div className="flex justify-between items-center mb-6">

      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <h1 className="text-2xl font-bold">
          👋 {greeting}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          🔔
          <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 rounded-full text-white">
            3
          </span>
        </div>

        <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold">
          C
        </div>

        <button
          onClick={onLogout}
          className="bg-orange-500 text-white px-4 py-2 rounded-full"
        >
          Logout
        </button>
      </div>
    </div>
  );
}