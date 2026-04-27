"use client";

import { useState } from "react";
import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const BedIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 13c1.66 0 3-1.34 3-3S8.66 7 7 7s-3 1.34-3 3 1.34 3 3 3zm12-6h-8v7H3V5H1v15h2v-3h18v3h2v-9c0-2.21-1.79-4-4-4z"/>
  </svg>
);
const PersonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
  </svg>
);
const PoolIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22 21c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.54 0-.78.14-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.54 0-.78.14-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.54 0-.78.14-1.15.36-.45.27-1.07.64-2.17.64v-2c.54 0 .78-.14 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.54 0 .78-.14 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.54 0 .78-.14 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.61.36 1.15.36v2zm0-4.5c-1.11 0-1.73-.37-2.18-.64-.37-.22-.6-.36-1.15-.36-.54 0-.78.14-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.54 0-.78.14-1.15.36-.46.27-1.07.64-2.18.64s-1.73-.37-2.18-.64c-.37-.22-.6-.36-1.15-.36-.54 0-.78.14-1.15.36-.45.27-1.07.64-2.17.64v-2c.54 0 .78-.14 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.54 0 .78-.14 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.6.36 1.15.36.54 0 .78-.14 1.15-.36.46-.27 1.07-.64 2.18-.64s1.73.37 2.18.64c.37.22.61.36 1.15.36v2zM8.67 12c.14.31.33.59.58.83.7.71 1.63 1.04 2.75 1.17V16h2v-2c2.96-.32 4-2.23 4-3.7 0-.04 0-.08-.01-.12L8.67 12zM12 2C10.34 2 9 3.34 9 5c0 1.09.6 2.03 1.47 2.56L4 10h5.42l7.1-2.56C16.26 6.61 16 5.84 16 5c0-2.21-1.79-4-4-3z"/>
  </svg>
);
const WifiIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"/>
  </svg>
);
const WaveIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3.5 18.5c1.5 0 3-1.5 3-1.5s1.5 1.5 3 1.5 3-1.5 3-1.5 1.5 1.5 3 1.5 3-1.5 3-1.5v2s-1.5 1.5-3 1.5-3-1.5-3-1.5-1.5 1.5-3 1.5-3-1.5-3-1.5-1.5 1.5-3 1.5-3-1.5-3-1.5v-2s1.5 1.5 3 1.5zM3 7.5s1.5-1.5 3-1.5 3 1.5 3 1.5 1.5-1.5 3-1.5 3 1.5 3 1.5 1.5-1.5 3-1.5 3 1.5 3 1.5v2s-1.5-1.5-3-1.5-3 1.5-3 1.5-1.5-1.5-3-1.5-3 1.5-3 1.5-1.5-1.5-3-1.5-3 1.5-3 1.5V7.5z"/>
  </svg>
);
const PinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

interface Chalet {
  id: number;
  image: string;
  nameAr: string;
  nameEn: string;
  locationKey: "location" | "phase2";
  rooms: number;
  persons: number;
  amenity: "pool" | "beach" | "wifi";
  price: number;
  stars: number;
  badge: "featured" | "sea" | "mostBooked" | null;
  badgeType: "gold" | "sea" | null;
}

const chalets: Chalet[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800",
    nameAr: "شاليه النخيل الفاخر",
    nameEn: "Palm Luxury Chalet",
    locationKey: "location",
    rooms: 3,
    persons: 8,
    amenity: "pool",
    price: 3500,
    stars: 5,
    badge: "featured",
    badgeType: "gold",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=800",
    nameAr: "فيلا سكاي الساحل",
    nameEn: "Sky Coast Villa",
    locationKey: "phase2",
    rooms: 4,
    persons: 10,
    amenity: "beach",
    price: 5200,
    stars: 5,
    badge: "sea",
    badgeType: "sea",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=800",
    nameAr: "شاليه درييم هاوس",
    nameEn: "Dream House Chalet",
    locationKey: "location",
    rooms: 2,
    persons: 6,
    amenity: "wifi",
    price: 2800,
    stars: 4,
    badge: "mostBooked",
    badgeType: "gold",
  },
];

