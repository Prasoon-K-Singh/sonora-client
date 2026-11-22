import { create } from "zustand";
import { persist } from "zustand/middleware";

const identity = (n) => Array.from({ length: n }, (_, i) => i);

function shuffledOrder(n, first) {
  const rest = identity(n).filter((i) => i !== first);
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j], rest[i]];
  }
  return [first, ...rest];
}

export const selectCurrent = (s) => s.queue[s.order[s.pos]] ?? null;

export const usePlayer = create(
  persist(
    (set, get) => ({
      queue: [],
      order: [],
      pos: 0,
      isPlaying: false,
      shuffle: false,
      repeat: "off", // "off" | "all" | "one"
      volume: 0.8,
      muted: false,

      play: (tracks, startIndex = 0) => {
        if (!tracks.length) return;
        if (get().shuffle) {
          set({ queue: tracks, order: shuffledOrder(tracks.length, startIndex), pos: 0, isPlaying: true });
        } else {
          set({ queue: tracks, order: identity(tracks.length), pos: startIndex, isPlaying: true });
        }
      },

      playShuffled: (tracks) => {
        if (!tracks.length) return;
        const first = Math.floor(Math.random() * tracks.length);
        set({ shuffle: true, queue: tracks, order: shuffledOrder(tracks.length, first), pos: 0, isPlaying: true });
      },

      togglePlay: () => {
        if (!selectCurrent(get())) return;
        set({ isPlaying: !get().isPlaying });
      },
      pause: () => set({ isPlaying: false }),

      next: () => {
        const { order, pos, repeat } = get();
        if (!order.length) return;
        if (pos + 1 < order.length) set({ pos: pos + 1, isPlaying: true });
        else if (repeat === "all") set({ pos: 0, isPlaying: true });
        else set({ pos: 0, isPlaying: false }); // end of queue: stop on first track
      },

      prev: () => {
        const { order, pos, repeat } = get();
        if (!order.length) return;
        if (pos > 0) set({ pos: pos - 1, isPlaying: true });
        else if (repeat === "all") set({ pos: order.length - 1, isPlaying: true });
      },

      toggleShuffle: () => {
        const { shuffle, queue, order, pos } = get();
        if (!queue.length) return set({ shuffle: !shuffle });
        const currentIndex = order[pos];
        if (!shuffle) set({ shuffle: true, order: shuffledOrder(queue.length, currentIndex), pos: 0 });
        else set({ shuffle: false, order: identity(queue.length), pos: currentIndex });
      },

      cycleRepeat: () => {
        const next = { off: "all", all: "one", one: "off" }[get().repeat];
        set({ repeat: next });
      },

      setVolume: (volume) => set({ volume, muted: volume === 0 }),
      toggleMute: () => set({ muted: !get().muted }),

      reset: () => set({ queue: [], order: [], pos: 0, isPlaying: false }),
    }),
    {
      name: "sonora-player",
      partialize: (s) => ({ volume: s.volume, muted: s.muted, shuffle: s.shuffle, repeat: s.repeat }),
    },
  ),
);
