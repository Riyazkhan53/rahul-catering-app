export default function AppLayout({ children, isDark, toggleTheme }) {
  return (
    <div className="min-h-screen bg-app text-app transition-colors duration-300">
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full bg-black/10 dark:bg-white/10"
      >
        {isDark ? "🌙" : "☀️"}
      </button>

      {children}
    </div>
  );
}