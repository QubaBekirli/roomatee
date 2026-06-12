import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-store";
import { useUserListings } from "@/lib/listings-store";
import { Eye, Users, MessageCircle, CheckCircle2, TrendingUp, Clock, Plus, Building2 } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/owner")({
  head: () => ({ meta: [{ title: "Ev sahibi paneli — RooMate" }] }),
  component: OwnerDashboard,
});

function OwnerDashboard() {
  const { user } = useAuth();
  const mine = useUserListings();
  const [views, setViews] = useState(1243);
  const [interested, setInterested] = useState(87);
  const [activeChats, setActiveChats] = useState(14);

  // Live ticker
  useEffect(() => {
    const t = setInterval(() => {
      setViews(v => v + Math.floor(Math.random() * 4));
      if (Math.random() > 0.7) setInterested(i => i + 1);
      if (Math.random() > 0.85) setActiveChats(c => c + 1);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const occupancy = Math.min(100, 65 + mine.length * 5);

  const STATS = [
    { icon: Eye, label: "Baxışlar", v: views.toLocaleString(), trend: "+12%", color: "text-primary bg-primary/10" },
    { icon: Users, label: "Maraqlanan", v: String(interested), trend: "+5", color: "text-emerald-600 bg-emerald-500/10" },
    { icon: MessageCircle, label: "Aktiv çat", v: String(activeChats), trend: "+3", color: "text-accent bg-accent/15" },
    { icon: CheckCircle2, label: "Rezerv", v: "9", trend: "+1", color: "text-rose-500 bg-rose-500/10" },
  ];

  const totalListings = mine.length + 4;

  return (
    <AppShell>
      <TopBar title="Ev sahibi paneli"/>
      <div className="px-4 pt-3 animate-fade-in">
        <div className="bg-primary text-white rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full animate-float"/>
          <div className="absolute -right-12 -bottom-10 w-40 h-40 bg-white/5 rounded-full"/>
          <p className="text-xs text-white/85 relative">Xoş gəldin,</p>
          <h2 className="text-xl font-bold relative">{user?.name}</h2>
          <div className="mt-4 flex items-end gap-2 relative">
            <div>
              <p className="text-[10px] text-white/75">Doluluq faizi</p>
              <p className="text-2xl font-bold">{occupancy}%</p>
              <div className="mt-1 w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-accent transition-all duration-700" style={{ width: `${occupancy}%` }}/>
              </div>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-white/75">Orta cavab</p>
              <p className="text-sm font-bold flex items-center gap-1"><Clock size={12}/> 12 dəq</p>
              <p className="text-[10px] text-white/75 mt-1">{totalListings} aktiv elan</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-3 hover-lift animate-slide-up transition" style={{animationDelay:`${i*60}ms`}}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={18}/></div>
              <p className="text-xl font-bold mt-2 transition-all">{s.v}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5"><TrendingUp size={10}/>{s.trend}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h3 className="font-bold">Sürətli əməliyyatlar</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Link to="/owner/listings" className="p-4 rounded-2xl bg-card border border-border press-scale hover-lift transition hover:border-primary/40">
            <Building2 size={22} className="text-primary"/>
            <p className="font-semibold text-sm mt-2">Elanları idarə et</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{totalListings} aktiv</p>
          </Link>
          <Link to="/owner/new" className="p-4 rounded-2xl bg-primary text-white press-scale hover-lift transition hover:brightness-110">
            <Plus size={22}/>
            <p className="font-semibold text-sm mt-2">Yeni elan</p>
            <p className="text-[10px] text-white/70 mt-0.5">Dərhal paylaş</p>
          </Link>
        </div>

        <h3 className="font-bold mt-5 mb-2">Son fəaliyyət <span className="text-[10px] text-emerald-600 font-bold ml-1">● canlı</span></h3>
        <div className="space-y-2">
          {[
            {emoji:"👀", t:"Aysel M. elanına baxdı", time:"5 dəq"},
            {emoji:"💬", t:"Kamran Q. mesaj göndərdi", time:"22 dəq"},
            {emoji:"✅", t:"Tural H. rezerv etdi", time:"1 saat"},
            {emoji:"⭐", t:"Yeni 5★ rəy aldın", time:"3 saat"},
            {emoji:"💰", t:"Depozit qorumaya alındı (₼200)", time:"Dünən"},
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border animate-slide-up hover-lift transition" style={{animationDelay:`${i*60}ms`}}>
              <span className="text-xl">{a.emoji}</span>
              <p className="text-sm flex-1">{a.t}</p>
              <span className="text-[10px] text-muted-foreground">{a.time}</span>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
