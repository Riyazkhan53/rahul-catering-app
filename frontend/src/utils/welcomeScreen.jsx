export default function CateringLoader() {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* BACKGROUND */}
      <div className="relative h-full w-full bg-gradient-to-br from-[#0F172A] via-[#020617] to-[#020617] flex items-center justify-center">

        {/* WATERMARK ICONS */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.04] text-white text-[140px] flex flex-wrap justify-center items-center gap-24">
          <span>🍽️</span>
          <span>🥗</span>
          <span>🍛</span>
          <span>🥘</span>
          <span>🍲</span>
          <span>🍴</span>
        </div>

        {/* CONTENT */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">

          {/* TITLE */}
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-wide">
            Rahul Catering & Events
          </h1>

          <p className="mt-2 text-slate-300 text-sm md:text-base">
            Serving moments with flavour & care
          </p>

          {/* SPACING */}
          <div className="h-16" />

          {/* LOADER */}
          <div className="relative w-72">

            {/* CHEF HAT */}
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 animate-bounce">
              <div className="w-14 h-10 bg-[#ADC455] rounded-t-xl rounded-b-md flex items-end justify-center shadow-lg">
                <div className="w-8 h-2 bg-white rounded-sm mb-1" />
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-3 w-full bg-slate-700 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-gradient-to-r from-[#ADC455] to-[#FACC15] animate-catering-loading" />
            </div>

            {/* LOADING TEXT */}
            <p className="mt-4 text-xs uppercase tracking-widest text-slate-400 animate-pulse">
              Preparing your order…
            </p>
          </div>
        </div>
      </div>

      {/* KEYFRAMES */}
      <style jsx>{`
        @keyframes catering-loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-catering-loading {
          animation: catering-loading 1.6s infinite linear;
        }
      `}</style>
    </div>
  );
}