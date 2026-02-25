import { motion } from "framer-motion";
import { ChefHat, UtensilsCrossed } from "lucide-react";

export default function ChefLoader({ size = "default", message = "Loading..." }) {
  const sizes = {
    small: { container: "w-24 h-24", icon: "w-8 h-8", text: "text-sm" },
    default: { container: "w-32 h-32", icon: "w-12 h-12", text: "text-base" },
    large: { container: "w-48 h-48", icon: "w-16 h-16", text: "text-lg" }
  };

  const s = sizes[size];

  return (
    <div className="flex flex-col items-center justify-center gap-6">
      {/* Chef Animation Container */}
      <div className={`${s.container} relative`}>
        {/* Chef Hat (stays at top) */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2"
          animate={{
            y: [0, -5, 0],
            rotate: [-2, 2, -2]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <ChefHat className={`${s.icon} text-orange-500`} />
        </motion.div>

        {/* Knife - Falls from top left */}
        <motion.div
          className="absolute left-1/4 top-0"
          animate={{
            y: ["-100%", "200%", "-100%"],
            rotate: [45, 135, 45],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 0.8, 1]
          }}
        >
          <svg
            className={`${s.icon} text-gray-600 dark:text-gray-300`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M12 4v12m-4-4 4 4 4-4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="16" x2="12" y2="22" />
          </svg>
        </motion.div>

        {/* Spoon - Falls from top right */}
        <motion.div
          className="absolute right-1/4 top-0"
          animate={{
            y: ["-100%", "200%", "-100%"],
            rotate: [-45, -135, -45],
            opacity: [0, 1, 1, 0]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 0.8, 1],
            delay: 0.3
          }}
        >
          <svg
            className={`${s.icon} text-gray-600 dark:text-gray-300`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2v20" />
            <path d="M8 2c-1.5 3-1.5 5 0 6 1.5 1 3 1 5 1 2 0 3.5 0 5-1 1.5-1 1.5-3 0-6" />
          </svg>
        </motion.div>

        {/* Chef Face - Center */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Face Circle */}
          <div className="relative">
            <motion.div
              className={`${s.icon} rounded-full bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 border-4 border-orange-400 dark:border-orange-500`}
            />
            
            {/* Eyes */}
            <motion.div
              className="absolute top-1/3 left-1/4 w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            <motion.div
              className="absolute top-1/3 right-1/4 w-2 h-2 bg-gray-800 dark:bg-gray-200 rounded-full"
              animate={{ scaleY: [1, 0.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
            
            {/* Smile - Animated */}
            <motion.div
              className="absolute bottom-1/4 left-1/2 -translate-x-1/2"
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: [0, 1],
                scale: [0.8, 1, 0.8]
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.5, 1]
              }}
            >
              <svg
                width="20"
                height="12"
                viewBox="0 0 20 12"
                fill="none"
                className="text-gray-800 dark:text-gray-200"
              >
                <motion.path
                  d="M 2 2 Q 10 10, 18 2"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 1] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    times: [0, 0.4, 1]
                  }}
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Hand Left - Catches knife */}
        <motion.div
          className="absolute bottom-0 left-1/4"
          animate={{
            y: [0, -10, 0],
            rotate: [-15, -25, -15]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 1]
          }}
        >
          <svg
            className="w-8 h-8 text-orange-400 dark:text-orange-500"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M23 7a8.44 8.44 0 0 0-5 1.31c-.36-.41-.73-.82-1.12-1.21l-.29-.27.14-.12a3.15 3.15 0 0 0 .9-3.49A3.9 3.9 0 0 0 14 1v2a2 2 0 0 1 1.76 1c.17.4 0 .84-.47 1.31-.07.08-.15.13-.22.2-3.5-3.73-6.73-5.51-9.89-5.51C2.54 0 1 1.54 1 4.14v.11c.12 4.93 4.74 8.58 7.83 9.87A7.91 7.91 0 0 0 17 17v6h2v-4.17c3.37-.53 6-3.59 6-7.28a7.77 7.77 0 0 0-.21-1.75z" />
          </svg>
        </motion.div>

        {/* Hand Right - Catches spoon */}
        <motion.div
          className="absolute bottom-0 right-1/4"
          animate={{
            y: [0, -10, 0],
            rotate: [15, 25, 15]
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            times: [0, 0.4, 1],
            delay: 0.3
          }}
        >
          <svg
            className="w-8 h-8 text-orange-400 dark:text-orange-500 scale-x-[-1]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M23 7a8.44 8.44 0 0 0-5 1.31c-.36-.41-.73-.82-1.12-1.21l-.29-.27.14-.12a3.15 3.15 0 0 0 .9-3.49A3.9 3.9 0 0 0 14 1v2a2 2 0 0 1 1.76 1c.17.4 0 .84-.47 1.31-.07.08-.15.13-.22.2-3.5-3.73-6.73-5.51-9.89-5.51C2.54 0 1 1.54 1 4.14v.11c.12 4.93 4.74 8.58 7.83 9.87A7.91 7.91 0 0 0 17 17v6h2v-4.17c3.37-.53 6-3.59 6-7.28a7.77 7.77 0 0 0-.21-1.75z" />
          </svg>
        </motion.div>

        {/* Sparkles when catching */}
        <motion.div
          className="absolute left-1/4 top-1/2"
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 1.7,
            ease: "easeOut"
          }}
        >
          <span className="text-yellow-400 text-2xl">✨</span>
        </motion.div>

        <motion.div
          className="absolute right-1/4 top-1/2"
          animate={{
            scale: [0, 1.5, 0],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            repeatDelay: 1.7,
            delay: 0.3,
            ease: "easeOut"
          }}
        >
          <span className="text-yellow-400 text-2xl">✨</span>
        </motion.div>

        {/* Pulsing background glow */}
        <motion.div
          className="absolute inset-0 -z-10 rounded-full bg-gradient-to-br from-orange-200/30 to-amber-200/30 dark:from-orange-500/10 dark:to-amber-500/10 blur-2xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Loading Text */}
      {message && (
        <motion.p
          className={`${s.text} font-semibold text-gray-700 dark:text-gray-300 text-center`}
          animate={{
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {message}
        </motion.p>
      )}

      {/* Animated dots */}
      <div className="flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-orange-500"
            animate={{
              y: [0, -10, 0],
              opacity: [0.3, 1, 0.3]
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    </div>
  );
}
