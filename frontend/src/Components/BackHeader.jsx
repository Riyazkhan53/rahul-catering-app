import { ArrowLeft } from "lucide-react";

export default function BackHeader({ title, onBack }) {
  return (
    <div className="flex items-center gap-4 mb-6">
      <button
        onClick={onBack}
        className="p-2 rounded-full hover:bg-white/10 transition"
        title="Back"
      >
        <ArrowLeft className="w-5 h-5 text-orange-400" />
      </button>

      <h2 className="text-2xl font-bold text-app flex items-center gap-2">
        {title}
      </h2>
    </div>
  );
}