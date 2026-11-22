import { Heart, Play, Shuffle } from "lucide-react";
import { Link } from "react-router-dom";
import { EmptyState, Page } from "@/components/PageSection";
import { TrackList } from "@/components/TrackList";
import { Button } from "@/components/ui/button";
import { plural } from "@/lib/format";
import { useLibrary } from "@/store/library";
import { usePlayer } from "@/store/player";

export default function Liked() {
  const liked = useLibrary((s) => s.liked);
  const play = usePlayer((s) => s.play);
  const playShuffled = usePlayer((s) => s.playShuffled);
  const tracks = Object.values(liked);

  return (
    <Page>
      <div className="flex flex-col gap-5 pt-4 sm:flex-row sm:items-end">
        <div className="grid size-40 shrink-0 place-items-center rounded-lg bg-linear-to-br from-like to-[#6a0f49] shadow-xl shadow-black/40 md:size-48">
          <Heart className="size-16 fill-white text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-bold md:text-6xl">Liked songs</h1>
          <p className="mt-2 text-sm text-muted-foreground">{plural(tracks.length, "song")}, saved on this device</p>
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
          <TrackList tracks={tracks} />
        </>
      ) : (
        <div className="mt-8">
          <EmptyState title="Nothing liked yet">
            Tap the heart on any track to save it here.{" "}
            <Link to="/" className="text-foreground underline underline-offset-4">
              Browse music
            </Link>
          </EmptyState>
        </div>
      )}
    </Page>
  );
}
