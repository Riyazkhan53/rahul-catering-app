import { motion } from "framer-motion";

/**
 * MiniLoader — reusable loader for API operations.
 *
 * Variants:
 *   "overlay"  → full-screen semi-transparent overlay with centered loader (default)
 *   "inline"   → small inline spinner for buttons / sections
 *   "section"  → centered loader within a parent container
 *
 * @param {string}  variant   - "overlay" | "inline" | "section"
 * @param {string}  message   - optional text below the spinner
 * @param {string}  className - extra classes for the wrapper
 */
export default function MiniLoader({ variant = "overlay", message, className = "" }) {
  // Inline: tiny spinner for inside buttons
  if (variant === "inline") {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <motion.span
          className="w-4 h-4 rounded-full border-2 border-t-transparent"
          style={{ borderColor: "currentColor", borderTopColor: "transparent" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
        />
        {message && <span className="text-sm">{message}</span>}
      </span>
    );
  }

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      {/* Gold themed spinner */}
      <div className="relative w-10 h-10">
        <motion.div
          className="absolute inset-0 rounded-full border-[3px] border-transparent"
          style={{ borderTopColor: "#D4A017", borderRightColor: "#FFD70066" }}
          animate={{ rotate: 360 }}
          transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-1 rounded-full border-2 border-transparent"
          style={{ borderBottomColor: "#B8860B", borderLeftColor: "#FFD70044" }}
          animate={{ rotate: -360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
        />
        {/* Center dot */}
        <motion.div
          className="absolute top-1/2 left-1/2 w-1.5 h-1.5 -mt-[3px] -ml-[3px] rounded-full"
          style={{ background: "linear-gradient(135deg, #B8860B, #FFD700)" }}
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      {message && (
        <motion.p
          className="text-xs font-medium text-gray-500 dark:text-gray-400"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          {message}
        </motion.p>
      )}
    </div>
  );

  // Section: centered within parent, no overlay
  if (variant === "section") {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        {spinner}
      </div>
    );
  }

  // Overlay: full-screen semi-transparent backdrop
  return (
    <motion.div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/20 dark:bg-black/40 backdrop-blur-[2px] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl px-8 py-6 flex flex-col items-center gap-3"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {spinner}
      </motion.div>
    </motion.div>
  );
}
