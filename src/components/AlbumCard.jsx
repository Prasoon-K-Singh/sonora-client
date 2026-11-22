import { Link } from "react-router-dom";
import { Cover } from "@/components/Cover";

export function AlbumCard({ album }) {
  return (
    <Link
      to={`/album/${album._id}`}
      className="group block rounded-lg p-3 transition-colors outline-none hover:bg-accent/60 focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Cover seed={album.title} label={album.title} className="w-full shadow-lg shadow-black/30" rounded="rounded-md" />
      <p className="mt-3 truncate text-sm font-semibold">{album.title}</p>
      <p className="truncate text-xs text-muted-foreground">{album.artist?.username ?? "Unknown artist"}</p>
    </Link>
  );
}

export function AlbumGrid({ albums }) {
  return (
    <div className="-mx-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6">
      {albums.map((a) => (
        <AlbumCard key={a._id} album={a} />
      ))}
    </div>
  );
}
