import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { useAuth } from "@/lib/auth-store";
import { useUserListings } from "@/lib/listings-store";
import { ShieldCheck, Star, LogOut, Settings, FileText, Sparkles, Moon, Bell, Volume2, Mail, Heart, Edit3, ChevronRight, Award } from "lucide-react";
import { useSettings } from "@/lib/settings-store";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profil — RooMate" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useSettings();
  const mine = useUserListings();
  const [openSettings, setOpenSettings] = useState(false);
  const [openDocs, setOpenDocs] = useState(false);
  if (!user) return null;

  return (
    <AppShell>
      <TopBar title="Profil" right={
        <button onClick={() => toast.info("Profil redaktə yaxında")} className="p-2 rounded-xl bg-secondary press-scale hover:bg-primary/10 transition"><Edit3 size={14}/></button>
      }/>
      <div className="px-4 pt-2 animate-fade-in">
        <div className="bg-card rounded-3xl border border-border p-5 relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-32 h-32 bg-primary/5 rounded-full"/>
          <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-accent/5 rounded-full"/>
          <div className="relative flex items-center gap-4">
            <div className="relative">
              <img src={user.avatar} alt="" className="w-20 h-20 rounded-2xl bg-secondary"/>
              {user.verified && <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center border-2 border-card"><ShieldCheck size={12}/></span>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-bold truncate">{user.name}</h2>
              </div>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              {user.university && <p className="text-xs mt-0.5">🎓 {user.university}</p>}
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="fill-amber-400 text-amber-400"/>
                <span className="text-xs font-bold">4.9</span>
                <span className="text-[10px] text-muted-foreground">Reputation Score</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4 relative">
            <Stat label="Rezervlər" v={user.role === "owner" ? String(mine.length || 3) : "3"}/>
            <Stat label="Mesajlar" v="12"/>
            <Stat label="Bəyənilən" v="8"/>
          </div>
        </div>

        {/* Reputation card */}
        <div className="mt-4 p-4 rounded-2xl border-2 border-emerald-500/30 bg-emerald-500/5 flex items-center gap-3 press-scale hover-lift cursor-pointer">
          <div className="p-2 rounded-xl bg-emerald-500/15"><Award className="text-emerald-600" size={18}/></div>
          <div className="flex-1">
            <p className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
              {user.role === "student" ? "Doğrulanmış tələbə" : "Doğrulanmış ev sahibi"}
            </p>
            <p className="text-[11px] text-muted-foreground">Hesab statusu aktiv</p>
          </div>
          <ChevronRight size={16} className="text-muted-foreground"/>
        </div>

        {/* Premium */}
        <div onClick={() => toast.success("RooMate Plus tezliklə!")} className="mt-4 p-4 rounded-2xl bg-accent text-accent-foreground flex items-center gap-3 press-scale hover-lift cursor-pointer">
          <Sparkles size={20}/>
          <div className="flex-1">
            <p className="font-bold">RooMate Plus</p>
            <p className="text-[11px] opacity-80">Erkən bildiriş, AI uyğunluq və əlavə filtrlər</p>
          </div>
          <span className="text-xs font-bold bg-white/30 px-2.5 py-1 rounded-lg">₼9.99</span>
        </div>

        <div className="mt-4 divide-y divide-border bg-card rounded-2xl border border-border overflow-hidden">
          <Row icon={<FileText size={16}/>} label="Sənədlərim" badge="2" onClick={() => setOpenDocs(true)}/>
          <Row icon={<Heart size={16}/>} label="Bəyəndiklərim" badge="8" onClick={() => toast.info("Bəyəndiklər siyahısı yaxında")}/>
          <Row icon={<Bell size={16}/>} label="Bildirişlər" onClick={() => navigate({to:"/notifications"})}/>
          <Row icon={<Settings size={16}/>} label="Tənzimləmələr" onClick={() => setOpenSettings(true)}/>
          <ToggleRow icon={<Moon size={16}/>} label="Qaranlıq rejim" on={settings.dark} onChange={(v) => { setSettings({ dark: v }); toast.success(v ? "Qaranlıq rejim aktiv" : "İşıqlı rejim aktiv"); }}/>
        </div>

        {user.role === "owner" && (
          <Link to="/owner" className="block mt-3 p-4 rounded-2xl bg-card border border-border text-sm font-semibold text-center press-scale hover-lift transition hover:border-primary/40">
            🏠 Ev sahibi panelinə keç
          </Link>
        )}

        <button onClick={() => { logout(); toast.success("Çıxış edildi"); navigate({ to: "/auth" }); }} className="w-full mt-4 mb-6 p-3.5 rounded-2xl bg-card border border-rose-500/30 text-rose-500 font-semibold flex items-center justify-center gap-2 press-scale hover:bg-rose-500/5 transition">
          <LogOut size={16}/> Çıxış
        </button>
      </div>

      {openSettings && (
        <SettingsSheet onClose={() => setOpenSettings(false)} settings={settings} setSettings={setSettings}/>
      )}
      {openDocs && (
        <DocsSheet onClose={() => setOpenDocs(false)}/>
      )}
    </AppShell>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="text-center p-2 rounded-xl bg-secondary press-scale cursor-pointer hover:bg-primary/5 transition">
      <div className="text-lg font-bold">{v}</div>
      <div className="text-[10px] text-muted-foreground">{label}</div>
    </div>
  );
}
function Row({ icon, label, badge, onClick }: { icon: React.ReactNode; label: string; badge?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full flex items-center gap-3 px-4 py-3.5 press-scale hover:bg-secondary/50 transition">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm flex-1 text-left">{label}</span>
      {badge && <span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full">{badge}</span>}
      <ChevronRight size={14} className="text-muted-foreground"/>
    </button>
  );
}
function ToggleRow({ icon, label, on, onChange }: { icon: React.ReactNode; label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!on)} className="w-full flex items-center gap-3 px-4 py-3.5 press-scale hover:bg-secondary/50 transition">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-sm flex-1 text-left">{label}</span>
      <span className={`w-10 h-5.5 rounded-full transition-colors relative ${on ? "bg-primary" : "bg-muted"}`} style={{ width: 40, height: 22 }}>
        <span className="absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-all" style={{ left: on ? 20 : 2 }}/>
      </span>
    </button>
  );
}

