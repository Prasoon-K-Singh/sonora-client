import { useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Disc3, FileAudio, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Cover } from "@/components/Cover";
import { EmptyState, Page, Section } from "@/components/PageSection";
import { TrackList } from "@/components/TrackList";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSongs } from "@/hooks/queries";
import { errorMessage, musicApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/store/auth";

function UploadForm() {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const upload = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("music", file); // field name expected by multer: "music"
      return musicApi.upload(fd, setProgress);
    },
    onSuccess: () => {
      toast.success(`"${title.trim()}" uploaded`);
      setTitle("");
      setFile(null);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
      qc.invalidateQueries({ queryKey: ["songs"] });
    },
    onError: (err) => {
      setProgress(0);
      toast.error(errorMessage(err, "Upload failed."));
    },
  });

  function onPick(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith("audio/")) {
      toast.error("Choose an audio file (mp3, wav, m4a, ogg).");
      e.target.value = "";
      return;
    }
    setFile(f);
    if (!title.trim()) setTitle(f.name.replace(/\.[^.]+$/, ""));
  }

  const busy = upload.isPending;
  const processing = busy && progress >= 100;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        upload.mutate();
      }}
      className="max-w-xl space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="track-title">Track title</Label>
        <Input id="track-title" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={busy} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="track-file">Audio file</Label>
        <label
          htmlFor="track-file"
          className={cn(
            "flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed px-6 py-8 text-center transition-colors hover:bg-accent/40 has-focus-visible:ring-[3px] has-focus-visible:ring-ring/40",
            busy && "pointer-events-none opacity-60",
          )}
        >
          {file ? <FileAudio className="size-7 text-primary" /> : <Upload className="size-7 text-muted-foreground" />}
          <span className="text-sm font-medium">{file ? file.name : "Choose an audio file"}</span>
          <span className="text-xs text-muted-foreground">
            {file ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : "MP3, WAV, M4A or OGG"}
          </span>
          <input id="track-file" ref={fileRef} type="file" accept="audio/*" onChange={onPick} className="sr-only" />
        </label>
      </div>

      {busy && (
        <div className="space-y-1.5" role="status">
          <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
            <div className="h-full bg-primary transition-[width]" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-muted-foreground">{processing ? "Finishing up on the server..." : `Uploading ${progress}%`}</p>
        </div>
      )}

      <Button type="submit" size="lg" disabled={busy || !file || !title.trim()}>
        {busy ? <Loader2 className="animate-spin" /> : <Upload />}
        Upload track
      </Button>
    </form>
  );
}

function AlbumForm({ myTracks }) {
  const qc = useQueryClient();
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState([]);

  const create = useMutation({
    mutationFn: () => musicApi.createAlbum({ title: title.trim(), musics: selected }),
    onSuccess: () => {
      toast.success(`Album "${title.trim()}" created`);
      setTitle("");
      setSelected([]);
      qc.invalidateQueries({ queryKey: ["albums"] });
    },
    onError: (err) => toast.error(errorMessage(err, "Couldn't create the album.")),
  });

  const toggle = (id) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  if (myTracks.length === 0) {
    return <EmptyState title="Upload a track first">Albums are built from tracks you've uploaded.</EmptyState>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        create.mutate();
      }}
      className="max-w-xl space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="album-title">Album title</Label>
        <Input id="album-title" required value={title} onChange={(e) => setTitle(e.target.value)} disabled={create.isPending} />
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Tracks ({selected.length} selected, in the order you pick them)</legend>
        <div className="max-h-72 overflow-y-auto rounded-xl border p-1">
          {myTracks.map((t) => {
            const order = selected.indexOf(t.id);
            return (
              <label key={t.id} className="flex cursor-pointer items-center gap-3 rounded-md p-2 hover:bg-accent/60">
                <Checkbox checked={order !== -1} onCheckedChange={() => toggle(t.id)} />
                <Cover seed={t.title} label={t.title} className="size-9" />
                <span className="min-w-0 flex-1 truncate text-sm font-medium">{t.title}</span>
                {order !== -1 && <span className="text-xs text-primary tabular-nums">#{order + 1}</span>}
              </label>
            );
          })}
        </div>
      </fieldset>

      <Button type="submit" size="lg" disabled={create.isPending || !title.trim() || selected.length === 0}>
        {create.isPending ? <Loader2 className="animate-spin" /> : <Disc3 />}
        Create album
      </Button>
    </form>
  );
}

export default function Studio() {
  const userId = useAuth((s) => s.user?.id);
  const songs = useSongs();
  const myTracks = (songs.data ?? []).filter((t) => t.artistId === userId);

  return (
    <Page>
      <h1 className="text-3xl font-bold md:text-4xl">Studio</h1>
      <p className="mt-1 text-muted-foreground">Upload music and group it into albums.</p>

      <Tabs defaultValue="upload" className="mt-6">
        <TabsList>
          <TabsTrigger value="upload">
            <Upload /> Upload track
          </TabsTrigger>
          <TabsTrigger value="album">
            <Disc3 /> Create album
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <UploadForm />
        </TabsContent>
        <TabsContent value="album">
          <AlbumForm myTracks={myTracks} />
        </TabsContent>
      </Tabs>

      <Section title={`Your tracks (${myTracks.length})`}>
        {myTracks.length === 0 ? (
          <EmptyState title="No uploads yet">Tracks you upload will appear here.</EmptyState>
        ) : (
          <TrackList tracks={myTracks} showArtist={false} />
        )}
      </Section>
    </Page>
  );
}
