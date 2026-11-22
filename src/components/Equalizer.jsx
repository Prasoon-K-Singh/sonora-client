import { cn } from "@/lib/utils";

export function Equalizer({ className }) {
  return (
    <span aria-hidden className={cn("flex h-3.5 items-end gap-[2px]", className)}>
      {[0, 0.25, 0.5].map((delay) => (
        <span key={delay} className="eq-bar h-full w-[3px] rounded-sm bg-primary" style={{ animationDelay: `${delay}s` }} />
      ))}
    </span>
  );
}
