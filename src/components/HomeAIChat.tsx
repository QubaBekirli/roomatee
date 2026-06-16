import { useState, useMemo, useEffect, useRef } from "react";
import { Bot, Send, Sparkles, X, MapPin } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useListings } from "@/lib/listings-store";
import { useT } from "@/lib/settings-store";

type Msg = { from: "bot" | "me"; text: string; chips?: { label: string; value: string }[] };
type Step = "intro" | "district" | "rooms" | "price" | "result";

export function HomeAIChat() {
  const t = useT();
  const listings = useListings();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("intro");
  const [district, setDistrict] = useState<string | null>(null);
  const [rooms, setRooms] = useState<number | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const endRef = useRef<HTMLDivElement>(null);

  const districts = useMemo(() => Array.from(new Set(listings.map(l => l.district))), [listings]);

  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ from: "bot", text: t("ai_intro") }]);
      setTimeout(() => {
        setMsgs(m => [...m, { from: "bot", text: t("ask_district"), chips: [{ label: t("any"), value: "any" }, ...districts.map(d => ({ label: d, value: d })) ] }]);
        setStep("district");
      }, 700);
    }
  }, [open]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const matches = useMemo(() => {
    return listings.filter(l => {
      if (district && district !== "any" && l.district !== district) return false;
      if (rooms && (rooms === 3 ? l.rooms < 3 : l.rooms !== rooms)) return false;
      if (price && l.price > price) return false;
      return true;
    });
  }, [listings, district, rooms, price]);

  const pick = (label: string, value: string) => {
    setMsgs(m => [...m, { from: "me", text: label }]);
    setTimeout(() => {
      if (step === "district") {
        setDistrict(value);
        setMsgs(m => [...m, { from: "bot", text: t("ask_rooms"), chips: [{label:t("rooms_studio"),value:"1"},{label:t("rooms_2"),value:"2"},{label:t("rooms_3plus"),value:"3"},{label:t("any"),value:"0"}] }]);
        setStep("rooms");
      } else if (step === "rooms") {
        setRooms(value === "0" ? null : Number(value));
        setMsgs(m => [...m, { from: "bot", text: t("ask_price"), chips: [{label:"₼200",value:"200"},{label:"₼300",value:"300"},{label:"₼400",value:"400"},{label:"₼500",value:"500"}] }]);
        setStep("price");
      } else if (step === "price") {
        setPrice(Number(value));
        setStep("result");
      }
    }, 400);
  };

  const restart = () => {
    setStep("intro"); setDistrict(null); setRooms(null); setPrice(null); setMsgs([]);
    setTimeout(() => {
      setMsgs([{ from: "bot", text: t("ai_intro") }]);
      setTimeout(() => {
        setMsgs(m => [...m, { from: "bot", text: t("ask_district"), chips: [{ label: t("any"), value: "any" }, ...districts.map(d => ({ label: d, value: d }))] }]);
        setStep("district");
      }, 500);
    }, 50);
  };

  const lastChips = [...msgs].reverse().find(m => m.chips)?.chips;
  const showChips = step !== "result" && step !== "intro";

  return (
    <>
      <button onClick={() => setOpen(true)} className="mx-4 mt-4 w-[calc(100%-2rem)] flex items-center gap-3 p-4 rounded-2xl bg-card border-2 border-primary/30 hover-lift press-scale animate-fade-in group">
        <div className="relative">
          <div className="p-2.5 rounded-xl bg-primary text-white animate-float">
            <Bot size={20}/>
          </div>
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-card pulse-dot"/>
        </div>
        <div className="flex-1 text-left">
          <p className="font-bold text-sm flex items-center gap-1.5">{t("ai_helper")} <Sparkles size={12} className="text-accent"/></p>
          <p className="text-[11px] text-muted-foreground">{t("ai_intro")}</p>
        </div>
        <span className="text-[10px] font-bold bg-accent text-accent-foreground px-2 py-1 rounded-lg group-hover:scale-110 transition">{t("start")}</span>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end max-w-md mx-auto animate-fade-in" onClick={() => setOpen(false)}>
          <div className="bg-card w-full rounded-t-3xl flex flex-col animate-slide-up" style={{ height: "85vh" }} onClick={e => e.stopPropagation()}>
            <div className="px-5 pt-3 pb-3 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center"><Bot size={20}/></div>
              <div className="flex-1">
                <p className="font-bold text-sm flex items-center gap-1">{t("ai_helper")} <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-dot ml-1"/></p>
                <p className="text-[10px] text-muted-foreground">RooMate AI · online</p>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg bg-secondary press-scale"><X size={14}/></button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"} animate-slide-up`}>
                  <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${m.from === "me" ? "bg-primary text-white rounded-br-sm" : "bg-secondary text-foreground rounded-bl-sm"}`}>
                    {m.text}
                  </div>
                </div>
              ))}

              {step === "result" && (
                <div className="animate-slide-up">
                  <div className="bg-secondary rounded-2xl rounded-bl-sm p-3 text-sm">
                    <p className="font-semibold">✨ {matches.length} {t("results_found")}</p>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      {district && district !== "any" ? `📍 ${district} · ` : ""}
                      {rooms ? `🚪 ${rooms === 3 ? "3+" : rooms} otaq · ` : ""}
                      {price ? `💰 ≤ ₼${price}` : ""}
                    </p>
                  </div>
                  {matches.length === 0 ? (
                    <p className="text-xs text-muted-foreground text-center py-4">{t("no_match")}</p>
                  ) : (
                    <div className="mt-3 space-y-2">
                      {matches.slice(0, 4).map((l, i) => (
                        <Link to="/listings/$id" params={{id:l.id}} key={l.id} onClick={() => setOpen(false)} className="flex gap-3 p-2 rounded-xl bg-card border border-border press-scale hover-lift animate-slide-up" style={{animationDelay:`${i*60}ms`}}>
                          <img src={l.images[0]} className="w-16 h-16 rounded-lg object-cover" alt=""/>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold truncate">{l.title}</p>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-0.5"><MapPin size={9}/>{l.district}, {l.city}</p>
                            <p className="text-sm font-bold text-primary mt-0.5">₼{l.price}<span className="text-[9px] font-normal text-muted-foreground">/ay</span></p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2 mt-3">
                    <button onClick={restart} className="flex-1 py-2.5 rounded-xl bg-secondary text-xs font-semibold press-scale">{t("restart")}</button>
                    {matches.length > 0 && (
                      <Link to="/search" onClick={() => setOpen(false)} className="flex-1 py-2.5 rounded-xl bg-primary text-white text-xs font-bold press-scale text-center">{t("see_all")} →</Link>
                    )}
                  </div>
                </div>
              )}
              <div ref={endRef}/>
            </div>

            {showChips && lastChips && (
              <div className="px-4 py-3 border-t border-border bg-background/50">
                <div className="flex gap-2 flex-wrap">
                  {lastChips.map(c => (
                    <button key={c.value} onClick={() => pick(c.label, c.value)} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold press-scale hover:bg-primary/20 transition">
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
