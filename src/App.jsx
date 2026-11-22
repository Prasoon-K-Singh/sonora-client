import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";
import { GuestOnly, RequireArtist, RequireAuth } from "@/components/guards";
import Album from "@/pages/Album";
import Home from "@/pages/Home";
import Liked from "@/pages/Liked";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Search from "@/pages/Search";
import Studio from "@/pages/Studio";

export default function App() {
  return (
    <Routes>
      <Route element={<GuestOnly />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="liked" element={<Liked />} />
          <Route path="album/:albumId" element={<Album />} />
          <Route element={<RequireArtist />}>
            <Route path="studio" element={<Studio />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
