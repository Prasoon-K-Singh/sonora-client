import { Link, useParams } from "react-router-dom";
import { Play, Shuffle } from "lucide-react";
import { Cover } from "@/components/Cover";
import { EmptyState, Page } from "@/components/PageSection";
import { TrackList } from "@/components/TrackList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAlbum } from "@/hooks/queries";
import { plural } from "@/lib/format";
import { usePlayer } from "@/store/player";

export default function Album() {
  const { albumId } = useParams();
  const { data: album, isLoading, isError } = useAlbum(albumId);
  const play = usePlayer((s) => s.play);
  const playShuffled = usePlayer((s) => s.playShuffled);

  if (isLoading) {
    return (
      <Page>
        <div className="flex flex-col gap-5 pt-4 sm:flex-row sm:items-end">
          <Skeleton className="size-40 md:size-52" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </Page>
    );
  }

  if (isError || !album) {
    return (
      <Page className="pt-4">
        <EmptyState title="Album not found">
          It may have been removed.{" "}
          <Link to="/" className="text-foreground underline underline-offset-4">
            Back to home
          </Link>
        </EmptyState>
      </Page>
    );
  }

  const { tracks } = album;

  return (
    <Page>
      <div className="flex flex-col gap-5 pt-4 sm:flex-row sm:items-end">
        <Cover seed={album.title} label={album.title} className="size-40 shadow-xl shadow-black/40 md:size-52" rounded="rounded-lg" />
        <div className="min-w-0">
          <p className="text-sm font-medium text-muted-foreground">Album</p>
          <h1 className="text-4xl font-bold break-words md:text-6xl">{album.title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{album.artist?.username ?? "Unknown artist"}</span>, {plural(tracks.length, "track")}
          </p>
        </div>
      </div>

      {tracks.length > 0 ? (
        <>
          <div className="my-6 flex gap-2">
            <Button size="lg" className="rounded-full" onClick={() => play(tracks, 0)}>
              <Play className="fill-current" /> Play
            </Button>
            <Button size="lg" variant="secondary" className="rounded-full" onClick={() => playShuffled(tracks)}>
              <Shuffle /> Shuffle
            </Button>
          </div>
          <TrackList tracks={tracks} showArtist={false} />
        </>
      ) : (
        <div className="mt-8">
          <EmptyState title="This album is empty">The artist hasn't added any tracks yet.</EmptyState>
        </div>
      )}
    </Page>
  );
}
