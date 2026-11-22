import { cn } from "@/lib/utils";

export function Page({ className, ...props }) {
  return <div className={cn("px-4 pb-10 md:px-6", className)} {...props} />;
}

export function Section({ title, action, children, className }) {
  return (
    <section className={cn("mt-8", className)}>
      <div className="mb-3 flex items-end justify-between gap-4">
        <h2 className="text-xl font-bold md:text-2xl">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

export function EmptyState({ title, children }) {
  return (
    <div className="rounded-xl border border-dashed px-6 py-10 text-center">
      <p className="font-display text-lg font-semibold">{title}</p>
      {children && <div className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">{children}</div>}
    </div>
  );
}
