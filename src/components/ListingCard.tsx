import { Link } from "@tanstack/react-router";
import { type Listing } from "@/lib/mock-data";
import { Heart, MapPin, ShieldCheck, Star, Zap } from "lucide-react";
import { toggleFavorite, useIsFavorite } from "@/lib/favorites-store";
import { toast } from "sonner";

export function BedDots({ beds }: { beds: Listing["beds"] }) {
  const map = { free: "bg-emerald-500", reserved: "bg-amber-500", taken: "bg-rose-500" } as const;
  return (
    <div className="flex gap-1">
      {beds.map((b, i) => (
        <span key={i} className={`w-2 h-2 rounded-full ${map[b]} ${b === "free" ? "pulse-dot" : ""}`} title={b} />
      ))}
    </div>
  );
}

export function ListingCard({ l, delay = 0 }: { l: Listing; delay?: number }) {
  const [liked, setLiked] = useState(false);
  const free = l.beds.filter((b) => b === "free").length;
  return (
    <Link
      to="/listings/$id"
      params={{ id: l.id }}
      className="block bg-card rounded-2xl overflow-hidden border border-border hover-lift press-scale animate-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img src={l.images[0]} alt={l.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" loading="lazy" />
        <div className="absolute top-2 left-2 flex gap-1">
          {l.premium && <span className="bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><Zap size={10}/>Premium</span>}
          {l.verified && <span className="bg-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><ShieldCheck size={10}/>Verified</span>}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); setLiked(!liked); }}
          className="absolute top-2 right-2 p-2 rounded-full bg-card/90 backdrop-blur press-scale"
        >
          <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : "text-foreground"} />
        </button>
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur text-white text-[11px] px-2 py-1 rounded-full flex items-center gap-1.5">
          <BedDots beds={l.beds} />
          <span className="font-semibold">{free} boş / {l.totalBeds}</span>
        </div>
      </div>
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-bold text-sm leading-tight line-clamp-1">{l.title}</h3>
          <div className="text-right shrink-0">
            <div className="font-bold text-primary">₼{l.price}</div>
            <div className="text-[10px] text-muted-foreground">/aylıq</div>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
          <MapPin size={12} /> <span className="truncate">{l.district} · {l.metroDistance}</span>
        </div>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1 text-xs">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-semibold">{l.rating}</span>
            <span className="text-muted-foreground">({l.reviews})</span>
          </div>
          <span className="text-[10px] text-muted-foreground">{l.gender}</span>
        </div>
      </div>
    </Link>
  );
}
