import { APP_NAME } from "@/lib/constants";

function Vinyl() {
  return (
    <div aria-hidden className="relative aspect-square w-full max-w-md">
      <div className="absolute inset-0 rounded-full bg-[repeating-radial-gradient(circle_at_center,#1a1527_0,#1a1527_3px,#120e1b_4px,#120e1b_7px)] shadow-2xl shadow-black/60 ring-1 ring-border motion-safe:animate-[spin_30s_linear_infinite]">
        <div className="absolute inset-[32%] rounded-full bg-[linear-gradient(135deg,#ffc93c,#ff7e5f)]">
          <div className="absolute inset-[42%] rounded-full bg-background" />
        </div>
        <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_20deg,transparent,rgba(255,255,255,0.07),transparent_25%,transparent_50%,rgba(255,255,255,0.07),transparent_75%)]" />
      </div>
    </div>
  );
}

export function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <p className="mb-10 flex items-center gap-2.5 font-display text-xl font-bold">
            <span className="grid size-8 place-items-center rounded-full bg-secondary ring-1 ring-border">
              <span className="size-3.5 rounded-full bg-primary" />
            </span>
            {APP_NAME}
          </p>
          <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-sm text-muted-foreground">{footer}</p>
        </div>
      </div>
      <div className="hidden items-center justify-center overflow-hidden bg-sidebar p-16 lg:flex">
        <Vinyl />
      </div>
    </div>
  );
}
