import { Slider as SliderPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";

// Thin player-style slider: the thumb only appears on hover/focus, the fill turns accent-colored on hover.
function Slider({ className, value, defaultValue, min = 0, max = 100, ...props }) {
  const count = Array.isArray(value) ? value.length : Array.isArray(defaultValue) ? defaultValue.length : 1;
  return (
    <SliderPrimitive.Root
      data-slot="slider"
      value={value}
      defaultValue={defaultValue}
      min={min}
      max={max}
      className={cn("group relative flex w-full touch-none items-center py-2 select-none data-[disabled]:opacity-50", className)}
      {...props}
    >
      <SliderPrimitive.Track data-slot="slider-track" className="relative h-1 w-full grow overflow-hidden rounded-full bg-secondary">
        <SliderPrimitive.Range data-slot="slider-range" className="absolute h-full bg-foreground group-hover:bg-primary group-focus-within:bg-primary" />
      </SliderPrimitive.Track>
      {Array.from({ length: count }, (_, i) => (
        <SliderPrimitive.Thumb
          key={i}
          data-slot="slider-thumb"
          className="block size-3 rounded-full bg-foreground opacity-0 shadow transition-opacity outline-none group-hover:opacity-100 focus-visible:opacity-100 focus-visible:ring-4 focus-visible:ring-ring/40"
        />
      ))}
    </SliderPrimitive.Root>
  );
}

export { Slider };
