import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Home, Search, MessageCircle, Bell, User, LayoutDashboard, Building2, Users } from "lucide-react";
import { useAuth } from "@/lib/auth-store";
import { useT } from "@/lib/settings-store";
import { useEffect, type ReactNode } from "react";
import logo from "@/assets/roomate-logo.asset.json";

export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logo.url} alt="RooMate" style={{ width: size, height: size }} className="rounded-lg object-contain" />
      <span className="font-bold text-lg brand-gradient-text tracking-tight">RooMate</span>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { user, ready } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (ready && !user && loc.pathname !== "/auth") {
      navigate({ to: "/auth" });
    }
  }, [ready, user, loc.pathname, navigate]);

  if (!ready || !user) return <>{children}</>;

  const studentNav = [
    { to: "/", label: "Ana", icon: Home },
    { to: "/search", label: "Axtar", icon: Search },
    { to: "/roommates", label: "Yoldaş", icon: Users },
    { to: "/messages", label: "Mesaj", icon: MessageCircle },
    { to: "/profile", label: "Profil", icon: User },
  ];
  const ownerNav = [
    { to: "/owner", label: "Panel", icon: LayoutDashboard },
    { to: "/owner/listings", label: "Elanlar", icon: Building2 },
    { to: "/messages", label: "Mesaj", icon: MessageCircle },
    { to: "/notifications", label: "Bildiriş", icon: Bell },
    { to: "/profile", label: "Profil", icon: User },
  ];
  const nav = user.role === "student" ? studentNav : ownerNav;

  return (
    <div className="min-h-screen bg-background flex flex-col max-w-md mx-auto relative shadow-2xl">
      <main className="flex-1 pb-24">{children}</main>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-card/95 backdrop-blur-xl border-t border-border z-40">
        <div className="flex items-center justify-around px-2 py-2 safe-area">
          {nav.map((item) => {
            const active = item.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex flex-col items-center gap-1 px-3 py-1.5 rounded-xl press-scale transition-all"
              >
                <div className={`p-1.5 rounded-xl transition-all ${active ? "brand-gradient text-white scale-110 shadow-lg" : "text-muted-foreground"}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium transition-colors ${active ? "text-foreground" : "text-muted-foreground"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function TopBar({ title, right, back }: { title: string; right?: ReactNode; back?: boolean }) {
  const navigate = useNavigate();
  return (
    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between animate-fade-in">
      <div className="flex items-center gap-2">
        {back && (
          <button onClick={() => navigate({ to: ".." as any })} className="p-1.5 -ml-1.5 rounded-lg hover:bg-secondary press-scale">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
          </button>
        )}
        <h1 className="text-lg font-bold">{title}</h1>
      </div>
      {right}
    </div>
  );
}
