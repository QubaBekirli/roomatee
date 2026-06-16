import { useEffect, useState } from "react";

const KEY = "roomate.settings.v1";

export type Settings = {
  dark: boolean;
  notifications: boolean;
  emailAlerts: boolean;
  newMatches: boolean;
  soundOn: boolean;
};

const DEFAULTS: Settings = {
  dark: false,
  notifications: true,
  emailAlerts: true,
  newMatches: true,
  soundOn: true,
};

function read(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return DEFAULTS; }
}

export function useSettings() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  useEffect(() => {
    const r = read();
    setS(r);
    document.documentElement.classList.toggle("dark", r.dark);
  }, []);
  const set = (patch: Partial<Settings>) => {
    const next = { ...s, ...patch };
    setS(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    if (patch.dark !== undefined) document.documentElement.classList.toggle("dark", patch.dark);
  };
  return [s, set] as const;
}
