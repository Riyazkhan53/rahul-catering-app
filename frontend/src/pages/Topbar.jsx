import { Menu } from "lucide-react";

export default function Topbar({
  greeting,
  onLogout,
  toggleSidebar,
  isDesktop,
}) {
  return (
    <div className="flex justify-between items-center px-6 py-4">

      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded hover:bg-black/10"
        >
          <Menu />
        </button>

        <h1 className="text-xl font-semibold">
          👋 {greeting}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative">🔔</button>

        <div className="w-9 h-9 bg-orange-500 rounded-full flex items-center justify-center text-white">
          C
        </div>

        <button
          onClick={onLogout}
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full mr-12"
        >
          Logout
        </button>
      </div>
    </div>
  );
}