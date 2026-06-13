import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { THREADS } from "@/lib/mock-data";
import { Search, MessageCircle, Phone, Video, ShieldCheck, X, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Mesajlar — RooMate" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  const [q, setQ] = useState("");
  const [threads, setThreads] = useState(THREADS);
  const [preview, setPreview] = useState<typeof THREADS[number] | null>(null);
  const navigate = useNavigate();

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
      <div className="mt-2">
        {filtered.map((t, i) => (
          <div key={t.id} className="flex items-stretch border-b border-border animate-slide-up" style={{animationDelay:`${i*60}ms`}}>
            <button onClick={() => setPreview(t)} className="pl-4 pr-2 py-3 press-scale" aria-label="Profilə bax">
              <div className="relative">
                <img src={t.avatar} alt="" className="w-12 h-12 rounded-full bg-secondary object-cover"/>
                {t.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background pulse-dot"/>}
              </div>
            </button>
            <Link to="/messages/$id" params={{id:t.id}} className="flex-1 min-w-0 flex items-center pr-4 py-3 hover:bg-secondary/50 press-scale transition">
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-sm truncate">{t.name}</p>
                  <span className="text-[10px] text-muted-foreground">{t.time}</span>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className={`text-xs truncate ${t.unread > 0 ? "text-foreground font-semibold" : "text-muted-foreground"}`}>{t.lastMessage}</p>
                  {t.unread > 0 && <span className="ml-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce-in shrink-0">{t.unread}</span>}
                </div>
              </div>
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-16 text-sm text-muted-foreground animate-fade-in">
            <MessageCircle size={32} className="mx-auto mb-2 opacity-40"/>
            Söhbət tapılmadı
          </div>
        )}
      </div>

      {preview && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-md mx-auto animate-fade-in" onClick={() => setPreview(null)}>
          <div className="bg-card w-full rounded-t-3xl p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"/>
            <div className="flex justify-end -mt-2 -mr-2">
              <button onClick={() => setPreview(null)} className="p-1.5 rounded-lg bg-secondary press-scale"><X size={14}/></button>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img src={preview.avatar} alt="" className="w-24 h-24 rounded-2xl bg-secondary object-cover"/>
                {preview.online && <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card pulse-dot"/>}
              </div>
              <h3 className="text-lg font-bold mt-3">{preview.name}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <span className={`w-1.5 h-1.5 rounded-full ${preview.online ? "bg-emerald-500" : "bg-muted-foreground"}`}/>
                {preview.online ? "Online" : "Offline"} · Son aktivlik {preview.time}
              </p>
              <div className="flex items-center gap-1 mt-2 text-[11px]">
                <ShieldCheck size={12} className="text-primary"/>
                <span className="text-muted-foreground">RooMate doğrulanmış</span>
                <span className="mx-1">·</span>
                <Star size={12} className="fill-amber-400 text-amber-400"/>
                <span className="font-bold">4.9</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-5">
              <button onClick={() => { setPreview(null); navigate({ to: "/messages/$id", params: { id: preview.id } }); }} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-primary text-white press-scale hover:brightness-110 transition">
                <MessageCircle size={18}/>
                <span className="text-[11px] font-semibold">Mesaj</span>
              </button>
              <button onClick={() => toast.info("Zəng tezliklə əlçatandır")} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-secondary press-scale hover:bg-primary/5 transition">
                <Phone size={18}/>
                <span className="text-[11px] font-semibold">Zəng</span>
              </button>
              <button onClick={() => toast.info("Video zəng tezliklə")} className="flex flex-col items-center gap-1 p-3 rounded-2xl bg-secondary press-scale hover:bg-primary/5 transition">
                <Video size={18}/>
                <span className="text-[11px] font-semibold">Video</span>
              </button>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/15 text-[11px] text-muted-foreground flex items-start gap-2">
              <ShieldCheck size={14} className="text-primary mt-0.5 shrink-0"/>
              <span>Bu istifadəçi RooMate tərəfindən doğrulanıb. Şəxsi məlumat və ya pul ödənişini söhbətdənkənar paylaşmayın.</span>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
