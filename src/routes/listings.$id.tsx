import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { getListing } from "@/lib/listings-store";
import { BedDots } from "@/components/ListingCard";
import { ShieldCheck, Star, Wifi, Heart, Share2, MessageCircle, CalendarCheck, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/listings/$id")({
  head: ({ params }) => ({ meta: [{ title: `Elan — RooMate` }, { name: "description", content: `Elan #${params.id}` }] }),
  component: ListingDetail,
});

function ListingDetail() {
  const { id } = Route.useParams();
  const l = getListing(id);
  const navigate = useNavigate();
  const [img, setImg] = useState(0);
  const [showReserve, setShowReserve] = useState(false);
  const [step, setStep] = useState(0);
  const [liked, setLiked] = useState(false);

  if (!l) return <AppShell><div className="p-6 text-center">Elan tapılmadı</div></AppShell>;

  const free = l.beds.filter((b) => b === "free").length;

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: l.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link kopyalandı");
    }
  };

  return (
    <AppShell>
      <TopBar back title="Elan" right={
        <div className="flex gap-1">
          <button onClick={share} className="p-2 rounded-xl bg-secondary press-scale hover:bg-primary/10 transition"><Share2 size={16}/></button>
          <button onClick={() => { setLiked(!liked); toast.success(liked ? "Bəyəndiklərdən çıxarıldı" : "Bəyəndilərə əlavə edildi"); }} className="p-2 rounded-xl bg-secondary press-scale hover:bg-rose-500/10 transition">
            <Heart size={16} className={liked ? "fill-rose-500 text-rose-500" : ""}/>
          </button>
        </div>
      }/>
      <div className="relative aspect-[4/3] bg-muted">
        <img src={l.images[img]} alt={l.title} className="w-full h-full object-cover animate-fade-in" key={img}/>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {l.images.map((_, i) => (
            <button key={i} onClick={() => setImg(i)} className={`h-1.5 rounded-full transition-all ${i === img ? "bg-white w-6" : "bg-white/50 w-1.5"}`}/>
          ))}
        </div>
      </div>

      <div className="px-4 pt-4 animate-fade-in">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold leading-tight">{l.title}</h1>
            <p className="text-sm text-muted-foreground mt-1">{l.district}, {l.city} · {l.metroDistance}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">₼{l.price}</div>
            <div className="text-[10px] text-muted-foreground">/aylıq</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          {l.verified && <Badge icon={<ShieldCheck size={12}/>} text="Doğrulanmış" tone="primary"/>}
          <Badge icon={<Star size={12} className="fill-amber-400 text-amber-400"/>} text={`${l.rating} (${l.reviews})`} tone="muted"/>
          <Badge text={l.gender} tone="muted"/>
          {l.pets && <Badge text="🐾 Pet OK" tone="muted"/>}
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-card border border-border">
          <div className="flex items-center justify-between mb-2">
            <p className="font-bold text-sm">Yer statusu (real-time)</p>
            <BedDots beds={l.beds}/>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {l.beds.map((b, i) => (
              <div key={i} className={`p-2 rounded-xl text-center text-[10px] font-semibold border ${b === "free" ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600" : b === "reserved" ? "bg-amber-500/10 border-amber-500/30 text-amber-600" : "bg-rose-500/10 border-rose-500/30 text-rose-600"}`}>
                Yer {i+1}<br/>{b === "free" ? "🟢 Boş" : b === "reserved" ? "🟡 Rezerv" : "🔴 Dolu"}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full pulse-dot"/> {free} boş yer var</p>
        </div>

        <div className="mt-4 p-4 rounded-2xl bg-card border border-border flex items-center gap-3 hover-lift transition">
          <img src={l.owner.avatar} alt="" className="w-12 h-12 rounded-full bg-secondary"/>
          <div className="flex-1">
            <div className="flex items-center gap-1.5">
              <p className="font-bold text-sm">{l.owner.name}</p>
              {l.owner.verified && <ShieldCheck size={14} className="text-primary fill-primary/20"/>}
            </div>
            <p className="text-[11px] text-muted-foreground">Ortalama cavab: {l.owner.responseMin} dəq</p>
          </div>
          <Link to="/messages/$id" params={{id:"t1"}} className="p-2.5 rounded-xl bg-primary text-white press-scale hover:brightness-110 transition"><MessageCircle size={16}/></Link>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{l.description}</p>

        {l.utilities.length > 0 && <>
          <h3 className="font-bold mt-5 mb-2">Kommunal & şərait</h3>
          <div className="flex flex-wrap gap-2">
            {l.utilities.map(u => <span key={u} className="text-xs px-3 py-1.5 rounded-full bg-secondary flex items-center gap-1 hover:bg-primary/10 transition press-scale cursor-default"><Wifi size={12}/>{u}</span>)}
          </div>
        </>}

        {l.nearby.length > 0 && <>
          <h3 className="font-bold mt-5 mb-2">Yaxınlıqda (Smart Location)</h3>
          <div className="grid grid-cols-2 gap-2">
            {l.nearby.map(n => (
              <div key={n.name} className="bg-card border border-border rounded-xl p-3 flex items-center gap-2 hover-lift transition">
                <span className="text-xl">{n.icon}</span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold truncate">{n.name}</p>
                  <p className="text-[10px] text-muted-foreground">{n.distance}</p>
                </div>
              </div>
            ))}
          </div>
        </>}

        <div className="mt-5 p-4 rounded-2xl border-2 border-primary/20 bg-primary/5">
          <div className="flex items-center gap-2 mb-1">
            <Lock size={14} className="text-primary"/>
            <p className="font-bold text-sm">Safe Deposit qorumalı</p>
          </div>
          <p className="text-xs text-muted-foreground">Depozit RooMate-də qalır, köçmədən sonra ev sahibinə ötürülür.</p>
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-full max-w-md px-4 z-20">
        <button onClick={() => { setShowReserve(true); setStep(0); }} className="w-full py-3.5 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/30 press-scale flex items-center justify-center gap-2 hover:brightness-110 transition">
          <CalendarCheck size={18}/> Rezerv et — ₼{l.price}
        </button>
      </div>

      {showReserve && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end max-w-md mx-auto animate-fade-in" onClick={() => setShowReserve(false)}>
          <div className="bg-card w-full rounded-t-3xl p-5 animate-slide-up" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-border rounded-full mx-auto mb-4"/>
            <h3 className="text-lg font-bold mb-1">Təhlükəsiz rezervasiya</h3>
            <p className="text-xs text-muted-foreground mb-4">Safe Deposit ilə qorunan proses</p>

            <div className="space-y-2">
              {[
                "Evi seçirsən",
                "Ev sahibi ilə danışırsan",
                "Rezerv sorğusu göndərirsən",
                "Depozit ödəyirsən (Escrow)",
                "Ev sahibi təsdiqləyir",
                "Yer rezerv olunur ✅",
              ].map((s, i) => (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${i <= step ? "bg-primary/5 border-primary/30" : "bg-secondary border-border opacity-60"}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${i <= step ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>{i+1}</div>
                  <span className="text-sm">{s}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                if (step < 5) setStep(step + 1);
                else { toast.success("🎉 Rezerv uğurla tamamlandı!"); setShowReserve(false); navigate({ to: "/messages" }); }
              }}
              className="w-full mt-5 py-3 rounded-xl bg-primary text-white font-bold press-scale hover:brightness-110 transition"
            >
              {step < 5 ? `Növbəti addım (${step+1}/6)` : "Tamamla ✓"}
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Badge({ icon, text, tone }: { icon?: React.ReactNode; text: string; tone: "primary" | "muted" }) {
  return (
    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${tone === "primary" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
      {icon}{text}
    </span>
  );
}
