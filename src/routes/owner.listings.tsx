import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { LISTINGS } from "@/lib/mock-data";
import { BedDots } from "@/components/ListingCard";
import { Plus, MoreVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/owner/listings")({
  head: () => ({ meta: [{ title: "Elanlarım — RooMate" }] }),
  component: OwnerListings,
});

type BedStatus = "free" | "reserved" | "taken";

function OwnerListings() {
  const [data, setData] = useState(LISTINGS.map(l => ({ ...l })));

  const cycle = (lid: string, bedIdx: number) => {
    setData(d => d.map(l => {
      if (l.id !== lid) return l;
      const beds = [...l.beds] as BedStatus[];
      const order: BedStatus[] = ["free","reserved","taken"];
      beds[bedIdx] = order[(order.indexOf(beds[bedIdx]) + 1) % 3];
      return { ...l, beds };
    }));
    toast.success("Yer statusu yeniləndi (real-time)");
  };

  return (
    <AppShell>
      <TopBar title="Elanlarım" right={
        <Link to="/owner/new" className="p-2 rounded-xl brand-gradient text-white press-scale"><Plus size={16}/></Link>
      }/>
      <div className="px-4 pt-3 space-y-3">
        {data.map((l, i) => (
          <div key={l.id} className="bg-card rounded-2xl border border-border overflow-hidden animate-slide-up" style={{animationDelay:`${i*70}ms`}}>
            <div className="flex gap-3 p-3">
              <img src={l.images[0]} className="w-20 h-20 rounded-xl object-cover"/>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-sm leading-tight line-clamp-2">{l.title}</h3>
                  <button className="p-1 text-muted-foreground"><MoreVertical size={14}/></button>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">₼{l.price}/ay · {l.district}</p>
                <div className="flex items-center gap-1 mt-1.5"><BedDots beds={l.beds}/><span className="text-[10px] text-muted-foreground ml-1">{l.beds.filter(b=>b==="free").length} boş</span></div>
              </div>
            </div>
            <div className="border-t border-border p-3">
              <p className="text-[10px] font-semibold text-muted-foreground mb-2">YER STATUSU — basaraq dəyiş</p>
              <div className="grid grid-cols-4 gap-2">
                {l.beds.map((b, idx) => (
                  <button key={idx} onClick={() => cycle(l.id, idx)} className={`p-2 rounded-lg text-[10px] font-bold transition-all press-scale ${b === "free" ? "bg-emerald-500/15 text-emerald-600" : b === "reserved" ? "bg-amber-500/15 text-amber-600" : "bg-rose-500/15 text-rose-600"}`}>
                    Y{idx+1}<br/>{b === "free" ? "🟢" : b === "reserved" ? "🟡" : "🔴"}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
