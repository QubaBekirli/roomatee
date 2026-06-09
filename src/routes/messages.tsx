import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { THREADS } from "@/lib/mock-data";

export const Route = createFileRoute("/messages")({
  head: () => ({ meta: [{ title: "Mesajlar — RooMate" }] }),
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <AppShell>
      <TopBar title="Mesajlar"/>
      <div className="divide-y divide-border">
        {THREADS.map((t, i) => (
          <Link to="/messages/$id" params={{id:t.id}} key={t.id} className="flex items-center gap-3 px-4 py-3 hover:bg-secondary/50 press-scale animate-slide-up" style={{animationDelay:`${i*60}ms`}}>
            <div className="relative">
              <img src={t.avatar} alt="" className="w-12 h-12 rounded-full bg-secondary"/>
              {t.online && <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-background"/>}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm truncate">{t.name}</p>
                <span className="text-[10px] text-muted-foreground">{t.time}</span>
              </div>
              <div className="flex justify-between items-center mt-0.5">
                <p className="text-xs text-muted-foreground truncate">{t.lastMessage}</p>
                {t.unread > 0 && <span className="ml-2 bg-primary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">{t.unread}</span>}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
