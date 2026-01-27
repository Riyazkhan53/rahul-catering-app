export default function PrimaryButton({
  children,
  type = "button",
  loading = false,
  disabled = false,
  onClick,
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className="
        w-full py-2.5 rounded-xl font-semibold
        text-white
        bg-orange-500 hover:bg-orange-600
        active:scale-[0.98]
        transition
        focus:outline-none focus:ring-2 focus:ring-orange-400
        disabled:opacity-60 disabled:cursor-not-allowed
      "
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}