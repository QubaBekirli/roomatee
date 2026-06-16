import { createFileRoute } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { useListings } from "@/lib/listings-store";
import { ListingCard } from "@/components/ListingCard";
import { Search as SearchIcon, SlidersHorizontal, X, MapPin, Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useT } from "@/lib/settings-store";

export const Route = createFileRoute("/search")({
  head: () => ({ meta: [{ title: "Axtar — RooMate" }] }),
  component: SearchPage,
});

function SearchPage() {
  const t = useT();
  const all = useListings();
  const [q, setQ] = useState("");
  const [openFilter, setOpenFilter] = useState(false);
  const [maxPrice, setMaxPrice] = useState(500);
  const [city, setCity] = useState<string>("any");
  const [district, setDistrict] = useState<string>("any");
  const [gender, setGender] = useState<string>("any");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [pets, setPets] = useState(false);
  const [sort, setSort] = useState<"new" | "cheap" | "rating">("new");

  const cities = useMemo(() => Array.from(new Set(all.map(l => l.city))), [all]);
  const districts = useMemo(() => {
    const pool = city === "any" ? all : all.filter(l => l.city === city);
    return Array.from(new Set(pool.map(l => l.district)));
  }, [all, city]);

  const list = useMemo(() => {
    let r = all.filter((l) => {
      if (q && !`${l.title} ${l.district} ${l.city} ${l.university}`.toLowerCase().includes(q.toLowerCase())) return false;
      if (city !== "any" && l.city !== city) return false;
      if (district !== "any" && l.district !== district) return false;
      if (l.price > maxPrice) return false;
      if (gender !== "any" && l.gender !== gender && l.gender !== "qarışıq") return false;
      if (verifiedOnly && !l.verified) return false;
      if (pets && !l.pets) return false;
      return true;
    });
    if (sort === "cheap") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "rating") r = [...r].sort((a, b) => b.rating - a.rating);
    return r;
  }, [all, q, city, district, maxPrice, gender, verifiedOnly, pets, sort]);

  const activeFilters = [verifiedOnly, pets, gender !== "any", maxPrice < 500, city !== "any", district !== "any"].filter(Boolean).length;

  return (
    <AppShell>
      <TopBar title={t("search")} right={
        <button onClick={() => setOpenFilter(true)} className="p-2 rounded-xl bg-secondary press-scale relative hover:bg-primary/10 transition">
          <SlidersHorizontal size={16} />
          {activeFilters > 0 && (
            <span className="absolute -top-1 -right-1 bg-primary text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold animate-bounce-in">{activeFilters}</span>
          )}
        </button>
      }/>
      <div className="px-4 pt-3">
        <div className="flex items-center gap-2 bg-card border border-border rounded-2xl px-3 py-2.5 transition-all focus-within:border-primary focus-within:shadow-sm focus-within:shadow-primary/10">
          <SearchIcon size={18} className="text-muted-foreground"/>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("search_ph")} className="flex-1 bg-transparent outline-none text-sm" />
          {q && <button onClick={() => setQ("")} className="press-scale"><X size={16} className="text-muted-foreground"/></button>}
        </div>

        {/* Quick city/district pills */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          <button onClick={() => { setCity("any"); setDistrict("any"); }} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition press-scale flex items-center gap-1 ${city==="any"?"bg-primary text-white border-primary":"bg-card border-border text-muted-foreground"}`}>
            <MapPin size={11}/>{t("all")}
          </button>
          {cities.map(c => (
            <button key={c} onClick={() => setCity(c)} className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition press-scale flex items-center gap-1 ${city===c?"bg-primary text-white border-primary":"bg-card border-border text-muted-foreground"}`}>
              <Building2 size={11}/>{c}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-2 overflow-x-auto no-scrollbar">
          {([["new","Yeni"],["cheap","Ən ucuz"],["rating","Reytinq"]] as const).map(([k,v]) => (
            <button key={k} onClick={() => setSort(k)} className={`shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold border transition press-scale ${sort===k?"bg-accent text-accent-foreground border-accent":"bg-card border-border text-muted-foreground"}`}>{v}</button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-3"><span className="font-bold text-foreground">{list.length}</span> {t("results")}</p>
        <div className="grid gap-4 mt-3">
          {list.map((l, i) => <ListingCard key={l.id} l={l} delay={i * 60} />)}
          {list.length === 0 && (
            <div className="text-center py-12 text-sm text-muted-foreground animate-fade-in">
              <div className="text-4xl mb-2">😕</div>{t("no_match")}
            </div>
          )}
        </div>
      </div>

      {openFilter && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end max-w-md mx-auto animate-fade-in" onClick={() => setOpenFilter(false)}>
          <div className="bg-card w-full rounded-t-3xl p-5 animate-slide-up max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-4">{t("filters")}</h3>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2"><Building2 size={12}/> {t("city")}</label>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => { setCity("any"); setDistrict("any"); }} className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition press-scale ${city==="any"?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground"}`}>{t("any")}</button>
                {cities.map(c => (
                  <button key={c} onClick={() => { setCity(c); setDistrict("any"); }} className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition press-scale ${city===c?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground"}`}>{c}</button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1 mb-2"><MapPin size={12}/> {t("district")}</label>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setDistrict("any")} className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition press-scale ${district==="any"?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground"}`}>{t("any")}</button>
                {districts.map(d => (
                  <button key={d} onClick={() => setDistrict(d)} className={`px-3 py-2 rounded-xl text-xs font-semibold border-2 transition press-scale ${district===d?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground"}`}>{d}</button>
                ))}
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5">
                {city === "any" ? `${districts.length} ərazi mövcuddur` : `${city} → ${districts.length} ərazi`}
              </p>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground">{t("max_price")}: <span className="text-primary font-bold">₼{maxPrice}</span></label>
              <input type="range" min={100} max={500} step={10} value={maxPrice} onChange={(e) => setMaxPrice(+e.target.value)} className="w-full accent-primary mt-1"/>
            </div>

            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground block mb-2">{t("gender")}</label>
              <div className="flex gap-2">
                {[["any",t("any")],["kişi",t("male")],["qadın",t("female")]].map(([g,lab]) => (
                  <button key={g} onClick={() => setGender(g)} className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition press-scale ${gender===g?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground"}`}>{lab}</button>
                ))}
              </div>
            </div>

            <label className="flex items-center justify-between py-2.5 cursor-pointer">
              <span className="text-sm">{t("verified_only")}</span>
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-5 h-5 accent-primary"/>
            </label>
            <label className="flex items-center justify-between py-2.5 cursor-pointer">
              <span className="text-sm">{t("pets_ok")}</span>
              <input type="checkbox" checked={pets} onChange={e => setPets(e.target.checked)} className="w-5 h-5 accent-primary"/>
            </label>

            <div className="flex gap-2 mt-4">
              <button onClick={() => { setMaxPrice(500); setGender("any"); setVerifiedOnly(false); setPets(false); setCity("any"); setDistrict("any"); }} className="flex-1 py-3 rounded-xl bg-secondary font-semibold press-scale text-sm">{t("reset")}</button>
              <button onClick={() => setOpenFilter(false)} className="flex-1 py-3 rounded-xl bg-primary text-white font-bold press-scale">
                {list.length} {t("show_n")}
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
