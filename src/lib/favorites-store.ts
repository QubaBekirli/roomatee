import { useEffect, useState } from "react";

const KEY = "roomate.favorites.v1";
const EVT = "roomate-favorites";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function isFavorite(id: string) {
  return read().includes(id);
}

export function toggleFavorite(id: string) {
  const list = read();
  const next = list.includes(id) ? list.filter(x => x !== id) : [id, ...list];
  localStorage.setItem(KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(EVT));
  return next.includes(id);
}

export function useFavorites() {
  const [ids, setIds] = useState<string[]>(() => read());
  useEffect(() => {
    const h = () => setIds(read());
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    setIds(read());
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return ids;
}

export function useIsFavorite(id: string) {
  const ids = useFavorites();
  return ids.includes(id);
}