function SettingsSheet({ onClose, settings, setSettings }: { onClose: () => void; settings: any; setSettings: (p: any) => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-md mx-auto animate-fade-in" onClick={onClose}>
      <div className="bg-card w-full rounded-t-3xl p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"/>
        <h3 className="text-lg font-bold mb-4">Tənzimləmələr</h3>
        <div className="space-y-2">
          <SettingToggle icon={<Bell size={16}/>} label="Push bildirişlər" desc="Yeni elanlar üçün bildir" on={settings.notifications} onChange={(v) => setSettings({notifications:v})}/>
          <SettingToggle icon={<Mail size={16}/>} label="E-poçt xəbərdarlığı" desc="Həftəlik xülasə" on={settings.emailAlerts} onChange={(v) => setSettings({emailAlerts:v})}/>
          <SettingToggle icon={<Heart size={16}/>} label="Yeni uyğunluq" desc="AI 90%+ tapanda" on={settings.newMatches} onChange={(v) => setSettings({newMatches:v})}/>
          <SettingToggle icon={<Volume2 size={16}/>} label="Səs effektləri" desc="Mesaj və bildirişlər" on={settings.soundOn} onChange={(v) => setSettings({soundOn:v})}/>
        </div>
        <div className="mt-4 p-3 rounded-xl bg-secondary text-[11px] text-muted-foreground">
          🌐 Dil: <span className="font-bold text-foreground">Azərbaycan</span> (yeganə dəstəklənən dil)
        </div>
        <button onClick={onClose} className="w-full mt-4 py-3 rounded-xl bg-primary text-white font-bold press-scale">Bağla</button>
      </div>
    </div>
  );
}
function SettingToggle({ icon, label, desc, on, onChange }: any) {
  return (
    <button onClick={() => onChange(!on)} className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card press-scale hover:border-primary/40 transition">
      <span className="p-2 rounded-lg bg-secondary text-muted-foreground">{icon}</span>
      <div className="flex-1 text-left">
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-[10px] text-muted-foreground">{desc}</p>
      </div>
      <span className={`relative rounded-full transition-colors ${on ? "bg-primary" : "bg-muted"}`} style={{ width: 40, height: 22 }}>
        <span className="absolute top-0.5 w-[18px] h-[18px] bg-white rounded-full shadow transition-all" style={{ left: on ? 20 : 2 }}/>
      </span>
    </button>
  );
}

function DocsSheet({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-md mx-auto animate-fade-in" onClick={onClose}>
      <div className="bg-card w-full rounded-t-3xl p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"/>
        <h3 className="text-lg font-bold mb-4">Sənədlərim</h3>
        <div className="space-y-2">
          {[
            { name: "Tələbə bileti", status: "Doğrulandı", color: "emerald" },
            { name: "Şəxsiyyət vəsiqəsi", status: "Doğrulandı", color: "emerald" },
            { name: "Universitet arayışı", status: "Gözləyir", color: "amber" },
          ].map(d => (
            <div key={d.name} className="flex items-center gap-3 p-3 rounded-xl bg-secondary">
              <FileText size={18} className="text-muted-foreground"/>
              <div className="flex-1">
                <p className="text-sm font-semibold">{d.name}</p>
                <p className={`text-[10px] font-bold text-${d.color}-600`}>{d.status}</p>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-4 py-3 rounded-xl bg-primary text-white font-bold press-scale">Bağla</button>
      </div>
    </div>
  );
}
