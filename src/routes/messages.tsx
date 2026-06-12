import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { THREADS } from "@/lib/mock-data";
import { Search, MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Mesajlar — RooMate" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [q, setQ] = useState("");
  const [threads, setThreads] = useState(THREADS);

  // Simulate online status changes
  useEffect(() => {
    const t = setInterval(() => {
      setThreads(prev => prev.map(th => Math.random() > 0.8 ? { ...th, online: !th.online } : th));
    }, 6000);
    return () => clearInterval(t);
  }, []);

  const filtered = threads.filter(t => t.name.toLowerCase().includes(q.toLowerCase()));
  const totalUnread = threads.reduce((s, t) => s + t.unread, 0);

  return (
    <AppShell>
      <TopBar title="Mesajlar" right={totalUnread > 0 ? <span className="text-[10px] font-bold bg-primary text-white px-2 py-1 rounded-full animate-bounce-in">{totalUnread} yeni</span> : undefined}/>
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2 focus-within:border-primary transition">
          <Search size={16} className="text-muted-foreground"/>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Söhbət axtar..." className="flex-1 bg-transparent outline-none text-sm"/>
        </div>
      </div>
      <div className="mt-2 divide-y divide-border">
        {filtered.map((t, i) => (
          <Link to="/messages/$id" params={{id:t.id}} key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 press-scale animate-slide-up transition" style={{animationDelay:`${i*60}ms`}}>
            <div className="relative">
              <img src={t.avatar} alt="" className="w-12 h-12 rounded-full bg-secondary"/>
              {t.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background pulse-dot"/>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm truncate">{t.name}</p>
                <span className="text-[10px] text-muted-foreground">{t.time}</span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className={`text-xs truncate ${t.unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{t.lastMessage}</p>
                {t.unread > 0 && <span className="ml-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in">{t.unread}</span>}
              </div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-sm text-muted-foreground animate-fade-in">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-40"/>
            Söhbət tapılmadı
          </div>
        )}
      </div>
    </AppShell>
  );
}
