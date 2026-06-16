import { useEffect, useState } from "react";
import { LISTINGS, STOCK_PHOTOS, type Listing } from "./mock-data";

const KEY = "roomate.listings.v1";
const EVT = "roomate-listings";

function readUser(): Listing[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}

export function getAllListings(): Listing[] {
  return [...readUser(), ...LISTINGS];
}

export function getListing(id: string): Listing | undefined {
  return getAllListings().find(l => l.id === id);
}

export function addListing(data: Partial<Listing>): Listing {
  const stockKey = (data.title || "").toLowerCase().includes("studio") ? "studio"
    : (data.gender === "qadın") ? "qızlar"
    : (data.rooms && data.rooms <= 2) ? "2 otaqlı" : "3 otaqlı";
  const images = data.images?.length ? data.images : (STOCK_PHOTOS as any)[stockKey] || STOCK_PHOTOS.default;
  const beds = Array.from({ length: data.totalBeds || 1 }, () => "free" as const);
  const listing: Listing = {
    id: "u_" + Date.now(),
    title: data.title || "Yeni elan",
    city: data.city || "Bakı",
    district: data.district || "Bakı",
    university: data.university || "—",
    metroDistance: data.metroDistance || "Şəhər mərkəzi",
    price: data.price || 0,
    rooms: data.rooms || 1,
    totalBeds: data.totalBeds || 1,
    beds,
    gender: data.gender || "qarışıq",
    utilities: data.utilities || [],
    pets: !!data.pets,
    smoking: !!data.smoking,
    verified: false,
    premium: false,
    rating: 5.0,
    reviews: 0,
    owner: data.owner || { name: "Sən", verified: true, responseMin: 5, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=me" },
    images,
    description: data.description || "Yeni paylaşılan elan.",
    nearby: data.nearby || [],
    createdAt: Date.now(),
  };
  const list = [listing, ...readUser()];
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
  return listing;
}

export function updateListingBeds(id: string, beds: Listing["beds"]) {
  const user = readUser();
  const idx = user.findIndex(l => l.id === id);
  if (idx >= 0) {
    user[idx] = { ...user[idx], beds };
    localStorage.setItem(KEY, JSON.stringify(user));
    window.dispatchEvent(new Event(EVT));
  }
}

export function deleteListing(id: string) {
  const list = readUser().filter(l => l.id !== id);
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(EVT));
}

export function useListings() {
  const [list, setList] = useState<Listing[]>(LISTINGS);
  useEffect(() => {
    const h = () => setList(getAllListings());
    window.addEventListener(EVT, h);
    window.addEventListener("storage", h);
    setList(getAllListings());
    return () => {
      window.removeEventListener(EVT, h);
      window.removeEventListener("storage", h);
    };
  }, []);
  return list;
}

export function useUserListings() {
  const [list, setList] = useState<Listing[]>([]);
  useEffect(() => {
    const h = () => setList(readUser());
    window.addEventListener(EVT, h);
    setList(readUser());
    return () => window.removeEventListener(EVT, h);
  }, []);
  return list;
}
