export default function ThemeToggle({ isDark, toggleTheme }) {
  return (
    <button
      onClick={toggleTheme}
      className="
        fixed top-6 right-6 z-50
        w-10 h-10 rounded-full
        flex items-center justify-center
        bg-white/80 dark:bg-black/40
        shadow-md backdrop-blur
        transition-all
      "
      title="Toggle theme"
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}