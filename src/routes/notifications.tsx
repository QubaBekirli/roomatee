import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { NOTIFICATIONS } from "@/lib/mock-data";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Bildirişlər — RooMate" }] }),
  component: NotifPage,
});

function NotifPage() {
  return (
    <AppShell>
      <TopBar back title="Bildirişlər"/>
      <div className="px-4 pt-3 space-y-2">
        {NOTIFICATIONS.map((n, i) => (
          <div key={n.id} className={`flex gap-3 p-3 rounded-2xl border animate-slide-up ${n.unread ? "bg-primary/5 border-primary/20" : "bg-card border-border"}`} style={{animationDelay:`${i*60}ms`}}>
            <div className="text-2xl shrink-0">{n.icon}</div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <p className="font-semibold text-sm">{n.title}</p>
                <span className="text-[10px] text-muted-foreground shrink-0">{n.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>
            </div>
            {n.unread && <span className="w-2 h-2 bg-primary rounded-full mt-2 pulse-dot"/>}
          </div>
        ))}
      </div>
    </AppShell>
  );
}
