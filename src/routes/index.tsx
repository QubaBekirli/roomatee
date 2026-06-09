import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, BrandMark } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-store";
import { LISTINGS } from "@/lib/mock-data";
import { ListingCard } from "@/components/ListingCard";
import { Bell, Search, Sparkles, Zap, ShieldCheck, Users, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Ana — RooMate" }] }),
  component: HomePage,
});

const QUICK = [
  { icon: Zap, label: "Urgent", color: "bg-rose-500/10 text-rose-500" },
  { icon: ShieldCheck, label: "Verified", color: "bg-emerald-500/10 text-emerald-500" },
  { icon: Users, label: "Yoldaş", color: "bg-primary/10 text-primary" },
  { icon: Sparkles, label: "Premium", color: "bg-accent/15 text-accent" },
];

const DISTRICTS = ["Hamısı", "Yasamal", "Xətai", "Nəsimi", "Nərimanov", "Səbail"];

function HomePage() {
  const { user } = useAuth();
  const [district, setDistrict] = useState("Hamısı");
  const filtered = district === "Hamısı" ? LISTINGS : LISTINGS.filter((l) => l.district === district);

  return (
    <AppShell>
      <div className="px-4 pt-4 pb-2 animate-fade-in">
        <div className="flex items-center justify-between">
          <BrandMark size={36} />
          <Link to="/notifications" className="relative p-2 rounded-xl bg-secondary press-scale">
            <Bell size={18} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full pulse-dot" />
          </Link>
        </div>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground">Salam, {user?.name?.split(" ")[0]} 👋</p>
          <h2 className="text-2xl font-bold leading-tight">Yeni evini <span className="brand-gradient-text">tap</span></h2>
        </div>

        <Link to="/search" className="mt-4 flex items-center gap-2 bg-card border border-border rounded-2xl px-4 py-3 hover-lift press-scale">
          <Search size={18} className="text-muted-foreground" />
          <span className="text-sm text-muted-foreground flex-1">Şəhər, rayon və ya universitet axtar...</span>
          <span className="text-[10px] bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">AI</span>
        </Link>

        <div className="grid grid-cols-4 gap-2 mt-4">
          {QUICK.map((q, i) => (
            <button key={q.label} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border press-scale hover-lift animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
              <div className={`p-2 rounded-xl ${q.color}`}><q.icon size={18} /></div>
              <span className="text-[10px] font-semibold">{q.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Urgent banner */}
      <div className="mx-4 mt-4 rounded-2xl brand-gradient p-4 text-white relative overflow-hidden animate-scale-in">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]" />
        <div className="relative flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur"><Zap size={20} /></div>
          <div className="flex-1">
            <p className="font-bold text-sm">Urgent Move-In</p>
            <p className="text-[11px] text-white/85">Bu həftə dərhal köç</p>
          </div>
          <button className="text-xs font-bold bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg press-scale">Aktiv et</button>
        </div>
      </div>

      <div className="mt-5 flex gap-2 px-4 overflow-x-auto no-scrollbar">
        {DISTRICTS.map((d) => (
          <button
            key={d}
            onClick={() => setDistrict(d)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all press-scale ${district === d ? "brand-gradient text-white border-transparent shadow-md" : "bg-card border-border text-muted-foreground"}`}
          >
            <MapPin size={11} className="inline mr-1 -mt-0.5"/>{d}
          </button>
        ))}
      </div>

      <div className="px-4 mt-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Sənin üçün uyğun</h3>
          <Link to="/search" className="text-xs text-primary font-semibold">Hamısı →</Link>
        </div>
        <div className="grid gap-4">
          {filtered.map((l, i) => <ListingCard key={l.id} l={l} delay={i * 70} />)}
          {filtered.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">Bu rayonda elan yoxdur</p>
          )}
        </div>
      </div>

      <div className="px-4 mt-6">
        <Link to="/roommates" className="block rounded-2xl bg-card border border-border p-4 hover-lift press-scale">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-accent/15 text-accent">🤝</div>
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
