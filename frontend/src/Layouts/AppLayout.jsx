import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

export default function AppLayout({ children }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-app text-app transition-colors duration-300">

      {/* Glow Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="fixed top-3 right-3 z-50
                   w-12 h-12 rounded-full
                   flex items-center justify-center
                   transition-all duration-300
                   bg-white/80 dark:bg-gray-900/80
                   backdrop-blur shadow-lg hover:scale-110"
      >
        {isDark ? (
          <Moon className="text-indigo-300 moon-glow" />
        ) : (
          <Sun className="text-orange-400 sun-glow" />
        )}
      </button>

      {children}
    </div>
  );
}