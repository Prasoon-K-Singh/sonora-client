import { useEffect, useRef, useState } from "react";
import { Pause, Play, Repeat, Repeat1, Shuffle, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { Cover } from "@/components/Cover";
import { LikeButton } from "@/components/LikeButton";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";
import { selectCurrent, usePlayer } from "@/store/player";

export function PlayerBar() {
  const audioRef = useRef(null);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const current = usePlayer(selectCurrent);
  const isPlaying = usePlayer((s) => s.isPlaying);
  const shuffle = usePlayer((s) => s.shuffle);
  const repeat = usePlayer((s) => s.repeat);
  const volume = usePlayer((s) => s.volume);
  const muted = usePlayer((s) => s.muted);
  const { togglePlay, next, prev, toggleShuffle, cycleRepeat, setVolume, toggleMute } = usePlayer.getState();

  const startFresh = () => {
    const a = audioRef.current;
    a.currentTime = 0;
    setTime(0);
    return a.play().catch(() => usePlayer.getState().pause());
  };

  // Load a new track when the current one changes.
  useEffect(() => {
    const a = audioRef.current;
    setTime(0);
    setDuration(0);
    if (!current) {
      a.removeAttribute("src");
      a.load();
      return;
    }
    a.src = current.uri;
    if (usePlayer.getState().isPlaying) a.play().catch(() => usePlayer.getState().pause());
  }, [current?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep the audio element in sync with play/pause.
  useEffect(() => {
    const a = audioRef.current;
    if (!current) return;
    if (isPlaying) a.play().catch(() => usePlayer.getState().pause());
    else a.pause();
  }, [isPlaying]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    audioRef.current.volume = muted ? 0 : volume;
  }, [volume, muted]);

  // OS-level media keys / lock screen controls.
  useEffect(() => {
    if (!("mediaSession" in navigator) || !current) return;
    navigator.mediaSession.metadata = new MediaMetadata({ title: current.title, artist: current.artistName });
    navigator.mediaSession.setActionHandler("play", () => usePlayer.setState({ isPlaying: true }));
    navigator.mediaSession.setActionHandler("pause", () => usePlayer.setState({ isPlaying: false }));
    navigator.mediaSession.setActionHandler("nexttrack", () => usePlayer.getState().next());
    navigator.mediaSession.setActionHandler("previoustrack", () => usePlayer.getState().prev());
  }, [current]);

  function handleEnded() {
    const s = usePlayer.getState();
    if (s.repeat === "one" || (s.repeat === "all" && s.queue.length === 1)) startFresh();
    else s.next();
  }

  function handlePrev() {
    const { pos, repeat } = usePlayer.getState();
    if (time > 3 || (pos === 0 && repeat !== "all")) startFresh();
    else prev();
  }

  const RepeatIcon = repeat === "one" ? Repeat1 : Repeat;
  const VolumeIcon = muted || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const disabled = !current;
  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <div className="relative grid grid-cols-[1fr_auto] items-center gap-4 px-3 py-2.5 md:h-[88px] md:grid-cols-[minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)] md:px-4 md:py-0">
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onEnded={handleEnded}
        onError={() => {
          if (current) {
            toast.error(`Couldn't play "${current.title}"`);
            usePlayer.getState().pause();
          }
        }}
      />

      {/* Thin progress line on mobile */}
      <div className="absolute inset-x-0 top-0 h-0.5 bg-secondary md:hidden" aria-hidden>
        <div className="h-full bg-primary" style={{ width: `${progress}%` }} />
      </div>

      {/* Now playing */}
      <div className="flex min-w-0 items-center gap-3">
        {current ? (
          <>
            <Cover seed={current.title} label={current.title} className="size-12 md:size-14" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{current.title}</p>
              <p className="truncate text-xs text-muted-foreground">{current.artistName}</p>
            </div>
            <LikeButton track={current} className="hidden sm:inline-flex" />
          </>
        ) : (
          <p className="text-sm text-muted-foreground">Pick a track to start listening</p>
        )}
      </div>

      {/* Transport + seek */}
      <div className="flex flex-col items-center gap-1">
        <div className="flex items-center gap-1 md:gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleShuffle}
            aria-label="Shuffle"
            aria-pressed={shuffle}
            className={cn("hidden text-muted-foreground md:inline-flex", shuffle && "text-primary hover:text-primary")}
          >
            <Shuffle />
          </Button>
          <Button variant="ghost" size="icon" onClick={handlePrev} disabled={disabled} aria-label="Previous track" className="hidden sm:inline-flex">
            <SkipBack className="fill-current" />
          </Button>
          <Button
            size="icon-lg"
            onClick={togglePlay}
            disabled={disabled}
            aria-label={isPlaying ? "Pause" : "Play"}
            className="rounded-full md:size-10"
          >
            {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={next} disabled={disabled} aria-label="Next track">
            <SkipForward className="fill-current" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={cycleRepeat}
            aria-label={`Repeat: ${repeat}`}
            className={cn("hidden text-muted-foreground md:inline-flex", repeat !== "off" && "text-primary hover:text-primary")}
          >
            <RepeatIcon />
          </Button>
        </div>
        <div className="hidden w-full max-w-xl items-center gap-2 md:flex">
          <span className="w-10 text-right text-xs text-muted-foreground tabular-nums">{formatTime(time)}</span>
          <Slider
            aria-label="Seek"
            value={[Math.min(time, duration || 0)]}
            max={duration || 1}
            step={1}
            disabled={disabled || !duration}
            onValueChange={([v]) => {
              audioRef.current.currentTime = v;
              setTime(v);
            }}
          />
          <span className="w-10 text-xs text-muted-foreground tabular-nums">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="hidden items-center justify-end gap-2 md:flex">
        <Button variant="ghost" size="icon" onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className="text-muted-foreground">
          <VolumeIcon />
        </Button>
        <Slider
          aria-label="Volume"
          className="max-w-28"
          value={[muted ? 0 : Math.round(volume * 100)]}
          max={100}
          step={1}
          onValueChange={([v]) => setVolume(v / 100)}
        />
      </div>
    </div>
  );
}
