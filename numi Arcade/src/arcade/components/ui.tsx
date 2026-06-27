import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Button({
  children, variant = "primary", className = "", ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost"; children: ReactNode }) {
  const base =
    "px-7 py-3 rounded-full font-extrabold tracking-tight transition-all duration-200 active:scale-95 select-none";
  const styles =
    variant === "primary"
      ? "bg-teal text-navy-deep hover:brightness-110 shadow-[0_8px_30px_rgba(0,174,199,0.35)]"
      : "bg-white/5 text-white hover:bg-white/10 border border-white/10";
  return (
    <button className={`${base} ${styles} ${className}`} {...rest}>
      {children}
    </button>
  );
}

export function Logo({ size = 34 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5 select-none">
      <img src="/brand/numi-glyph.svg" width={size} height={size} alt="numi" className="anim-float" />
      <span className="font-extrabold text-xl tracking-tight lowercase">numi</span>
      <span className="text-white/35 text-xl font-light">arcade</span>
    </div>
  );
}
