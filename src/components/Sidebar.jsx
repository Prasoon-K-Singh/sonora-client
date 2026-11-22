import { NavLink, Link } from "react-router-dom";
import { Heart, Home, Search, Mic2 } from "lucide-react";
import { Cover } from "@/components/Cover";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlbums } from "@/hooks/queries";
import { useAuth } from "@/store/auth";
import { APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function useNavItems() {
  const role = useAuth((s) => s.user?.role);
  return [
    { to: "/", label: "Home", icon: Home, end: true },
    { to: "/search", label: "Search", icon: Search },
    { to: "/liked", label: "Liked songs", icon: Heart },
    ...(role === "artist" ? [{ to: "/studio", label: "Studio", icon: Mic2 }] : []),
  ];
}

export function Brand({ className }) {
  return (
    <Link to="/" className={cn("flex items-center gap-2.5 outline-none", className)}>
      <span aria-hidden className="grid size-8 place-items-center rounded-full bg-secondary ring-1 ring-border">
        <span className="size-3.5 rounded-full bg-primary" />
      </span>
      <span className="font-display text-xl font-bold tracking-tight">{APP_NAME}</span>
    </Link>
  );
}

export function Sidebar() {
  const items = useNavItems();
  const { data: albums, isLoading } = useAlbums();

  return (
    <aside className="hidden min-h-0 flex-col gap-4 rounded-xl bg-sidebar p-4 md:flex">
      <Brand className="px-2 pt-1" />
      <nav aria-label="Main" className="flex flex-col gap-1">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                isActive && "bg-accent text-foreground",
              )
            }
          >
            <Icon className="size-5" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="flex min-h-0 flex-1 flex-col border-t pt-4">
        <h2 className="px-3 pb-2 font-sans text-sm font-semibold text-muted-foreground">Albums</h2>
        <div className="-mx-1 min-h-0 flex-1 overflow-y-auto px-1">
          {isLoading &&
            Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-3 p-2">
                <Skeleton className="size-10" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          {albums?.length === 0 && <p className="px-3 text-sm text-muted-foreground">No albums yet.</p>}
          {albums?.map((a) => (
            <NavLink
              key={a._id}
              to={`/album/${a._id}`}
              className={({ isActive }) =>
                cn("flex items-center gap-3 rounded-md p-2 outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring", isActive && "bg-accent")
              }
            >
              <Cover seed={a.title} label={a.title} className="size-10" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{a.title}</p>
                <p className="truncate text-xs text-muted-foreground">{a.artist?.username}</p>
              </div>
            </NavLink>
          ))}
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const items = useNavItems();
  return (
    <nav aria-label="Main" className="flex border-t bg-sidebar md:hidden">
      {items.map(({ to, label, icon: Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            cn("flex flex-1 flex-col items-center gap-1 py-2 text-[11px] font-medium text-muted-foreground", isActive && "text-primary")
          }
        >
          <Icon className="size-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
