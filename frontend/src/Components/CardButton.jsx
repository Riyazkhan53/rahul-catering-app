export default function CardButton({ icon: Icon, title, description, onClick }) {
  return (
    <button
      onClick={onClick}
      className="card p-6 text-left hover:scale-[1.02] transition
                 border border-white/20 shadow-md"
    >
      {Icon && <Icon className="w-8 h-8 mb-3 text-orange-500" />}

      <h3 className="text-lg font-semibold text-app">{title}</h3>
      <p className="text-sm opacity-70 mt-1">{description}</p>
    </button>
  );
}