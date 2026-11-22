import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/store/auth";

export function RequireAuth() {
  const user = useAuth((s) => s.user);
  const location = useLocation();
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export function GuestOnly() {
  const user = useAuth((s) => s.user);
  return user ? <Navigate to="/" replace /> : <Outlet />;
}

export function RequireArtist() {
  const role = useAuth((s) => s.user?.role);
  return role === "artist" ? <Outlet /> : <Navigate to="/" replace />;
}
