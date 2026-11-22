import { useQuery } from "@tanstack/react-query";
import { musicApi } from "@/lib/api";
import { normalizeTrack } from "@/lib/tracks";

const selectSongs = (list) => list.map((m) => normalizeTrack(m));

const selectAlbum = (album) =>
  album && {
    id: album._id,
    title: album.title,
    artist: album.artist,
    tracks: (album.musics ?? []).map((m) => normalizeTrack(m, album.artist)),
  };

export const useSongs = () => useQuery({ queryKey: ["songs"], queryFn: musicApi.songs, select: selectSongs });

export const useAlbums = () => useQuery({ queryKey: ["albums"], queryFn: musicApi.albums });

export const useAlbum = (id) =>
  useQuery({ queryKey: ["album", id], queryFn: () => musicApi.album(id), select: selectAlbum });
