import { useEffect, useState } from "react";

const KEY = "roomate.settings.v2";

export type Lang = "az" | "en" | "ru";

export type Settings = {
  dark: boolean;
  notifications: boolean;
  emailAlerts: boolean;
  newMatches: boolean;
  soundOn: boolean;
  lang: Lang;
};

const DEFAULTS: Settings = {
  dark: false,
  notifications: true,
  emailAlerts: true,
  newMatches: true,
  soundOn: true,
  lang: "az",
};

function read(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try { return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || "{}") }; } catch { return DEFAULTS; }
}

const listeners = new Set<() => void>();
function notify() { listeners.forEach(l => l()); }

export function useSettings() {
  const [s, setS] = useState<Settings>(DEFAULTS);
  useEffect(() => {
    const sync = () => {
      const r = read();
      setS(r);
      document.documentElement.classList.toggle("dark", r.dark);
      document.documentElement.lang = r.lang;
    };
    sync();
    listeners.add(sync);
    return () => { listeners.delete(sync); };
  }, []);
  const set = (patch: Partial<Settings>) => {
    const next = { ...read(), ...patch };
    localStorage.setItem(KEY, JSON.stringify(next));
    if (patch.dark !== undefined) document.documentElement.classList.toggle("dark", patch.dark);
    if (patch.lang) document.documentElement.lang = patch.lang;
    notify();
  };
  return [s, set] as const;
}

// ============ i18n ============
type Dict = Record<string, { az: string; en: string; ru: string }>;
const DICT: Dict = {
  // nav
  nav_home: { az: "Ana", en: "Home", ru: "Главная" },
  nav_search: { az: "Axtar", en: "Search", ru: "Поиск" },
  nav_roommate: { az: "Yoldaş", en: "Roommate", ru: "Сосед" },
  nav_messages: { az: "Mesaj", en: "Chat", ru: "Чат" },
  nav_profile: { az: "Profil", en: "Profile", ru: "Профиль" },
  // home
  hi: { az: "Salam", en: "Hi", ru: "Привет" },
  find_new_home: { az: "Yeni evini", en: "Find your new", ru: "Найди новый" },
  find: { az: "tap", en: "home", ru: "дом" },
  online_now: { az: "tələbə online", en: "students online", ru: "студентов онлайн" },
  search_ph: { az: "Şəhər, rayon və ya universitet axtar...", en: "City, district, university...", ru: "Город, район, университет..." },
  urgent: { az: "Təcili", en: "Urgent", ru: "Срочно" },
  verified: { az: "Doğrulanmış", en: "Verified", ru: "Проверено" },
  roommate: { az: "Yoldaş", en: "Roommate", ru: "Сосед" },
  premium: { az: "Premium", en: "Premium", ru: "Премиум" },
  urgent_move: { az: "Təcili köçmə", en: "Urgent move-in", ru: "Срочный заезд" },
  urgent_move_d: { az: "Bu həftə dərhal köç", en: "Move this week", ru: "Заселись на этой неделе" },
  activate: { az: "Aktiv et", en: "Activate", ru: "Активировать" },
  for_you: { az: "Sənin üçün uyğun", en: "Picked for you", ru: "Для тебя" },
  all: { az: "Hamısı", en: "All", ru: "Все" },
  smart_match: { az: "Smart Roommate Matching", en: "Smart Roommate Matching", ru: "Умный подбор соседа" },
  smart_match_d: { az: "AI ilə uyğun otaq yoldaşı tap", en: "Find a matching roommate with AI", ru: "Подбор соседа с ИИ" },
  // chatbot
  ai_helper: { az: "AI köməkçi", en: "AI assistant", ru: "AI помощник" },
  ai_intro: { az: "Sənə uyğun ev tapım?", en: "Want me to find a home for you?", ru: "Подобрать жильё?" },
  start: { az: "Başla", en: "Start", ru: "Начать" },
  ask_district: { az: "Hansı ərazidə axtarırsan?", en: "Which district are you looking in?", ru: "В каком районе ищешь?" },
  ask_rooms: { az: "Neçə otaqlı?", en: "How many rooms?", ru: "Сколько комнат?" },
  ask_price: { az: "Aylıq qiymət limiti?", en: "Monthly budget?", ru: "Бюджет в месяц?" },
  rooms_studio: { az: "Studio", en: "Studio", ru: "Студия" },
  rooms_2: { az: "2 otaqlı", en: "2 rooms", ru: "2 комнаты" },
  rooms_3plus: { az: "3+ otaq", en: "3+ rooms", ru: "3+ комнаты" },
  any: { az: "Fərqi yox", en: "Any", ru: "Любой" },
  results_found: { az: "uyğun ev tapdım", en: "matching homes found", ru: "подходящих вариантов" },
  see_all: { az: "Hamısına bax", en: "See all", ru: "Смотреть все" },
  restart: { az: "Yenidən başla", en: "Restart", ru: "Заново" },
  no_match: { az: "Uyğun ev yoxdur. Filtri dəyiş.", en: "No matches. Try different filters.", ru: "Ничего не найдено." },
  // search
  search: { az: "Axtarış", en: "Search", ru: "Поиск" },
  filters: { az: "Filtrlər", en: "Filters", ru: "Фильтры" },
  city: { az: "Şəhər", en: "City", ru: "Город" },
  district: { az: "Rayon / Ərazi", en: "District / Area", ru: "Район" },
  max_price: { az: "Maks. qiymət", en: "Max price", ru: "Макс. цена" },
  gender: { az: "Cins", en: "Gender", ru: "Пол" },
  male: { az: "kişi", en: "male", ru: "муж" },
  female: { az: "qadın", en: "female", ru: "жен" },
  mixed: { az: "qarışıq", en: "mixed", ru: "смеш" },
  verified_only: { az: "Yalnız doğrulanmış", en: "Verified only", ru: "Только проверенные" },
  pets_ok: { az: "Heyvan icazəsi", en: "Pets allowed", ru: "Можно с животными" },
  reset: { az: "Sıfırla", en: "Reset", ru: "Сброс" },
  show_n: { az: "elan göstər", en: "listings", ru: "показать" },
  results: { az: "nəticə tapıldı", en: "results found", ru: "результатов" },
  // settings
  settings: { az: "Tənzimləmələr", en: "Settings", ru: "Настройки" },
  language: { az: "Dil", en: "Language", ru: "Язык" },
  dark_mode: { az: "Qaranlıq rejim", en: "Dark mode", ru: "Тёмная тема" },
  close: { az: "Bağla", en: "Close", ru: "Закрыть" },
  // profile
  favorites: { az: "Bəyəndiklərim", en: "My favorites", ru: "Избранное" },
  documents: { az: "Sənədlərim", en: "My documents", ru: "Документы" },
};

export function useT() {
  const [s] = useSettings();
  return (k: keyof typeof DICT) => DICT[k]?.[s.lang] ?? String(k);
}
