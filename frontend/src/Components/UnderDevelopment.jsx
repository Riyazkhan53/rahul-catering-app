import { Construction } from "lucide-react";

export default function UnderDevelopment({
  title = "Feature Under Development",
  subtitle = "We’re working hard to bring this feature to you."
}) {
  return (
    <div className="w-full h-[60vh] flex items-center justify-center">
      <div className="card p-10 text-center max-w-md animate-scaleIn">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-orange-100 dark:bg-orange-500/20">
            <Construction className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold mb-2 text-app">
          {title}
        </h2>

        {/* Subtitle */}
        <p className="text-sm opacity-70">
          {subtitle}
        </p>

        {/* Badge */}
        <div className="mt-6 inline-block px-4 py-1 rounded-full text-xs font-semibold
                        bg-orange-500/10 text-orange-500">
          🚧 Coming Soon
        </div>
      </div>
    </div>
  );
}