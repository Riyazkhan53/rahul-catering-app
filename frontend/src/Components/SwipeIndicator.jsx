import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function SwipeIndicator({ direction, show }) {
  if (!show) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className={`fixed top-1/2 -translate-y-1/2 z-50 pointer-events-none
          ${direction === 'left' ? 'left-4' : 'right-4'}
        `}
      >
        <div className="bg-orange-500/80 dark:bg-orange-600/80 backdrop-blur-sm rounded-full p-4 shadow-2xl">
          {direction === 'left' ? (
            <ChevronLeft className="w-8 h-8 text-white" />
          ) : (
            <ChevronRight className="w-8 h-8 text-white" />
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
