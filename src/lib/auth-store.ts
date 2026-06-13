import { useEffect, useState } from "react";

export type Role = "student" | "owner";
export type User = {
  id: string;
  role: Role;
  name: string;
  email: string;
  university?: string;
  verified: boolean;
  avatar: string;
};

const KEY = "roomate.user";

const DEMO: Record<Role, User> = {
  student: {
    id: "stu_1",
    role: "student",
    name: "Aysel Məmmədova",
    email: "student@roomate.az",
    university: "ADA University",
    verified: true,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Aysel",
  },
  owner: {
    id: "own_1",
    role: "owner",
    name: "Rəşad Əliyev",
    email: "owner@roomate.az",
    verified: true,
    avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=Rashad",
  },
};

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function setUser(u: User | null) {
  if (typeof window === "undefined") return;
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("roomate-auth"));
}

export function loginDemo(role: Role) {
  setUser(DEMO[role]);
  return DEMO[role];
}

export function useAuth() {
  const [user, setU] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setU(getUser());
    setReady(true);
    const h = () => setU(getUser());
    window.addEventListener("roomate-auth", h);
    window.addEventListener("storage", h);
    return () => {
      window.removeEventListener("roomate-auth", h);
      window.removeEventListener("storage", h);
    };
  }, []);
  const updateUser = (patch: Partial<User>) => {
    const curr = getUser();
    if (!curr) return;
    setUser({ ...curr, ...patch });
  };
  return { user, ready, logout: () => setUser(null), updateUser };
}
