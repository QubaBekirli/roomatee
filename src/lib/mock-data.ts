export type BedStatus = "free" | "reserved" | "taken";

export type Listing = {
  id: string;
  title: string;
  city: string;
  district: string;
  university: string;
  metroDistance: string;
  price: number;
  rooms: number;
  totalBeds: number;
  beds: BedStatus[];
  gender: "kişi" | "qadın" | "qarışıq";
  utilities: string[];
  pets: boolean;
  smoking: boolean;
  verified: boolean;
  premium: boolean;
  rating: number;
  reviews: number;
  owner: { name: string; verified: boolean; responseMin: number; avatar: string };
  images: string[];
  description: string;
  nearby: { name: string; distance: string; icon: string }[];
  createdAt?: number;
};

// Real apartment / room photos from Unsplash, matched to listing type.
const U = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&q=70`;

// Curated apartment interior photos (richer galleries)
const SETS = {
  apt3room: [
    U("1522708323590-d24dbb6b0267"),
    U("1556909114-f6e7ad7d3136"),
    U("1556911220-bff31c812dba"),
    U("1493809842364-78817add7ffb"),
    U("1567016432779-094069958ea5"),
    U("1505691938895-1758d7feb511"),
    U("1560185007-c5ca9d2c014d"),
  ],
  studio: [
    U("1560448204-e02f11c3d0e2"),
    U("1502672260266-1c1ef2d93688"),
    U("1505691938895-1758d7feb511"),
    U("1522771739844-6a9f6d5f14af"),
    U("1554995207-c18c203602cb"),
    U("1505693416388-ac5ce068fe85"),
  ],
  girlsRoom: [
    U("1522444195799-478538b28823"),
    U("1540518614846-7eded433c457"),
    U("1616594039964-ae9021a400a0"),
    U("1558211583-d26f610c1eb1"),
    U("1616137466211-f939a420be84"),
  ],
  centralApt: [
    U("1554995207-c18c203602cb"),
    U("1484154218962-a197022b5858"),
    U("1517705008128-361805f42e86"),
    U("1560185007-c5ca9d2c014d"),
    U("1502005229762-cf1b2da7c5d6"),
    U("1493809842364-78817add7ffb"),
  ],
};

// Real human portrait photos (Unsplash) — used for roommate cards & chat avatars
const P = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=400&q=70`;
export const PEOPLE = {
  kamran: P("1500648767791-00dcc994a43e"),
  tural: P("1507003211169-0a1dd7228f2d"),
  orxan: P("1506794778202-cad84cf45f1d"),
  cavid: P("1539571696357-5a69c17a67c6"),
  aysel: P("1494790108377-be9c29b29330"),
  leyla: P("1517841905240-472988babdf9"),
  nigar: P("1438761681033-6461ffad8d80"),
  rashad: P("1472099645785-5658abf4ff4e"),
  elvin: P("1463453091185-61582044d556"),
};

