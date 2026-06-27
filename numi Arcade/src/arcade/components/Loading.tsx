import { useEffect, useState } from "react";

export function Loading({ onDone }: { onDone: () => void }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const k = Math.min(1, (now - t0) / dur);
      setP(k);
      if (k < 1) raf = requestAnimationFrame(tick);
      else setTimeout(onDone, 220);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="flex flex-col items-center gap-7">
        <img
          src="/brand/numi-glyph.svg"
          width={96} height={96}
          alt="numi"
          style={{ transform: `scale(${0.6 + p * 0.4})`, opacity: Math.min(1, p * 1.4) }}
        />
        <div className="w-44 h-1 rounded-full bg-white/10 overflow-hidden">
          <div className="h-full bg-teal" style={{ width: `${p * 100}%` }} />
        </div>
      </div>
    </div>
  );
}
