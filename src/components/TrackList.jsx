import { Pause, Play } from "lucide-react";
import { Cover } from "@/components/Cover";
import { Equalizer } from "@/components/Equalizer";
import { LikeButton } from "@/components/LikeButton";
import { selectCurrent, usePlayer } from "@/store/player";
import { cn } from "@/lib/utils";

const cols = (showArtist) =>
  showArtist
    ? "grid-cols-[2rem_minmax(0,1fr)_auto] md:grid-cols-[2rem_minmax(0,4fr)_minmax(0,3fr)_auto]"
    : "grid-cols-[2rem_minmax(0,1fr)_auto]";

export function TrackRow({ track, index, queue, showArtist = true }) {
  const play = usePlayer((s) => s.play);
  const togglePlay = usePlayer((s) => s.togglePlay);
  const isCurrent = usePlayer((s) => selectCurrent(s)?.id === track.id);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const active = isCurrent && isPlaying;

  const activate = () => (isCurrent ? togglePlay() : play(queue, index));

  return (
    <div
      role="row"
      onDoubleClick={() => !isCurrent && play(queue, index)}
      className={cn("group grid items-center gap-3 rounded-md px-2 py-1.5 hover:bg-accent/60 focus-within:bg-accent/60", cols(showArtist))}
    >
      <button
        type="button"
        onClick={activate}
        aria-label={active ? `Pause ${track.title}` : `Play ${track.title}`}
        className="relative grid size-8 place-items-center rounded text-sm text-muted-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {active ? (
          <Equalizer className="group-hover:hidden group-focus-within:hidden" />
        ) : (
          <span className={cn("tabular-nums group-hover:hidden group-focus-within:hidden", isCurrent && "text-primary")}>{index + 1}</span>
        )}
        <span className="hidden text-foreground group-hover:block group-focus-within:block">
          {active ? <Pause className="size-4 fill-current" /> : <Play className="size-4 fill-current" />}
        </span>
      </button>

      <div className="flex min-w-0 items-center gap-3">
        <Cover seed={track.title} label={track.title} className="size-10" />
        <div className="min-w-0">
          <p className={cn("truncate text-sm font-medium", isCurrent && "text-primary")}>{track.title}</p>
          {showArtist && <p className="truncate text-xs text-muted-foreground md:hidden">{track.artistName}</p>}
        </div>
      </div>

      {showArtist && <p className="hidden truncate text-sm text-muted-foreground md:block">{track.artistName}</p>}

      <LikeButton track={track} className="md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 md:aria-pressed:opacity-100" />
    </div>
  );
}

export function TrackList({ tracks, showArtist = true }) {
  return (
    <div role="table">
      <div
        role="row"
        className={cn("mb-1 grid gap-3 border-b px-2 pb-2 text-xs text-muted-foreground", cols(showArtist))}
      >
        <span className="text-center">#</span>
        <span>Title</span>
        {showArtist && <span className="hidden md:block">Artist</span>}
        <span className="size-8" aria-hidden />
      </div>
      {tracks.map((track, i) => (
        <TrackRow key={track.id} track={track} index={i} queue={tracks} showArtist={showArtist} />
      ))}
    </div>
  );
}