export const LISTINGS: Listing[] = [
  {
    id: "l1",
    title: "Yasamal, ADA-ya yaxın 3 otaqlı",
    city: "Bakı",
    district: "Yasamal",
    university: "ADA University",
    metroDistance: "5 dəq Nəsimi metro",
    price: 280,
    rooms: 3,
    totalBeds: 4,
    beds: ["free", "free", "reserved", "taken"],
    gender: "kişi",
    utilities: ["Wi-Fi", "İsitmə", "Kombi", "Kondisioner", "Paltaryuyan"],
    pets: false,
    smoking: false,
    verified: true,
    premium: true,
    rating: 4.8,
    reviews: 32,
    owner: { name: "Rəşad Ə.", verified: true, responseMin: 12, avatar: PEOPLE.rashad },
    images: SETS.apt3room,
    description:
      "Geniş, işıqlı 3 otaqlı mənzil. Tələbələr üçün ideal. Hər otaqda iş masası, yataq və şkaf mövcuddur.",
    nearby: [
      { name: "ADA University", distance: "800m", icon: "🎓" },
      { name: "Nəsimi metro", distance: "450m", icon: "🚇" },
      { name: "Bravo Market", distance: "200m", icon: "🛒" },
      { name: "Aptek 24/7", distance: "150m", icon: "💊" },
    ],
  },
  {
    id: "l2",
    title: "Xətai, BDU yaxınlığında studio",
    city: "Bakı",
    district: "Xətai",
    university: "BDU",
    metroDistance: "Xətai metrosu yanında",
    price: 350,
    rooms: 1,
    totalBeds: 1,
    beds: ["free"],
    gender: "qarışıq",
    utilities: ["Wi-Fi", "Mərkəzi isitmə", "Soyuducu"],
    pets: true,
    smoking: false,
    verified: true,
    premium: false,
    rating: 4.6,
    reviews: 18,
    owner: { name: "Leyla H.", verified: true, responseMin: 25, avatar: PEOPLE.leyla },
    images: SETS.studio,
    description: "Tək nəfərlik studio. Tam mebelli, dərhal köçməyə hazırdır.",
    nearby: [
      { name: "BDU", distance: "1.2km", icon: "🎓" },
      { name: "Xətai metro", distance: "300m", icon: "🚇" },
      { name: "Araz Market", distance: "100m", icon: "🛒" },
    ],
  },
  {
    id: "l3",
    title: "Nəsimi, qızlar üçün 2 yer",
    city: "Bakı",
    district: "Nəsimi",
    university: "UNEC",
    metroDistance: "28 May metrosu",
    price: 220,
    rooms: 2,
    totalBeds: 3,
    beds: ["free", "free", "taken"],
    gender: "qadın",
    utilities: ["Wi-Fi", "Kondisioner", "Bulaşıq maşını"],
    pets: false,
    smoking: false,
    verified: true,
    premium: false,
    rating: 4.9,
    reviews: 45,
    owner: { name: "Nigar M.", verified: true, responseMin: 8, avatar: PEOPLE.nigar },
    images: SETS.girlsRoom,
    description: "Yalnız qız tələbələr üçün. Təhlükəsiz, sakit ərazi.",
    nearby: [
      { name: "UNEC", distance: "600m", icon: "🎓" },
      { name: "28 May metro", distance: "500m", icon: "🚇" },
      { name: "Park Bulvar", distance: "1km", icon: "🌳" },
    ],
  },
  {
    id: "l4",
    title: "Nərimanov, Khazar yaxınlığında",
    city: "Bakı",
    district: "Nərimanov",
    university: "Khazar University",
    metroDistance: "Nərimanov metrosu 7 dəq",
    price: 310,
    rooms: 3,
    totalBeds: 3,
    beds: ["free", "taken", "taken"],
    gender: "kişi",
    utilities: ["Wi-Fi", "İsitmə", "Paltaryuyan", "Kondisioner"],
    pets: false,
    smoking: true,
    verified: false,
    premium: false,
    rating: 4.3,
    reviews: 11,
    owner: { name: "Elvin S.", verified: true, responseMin: 40, avatar: PEOPLE.elvin },
    images: SETS.centralApt,
    description: "Mərkəzi yerdə geniş mənzil.",
    nearby: [
      { name: "Khazar Uni", distance: "900m", icon: "🎓" },
      { name: "Nərimanov metro", distance: "550m", icon: "🚇" },
    ],
  },
];

// Default photo pool for new listings — pick one that matches the type chosen
export const STOCK_PHOTOS = {
  "3 otaqlı": SETS.apt3room,
  "2 otaqlı": SETS.centralApt,
  "studio": SETS.studio,
  "qızlar": SETS.girlsRoom,
  "default": SETS.apt3room,
};

export type Roommate = {
  id: string;
  name: string;
  age: number;
  university: string;
  course: string;
  avatar: string;
  sleep: string;
  cleanliness: string;
  smoking: boolean;
  pets: boolean;
  bio: string;
  compatibility: number;
};

