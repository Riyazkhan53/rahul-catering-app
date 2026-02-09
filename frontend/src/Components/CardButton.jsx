export default function CardButton({ icon: Icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-4 sm:p-6 text-left hover:scale-[1.02] active:scale-[0.98] transition
                 border border-white/20 dark:border-gray-700 shadow-md"
    >
      {Icon && <Icon className="w-7 h-7 sm:w-8 sm:h-8 mb-3 text-orange-500 dark:text-orange-400" />}

      <h3 className="text-base sm:text-lg font-semibold text-app">{title}</h3>
      <p className="text-xs sm:text-sm opacity-70 mt-1">{description}</p>
    </button>
  );
}