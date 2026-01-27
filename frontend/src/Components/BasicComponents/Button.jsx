export default function Button({
  children,
  variant = "primary",
  ...props
}) {
  const styles = {
    primary:
      "bg-gradient-to-r from-orange-400 to-orange-500 text-white " +
      "shadow-lg hover:shadow-xl",

    secondary:
      "bg-white/70 dark:bg-slate-800 text-gray-800 dark:text-gray-200 " +
      "border border-gray-300 dark:border-gray-700",

    danger:
      "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg",
  };

  return (
    <button
      className={`w-full py-3 rounded-xl font-semibold transition
        hover:-translate-y-0.5 active:translate-y-0
        ${styles[variant]}`}
      {...props}
    >
      {children}
    </button>
  );
}