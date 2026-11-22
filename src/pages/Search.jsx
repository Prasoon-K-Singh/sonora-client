import { useMemo, useState } from "react";
import { Search as SearchIcon } from "lucide-react";
import { AlbumGrid } from "@/components/AlbumCard";
import { EmptyState, Page, Section } from "@/components/PageSection";
import { TrackList } from "@/components/TrackList";
import { Input } from "@/components/ui/input";
import { useAlbums, useSongs } from "@/hooks/queries";

// The API has no search endpoint, so filtering happens in the browser over the full lists.
export default function Search() {
  const [query, setQuery] = useState("");
  const songs = useSongs();
  const albums = useAlbums();
  const q = query.trim().toLowerCase();

  const matchedTracks = useMemo(
    () => (q ? (songs.data ?? []).filter((t) => `${t.title} ${t.artistName}`.toLowerCase().includes(q)) : []),
    [q, songs.data],
  );
  const matchedAlbums = useMemo(
    () => (q ? (albums.data ?? []).filter((a) => `${a.title} ${a.artist?.username ?? ""}`.toLowerCase().includes(q)) : []),
    [q, albums.data],
  );
  const artists = useMemo(() => [...new Set((songs.data ?? []).map((t) => t.artistName))].sort(), [songs.data]);

  return (
    <Page>
      <h1 className="sr-only">Search</h1>
      <div className="relative max-w-xl">
        <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          autoFocus
          aria-label="Search tracks, albums and artists"
          placeholder="Search tracks, albums and artists"
          className="h-11 rounded-full pl-9"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {!q && (
        <Section title="Browse artists">
          {artists.length === 0 ? (
            <EmptyState title="Nothing to browse yet">Tracks will show up here once artists upload them.</EmptyState>
          ) : (
            <div className="flex flex-wrap gap-2">
              {artists.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => setQuery(name)}
                  className="rounded-full bg-secondary px-4 py-2 text-sm font-medium transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </Section>
      )}

      {q && matchedTracks.length === 0 && matchedAlbums.length === 0 && (
        <div className="mt-8">
          <EmptyState title={`No results for "${query.trim()}"`}>Check the spelling or try an artist name.</EmptyState>
        </div>
      )}

      {matchedTracks.length > 0 && (
        <Section title="Tracks">
          <TrackList tracks={matchedTracks} />
        </Section>
      )}
      {matchedAlbums.length > 0 && (
        <Section title="Albums">
          <AlbumGrid albums={matchedAlbums} />
        </Section>
      )}
    </Page>
  );
}
