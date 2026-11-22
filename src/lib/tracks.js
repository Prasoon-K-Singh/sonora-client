// Backend shapes:
//  - GET /music         -> artist is populated: { _id, username, email }
//  - GET /albums/:id    -> musics[].artist is a plain id; album.artist is populated
export function normalizeTrack(m, fallbackArtist) {
  const populated = m.artist && typeof m.artist === "object" ? m.artist : null;
  const artist = populated ?? fallbackArtist ?? null;
  return {
    id: m._id,
    title: m.title,
    uri: m.uri,
    artistName: artist?.username ?? "Unknown artist",
    artistId: artist?._id ?? (typeof m.artist === "string" ? m.artist : null),
  };
}
