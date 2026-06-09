import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-store";
import { Eye, Users, MessageCircle, CheckCircle2, TrendingUp, Clock, Plus } from "lucide-react";

export const Route = createFileRoute("/owner")({
  head: () => ({ meta: [{ title: "Ev sahibi paneli — RooMate" }] }),
  component: OwnerDashboard,
});

const STATS = [
  { icon: Eye, label: "Baxışlar", v: "1,243", trend: "+12%", color: "text-primary bg-primary/10" },
  { icon: Users, label: "Maraqlanan", v: "87", trend: "+5", color: "text-emerald-600 bg-emerald-500/10" },
  { icon: MessageCircle, label: "Aktiv çat", v: "14", trend: "+3", color: "text-accent bg-accent/15" },
  { icon: CheckCircle2, label: "Rezerv", v: "9", trend: "+1", color: "text-rose-500 bg-rose-500/10" },
];

function OwnerDashboard() {
  const { user } = useAuth();
  return (
    <AppShell>
      <TopBar title="Ev sahibi paneli"/>
      <div className="px-4 pt-3 animate-fade-in">
        <div className="brand-gradient text-white rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full"/>
          <div className="absolute -right-12 -bottom-10 w-40 h-40 bg-white/5 rounded-full"/>
          <p className="text-xs text-white/85 relative">Xoş gəldin,</p>
          <h2 className="text-xl font-bold relative">{user?.name}</h2>
          <div className="mt-4 flex items-end gap-2 relative">
            <div>
              <p className="text-[10px] text-white/75">Doluluq faizi</p>
              <p className="text-2xl font-bold">78%</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-[10px] text-white/75">Orta cavab</p>
              <p className="text-sm font-bold flex items-center gap-1"><Clock size={12}/> 12 dəq</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {STATS.map((s, i) => (
            <div key={s.label} className="bg-card border border-border rounded-2xl p-3 hover-lift animate-slide-up" style={{animationDelay:`${i*60}ms`}}>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={18}/></div>
              <p className="text-xl font-bold mt-2">{s.v}</p>
              <p className="text-[11px] text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5 mt-0.5"><TrendingUp size={10}/>{s.trend}</p>
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <h3 className="font-bold">Sürətli əməliyyatlar</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <Link to="/owner/listings" className="p-4 rounded-2xl bg-card border border-border press-scale hover-lift">
            <div className="text-2xl">🏠</div>
            <p className="font-semibold text-sm mt-2">Elanları idarə et</p>
          </Link>
          <Link to="/owner/new" className="p-4 rounded-2xl brand-gradient text-white press-scale hover-lift">
            <Plus size={24}/>
            <p className="font-semibold text-sm mt-2">Yeni elan</p>
          </Link>
        </div>

        <h3 className="font-bold mt-5 mb-2">Son fəaliyyət</h3>
        <div className="space-y-2">
          {[
            {emoji:"👀", t:"Aysel M. elanına baxdı", time:"5 dəq"},
            {emoji:"💬", t:"Kamran Q. mesaj göndərdi", time:"22 dəq"},
            {emoji:"✅", t:"Tural H. rezerv etdi", time:"1 saat"},
            {emoji:"⭐", t:"Yeni 5★ rəy aldın", time:"3 saat"},
          ].map((a, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border animate-slide-up" style={{animationDelay:`${i*60}ms`}}>
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
