import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { LISTINGS } from "@/lib/mock-data";
import { ListingCard } from "@/components/ListingCard";
import { Search as SearchIcon, SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Axtar — RooMate" }] }),
  component: SearchPage,
});

function SearchPage() {
  const [q, setQ] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [gender, setGender] = useState<string>("hamısı");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [pets, setPets] = useState(false);

  const list = useMemo(() => LISTINGS.filter((l) => {
    if (q && !`${l.title} ${l.district} ${l.university}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (l.price > maxPrice) return false;
    if (gender !== "hamısı" && l.gender !== gender && l.gender !== "qarışıq") return false;
    if (verifiedOnly && !l.verified) return false;
    if (pets && !l.pets) return false;
    return true;
  }), [q, maxPrice, gender, verifiedOnly, pets]);

  return (
    <AppShell>
      <TopBar title="Axtarış" right={
        <button onClick={() => setOpenFilter(true)} className="p-2 rounded-xl bg-secondary press-scale relative">
          <SlidersHorizontal size={16} />
          <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">3</span>
        </button>
      }/>
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2.5">
          <SearchIcon size={18} className="text-muted-foreground"/>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rayon, universitet..." className="flex-1 bg-transparent outline-none text-sm" />
          {q && <button onClick={() => setQ("")}><X size={16} className="text-muted-foreground"/></button>}
        </div>
        <p className="text-xs text-muted-foreground mt-3">{list.length} nəticə tapıldı</p>
        <div className="grid gap-4 mt-3">
          {list.map((l, i) => <ListingCard key={l.id} l={l} delay={i * 60} />)}
        </div>
      </div>

      {openFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end max-w-md mx-auto animate-fade-in" onClick={() => setOpenFilter(false)}>
          <div className="bg-card w-full rounded-t-3xl p-5 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-4">Filtrlər</h3>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground">Maks. qiymət: ₼{maxPrice}</label>
              <input type="range" min={100} max={500} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary mt-1"/>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground block mb-2">Cins</label>
              <div className="flex gap-2">
                {["hamısı","kişi","qadın"].map(g => (
                  <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition ${gender===g?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground"}`}>{g}</button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between py-2.5 cursor-pointer">
              <span className="text-sm">Yalnız Verified</span>
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-5 h-5 accent-primary"/>
            </label>
            <label className="flex items-center justify-between py-2.5 cursor-pointer">
              <span className="text-sm">Heyvan icazəsi</span>
              <input type="checkbox" checked={pets} onChange={e => setPets(e.target.checked)} className="w-5 h-5 accent-primary"/>
            </label>

            <button onClick={() => setOpenFilter(false)} className="w-full mt-4 py-3 rounded-xl brand-gradient text-white font-bold press-scale">
              {list.length} elan göstər
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