const AmenityIcon = ({ type }: { type: "pool" | "beach" | "wifi" }) => {
  if (type === "pool") return <PoolIcon />;
  if (type === "beach") return <WaveIcon />;
  return <WifiIcon />;
};

function ChaletCard({ chalet }: { chalet: Chalet }) {
  const { lang } = useLang();
  const [liked, setLiked] = useState(false);
  const ref = useScrollReveal();

  const getBadgeLabel = () => {
    if (chalet.badge === "featured") return tr(t.chalets.featured, lang);
    if (chalet.badge === "sea") return tr(t.chalets.seaView, lang);
    if (chalet.badge === "mostBooked") return tr(t.chalets.mostBooked, lang);
    return "";
  };

  const amenityLabel = () => {
    if (chalet.amenity === "pool") return tr(t.chalets.pool, lang);
    if (chalet.amenity === "beach") return tr(t.chalets.beach, lang);
    return "WiFi";
  };

  return (
    <div ref={ref} className="chalet-card reveal">
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <Image
          src={chalet.image}
          alt={lang === "ar" ? chalet.nameAr : chalet.nameEn}
          fill
          className="object-cover chalet-img"
          sizes="(max-width:768px) 100vw, 33vw"
        />
        {/* Badges */}
        <div className="absolute top-3 right-3 flex gap-2">
          {chalet.badge && (
            <span className={chalet.badgeType === "gold" ? "badge-gold" : "badge-sea"}>
              {getBadgeLabel()}
            </span>
          )}
          {chalet.badge === "featured" && (
            <span className="badge-sea">{tr(t.chalets.seaView, lang)}</span>
          )}
        </div>
        {/* Heart */}
        <button
          className={`absolute top-3 left-3 heart-btn ${liked ? "text-red-500 bg-red-50" : "text-gray-400"}`}
          onClick={() => setLiked(!liked)}
          aria-label="Favorite"
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      {/* Info */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-black text-gray-800 dark:text-white text-lg">
            {lang === "ar" ? chalet.nameAr : chalet.nameEn}
          </h3>
          <div className="text-yellow-400 text-sm">
            {"★".repeat(chalet.stars)}{"☆".repeat(5 - chalet.stars)}
          </div>
        </div>

        <div className="flex items-center gap-1 text-gray-400 text-sm mb-3">
          <PinIcon />
          <span>
            {tr(t.chalets[chalet.locationKey], lang)}
          </span>
        </div>

        <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span className="flex items-center gap-1">
            <BedIcon />
            {tr(t.chalets.rooms(chalet.rooms), lang)}
          </span>
          <span className="flex items-center gap-1">
            <PersonIcon />
            {tr(t.chalets.persons(chalet.persons), lang)}
          </span>
          <span className="flex items-center gap-1">
            <AmenityIcon type={chalet.amenity} />
            {amenityLabel()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black text-sky-dark">
              {chalet.price.toLocaleString()}
            </span>
            <span className="text-sm text-gray-400 mr-1">
              {tr(t.chalets.perNight, lang)}
            </span>
          </div>
          <button className="btn-outline-sky text-sm px-5 py-2">
            {tr(t.chalets.viewDetails, lang)}
          </button>
        </div>
      </div>
    </div>
  );
}

export function ChaletsSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();
  const btnRef = useScrollReveal();

  return (
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {chalets.map((c) => (
            <ChaletCard key={c.id} chalet={c} />
          ))}
        </div>

        <div ref={btnRef} className="reveal text-center mt-12">
          <a href="#" className="btn-primary px-10 py-4 text-base inline-block">
            {tr(t.chalets.viewAll, lang)}
          </a>
        </div>
      </div>
    </section>
  );
}
