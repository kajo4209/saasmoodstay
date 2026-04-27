"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BookingModal } from "./BookingModal";

// ─── Icons ────────────────────────────────────────────────────────────────────
const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);
const BedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z" />
  </svg>
);
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const CalendarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

// ─── Type from DB ─────────────────────────────────────────────────────────────
interface ChaletDB {
  id: number;
  name: string;
  price: number;
  rooms: number;
  description: string;
  features: string;
  type: string;
  images: string[];
  createdAt: string;
}

// ─── Card ─────────────────────────────────────────────────────────────────────
function ChaletCard({ chalet, onBook }: { chalet: ChaletDB; onBook: (c: ChaletDB) => void }) {
  const { lang } = useLang();
  const ref = useScrollReveal();

  const [liked, setLiked] = useState(() => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem("moodstay_favs") || "[]");
      return favs.includes(chalet.id);
    } catch { return false; }
  });

  function toggleLike(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const favs: number[] = JSON.parse(localStorage.getItem("moodstay_favs") || "[]");
      const newFavs = liked ? favs.filter((id: number) => id !== chalet.id) : [...favs, chalet.id];
      localStorage.setItem("moodstay_favs", JSON.stringify(newFavs));
      setLiked(!liked);
    } catch { setLiked(!liked); }
  }

  const imgSrc =
    chalet.images?.[0] ??
    "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800";

  const featureList = chalet.features
    ? chalet.features.split(/[-،,]/).map((f) => f.trim()).filter(Boolean)
    : [];

  const badgeLabel =
    chalet.type === "youth"
      ? lang === "ar" ? "شباب" : "Youth"
      : lang === "ar" ? "عائلات" : "Family";

  return (
    <div ref={ref} className="chalet-card reveal">
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <Image src={imgSrc} alt={chalet.name} fill className="object-cover chalet-img" sizes="(max-width:768px) 100vw, 33vw" />
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={chalet.type === "youth" ? "badge-sea" : "badge-gold"}>{badgeLabel}</span>
        </div>
        <button className={`absolute top-3 left-3 heart-btn ${liked ? "text-red-500 bg-red-50" : "text-gray-400"}`} onClick={toggleLike} aria-label="Favorite">
          <HeartIcon filled={liked} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className="text-sky-700 font-black text-sm">{chalet.price.toLocaleString()}</span>
          <span className="text-gray-400 text-xs"> {lang === "ar" ? "ج/ليلة" : "EGP/night"}</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-black text-gray-800 dark:text-white text-lg">{chalet.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
          <PinIcon /><span>{tr(t.chalets.location, lang)}</span>
        </div>
        {chalet.description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{chalet.description}</p>
        )}
        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1"><BedIcon />{lang === "ar" ? `${chalet.rooms} غرف` : `${chalet.rooms} Rooms`}</span>
        </div>
        {featureList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {featureList.slice(0, 3).map((f, i) => (
              <span key={i} className="text-xs bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full">{f}</span>
            ))}
            {featureList.length > 3 && <span className="text-xs text-gray-400">+{featureList.length - 3}</span>}
          </div>
        )}
        <button
          onClick={() => onBook(chalet)}
          className="w-full btn-primary py-3 text-sm font-bold flex items-center justify-center gap-2 mt-1"
        >
          <CalendarIcon />
          {lang === "ar" ? "احجز الآن" : "Book Now"}
        </button>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="chalet-card animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-[220px] w-full" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mt-4" />
      </div>
    </div>
  );
}

export function ChaletsSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();
  const btnRef   = useScrollReveal();

  const [chalets, setChalets]   = useState<ChaletDB[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(false);
  const [bookingChalet, setBookingChalet] = useState<ChaletDB | null>(null);

  useEffect(() => {
    fetch("/api/chalets")
      .then((res) => { if (!res.ok) throw new Error("fetch failed"); return res.json(); })
      .then((data: ChaletDB[]) => { setChalets(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return (
    <>
      <section id="chalets" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={titleRef} className="reveal text-center mb-16">
            <span className="section-tag">{tr(t.chalets.tag, lang)}</span>
            <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">{tr(t.chalets.title, lang)}</h2>
            <div className="sep" />
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">{tr(t.chalets.sub, lang)}</p>
          </div>

          {error ? (
            <p className="text-center text-red-400 py-10">{lang === "ar" ? "تعذر تحميل الشاليهات" : "Failed to load chalets"}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : chalets.length === 0
                ? <p className="col-span-3 text-center text-gray-400 py-10">{lang === "ar" ? "لا توجد شاليهات بعد" : "No chalets yet"}</p>
                : chalets.map((c) => <ChaletCard key={c.id} chalet={c} onBook={setBookingChalet} />)
              }
            </div>
          )}

          <div ref={btnRef} className="reveal text-center mt-12">
            <a href="#" className="btn-primary px-10 py-4 text-base inline-block">{tr(t.chalets.viewAll, lang)}</a>
          </div>
        </div>
      </section>

      {bookingChalet && (
        <BookingModal chalet={bookingChalet} onClose={() => setBookingChalet(null)} />
      )}
    </>
  );
}