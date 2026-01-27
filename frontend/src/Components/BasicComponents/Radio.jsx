export default function Radio({ checked, onChange, label, name }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 accent-orange-500"
      />
      <span className="text-sm text-gray-700 dark:text-gray-300">
        {label}
      </span>
    </label>
  );
}