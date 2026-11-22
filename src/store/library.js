import { create } from "zustand";
import { persist } from "zustand/middleware";

// Liked songs live in the browser only (the backend has no likes endpoint).
export const useLibrary = create(
  persist(
    (set, get) => ({
      liked: {},
      toggleLike: (track) => {
        const liked = { ...get().liked };
        if (liked[track.id]) delete liked[track.id];
        else liked[track.id] = track;
        set({ liked });
      },
    }),
    { name: "sonora-library" },
  ),
);
