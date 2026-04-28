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
const InfoIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M18 6L6 18M6 6l12 12" />
  </svg>
);

// ─── Type from DB ─────────────────────────────────────────────────────────────
export interface ChaletDB {
  id: number;
  name: string;
  price: number;
  rooms: number;
  description: string;
  features: string;
  type: string;
  images: string[];
  createdAt: string;
  bookingsCount?: number; // for sorting by popularity
}

// ─── Chalet Details Modal ─────────────────────────────────────────────────────
function ChaletDetailsModal({
  chalet,
  onClose,
  onBook,
}: {
  chalet: ChaletDB;
  onClose: () => void;
  onBook: () => void;
}) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  const featureList = chalet.features
    ? chalet.features.split(/[-،,]/).map((f) => f.trim()).filter(Boolean)
    : [];

  const images = chalet.images?.length
    ? chalet.images
    : ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800"];

  const [imgIdx, setImgIdx] = useState(0);

  const badgeLabel =
    chalet.type === "youth"
      ? isAr ? "شباب" : "Youth"
      : isAr ? "عائلات" : "Family";

  function handleWa() {
    const msg = encodeURIComponent(
      `أهلاً، أريد حجز شاليه ${chalet.name}`
    );
    window.open(`https://wa.me/201201543050?text=${msg}`, "_blank");
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full overflow-y-auto"
        style={{ maxWidth: 680, maxHeight: "90vh", direction: isAr ? "rtl" : "ltr" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-3xl">
          <div>
            <h2 className="font-black text-xl text-gray-800 dark:text-white">{chalet.name}</h2>
            <p className="text-sm text-sky-600 font-semibold">
              {isAr ? "تفاصيل الشاليه" : "Chalet Details"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 transition-all"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Images carousel */}
          <div className="relative rounded-2xl overflow-hidden" style={{ height: 260 }}>
            <Image
              src={images[imgIdx]}
              alt={chalet.name}
              fill
              className="object-cover"
              sizes="680px"
            />
            {images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? "bg-white w-5" : "bg-white/50"}`}
                  />
                ))}
              </div>
            )}
            {/* Badge */}
            <span className={`absolute top-3 right-3 ${chalet.type === "youth" ? "badge-sea" : "badge-gold"}`}>
              {badgeLabel}
            </span>
            {/* Price */}
            <div className="absolute bottom-3 right-3 bg-white/95 rounded-full px-4 py-1.5 shadow-lg">
              <span className="text-sky-700 font-black">{chalet.price.toLocaleString()}</span>
              <span className="text-gray-500 text-sm"> {isAr ? "ج/ليلة" : "EGP/night"}</span>
            </div>
          </div>

          {/* Info grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-sky-700">{chalet.rooms}</div>
              <div className="text-xs text-gray-500 mt-0.5">{isAr ? "غرف نوم" : "Bedrooms"}</div>
            </div>
            <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-sky-700">{chalet.price.toLocaleString()}</div>
              <div className="text-xs text-gray-500 mt-0.5">{isAr ? "ج/ليلة" : "EGP/night"}</div>
            </div>
          </div>

          {/* Description */}
          {chalet.description && (
            <div>
              <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-sm">
                {isAr ? "الوصف" : "Description"}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {chalet.description}
              </p>
            </div>
          )}

          {/* Features */}
          {featureList.length > 0 && (
            <div>
              <h4 className="font-bold text-gray-700 dark:text-gray-200 mb-2 text-sm">
                {isAr ? "المميزات" : "Features"}
              </h4>
              <div className="flex flex-wrap gap-2">
                {featureList.map((f, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 text-sm rounded-full bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-100 dark:border-sky-800 font-medium"
                  >
                    ✓ {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Location */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <PinIcon />
            <span>{isAr ? "قرية غزالة الوادي، الكيلو 142 الساحل الشمالي" : "Ghazala Valley, Kilo 142 North Coast"}</span>
          </div>

          {/* Deposit note */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 text-sm text-amber-800 dark:text-amber-300">
            💡 {isAr
              ? `العربون المطلوب عند الحجز: ${Math.round(chalet.price * 0.15).toLocaleString()} ج.م (15% من سعر الليلة)`
              : `Required deposit: ${Math.round(chalet.price * 0.15).toLocaleString()} EGP (15% of nightly rate)`}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              onClick={onBook}
              className="flex-1 btn-primary py-3.5 font-bold flex items-center justify-center gap-2"
            >
              <CalendarIcon />
              {isAr ? "احجز الآن" : "Book Now"}
            </button>
            <button
              onClick={handleWa}
              className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold border-2 border-green-400 text-green-600 hover:bg-green-50 transition-all"
            >
              <WhatsAppIcon />
              {isAr ? "تواصل واتساب" : "WhatsApp"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chalet Card ──────────────────────────────────────────────────────────────
function ChaletCard({
  chalet,
  onBook,
  onDetails,
}: {
  chalet: ChaletDB;
  onBook: (c: ChaletDB) => void;
  onDetails: (c: ChaletDB) => void;
}) {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const ref = useScrollReveal();

  const [liked, setLiked] = useState(() => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem("moodstay_favs") || "[]");
      return favs.includes(chalet.id);
    } catch { return false; }
  });

  // Images array with fallback
  const images = chalet.images?.length
    ? chalet.images
    : ["https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800"];

  const [imgIndex, setImgIndex] = useState(0);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (images.length <= 1) return;

    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images]);

  function toggleLike(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      const favs: number[] = JSON.parse(localStorage.getItem("moodstay_favs") || "[]");
      const newFavs = liked ? favs.filter((id) => id !== chalet.id) : [...favs, chalet.id];
      localStorage.setItem("moodstay_favs", JSON.stringify(newFavs));
      setLiked(!liked);
    } catch { setLiked(!liked); }
  }

  const featureList = chalet.features
    ? chalet.features.split(/[-،,]/).map((f) => f.trim()).filter(Boolean)
    : [];

  const badgeLabel =
    chalet.type === "youth"
      ? isAr ? "شباب" : "Youth"
      : isAr ? "عائلات" : "Family";

  return (
    <div ref={ref} className="chalet-card reveal">
      {/* Image with auto-slide */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <Image
          src={images[imgIndex]}
          alt={chalet.name}
          fill
          className="object-cover chalet-img"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        
        {/* Image dots indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === imgIndex ? "bg-white w-3" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
        
        <div className="absolute top-3 right-3 flex gap-2">
          <span className={chalet.type === "youth" ? "badge-sea" : "badge-gold"}>
            {badgeLabel}
          </span>
        </div>
        <button
          className={`absolute top-3 left-3 heart-btn ${liked ? "text-red-500 bg-red-50" : "text-gray-400"}`}
          onClick={toggleLike}
          aria-label="Favorite"
        >
          <HeartIcon filled={liked} />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
          <span className="text-sky-700 font-black text-sm">{chalet.price.toLocaleString()}</span>
          <span className="text-gray-400 text-xs"> {isAr ? "ج/ليلة" : "EGP/night"}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-black text-gray-800 dark:text-white text-lg">{chalet.name}</h3>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm mb-2">
          <PinIcon />
          <span>{isAr ? "غزالة الوادي، الكيلو 142" : "Ghazala Valley, Kilo 142"}</span>
        </div>

        {chalet.description && (
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {chalet.description}
          </p>
        )}

        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <span className="flex items-center gap-1">
            <BedIcon />
            {isAr ? `${chalet.rooms} غرف` : `${chalet.rooms} Rooms`}
          </span>
        </div>

        {featureList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {featureList.slice(0, 3).map((f, i) => (
              <span
                key={i}
                className="text-xs bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 px-2 py-0.5 rounded-full"
              >
                {f}
              </span>
            ))}
            {featureList.length > 3 && (
              <span className="text-xs text-gray-400">+{featureList.length - 3}</span>
            )}
          </div>
        )}

        {/* ── 2 Buttons ── */}
        <div className="flex flex-col gap-2 mt-1">
          {/* 1. عرض التفاصيل */}
          <button
            onClick={() => onDetails(chalet)}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full font-bold text-sm border-2 border-sky-200 text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 transition-all"
          >
            <InfoIcon />
            {isAr ? "عرض التفاصيل" : "View Details"}
          </button>

          {/* 2. احجز الآن */}
          <button
            onClick={() => onBook(chalet)}
            className="w-full btn-primary py-2.5 text-sm font-bold flex items-center justify-center gap-2"
          >
            <CalendarIcon />
            {isAr ? "احجز الآن" : "Book Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="chalet-card animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 h-[220px] w-full" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full mt-2" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-full" />
      </div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export function ChaletsSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();
  const btnRef   = useScrollReveal();

  const [chalets, setChalets]       = useState<ChaletDB[]>([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [bookingChalet, setBookingChalet]   = useState<ChaletDB | null>(null);
  const [detailsChalet, setDetailsChalet]   = useState<ChaletDB | null>(null);

  useEffect(() => {
    fetch("/api/chalets")
      .then((res) => { if (!res.ok) throw new Error("fetch failed"); return res.json(); })
      .then((data: ChaletDB[]) => { setChalets(data); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  // Sort by bookingsCount (most popular first) and take only top 3
  const displayedChalets = [...chalets]
    .sort((a, b) => (b.bookingsCount || 0) - (a.bookingsCount || 0))
    .slice(0, 3);

  return (
    <>
      <section id="chalets" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div ref={titleRef} className="reveal text-center mb-16">
            <span className="section-tag">{tr(t.chalets.tag, lang)}</span>
            <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">
              {tr(t.chalets.title, lang)}
            </h2>
            <div className="sep" />
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              {tr(t.chalets.sub, lang)}
            </p>
          </div>

          {error ? (
            <p className="text-center text-red-400 py-10">
              {lang === "ar" ? "تعذر تحميل الشاليهات" : "Failed to load chalets"}
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {loading
                ? [1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : displayedChalets.length === 0
                ? (
                  <p className="col-span-3 text-center text-gray-400 py-10">
                    {lang === "ar" ? "لا توجد شاليهات بعد" : "No chalets yet"}
                  </p>
                )
                : displayedChalets.map((c) => (
                  <ChaletCard
                    key={c.id}
                    chalet={c}
                    onBook={setBookingChalet}
                    onDetails={setDetailsChalet}
                  />
                ))
              }
            </div>
          )}

          <div ref={btnRef} className="reveal text-center mt-12">
            <button
              onClick={() => window.location.href = "/chalets"}
              className="btn-primary px-10 py-4 text-base"
            >
              {tr(t.chalets.viewAll, lang)}
            </button>
          </div>
        </div>
      </section>

      {/* Details Modal */}
      {detailsChalet && (
        <ChaletDetailsModal
          chalet={detailsChalet}
          onClose={() => setDetailsChalet(null)}
          onBook={() => {
            setBookingChalet(detailsChalet);
            setDetailsChalet(null);
          }}
        />
      )}

      {/* Booking Modal */}
      {bookingChalet && (
        <BookingModal
          chalet={bookingChalet}
          onClose={() => setBookingChalet(null)}
        />
      )}
    </>
  );
}