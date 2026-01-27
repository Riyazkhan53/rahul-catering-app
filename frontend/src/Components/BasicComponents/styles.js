/* Glass Surface (Card / Container) */
export const glassCard =
  "rounded-3xl p-8 transition " +
  "bg-white/85 backdrop-blur-xl " +
  "shadow-[0_20px_40px_rgba(0,0,0,0.15)] " +
  "border border-white/40 " +
  "dark:bg-slate-900/80 dark:border-white/10 " +
  "dark:shadow-[0_20px_40px_rgba(0,0,0,0.6)]";

/* Input / Select / Textarea */
export const glassField =
  "w-full px-4 py-3 rounded-xl transition text-sm " +
  "bg-white/70 backdrop-blur-md " +
  "border border-gray-300 text-gray-900 " +
  "placeholder:text-gray-500 " +
  "focus:outline-none focus:ring-2 focus:ring-orange-400 " +
  "hover:border-gray-400 " +

  "dark:bg-slate-900/60 dark:border-gray-700 dark:text-gray-100 " +
  "dark:placeholder:text-gray-400 " +
  "dark:hover:border-gray-600 dark:focus:ring-orange-500";

export const glassDisabled =
  glassField +
  " opacity-60 cursor-not-allowed bg-gray-100 dark:bg-slate-800";

/* Labels */
export const labelStyle =
  "block mb-1 text-sm font-medium " +
  "text-gray-700 dark:text-gray-300";