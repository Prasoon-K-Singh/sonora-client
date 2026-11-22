import { Link } from "react-router-dom";
import { Play, Shuffle } from "lucide-react";
import { AlbumGrid } from "@/components/AlbumCard";
import { Cover } from "@/components/Cover";
import { EmptyState, Page, Section } from "@/components/PageSection";
import { TrackList } from "@/components/TrackList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlbums, useSongs } from "@/hooks/queries";
import { errorMessage } from "@/lib/api";
import { greeting } from "@/lib/format";
import { selectCurrent, usePlayer } from "@/store/player";
import { useAuth } from "@/store/auth";
import { cn } from "@/lib/utils";

function QuickTile({ track, index, queue }) {
  const play = usePlayer((s) => s.play);
  const togglePlay = usePlayer((s) => s.togglePlay);
  const isCurrent = usePlayer((s) => selectCurrent(s)?.id === track.id);
  return (
    <button
      type="button"
      onClick={() => (isCurrent ? togglePlay() : play(queue, index))}
      className={cn(
        "flex items-center gap-3 overflow-hidden rounded-md bg-secondary pr-3 text-left transition-colors outline-none hover:bg-accent focus-visible:ring-2 focus-visible:ring-ring",
        isCurrent && "ring-1 ring-primary",
      )}
    >
      <Cover seed={track.title} label={track.title} className="size-14" rounded="rounded-none" />
      <span className="truncate text-sm font-semibold">{track.title}</span>
    </button>
  );
}

export default function Home() {
  const user = useAuth((s) => s.user);
  const songs = useSongs();
  const albums = useAlbums();
  const play = usePlayer((s) => s.play);
  const playShuffled = usePlayer((s) => s.playShuffled);
  const tracks = songs.data ?? [];

  return (
    <Page>
      <h1 className="text-3xl font-bold md:text-4xl">
        {greeting()}, {user?.username}
      </h1>

      {songs.isLoading && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="h-14" />
          ))}
        </div>
      )}

      {songs.isError && (
        <div className="mt-6">
          <EmptyState title="Couldn't load tracks">{errorMessage(songs.error)}</EmptyState>
        </div>
      )}

      {tracks.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {tracks.slice(0, 6).map((t, i) => (
            <QuickTile key={t.id} track={t} index={i} queue={tracks} />
          ))}
        </div>
      )}

      <Section title="Albums">
        {albums.isLoading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="aspect-[3/4]" />
            ))}
          </div>
        )}
        {albums.data?.length === 0 && (
          <EmptyState title="No albums yet">
            {user?.role === "artist" ? (
              <>
                Group your tracks into an album in the{" "}
                <Link to="/studio" className="text-foreground underline underline-offset-4">
                  Studio
                </Link>
                .
              </>
            ) : (
              "Artists haven't published any albums yet."
            )}
          </EmptyState>
        )}
        {albums.data?.length > 0 && <AlbumGrid albums={albums.data} />}
      </Section>

      <Section
        title="All tracks"
        action={
          tracks.length > 0 && (
            <div className="flex gap-2">
              <Button size="sm" onClick={() => play(tracks, 0)}>
                <Play className="fill-current" /> Play all
              </Button>
              <Button size="sm" variant="secondary" onClick={() => playShuffled(tracks)}>
                <Shuffle /> Shuffle
              </Button>
            </div>
          )
        }
      >
        {songs.data?.length === 0 && (
          <EmptyState title="No music yet">
            {user?.role === "artist" ? (
              <>
                Upload your first track in the{" "}
                <Link to="/studio" className="text-foreground underline underline-offset-4">
                  Studio
                </Link>
                .
              </>
            ) : (
              "Check back soon. Artists are still uploading."
            )}
          </EmptyState>
        )}
        {tracks.length > 0 && <TrackList tracks={tracks} />}
      </Section>
    </Page>
  );
}
