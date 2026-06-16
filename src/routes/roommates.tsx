import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { ROOMMATES } from "@/lib/mock-data";
import { useState } from "react";
import { MessageCircle, Sparkles, X, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/roommates")({
  head: () => ({ meta: [{ title: "Otaq yoldaşı — RooMate" }] }),
  component: RoommatesPage,
});

function RoommatesPage() {
  const [i, setI] = useState(0);
  const r = ROOMMATES[i % ROOMMATES.length];

  const next = (liked: boolean) => {
    toast[liked ? "success" : "info"](liked ? `${r.name.split(" ")[0]} bəyənildi` : "Keçildi");
    setI((x) => x + 1);
  };

  return (
    <AppShell>
      <TopBar title="Otaq yoldaşı" right={<span className="text-[10px] font-bold bg-primary/10 text-primary px-2 py-1 rounded-full flex items-center gap-1"><Sparkles size={10}/>AI Match</span>}/>

      <div className="px-4 pt-3">
        <div className="bg-card rounded-3xl border border-border overflow-hidden animate-scale-in shadow-lg" key={r.id}>
          <div className="relative h-96 bg-secondary">
            <img src={r.avatar} alt={r.name} className="absolute inset-0 w-full h-full object-cover"/>
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent"/>
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 animate-bounce-in">
              <Sparkles size={12} className="text-accent"/> {r.compatibility}% uyğun
            </div>
            <div className="absolute bottom-3 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold drop-shadow-lg">{r.name}, {r.age}</h2>
              <p className="text-xs opacity-90 drop-shadow">{r.university} · {r.course}</p>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xl font-bold">{r.name}, {r.age}</h2>
                <p className="text-sm text-muted-foreground">{r.university} · {r.course}</p>
              </div>
            </div>
            <p className="text-sm mt-3 text-muted-foreground">{r.bio}</p>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Trait k="🌙 Yuxu" v={r.sleep}/>
              <Trait k="🧹 Təmizlik" v={r.cleanliness}/>
              <Trait k="🚬 Siqaret" v={r.smoking ? "Bəli" : "Xeyr"}/>
              <Trait k="🐾 Heyvan" v={r.pets ? "Bəli" : "Xeyr"}/>
            </div>

            <div className="mt-4 p-3 rounded-xl bg-secondary">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span className="font-semibold">AI Compatibility Score</span>
                <span className="font-bold text-primary">{r.compatibility}%</span>
              </div>
              <div className="h-2 bg-card rounded-full overflow-hidden">
                <div className="h-full brand-gradient transition-all duration-700" style={{ width: `${r.compatibility}%` }}/>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-5">
          <button onClick={() => next(false)} className="w-14 h-14 rounded-full bg-card border-2 border-border flex items-center justify-center press-scale hover-lift"><X size={24} className="text-rose-500"/></button>
          <button className="w-12 h-12 rounded-full bg-card border-2 border-border flex items-center justify-center press-scale"><MessageCircle size={20} className="text-primary"/></button>
          <button onClick={() => next(true)} className="w-14 h-14 rounded-full brand-gradient flex items-center justify-center press-scale shadow-lg shadow-primary/30"><Heart size={24} className="text-white fill-white"/></button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-3">Sürüşdür və ya basaraq seç</p>
      </div>
    </AppShell>
  );
}

function Trait({ k, v }: { k: string; v: string }) {
  return (
    <div className="p-2.5 rounded-xl bg-secondary">
      <p className="text-[10px] text-muted-foreground">{k}</p>
      <p className="text-xs font-semibold mt-0.5">{v}</p>
    </div>
  );
}
