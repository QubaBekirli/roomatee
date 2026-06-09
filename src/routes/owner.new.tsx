import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell, TopBar } from "@/components/AppShell";
import { useState } from "react";
import { toast } from "sonner";
import { Upload, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/owner/new")({
  head: () => ({ meta: [{ title: "Yeni elan — RooMate" }] }),
  component: NewListing,
});

function NewListing() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const steps = ["Əsas", "Şərait", "Doğrulama"];

  return (
    <AppShell>
      <TopBar back title="Yeni elan"/>
      <div className="px-4 pt-3">
        <div className="flex gap-2 mb-4">
          {steps.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1.5 rounded-full transition-all ${i <= step ? "brand-gradient" : "bg-secondary"}`}/>
              <p className={`text-[10px] mt-1 font-semibold ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</p>
            </div>
          ))}
        </div>

        {step === 0 && (
          <div className="space-y-3 animate-fade-in">
            <Input label="Başlıq" placeholder="Yasamal, ADA-ya yaxın..."/>
            <Input label="Rayon" placeholder="Yasamal"/>
            <Input label="Universitet"/>
            <div className="grid grid-cols-2 gap-3">
              <Input label="Qiymət (₼)" type="number"/>
              <Input label="Otaq sayı" type="number"/>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-3 animate-fade-in">
            <p className="text-sm font-semibold">Kommunal & qaydalar</p>
            {["Wi-Fi","İsitmə","Kondisioner","Paltaryuyan","Heyvan icazəsi","Siqaret icazəsi"].map(o => (
              <label key={o} className="flex items-center justify-between p-3 rounded-xl bg-card border border-border press-scale">
                <span className="text-sm">{o}</span>
                <input type="checkbox" className="w-5 h-5 accent-primary"/>
              </label>
            ))}
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3 animate-fade-in">
            <div className="p-4 rounded-2xl border-2 border-primary/30 bg-primary/5 flex items-center gap-3">
              <ShieldCheck className="text-primary"/>
              <div>
                <p className="font-bold text-sm">Verified Property</p>
                <p className="text-[11px] text-muted-foreground">Çıxarış, kupça və ya kommunal sənəd yüklə</p>
              </div>
            </div>
            {["Çıxarış","Kupça","Kommunal ödəniş"].map(d => (
              <button key={d} className="w-full p-4 rounded-2xl border-2 border-dashed border-border flex flex-col items-center gap-2 press-scale hover:border-primary hover:bg-primary/5 transition">
                <Upload size={20} className="text-muted-foreground"/>
                <span className="text-sm font-semibold">{d}</span>
                <span className="text-[10px] text-muted-foreground">PDF, JPG max 5MB</span>
              </button>
            ))}
          </div>
        )}

        <button
          onClick={() => {
            if (step < 2) setStep(step + 1);
            else { toast.success("Elan yaradıldı! Doğrulamadan sonra dərc olunacaq."); navigate({to:"/owner/listings"}); }
          }}
          className="w-full mt-6 py-3.5 rounded-2xl brand-gradient text-white font-bold press-scale shadow-lg shadow-primary/30"
        >
          {step < 2 ? "Növbəti" : "Elanı yarat"}
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
