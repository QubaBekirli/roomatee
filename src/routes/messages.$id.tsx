import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { THREADS } from "@/lib/mock-data";
import { useState } from "react";
import { Send, Paperclip, Image as ImageIcon, Calendar } from "lucide-react";

export const Route = createFileRoute("/messages/$id")({
  head: () => ({ meta: [{ title: "Çat — RooMate" }] }),
  component: ChatPage,
});

function ChatPage() {
  const { id } = Route.useParams();
  const thread = THREADS.find(t => t.id === id) ?? THREADS[0];
  const [msgs, setMsgs] = useState(thread.messages);
  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;
    setMsgs([...msgs, { id: String(Date.now()), from: "me", text, time: "indi" }]);
    setText("");
    setTimeout(() => {
      setMsgs(m => [...m, { id: String(Date.now()+1), from: "them", text: "Çox sağ olun, qeyd etdim 👌", time: "indi" }]);
    }, 900);
  };

  return (
    <AppShell>
      <TopBar back title={thread.name}/>
      <div className="px-4 py-4 space-y-2">
        {msgs.map((m, i) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-slide-up`} style={{animationDelay:`${i*40}ms`}}>
            <div className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm ${m.from === "me" ? "brand-gradient text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
              {m.text}
              <div className={`text-[9px] mt-0.5 ${m.from === "me" ? "text-white/70" : "text-muted-foreground"}`}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-2 bg-background/95 backdrop-blur border-t border-border">
        <div className="flex items-center gap-1.5 bg-card border border-border rounded-2xl px-2 py-1.5">
          <button className="p-2 text-muted-foreground hover:text-primary press-scale"><Paperclip size={18}/></button>
          <button className="p-2 text-muted-foreground hover:text-primary press-scale"><ImageIcon size={18}/></button>
          <button className="p-2 text-muted-foreground hover:text-primary press-scale"><Calendar size={18}/></button>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder="Mesaj yaz..." className="flex-1 bg-transparent outline-none text-sm px-1"/>
          <button onClick={send} className="p-2.5 rounded-xl brand-gradient text-white press-scale"><Send size={16}/></button>
        </div>
      </div>
    </AppShell>
  );
}
