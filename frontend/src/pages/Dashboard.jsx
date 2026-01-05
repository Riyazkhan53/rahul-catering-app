function Dashboard({ onLogout }) {
  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
  };

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }

  const greeting = getGreeting();

  return (
    <div className="flex h-screen bg-gray-100">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-gray-700">
          👨‍🍳 Chef Panel
        </div>

        <nav className="flex-1 p-4 space-y-4">
          <div className="cursor-pointer hover:text-orange-400">📊 Dashboard</div>
          <div className="cursor-pointer hover:text-orange-400">🧾 Orders</div>
          <div className="cursor-pointer hover:text-orange-400">🍽 Menu</div>
          <div className="cursor-pointer hover:text-orange-400">⚙️ Settings</div>
        </nav>

        <div className="p-4 border-t border-gray-700 text-sm text-gray-400">
          Rahul Catering & Events
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">

        {/* TOP BAR */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold">
            👋 {greeting}, Chef!
          </h1>

          <button
            onClick={handleLogout}
            className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-full transition"
          >
            Logout
          </button>
        </div>

        {/* CENTER CARD */}
        <div className="flex justify-center items-center h-[70%]">
          <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
            
            <div className="text-7xl mb-4">🚧</div>

            <h2 className="text-2xl font-semibold mb-2">
              Dashboard Under Development
            </h2>

            <p className="text-gray-500 mb-6">
              Amazing features are cooking 👨‍🍳🔥  
              Stay tuned!
            </p>

            <div className="bg-orange-100 text-orange-600 py-2 rounded-lg font-medium">
              Tailwind Working 🚀
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default Dashboard;