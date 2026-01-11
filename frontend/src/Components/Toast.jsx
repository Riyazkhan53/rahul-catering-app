import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from "lucide-react";

const CONFIG = {
  success: {
    icon: CheckCircle,
    gradient: "from-green-400 to-emerald-500",
    glow: "shadow-green-500/30",
  },
  error: {
    icon: XCircle,
    gradient: "from-red-400 to-rose-500",
    glow: "shadow-red-500/30",
  },
  warning: {
    icon: AlertTriangle,
    gradient: "from-yellow-400 to-orange-400",
    glow: "shadow-yellow-400/30",
  },
  info: {
    icon: Info,
    gradient: "from-blue-400 to-indigo-500",
    glow: "shadow-blue-500/30",
  },
};

export default function Toast({ message, type = "info" }) {
  const { icon: Icon, gradient, glow } = CONFIG[type] || CONFIG.info;

  return (
    <div
      className={`
        relative overflow-hidden min-w-[300px]
        rounded-xl backdrop-blur-xl
        bg-white/70 dark:bg-black/40
        border border-white/30 dark:border-white/10
        shadow-xl ${glow}
        animate-toastIn
      `}
    >
      {/* Gradient Accent */}
      <div
        className={`absolute left-0 top-0 h-full w-1.5 bg-gradient-to-b ${gradient}`}
      />

      {/* Content */}
      <div className="flex items-start gap-3 px-4 py-4">
        <div
          className={`p-2 rounded-full bg-gradient-to-br ${gradient} text-white`}
        >
          <Icon className="w-5 h-5" />
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">
            {message}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-black/10 dark:bg-white/10">
        <div
          className={`h-full bg-gradient-to-r ${gradient} animate-toastProgress`}
        />
      </div>
    </div>
  );
}