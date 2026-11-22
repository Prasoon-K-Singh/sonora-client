import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLibrary } from "@/store/library";
import { cn } from "@/lib/utils";

export function LikeButton({ track, className, size = "icon-sm" }) {
  const liked = useLibrary((s) => Boolean(s.liked[track.id]));
  const toggleLike = useLibrary((s) => s.toggleLike);
  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      aria-pressed={liked}
      aria-label={liked ? `Remove ${track.title} from liked songs` : `Add ${track.title} to liked songs`}
      onClick={() => toggleLike(track)}
      className={cn("text-muted-foreground hover:bg-transparent", liked && "text-like hover:text-like", className)}
    >
      <Heart className={cn(liked && "fill-current")} />
    </Button>
  );
}