export const ROOMMATES: Roommate[] = [
  { id: "r1", name: "Kamran Quliyev", age: 20, university: "ADA", course: "3-cü kurs", avatar: PEOPLE.kamran, sleep: "Tez yatan", cleanliness: "Çox təmiz", smoking: false, pets: false, bio: "Sakit, məsuliyyətli, idmançı.", compatibility: 95 },
  { id: "r2", name: "Tural Hüseynov", age: 22, university: "BDU", course: "Magistr 1", avatar: PEOPLE.tural, sleep: "Gec yatan", cleanliness: "Orta", smoking: false, pets: true, bio: "IT tələbəsiyəm, oyun oynamağı sevirəm.", compatibility: 88 },
  { id: "r3", name: "Orxan Babayev", age: 21, university: "UNEC", course: "4-cü kurs", avatar: PEOPLE.orxan, sleep: "Orta", cleanliness: "Təmiz", smoking: true, pets: false, bio: "İqtisad tələbəsi, kitab oxumağı sevirəm.", compatibility: 73 },
  { id: "r4", name: "Cavid Əliyev", age: 19, university: "ADA", course: "2-ci kurs", avatar: PEOPLE.cavid, sleep: "Tez yatan", cleanliness: "Çox təmiz", smoking: false, pets: false, bio: "Sakit həyat tərzi sevirəm.", compatibility: 91 },
];

export type ChatMessage = { id: string; from: "me" | "them"; text: string; time: string };
export type ChatThread = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unread: number;
  time: string;
  online: boolean;
  messages: ChatMessage[];
};

export const THREADS: ChatThread[] = [
  {
    id: "t1", name: "Rəşad Ə. (Ev sahibi)", avatar: PEOPLE.rashad,
    lastMessage: "Bəli, sabah saat 15:00-da uyğundur 👍", unread: 2, time: "12:34", online: true,
    messages: [
      { id: "m1", from: "them", text: "Salam, Yasamal elanı üçün maraqlanırsınız?", time: "12:30" },
      { id: "m2", from: "me", text: "Salam! Bəli, sabah baxa bilərəmmi?", time: "12:32" },
      { id: "m3", from: "them", text: "Bəli, sabah saat 15:00-da uyğundur 👍", time: "12:34" },
    ],
  },
  {
    id: "t2", name: "Kamran Q. (95% uyğun)", avatar: PEOPLE.kamran,
    lastMessage: "Razıyam, gəlin tanış olaq", unread: 0, time: "Dünən", online: false,
    messages: [
      { id: "m1", from: "me", text: "Salam, otaq yoldaşı kimi maraqlanırsan?", time: "Dünən" },
      { id: "m2", from: "them", text: "Razıyam, gəlin tanış olaq", time: "Dünən" },
    ],
  },
  {
    id: "t3", name: "Leyla H. (Ev sahibi)", avatar: PEOPLE.leyla,
    lastMessage: "Şəkilləri göndərdim", unread: 0, time: "Çər", online: true,
    messages: [
      { id: "m1", from: "them", text: "Şəkilləri göndərdim", time: "Çər" },
    ],
  },
];

export type Notification = { id: string; icon: string; title: string; body: string; time: string; unread: boolean };
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", icon: "🏠", title: "Yeni uyğun elan", body: "Yasamal-da 3 otaqlı yeni elan əlavə olundu", time: "indi", unread: true },
  { id: "n2", icon: "⚠️", title: "Son boş yer!", body: "Bəyəndiyin elanda yalnız 1 yer qaldı", time: "1 saat", unread: true },
  { id: "n3", icon: "✅", title: "Rezerv təsdiqləndi", body: "Rəşad Ə. rezervinizi təsdiqlədi", time: "3 saat", unread: false },
  { id: "n4", icon: "💰", title: "Depozit qorunur", body: "₼200 depoziti Safe Deposit-də", time: "Dünən", unread: false },
  { id: "n5", icon: "🤝", title: "95% uyğunluq!", body: "Kamran Q. ilə yüksək uyğunluq", time: "2 gün", unread: false },
];
