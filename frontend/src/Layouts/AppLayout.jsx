import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function AppLayout({ children }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-app text-app transition-colors duration-300">

      {/* Glow Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-14 sm:top-3 right-2 sm:right-3 z-50
                   w-9 h-9 sm:w-12 sm:h-12 rounded-full
                   flex items-center justify-center
                   transition-all duration-300
                   bg-white/80 dark:bg-gray-900/80
                   backdrop-blur shadow-lg hover:scale-110"
      >
        {isDark ? (
          <Moon className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-300 moon-glow" />
        ) : (
          <Sun className="w-4 h-4 sm:w-6 sm:h-6 text-orange-400 sun-glow" />
        )}
      </button>

      {children}
    </div>
  );
}