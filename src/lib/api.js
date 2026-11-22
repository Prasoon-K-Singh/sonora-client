import axios from "axios";
import { useAuth } from "@/store/auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000/api",
  withCredentials: true,
});

// Expired/missing cookie on a protected call -> drop the cached user, router sends us to /login.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url ?? "";
    if (err.response?.status === 401 && !url.startsWith("/auth/")) {
      useAuth.getState().clear();
    }
    return Promise.reject(err);
  },
);

export function errorMessage(
  err,
  fallback = "Something went wrong. Try again.",
) {
  if (err?.code === "ERR_NETWORK")
    return "Can't reach the server. Is the backend running on port 3000?";
  return err?.response?.data?.message ?? fallback;
}

export const authApi = {
  login: (body) => api.post("/auth/login", body).then((r) => r.data),
  register: (body) => api.post("/auth/register", body).then((r) => r.data),
  logout: () => api.post("/auth/logout").then((r) => r.data),
};

export const musicApi = {
  songs: () => api.get("/music").then((r) => r.data.musics),
  albums: () => api.get("/music/albums/").then((r) => r.data.albums),
  album: (id) => api.get(`/music/albums/${id}`).then((r) => r.data.album),
  upload: (formData, onProgress) =>
    api
      .post("/music/upload", formData, {
        onUploadProgress: (e) =>
          e.total && onProgress?.(Math.round((e.loaded * 100) / e.total)),
      })
      .then((r) => r.data),
  createAlbum: (body) => api.post("/music/album", body).then((r) => r.data),
};
