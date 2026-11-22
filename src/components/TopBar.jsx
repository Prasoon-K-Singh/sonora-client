import { useNavigate } from "react-router-dom";
import { LogOut, Mic2 } from "lucide-react";
import { toast } from "sonner";
import { Brand } from "@/components/Sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authApi } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/store/auth";
import { usePlayer } from "@/store/player";

export function TopBar() {
  const user = useAuth((s) => s.user);
  const clear = useAuth((s) => s.clear);
  const resetPlayer = usePlayer((s) => s.reset);
  const navigate = useNavigate();

  async function logout() {
    try {
      await authApi.logout();
    } catch {
      /* cookie may already be gone; still sign out locally */
    }
    resetPlayer();
    queryClient.clear();
    clear();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  }

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between bg-card/80 px-4 py-3 backdrop-blur md:justify-end md:px-6">
      <Brand className="md:hidden" />
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-full bg-secondary py-1 pr-3 pl-1 text-sm font-medium outline-none transition-colors hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
        >
          <span className="grid size-7 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
            {user?.username?.charAt(0).toUpperCase()}
          </span>
          <span className="max-w-32 truncate">{user?.username}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            <p className="truncate">{user?.username}</p>
            <p className="truncate text-xs font-normal text-muted-foreground">
              {user?.email} ({user?.role})
            </p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user?.role === "artist" && (
            <DropdownMenuItem onSelect={() => navigate("/studio")}>
              <Mic2 /> Studio
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onSelect={logout}>
            <LogOut /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
