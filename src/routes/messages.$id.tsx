import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { THREADS, type ChatMessage } from "@/lib/mock-data";
import { useEffect, useRef, useState } from "react";
import { Send, Paperclip, Image as ImageIcon, Calendar, ShieldCheck, Smile } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/messages/$id")({
  head: () => ({ meta: [{ title: "Çat — RooMate" }] }),
  component: ChatPage,
});

const REPLIES = [
  "Çox sağ olun, qeyd etdim 👌",
  "Bəli, sabah baxa bilərik 📅",
  "Şəkilləri göndərirəm bir az sonra 📸",
  "Qiymət danışıqlıdır, gəlin görüşək 🤝",
  "Yer hələ də boşdur ✅",
];

function ChatPage() {
  const { id } = Route.useParams();
  const thread = THREADS.find(t => t.id === id) ?? THREADS[0];
  const [msgs, setMsgs] = useState<ChatMessage[]>(thread.messages);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const [online, setOnline] = useState(thread.online);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing]);

  // Simulate online status fluctuation
  useEffect(() => {
    const t = setInterval(() => setOnline(o => Math.random() > 0.1 ? o : !o), 8000);
    return () => clearInterval(t);
  }, []);

  const send = () => {
    if (!text.trim()) return;
    const now = new Date();
    const time = now.toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" });
    setMsgs(m => [...m, { id: String(Date.now()), from: "me", text, time }]);
    setText("");
    setTimeout(() => setTyping(true), 500);
    setTimeout(() => {
      setTyping(false);
      const reply = REPLIES[Math.floor(Math.random() * REPLIES.length)];
      setMsgs(m => [...m, { id: String(Date.now()+1), from: "them", text: reply, time }]);
    }, 1600 + Math.random() * 800);
  };

  const sendQuick = (q: string) => { setText(q); setTimeout(() => { setText(""); setMsgs(m => [...m, { id: String(Date.now()), from: "me", text: q, time: "indi" }]); }, 50); };

  return (
    <AppShell>
      <TopBar back title={thread.name} right={
        <div className="flex items-center gap-1.5 text-[10px]">
          <span className={`w-2 h-2 rounded-full ${online ? "bg-emerald-500 pulse-dot" : "bg-muted-foreground"}`}/>
          <span className="text-muted-foreground">{online ? "online" : "offline"}</span>
        </div>
      }/>

      <div className="px-3 py-2 bg-primary/5 border-b border-primary/10 flex items-center gap-2 text-[11px]">
        <ShieldCheck size={14} className="text-primary"/>
        <span className="text-muted-foreground">RooMate qoruması altında. Şəxsi məlumat paylaşmayın.</span>
      </div>

      <div className="px-4 py-4 space-y-2">
        {msgs.map((m, i) => (
          <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-slide-up`} style={{animationDelay:`${Math.min(i*40,300)}ms`}}>
            <div className={`max-w-[78%] px-3.5 py-2 rounded-2xl text-sm ${m.from === "me" ? "bg-primary text-white rounded-br-sm" : "bg-card border border-border rounded-bl-sm"}`}>
              {m.text}
              <div className={`text-[9px] mt-0.5 ${m.from === "me" ? "text-white/70" : "text-muted-foreground"}`}>{m.time}</div>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-end gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground typing-dot"/>
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground typing-dot" style={{animationDelay:"0.2s"}}/>
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground typing-dot" style={{animationDelay:"0.4s"}}/>
            </div>
          </div>
        )}
        <div ref={endRef}/>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md p-2 bg-background/95 backdrop-blur border-t border-border">
        {msgs.length < 5 && (
          <div className="flex gap-1.5 mb-1.5 px-1 overflow-x-auto no-scrollbar">
            {["Salam 👋","Qiymət danışıqlıdır?","Sabah baxa bilərəm","Şəkil göndər"].map(q => (
              <button key={q} onClick={() => sendQuick(q)} className="shrink-0 text-[11px] font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary press-scale hover:bg-primary/15 transition">{q}</button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-1 bg-card border border-border rounded-2xl px-2 py-1.5 transition focus-within:border-primary">
          <button onClick={() => toast.info("Fayl əlavə et")} className="p-2 text-muted-foreground hover:text-primary press-scale transition"><Paperclip size={18}/></button>
          <button onClick={() => toast.info("Şəkil əlavə et")} className="p-2 text-muted-foreground hover:text-primary press-scale transition"><ImageIcon size={18}/></button>
          <button onClick={() => toast.info("Görüş təyin et")} className="p-2 text-muted-foreground hover:text-primary press-scale transition"><Calendar size={18}/></button>
          <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key==="Enter" && send()} placeholder="Mesaj yaz..." className="flex-1 bg-transparent outline-none text-sm px-1"/>
          <button onClick={() => setText(t => t + "😊")} className="p-2 text-muted-foreground hover:text-primary press-scale transition"><Smile size={18}/></button>
          <button onClick={send} disabled={!text.trim()} className="p-2.5 rounded-xl bg-primary text-white press-scale disabled:opacity-40 transition"><Send size={16}/></button>
        </div>
      </div>
    </AppShell>
  );
}
