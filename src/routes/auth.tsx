import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { loginDemo, setUser, useAuth, type Role } from "@/lib/auth-store";
import { BrandMark } from "@/components/AppShell";
import { toast } from "sonner";
import { GraduationCap, Home as HomeIcon, ShieldCheck, Sparkles, Loader2 } from "lucide-react";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Daxil ol — RooMate" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, ready } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [role, setRole] = useState<Role>("student");
  const [loading, setLoading] = useState<null | Role | "form">(null);
  const [form, setForm] = useState({ name: "", email: "", password: "", university: "" });

  useEffect(() => {
    if (ready && user) navigate({ to: user.role === "owner" ? "/owner" : "/" });
  }, [ready, user, navigate]);

  const quick = (r: Role) => {
    setLoading(r);
    setTimeout(() => {
      const u = loginDemo(r);
      toast.success(`Xoş gəldin, ${u.name}!`);
      navigate({ to: r === "owner" ? "/owner" : "/" });
    }, 600);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading("form");
    setTimeout(() => {
      setUser({
        id: "u_" + Date.now(),
        role,
        name: form.name || (role === "student" ? "Yeni Tələbə" : "Yeni Ev Sahibi"),
        email: form.email || `${role}@roomate.az`,
        university: form.university,
        verified: false,
        avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${encodeURIComponent(form.name || role)}`,
      });
      toast.success(mode === "login" ? "Daxil oldunuz!" : "Hesab yaradıldı!");
      navigate({ to: role === "owner" ? "/owner" : "/" });
    }, 700);
  };

  return (
    <div className="min-h-screen max-w-md mx-auto bg-background flex flex-col p-6 animate-fade-in">
      <div className="flex justify-center mt-6 mb-4 animate-scale-in">
        <BrandMark size={56} />
      </div>
      <p className="text-center text-sm text-muted-foreground mb-6 italic">
        "Axtarmağa yox, yaşamağa vaxt ayır."
      </p>

      {/* Demo quick login */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={() => quick("student")}
          disabled={loading !== null}
          className="group relative overflow-hidden rounded-2xl border-2 border-primary/20 bg-card p-4 press-scale hover-lift disabled:opacity-60"
        >
          <div className="flex flex-col items-center gap-2">
            {loading === "student" ? <Loader2 className="animate-spin text-primary" size={28}/> : <GraduationCap className="text-primary" size={28} />}
            <span className="text-xs font-bold">Tələbə kimi</span>
            <span className="text-[10px] text-muted-foreground">demo giriş</span>
          </div>
        </button>
        <button
          onClick={() => quick("owner")}
          disabled={loading !== null}
          className="group relative overflow-hidden rounded-2xl border-2 border-accent/30 bg-card p-4 press-scale hover-lift disabled:opacity-60"
        >
          <div className="flex flex-col items-center gap-2">
            {loading === "owner" ? <Loader2 className="animate-spin text-accent" size={28}/> : <HomeIcon className="text-accent" size={28} />}
            <span className="text-xs font-bold">Ev sahibi kimi</span>
            <span className="text-[10px] text-muted-foreground">demo giriş</span>
          </div>
        </button>
      </div>

      <div className="relative flex items-center my-2">
        <div className="flex-1 h-px bg-border" />
        <span className="px-3 text-xs text-muted-foreground">və ya</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Mode toggle */}
      <div className="flex bg-secondary rounded-xl p-1 mb-4 mt-2">
        {(["login", "register"] as const).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${mode === m ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
          >
            {m === "login" ? "Daxil ol" : "Qeydiyyat"}
          </button>
        ))}
      </div>

      {mode === "register" && (
        <div className="flex gap-2 mb-3 animate-fade-in">
          {(["student", "owner"] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition-all ${role === r ? "border-primary bg-primary/5 text-primary" : "border-border text-muted-foreground"}`}
            >
              {r === "student" ? "🎓 Tələbə" : "🏠 Ev sahibi"}
            </button>
          ))}
        </div>
      )}

      <form onSubmit={submit} className="space-y-3 animate-fade-in">
        {mode === "register" && (
          <input className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm transition" placeholder="Ad Soyad" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        )}
        {mode === "register" && role === "student" && (
          <input className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm transition" placeholder="Universitet" value={form.university} onChange={(e) => setForm({ ...form, university: e.target.value })} />
        )}
        <input type="email" className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm transition" placeholder="E-poçt" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input type="password" className="w-full px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm transition" placeholder="Şifrə" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <button type="submit" disabled={loading !== null} className="w-full py-3 rounded-xl brand-gradient text-white font-bold press-scale shadow-lg shadow-primary/20 disabled:opacity-60 flex items-center justify-center gap-2">
          {loading === "form" ? <Loader2 className="animate-spin" size={18}/> : <Sparkles size={18}/>}
          {mode === "login" ? "Daxil ol" : "Hesab yarat"}
        </button>
      </form>

      <div className="mt-6 grid grid-cols-3 gap-2 text-center">
        {[
          { icon: ShieldCheck, t: "Safe Deposit" },
          { icon: GraduationCap, t: "Verified" },
          { icon: Sparkles, t: "AI Matching" },
        ].map((f, i) => (
          <div key={i} className="bg-secondary/60 rounded-xl py-3 px-2 animate-slide-up" style={{ animationDelay: `${i * 80}ms` }}>
            <f.icon className="mx-auto text-primary" size={18} />
            <p className="text-[10px] mt-1 font-medium">{f.t}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
