import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { MobileNav, Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { PlayerBar } from "@/components/PlayerBar";
import { usePlayer } from "@/store/player";

export function AppLayout() {
  const { pathname } = useLocation();

  // Space toggles play/pause unless the user is typing or focused on a control.
  useEffect(() => {
    function onKey(e) {
      if (e.code !== "Space") return;
      const el = e.target;
      if (el.closest?.("input, textarea, select, button, a, [contenteditable], [role=slider]")) return;
      e.preventDefault();
      usePlayer.getState().togglePlay();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="flex h-dvh flex-col bg-black/40">
      <div className="grid min-h-0 flex-1 gap-2 p-2 pb-0 md:grid-cols-[280px_minmax(0,1fr)] md:pb-2">
        <Sidebar />
        <main key={pathname.split("/")[1]} className="min-h-0 overflow-y-auto rounded-xl bg-card">
          <TopBar />
          <Outlet />
        </main>
      </div>
      <div className="border-t bg-sidebar md:border-0 md:bg-transparent md:px-2 md:pb-2">
        <div className="md:rounded-xl md:bg-sidebar">
          <PlayerBar />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
