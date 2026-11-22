import { coverStyle } from "@/lib/cover";
import { cn } from "@/lib/utils";

// Generated cover art. Sized by className; the initial scales with the container (cqw units).
export function Cover({ seed, label, className, rounded = "rounded-md" }) {
  const initial = (label ?? seed ?? "?").trim().charAt(0).toUpperCase() || "?";
  return (
    <div
      aria-hidden
      style={coverStyle(seed ?? label)}
      className={cn("@container relative aspect-square shrink-0 overflow-hidden select-none", rounded, className)}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(255,255,255,0.3),transparent_55%)]" />
      <span className="absolute bottom-[6%] left-[10%] font-display text-[46cqw] leading-none font-bold text-white/80">
        {initial}
      </span>
    </div>
  );
}
