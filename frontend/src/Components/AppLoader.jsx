export default function AppLoader({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      
      {/* Spinner */}
      <div className="relative w-14 h-14">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-4 border-orange-200 dark:border-orange-900" />

        {/* Rotating arc */}
        <div className="absolute inset-0 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />

        {/* Center dots */}
        <div className="absolute inset-0 flex items-center justify-center gap-1">
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.2s]" />
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce" />
          <span className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]" />
        </div>
      </div>

      {/* Text */}
      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
        {text}
      </p>
    </div>
  );
}