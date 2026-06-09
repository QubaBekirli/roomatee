import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-store";
import { ShieldCheck, Star, LogOut, Settings, FileText, Globe, Sparkles, Moon } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profil — RooMate" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
  if (!user) return null;

  const toggleDark = () => {
    setDark(d => !d);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <AppShell>
      <TopBar title="Profil"/>
      <div className="px-4 pt-2 animate-fade-in">
        <div className="bg-card rounded-3xl border border-border p-5 relative overflow-hidden">
          <div className="absolute inset-0 brand-gradient opacity-5"/>
          <div className="relative flex items-center gap-4">
            <img src={user.avatar} alt="" className="w-20 h-20 rounded-2xl bg-secondary"/>
            <div className="flex-1">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold">{user.name}</h2>
                {user.verified && <ShieldCheck size={16} className="text-primary fill-primary/20"/>}
              </div>
              <p className="text-xs text-muted-foreground">{user.email}</p>
              {user.university && <p className="text-xs mt-0.5">🎓 {user.university}</p>}
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="fill-amber-400 text-amber-400"/>
                <span className="text-xs font-bold">4.9</span>
                <span className="text-[10px] text-muted-foreground">Reputation</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <Stat label="Rezervlər" v="3"/>
            <Stat label="Mesajlar" v="12"/>
            <Stat label="Bəyənilən" v="8"/>
          </div>
        </div>

        {/* Verified card */}
        <div className="mt-4 p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3">
          <ShieldCheck className="text-emerald-600"/>
          <div className="flex-1">
            <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
              {user.role === "student" ? "Verified Student" : "Verified Owner"}
            </p>
            <p className="text-[11px] text-muted-foreground">Doğrulanmış hesab</p>
          </div>
        </div>

        {/* Premium */}
        <div className="mt-4 p-4 rounded-2xl brand-gradient text-white flex items-center gap-3 press-scale hover-lift cursor-pointer">
          <Sparkles size={20}/>
          <div className="flex-1">
            <p className="font-bold">RooMate Plus</p>
            <p className="text-[11px] text-white/85">Erkən bildiriş, AI uyğunluq hesabatı və əlavə filtrlər</p>
          </div>
          <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-lg">₼9.99</span>
        </div>

        <div className="mt-4 divide-y divide-border bg-card rounded-2xl border border-border overflow-hidden">
          <Row icon={<FileText size={16}/>} label="Sənədlərim"/>
          <Row icon={<Settings size={16}/>} label="Tənzimləmələr"/>
          <Row icon={<Globe size={16}/>} label="Dil: Azərbaycan / English"/>
          <button onClick={toggleDark} className="w-full flex items-center gap-3 px-4 py-3.5 press-scale">
            <Moon size={16}/>
            <span className="text-sm flex-1 text-left">Qaranlıq rejim</span>
            <span className={`w-9 h-5 rounded-full transition-colors ${dark ? "bg-primary" : "bg-muted"} relative`}>
              <span className={`absolute top-0.5 ${dark ? "left-4.5" : "left-0.5"} w-4 h-4 bg-white rounded-full shadow transition-all`} style={{ left: dark ? 18 : 2 }}/>
            </span>
          </button>
        </div>

        {user.role === "student" ? null : (
          <Link to="/owner" className="block mt-3 p-4 rounded-2xl bg-card border border-border text-sm font-semibold text-center press-scale hover-lift">
            🏠 Ev sahibi panelinə keç
          </Link>
        )}

        <button onClick={() => { logout(); navigate({ to: "/auth" }); }} className="w-full mt-4 mb-6 p-3.5 rounded-2xl bg-card border border-rose-500/30 text-rose-500 font-semibold flex items-center justify-center gap-2 press-scale">
          <LogOut size={16}/> Çıxış
        </button>
      </div>
    </AppShell>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="text-center p-2 rounded-xl bg-secondary">
      <div className="text-lg font-bold">{v}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
function Row({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 px-4 py-3.5 press-scale hover:bg-secondary/50">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm flex-1 text-left">{label}</span>
      <span className="text-muted-foreground">›</span>
    </button>
  );
}
