import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { LISTINGS } from "@/lib/mock-data";
import { BedDots } from "@/components/ListingCard";
import { Plus, MoreVertical, Trash2, Edit3, Eye } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useUserListings, deleteListing, updateListingBeds } from "@/lib/listings-store";

export const Route = createFileRoute("/owner/listings")({
  head: () => ({ meta: [{ title: "Elanlarım — RooMate" }] }),
  component: OwnerListings,
});

type BedStatus = "free" | "reserved" | "taken";

function OwnerListings() {
  const userListings = useUserListings();
  const [mockBeds, setMockBeds] = useState(() => Object.fromEntries(LISTINGS.map(l => [l.id, l.beds])));
  const [menu, setMenu] = useState<string | null>(null);

  const all = [...userListings, ...LISTINGS.map(l => ({ ...l, beds: mockBeds[l.id] || l.beds }))];

  const cycle = (lid: string, bedIdx: number, isUser: boolean) => {
    const order: BedStatus[] = ["free","reserved","taken"];
    if (isUser) {
      const l = userListings.find(x => x.id === lid);
      if (!l) return;
      const beds = [...l.beds] as BedStatus[];
      beds[bedIdx] = order[(order.indexOf(beds[bedIdx]) + 1) % 3];
      updateListingBeds(lid, beds);
    } else {
      setMockBeds(prev => {
        const beds = [...(prev[lid] || [])] as BedStatus[];
        beds[bedIdx] = order[(order.indexOf(beds[bedIdx]) + 1) % 3];
        return { ...prev, [lid]: beds };
      });
    }
    toast.success("Yer statusu yeniləndi (real-time)");
  };

  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = () => setMenu(null);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <AppShell>
      <TopBar title="Elanlarım" right={
        <Link to="/owner/new" className="p-2 rounded-xl bg-primary text-white press-scale hover:brightness-110 transition"><Plus size={16}/></Link>
      }/>
      <div className="px-4 pt-3 space-y-3" ref={ref}>
        {userListings.length > 0 && (
          <div className="text-[11px] font-bold text-emerald-600 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot"/>
            {userListings.length} yeni paylaşılan elan
          </div>
        )}
        {all.map((l, i) => {
          const isUser = userListings.some(u => u.id === l.id);
          return (
            <div key={l.id} className="bg-card rounded-2xl border border-border overflow-hidden animate-slide-up hover-lift transition" style={{animationDelay:`${i*70}ms`}}>
              <div className="flex gap-3 p-3">
                <img src={l.images[0]} className="w-20 h-20 rounded-xl object-cover" alt={l.title}/>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-sm leading-tight line-clamp-2">{l.title}</h3>
                    <div className="relative">
                      <button onClick={(e) => { e.stopPropagation(); setMenu(menu === l.id ? null : l.id); }} className="p-1 text-muted-foreground press-scale hover:text-foreground"><MoreVertical size={14}/></button>
                      {menu === l.id && (
                        <div className="absolute right-0 top-7 z-30 bg-card border border-border rounded-xl shadow-xl py-1 w-36 animate-scale-in">
                          <button onClick={() => { toast.info("Baxış"); setMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary press-scale text-left"><Eye size={12}/>Bax</button>
                          <button onClick={() => { toast.info("Redaktə yaxında"); setMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-secondary press-scale text-left"><Edit3 size={12}/>Redaktə et</button>
                          {isUser && (
                            <button onClick={() => { deleteListing(l.id); toast.success("Elan silindi"); setMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-rose-500/5 text-rose-500 press-scale text-left"><Trash2 size={12}/>Sil</button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">₼{l.price}/ay · {l.district}</p>
                  <div className="flex items-center gap-1 mt-1.5"><BedDots beds={l.beds}/><span className="text-[10px] text-muted-foreground ml-1">{l.beds.filter(b=>b==="free").length} boş</span>
                    {isUser && <span className="ml-auto text-[9px] font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">SƏNİN</span>}
                  </div>
                </div>
              </div>
              <div className="border-t border-border p-3">
                <p className="text-[10px] font-semibold text-muted-foreground mb-2">YER STATUSU — basaraq dəyiş</p>
                <div className="grid grid-cols-4 gap-2">
                  {l.beds.map((b, idx) => (
                    <button key={idx} onClick={() => cycle(l.id, idx, isUser)} className={`p-2 rounded-lg text-[10px] font-bold transition-all press-scale hover:scale-105 ${b === "free" ? "bg-emerald-500/15 text-emerald-600" : b === "reserved" ? "bg-amber-500/15 text-amber-600" : "bg-rose-500/15 text-rose-600"}`}>
                      Y{idx+1}<br/>{b === "free" ? "🟢" : b === "reserved" ? "🟡" : "🔴"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
