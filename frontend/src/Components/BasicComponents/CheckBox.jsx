export default function Checkbox({ checked, onChange, label }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
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