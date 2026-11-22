import { create } from "zustand";
import { persist } from "zustand/middleware";

// The backend has no "who am I" endpoint, so we remember the user returned by
// login/register. If the cookie has expired, the first API call returns 401 and
// the axios interceptor clears this store, sending the user back to /login.
export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clear: () => set({ user: null }),
    }),
    { name: "sonora-auth" },
  ),
);
