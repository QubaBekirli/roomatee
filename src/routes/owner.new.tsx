import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, ShieldCheck, Check } from "lucide-react";
import { addListing } from "@/lib/listings-store";
import { useAuth } from "@/lib/auth-store";

export const Route = createFileRoute("/owner/new")({
  head: () => ({ meta: [{ title: "Yeni elan — RooMate" }] }),
  component: NewListing,
});

const UTILS = ["Wi-Fi","İsitmə","Kondisioner","Paltaryuyan","Soyuducu","Bulaşıq maşını"];

function NewListing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(0);
  const steps = ["Əsas", "Şərait", "Doğrulama"];
  const [form, setForm] = useState({
    title: "",
    district: "",
    university: "",
    metroDistance: "",
    price: "",
    rooms: "",
    totalBeds: "",
    gender: "qarışıq" as "kişi" | "qadın" | "qarışıq",
    description: "",
    pets: false,
    smoking: false,
    utilities: [] as string[],
    docs: [] as string[],
  });

  const set = (p: Partial<typeof form>) => setForm(f => ({ ...f, ...p }));
  const toggleUtil = (u: string) => set({ utilities: form.utilities.includes(u) ? form.utilities.filter(x => x !== u) : [...form.utilities, u] });
  const togglePet = () => set({ pets: !form.pets });
  const toggleSmoke = () => set({ smoking: !form.smoking });

  const canNext = () => {
    if (step === 0) return form.title.trim() && form.district.trim() && +form.price > 0 && +form.totalBeds > 0;
    return true;
  };

  const submit = () => {
    if (!canNext()) { toast.error("Zəruri sahələri doldur"); return; }
    if (step < 2) { setStep(step + 1); return; }
    addListing({
      title: form.title,
      district: form.district,
      university: form.university || "—",
      metroDistance: form.metroDistance || "Şəhər mərkəzi",
      price: +form.price,
      rooms: +form.rooms || 1,
      totalBeds: +form.totalBeds || 1,
      gender: form.gender,
      utilities: form.utilities,
      pets: form.pets,
      smoking: form.smoking,
      description: form.description || "Yeni paylaşılan elan.",
      owner: { name: user?.name || "Sən", verified: !!user?.verified, responseMin: 5, avatar: user?.avatar || "" },
    });
    toast.success("🎉 Elan paylaşıldı! Tələbələr indi görə bilər.");
    navigate({ to: "/owner/listings" });
  };

  return (
    <AppShell>
      <TopBar back title="Yeni elan"/>
      <div className="px-4 pt-3">
        <div className="flex gap-2 mb-4">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-secondary"}`}/>
              <p className={`text-[10px] mt-1 font-semibold flex items-center gap-1 ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>
                {i < step && <Check size={10} className="text-primary"/>}{s}
              </p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-3 animate-fade-in">
            <Input label="Başlıq *" placeholder="Yasamal, ADA-ya yaxın..." value={form.title} onChange={e => set({title:e.target.value})}/>
            <Input label="Rayon *" placeholder="Yasamal" value={form.district} onChange={e => set({district:e.target.value})}/>
            <Input label="Universitet" placeholder="ADA University" value={form.university} onChange={e => set({university:e.target.value})}/>
            <Input label="Metro / yaxınlıq" placeholder="5 dəq Nəsimi metro" value={form.metroDistance} onChange={e => set({metroDistance:e.target.value})}/>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Qiymət ₼ *" type="number" value={form.price} onChange={e => set({price:e.target.value})}/>
              <Input label="Otaq *" type="number" value={form.rooms} onChange={e => set({rooms:e.target.value})}/>
              <Input label="Yer *" type="number" value={form.totalBeds} onChange={e => set({totalBeds:e.target.value})}/>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground block mb-1.5">Cins</label>
              <div className="flex gap-2">
                {(["qarışıq","kişi","qadın"] as const).map(g => (
                  <button key={g} onClick={() => set({gender:g})} className={`flex-1 py-2 rounded-xl text-xs font-semibold border-2 transition press-scale ${form.gender===g?"border-primary bg-primary/5 text-primary":"border-border text-muted-foreground"}`}>{g}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Təsvir</label>
              <textarea value={form.description} onChange={e => set({description:e.target.value})} rows={3} placeholder="Mənzil haqqında qısa məlumat..." className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm transition resize-none"/>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm font-semibold">Kommunal</p>
            <div className="grid grid-cols-2 gap-2">
              {UTILS.map(o => {
                const on = form.utilities.includes(o);
                return (
                  <button key={o} onClick={() => toggleUtil(o)} className={`flex items-center justify-between p-3 rounded-xl border-2 press-scale transition ${on ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
                    <span className="text-sm">{o}</span>
                    {on && <Check size={16} className="text-primary"/>}
                  </button>
                );
              })}
            </div>
            <p className="text-sm font-semibold mt-3">Qaydalar</p>
            <button onClick={togglePet} className={`w-full flex items-center justify-between p-3 rounded-xl border-2 press-scale transition ${form.pets ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              <span className="text-sm">🐾 Heyvan icazəsi</span>
              {form.pets && <Check size={16} className="text-primary"/>}
            </button>
            <button onClick={toggleSmoke} className={`w-full flex items-center justify-between p-3 rounded-xl border-2 press-scale transition ${form.smoking ? "border-primary bg-primary/5" : "border-border bg-card"}`}>
              <span className="text-sm">🚬 Siqaret icazəsi</span>
              {form.smoking && <Check size={16} className="text-primary"/>}
            </button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
            <div className="p-4 rounded-2xl border-2 border-primary/30 bg-primary/5 flex items-center gap-3">
              <ShieldCheck className="text-primary"/>
              <div>
                <p className="font-bold text-sm">Verified Property</p>
                <p className="text-[11px] text-muted-foreground">Sənəd yükləmək könüllüdür, lakin doğrulamanı sürətləndirir</p>
              </div>
            </div>
            {["Çıxarış","Kupça","Kommunal ödəniş"].map(d => {
              const on = form.docs.includes(d);
              return (
                <button key={d} onClick={() => set({ docs: on ? form.docs.filter(x => x !== d) : [...form.docs, d] })} className={`w-full p-4 rounded-2xl border-2 border-dashed flex flex-col items-center gap-2 press-scale transition ${on ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`}>
                  {on ? <Check size={20} className="text-primary"/> : <Upload size={20} className="text-muted-foreground"/>}
                  <span className="text-sm font-semibold">{d}</span>
                  <span className="text-[10px] text-muted-foreground">{on ? "Yükləndi ✓" : "PDF, JPG max 5MB"}</span>
                </button>
              );
            })}

            <div className="mt-3 p-4 rounded-2xl bg-secondary">
              <p className="text-xs font-bold mb-2">Önbaxış:</p>
              <p className="text-sm font-bold">{form.title || "Başlıq daxil et"}</p>
              <p className="text-[11px] text-muted-foreground">{form.district || "Rayon"} · ₼{form.price || 0}/ay · {form.totalBeds || 0} yer</p>
            </div>
          </div>
        )}

        <button
          onClick={submit}
          disabled={!canNext()}
          className="w-full mt-6 mb-4 py-3.5 rounded-2xl bg-primary text-white font-bold press-scale shadow-lg shadow-primary/30 disabled:opacity-50 hover:brightness-110 transition"
        >
          {step < 2 ? "Növbəti addım" : "🚀 Elanı paylaş"}
        </button>
      </div>
    </AppShell>
  );
}

function Input({ label, ...p }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>
      <input {...p} className="w-full mt-1 px-4 py-3 rounded-xl bg-card border border-border focus:border-primary outline-none text-sm transition"/>
    </div>
  );
}
