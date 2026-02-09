import { motion } from "framer-motion";
import { ChefHat, UtensilsCrossed, Sparkles } from "lucide-react";

export default function CateringLoader() {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100 dark:from-gray-900 dark:via-orange-900/20 dark:to-gray-900 flex items-center justify-center z-50">
      <div className="relative">
        {/* Main cooking animation */}
        <div className="relative w-64 h-64 flex items-center justify-center">
          
          {/* Rotating plates background */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-1/2 left-1/2 w-8 h-8 bg-orange-200/30 dark:bg-orange-500/20 rounded-full"
                style={{
                  transform: `rotate(${i * 45}deg) translateY(-80px)`,
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.25,
                }}
              />
            ))}
          </motion.div>

          {/* Center chef hat with bounce */}
          <motion.div
            className="relative z-10 bg-white dark:bg-gray-800 rounded-full p-8 shadow-2xl"
            animate={{
              y: [0, -20, 0],
              rotate: [-5, 5, -5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <ChefHat className="w-24 h-24 text-orange-500 dark:text-orange-400" />
            </motion.div>
            
            {/* Steam effects */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute -top-2 left-1/2 w-2 h-2 bg-orange-300/40 dark:bg-orange-400/30 rounded-full"
                style={{ x: -4 + i * 4 }}
                animate={{
                  y: [-10, -40],
                  opacity: [0, 1, 0],
                  scale: [0.5, 1.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          {/* Orbiting utensils */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: -360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute top-0 left-1/2 -ml-6"
              whileHover={{ scale: 1.2 }}
            >
              <UtensilsCrossed className="w-12 h-12 text-orange-600 dark:text-orange-400" />
            </motion.div>
          </motion.div>

          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          >
            <motion.div
              className="absolute bottom-0 left-1/2 -ml-6"
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <div className="text-5xl">🍽️</div>
            </motion.div>
          </motion.div>

          {/* Sparkles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
              }}
            >
              <Sparkles className="w-4 h-4 text-amber-400 dark:text-yellow-300" />
            </motion.div>
          ))}
        </div>

        {/* Text animation */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 dark:from-orange-400 dark:to-amber-400 bg-clip-text text-transparent"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Rahul Catering
          </motion.h2>
          
          <motion.p
            className="mt-2 text-gray-600 dark:text-gray-400"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            Preparing delicious moments...
          </motion.p>

          {/* Loading dots */}
          <div className="flex justify-center gap-2 mt-4">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 bg-orange-500 dark:bg-orange-400 rounded-full"
                animate={{
                  y: [0, -12, 0],
                }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  delay: i * 0.15,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Floating food emojis */}
        <motion.div
          className="absolute top-10 left-0 text-4xl"
          animate={{
            y: [0, -20, 0],
            x: [0, 10, 0],
            rotate: [0, 10, 0],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          🍛
        </motion.div>

        <motion.div
          className="absolute top-20 right-0 text-4xl"
          animate={{
            y: [0, -15, 0],
            x: [0, -10, 0],
            rotate: [0, -10, 0],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          🥘
        </motion.div>

        <motion.div
          className="absolute bottom-20 left-10 text-4xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 15, 0],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        >
          🍲
        </motion.div>

        <motion.div
          className="absolute bottom-10 right-10 text-4xl"
          animate={{
            y: [0, -18, 0],
            x: [0, 8, 0],
            rotate: [0, -12, 0],
          }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        >
          🎂
        </motion.div>
      </div>
    </div>
  );
}
