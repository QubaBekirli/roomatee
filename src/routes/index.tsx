import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, BrandMark } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-store";
import { useListings } from "@/lib/listings-store";
import { ListingCard } from "@/components/ListingCard";
import { Bell, Search, Sparkles, Zap, ShieldCheck, Users, MapPin, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Ana — RooMate" }] }),
  component: HomePage,
});

const QUICK = [
  { icon: Zap, label: "Təcili", color: "bg-rose-500/10 text-rose-500", filter: "urgent" },
  { icon: ShieldCheck, label: "Doğrulanmış", color: "bg-emerald-500/10 text-emerald-500", filter: "verified" },
  { icon: Users, label: "Yoldaş", color: "bg-primary/10 text-primary", filter: "roommate" },
  { icon: Sparkles, label: "Premium", color: "bg-accent/15 text-accent", filter: "premium" },
];

const DISTRICTS = ["Hamısı", "Yasamal", "Xətai", "Nəsimi", "Nərimanov", "Səbail"];

function HomePage() {
  const { user } = useAuth();
  const listings = useListings();
  const [district, setDistrict] = useState("Hamısı");
  const [quick, setQuick] = useState<string | null>(null);
  const [liveCount, setLiveCount] = useState(247);

  // Simulate live activity
  useEffect(() => {
    const t = setInterval(() => setLiveCount(c => c + Math.floor(Math.random() * 3)), 4000);
    return () => clearInterval(t);
  }, []);

  let filtered = district === "Hamısı" ? listings : listings.filter((l) => l.district === district);
  if (quick === "verified") filtered = filtered.filter(l => l.verified);
  if (quick === "premium") filtered = filtered.filter(l => l.premium);
  if (quick === "urgent") filtered = filtered.filter(l => l.beds.filter(b => b === "free").length <= 1);

  return (
    <AppShell>
      <div className="px-4 pt-4 pb-2 animate-fade-in">
        <div className="flex items-center justify-between">
          <BrandMark size={36} />
          <Link to="/notifications" className="relative p-2 rounded-xl bg-secondary press-scale hover:bg-primary/10 transition">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full pulse-dot" />
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Salam, {user?.name?.split(" ")[0]} 👋</p>
          <h2 className="text-2xl font-bold leading-tight">Yeni evini <span className="text-primary">tap</span></h2>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"/>
            <span className="font-semibold text-emerald-600">{liveCount}</span> tələbə online · son saatda <span className="font-semibold text-primary">+{Math.floor(liveCount/30)}</span> yeni elan
          </div>
        </div>

        <Link to="/search" className="mt-3 flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 hover-lift press-scale transition-all hover:border-primary/50">
          <Search size={18} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground flex-1">Şəhər, rayon və ya universitet axtar...</span>
          <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">AI</span>
        </Link>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {QUICK.map((q, i) => {
            const active = quick === q.filter;
            return (
              <button
                key={q.label}
                onClick={() => setQuick(active ? null : q.filter)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border press-scale hover-lift animate-slide-up transition-all ${active ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className={`p-2 rounded-xl transition-transform ${active ? "scale-110" : ""} ${q.color}`}><q.icon size={18} /></div>
                <span className="text-[10px] font-semibold">{q.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Urgent banner — solid color, no gradient */}
      <div className="mx-4 mt-4 rounded-2xl bg-primary p-4 text-white relative overflow-hidden animate-scale-in">
        <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full animate-float"/>
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur"><Zap size={20} /></div>
          <div className="flex-1">
            <p className="font-bold text-sm">Təcili köçmə</p>
            <p className="text-[11px] text-white/85">Bu həftə dərhal köç</p>
          </div>
          <button onClick={() => setQuick("urgent")} className="text-xs font-bold bg-accent text-accent-foreground px-3 py-1.5 rounded-lg press-scale hover:brightness-110 transition">
            Aktiv et
          </button>
        </div>
      </div>

      <div className="mt-5 flex gap-2 px-4 overflow-x-auto no-scrollbar">
        {DISTRICTS.map((d) => (
          <button
            key={d}
            onClick={() => setDistrict(d)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all press-scale ${district === d ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-card border-border text-muted-foreground hover:border-primary/40"}`}
          >
            <MapPin size={11} className="inline mr-1 -mt-0.5"/>{d}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold flex items-center gap-1.5"><TrendingUp size={16} className="text-primary"/>Sənin üçün uyğun</h3>
          <Link to="/search" className="text-xs text-primary font-semibold story-link">Hamısı →</Link>
        </div>
        <div className="grid gap-4">
          {filtered.map((l, i) => <ListingCard key={l.id} l={l} delay={i * 70} />)}
          {filtered.length === 0 && (
            <div className="text-center text-sm text-muted-foreground py-12 animate-fade-in">
              <div className="text-4xl mb-2">🔍</div>
              Bu filtrlə elan yoxdur
            </div>
          )}
        </div>
      </div>

      <div className="px-4 mt-6">
        <Link to="/roommates" className="block rounded-2xl bg-card border border-border p-4 hover-lift press-scale transition hover:border-accent/40">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/15 text-accent animate-float">🤝</div>
            <div className="flex-1">
              <p className="font-bold text-sm">Smart Roommate Matching</p>
              <p className="text-[11px] text-muted-foreground">AI ilə uyğun otaq yoldaşı tap</p>
            </div>
            <span className="text-primary text-xl">→</span>
          </div>
        </Link>
      </div>
    </AppShell>
  );
}
