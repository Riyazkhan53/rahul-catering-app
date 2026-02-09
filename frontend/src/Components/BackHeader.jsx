import { ArrowLeft } from "lucide-react";

export default function BackHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
      <button
        onClick={onBack}
        className="p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-700 transition"
        title="Back"
      >
        <ArrowLeft className="w-5 h-5 text-orange-400 dark:text-orange-500" />
      </button>

      <h2 className="text-xl sm:text-2xl font-bold text-app flex items-center gap-2">
        {title}
      </h2>
    </div>
  );
}