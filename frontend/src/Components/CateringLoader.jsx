import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

function useFillLoop() {
  const [fillY, setFillY] = useState(100);

  useEffect(() => {
    let raf;
    let start = null;
    const duration = 3500;
    const pause = 900;
    let phase = "fill";

    const tick = (now) => {
      if (!start) start = now;
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      if (phase === "fill") setFillY(100 - eased * 100);
      else setFillY(eased * 100);

      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          phase = phase === "fill" ? "drain" : "fill";
          start = null;
          raf = requestAnimationFrame(tick);
        }, pause);
      }
    };

    const init = setTimeout(() => { raf = requestAnimationFrame(tick); }, 400);
    return () => { clearTimeout(init); cancelAnimationFrame(raf); };
  }, []);

  return fillY;
}

function useTransparentLogo(src) {
  const [dataUrl, setDataUrl] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imageData.data;
      for (let i = 0; i < d.length; i += 4) {
        const r = d[i], g = d[i + 1], b = d[i + 2];
        // Remove near-white background
        if (r > 225 && g > 225 && b > 225) {
          d[i + 3] = 0;
        }
      }
      ctx.putImageData(imageData, 0, 0);
      setDataUrl(canvas.toDataURL("image/png"));
    };
    img.src = src;
  }, [src]);

  return dataUrl;
}

export default function CateringLoader() {
  const fillY = useFillLoop();
  const logoUrl = useTransparentLogo("/Watermark_new.PNG");

  return (
    <div className="fixed inset-0 bg-white dark:bg-gray-950 flex flex-col items-center justify-center z-50">

      <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>

        {logoUrl ? (
          <>
            {/* Gold liquid fill — clipped to logo shape via CSS mask */}
            <div
              className="absolute inset-0"
              style={{
                WebkitMaskImage: `url('${logoUrl}')`,
                maskImage: `url('${logoUrl}')`,
                WebkitMaskSize: "contain",
                maskSize: "contain",
                WebkitMaskRepeat: "no-repeat",
                maskRepeat: "no-repeat",
                WebkitMaskPosition: "center",
                maskPosition: "center",
              }}
            >
              {/* Ghost fill (shows full logo faintly) */}
              <div
                className="absolute inset-0"
                style={{
                  background: "linear-gradient(135deg, #8B6914, #D4A017, #FFD700, #D4A017, #8B6914)",
                  opacity: 0.15,
                }}
              />

              {/* Rising liquid */}
              <div
                className="absolute left-0 right-0"
                style={{
                  top: `${fillY}%`,
                  bottom: 0,
                  background: "linear-gradient(135deg, #8B6914 0%, #C8950F 30%, #FFD700 55%, #C8950F 75%, #8B6914 100%)",
                }}
              />

              {/* Wave on top of liquid */}
              <motion.div
                className="absolute left-0 right-0"
                style={{ top: `${fillY}%`, height: 18, marginTop: -9 }}
                animate={{ x: [0, -110, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
              >
                <svg
                  viewBox="0 0 440 18"
                  width="200%"
                  height="18"
                  preserveAspectRatio="none"
                  style={{ display: "block" }}
                >
                  <path
                    d="M0,9 Q55,0 110,9 Q165,18 220,9 Q275,0 330,9 Q385,18 440,9 L440,18 L0,18 Z"
                    fill="#D4A017"
                  />
                </svg>
              </motion.div>

              {/* Second wave, offset */}
              <motion.div
                className="absolute left-0 right-0"
                style={{ top: `${fillY}%`, height: 14, marginTop: -7 }}
                animate={{ x: [0, 110, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <svg
                  viewBox="0 0 440 14"
                  width="200%"
                  height="14"
                  preserveAspectRatio="none"
                  style={{ display: "block" }}
                >
                  <path
                    d="M0,7 Q55,14 110,7 Q165,0 220,7 Q275,14 330,7 Q385,0 440,7 L440,14 L0,14 Z"
                    fill="#FFD700"
                    opacity="0.5"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Logo on top — crisp outline at low opacity as ghost */}
            <img
              src={logoUrl}
              className="absolute inset-0 w-full h-full object-contain pointer-events-none"
              style={{ opacity: 0.18 }}
            />
          </>
        ) : (
          // Tiny spinner while canvas processes the image
          <div className="w-6 h-6 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
        )}

        {/* Glow */}
        <div
          className="absolute inset-0 -z-10 blur-3xl rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(ellipse, rgba(212,160,23,${(100 - fillY) / 200}) 0%, transparent 70%)`,
          }}
        />
      </div>

      {/* Divider */}
      <motion.div
        className="mt-6 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #D4A017, transparent)" }}
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 100, opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.7, ease: "easeOut" }}
      />

      {/* Dots */}
      <motion.div
        className="flex gap-2 mt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-1 rounded-full"
            style={{ background: "linear-gradient(135deg, #B8860B, #FFD700)" }}
            animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
          />
        ))}
      </motion.div>
    </div>
  );
}
