"use client";

import { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// ─── Icons ────────────────────────────────────────────────────────────────────
const PinIcon = ({ color = "white" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);
const ClockIcon = ({ color = "white" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z" />
  </svg>
);
const WaIcon = ({ color = "white" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);
const CarIcon = ({ color = "currentColor" }: { color?: string }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={color}>
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" />
  </svg>
);
const NavIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
  </svg>
);
const BeachIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.127 14.56l1.43-1.43 6.44 6.443L19.57 21zm4.293-5.73l2.86-2.86c-3.95-3.95-10.35-3.96-14.3-.02 3.93-1.3 8.31-.25 11.44 2.88zM5.95 5.98c-3.94 3.95-3.93 10.35.02 14.3l2.86-2.86C5.7 14.29 4.65 9.91 5.95 5.98zm.02-.02l-.01.01c-.38 3.01.89 6.28 3.72 8.4L14.98 9.1c-2.12-2.83-5.39-4.1-8.4-3.71l-.62-.62z" />
  </svg>
);
const StoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4v2l16-2zm1 5v-1l-1-5H4L3 8v1h1v9H2v2h20v-2h-2V9h1zm-9 9H8v-4h4v4zm0-6H6V9h6v3zm6 6h-4v-4h4v4zm0-6h-4V9h4v3z" />
  </svg>
);
const GateIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);
const ExternalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const DISTANCES = [
  {
    fromAr: "القاهرة",
    fromEn: "Cairo",
    distanceAr: "٢٢٠ كم",
    distanceEn: "220 km",
    timeAr: "٢.٥ – ٣ ساعات",
    timeEn: "2.5 – 3 hrs",
    icon: "🏙️",
    color: "from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800",
    textColor: "text-blue-700 dark:text-blue-300",
  },
  {
    fromAr: "الإسكندرية",
    fromEn: "Alexandria",
    distanceAr: "١٧٠ كم",
    distanceEn: "170 km",
    timeAr: "١.٥ – ٢ ساعات",
    timeEn: "1.5 – 2 hrs",
    icon: "🌊",
    color: "from-sky-50 to-sky-100 dark:from-sky-900/20 dark:to-sky-800/20 border-sky-200 dark:border-sky-800",
    textColor: "text-sky-700 dark:text-sky-300",
  },
];

const LANDMARKS = [
  {
    nameAr: "مدخل قرية غزالة الوادي",
    nameEn: "Ghazala Valley Entrance",
    descAr: "البوابة الرئيسية للقرية على الطريق الدولي",
    descEn: "Main village gate on the coastal highway",
    icon: <GateIcon />,
    emoji: "🚪",
    color: "bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300",
    mapsUrl: "https://maps.google.com/?q=قرية+غزالة+الوادي+مدخل+الكيلو+142+الساحل+الشمالي",
  },
  {
    nameAr: "الشاطئ الخاص",
    nameEn: "Private Beach",
    descAr: "شاطئ رملي ناعم داخل القرية مباشرةً",
    descEn: "Soft sandy beach directly inside the village",
    icon: <BeachIcon />,
    emoji: "🏖️",
    color: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",
    mapsUrl: "https://maps.google.com/?q=شاطئ+غزالة+الوادي+الساحل+الشمالي",
  },
  {
    nameAr: "أقرب سوبرماركت",
    nameEn: "Nearest Supermarket",
    descAr: "على بعد ٥ دقائق من بوابة القرية",
    descEn: "5 minutes from the village gate",
    icon: <StoreIcon />,
    emoji: "🛒",
    color: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
    mapsUrl: "https://maps.google.com/?q=سوبرماركت+قرب+الكيلو+142+الساحل+الشمالي",
  },
];

const CHECK_RULES = [
  {
    typeAr: "وقت الدخول (Check-in)",
    typeEn: "Check-in Time",
    timeAr: "بعد الساعة ١٢ ظهراً",
    timeEn: "After 12:00 PM (Noon)",
    icon: "🟢",
    gradient: "from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 border-green-200 dark:border-green-800",
    note: { ar: "يُرجى التنسيق مسبقاً إذا كان الوصول متأخراً", en: "Please coordinate in advance for late arrival" },
  },
  {
    typeAr: "وقت الخروج (Check-out)",
    typeEn: "Check-out Time",
    timeAr: "قبل الساعة ١٢ ظهراً",
    timeEn: "Before 12:00 PM (Noon)",
    icon: "🔴",
    gradient: "from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10 border-red-200 dark:border-red-800",
    note: { ar: "التأخير يُحتسب كيوم إضافي", en: "Late checkout is charged as an extra day" },
  },
];

// Google Maps embed — Ghazala Valley, North Coast
// Coordinates: ~31.05°N, 28.76°E (Kilo 142 Ras El Bar area)
const MAP_EMBED_URL =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3414.2!2d28.7580!3d31.0521!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14f79c00000000%3A0x0!2zMzHCsDAzJzA3LjYiTiAyOMKwNDUnMjguOCJF!5e0!3m2!1sar!2seg!4v1700000000000!5m2!1sar!2seg";

const MAPS_LINK =
  "https://www.google.com/maps/place/%D9%82%D8%B1%D9%8A%D8%A9+%D8%BA%D8%B2%D8%A7%D9%84%D8%A9+%D8%A7%D9%84%D9%88%D8%A7%D8%AF%D9%8A%E2%80%AD/@31.05,28.75,14z";

// ─── Component ────────────────────────────────────────────────────────────────
export function LocationSection() {
  const { lang } = useLang();
  const isAr = lang === "ar";
  const titleRef   = useScrollReveal();
  const distRef    = useScrollReveal();
  const landRef    = useScrollReveal();
  const checkRef   = useScrollReveal();
  const mapRef     = useScrollReveal();
  const infoRef    = useScrollReveal();

  const [activeLandmark, setActiveLandmark] = useState<number | null>(null);

  return (
    <section id="location" className="py-24 sky-section overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 space-y-16">

        {/* ── Title ── */}
        <div ref={titleRef} className="reveal text-center">
          <span className="section-tag">{tr(t.location.tag, lang)}</span>
          <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">
            {tr(t.location.title, lang)}
          </h2>
          <div className="sep" />
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {isAr
              ? "الكيلو ١٤٢ على طريق الإسكندرية–مطروح — الساحل الشمالي، مصر"
              : "Kilo 142 on Alexandria–Matrouh Road — North Coast, Egypt"}
          </p>
        </div>

        {/* ── Distance Cards ── */}
        <div ref={distRef} className="reveal">
          <h3 className="font-black text-gray-800 dark:text-white text-xl text-center mb-6 flex items-center justify-center gap-2">
            <CarIcon color="#0288D1" />
            {isAr ? "المسافات من المدن الرئيسية" : "Distance from Major Cities"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
            {DISTANCES.map((d, i) => (
              <div
                key={i}
                className={`rounded-2xl p-5 border bg-gradient-to-br ${d.color} flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-lg`}
              >
                <div className="text-3xl">{d.icon}</div>
                <div className="flex-1">
                  <div className={`font-black text-base ${d.textColor}`}>
                    {isAr ? d.fromAr : d.fromEn}
                  </div>
                  <div className={`font-bold text-xl ${d.textColor}`}>
                    {isAr ? d.distanceAr : d.distanceEn}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-1 mt-0.5">
                    <ClockIcon color="#9CA3AF" />
                    {isAr ? d.timeAr : d.timeEn} {isAr ? "بالسيارة" : "by car"}
                  </div>
                </div>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=31.0521,28.758&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${d.textColor} hover:scale-110 transition-transform`}
                  style={{ background: "rgba(255,255,255,0.6)" }}
                  title={isAr ? "الاتجاهات" : "Get Directions"}
                >
                  <NavIcon />
                </a>
              </div>
            ))}
          </div>
          {/* Road tip */}
          <p className="text-center text-sm text-gray-400 mt-4 flex items-center justify-center gap-1.5">
            <span>ℹ️</span>
            {isAr
              ? "خذ مخرج الكيلو ١٤٢ من الطريق الدولي الساحلي — اللافتة واضحة"
              : "Take the Kilo 142 exit from the coastal highway — signage is clear"}
          </p>
        </div>

        {/* ── Map + Info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">

          {/* Map — col 3 */}
          <div ref={mapRef} className="reveal-left lg:col-span-3 order-2 lg:order-1">
            <div className="rounded-3xl overflow-hidden shadow-2xl relative" style={{ height: 460 }}>
              {/* Interactive Google Maps iframe — scrollable */}
              <iframe
                src={MAP_EMBED_URL}
                width="100%"
                height="100%"
                style={{ border: 0, pointerEvents: "auto" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ghazala Valley Village — Kilo 142 North Coast"
              />
              {/* Overlay label */}
              <div className="absolute top-4 left-4 glass rounded-xl px-3 py-2 flex items-center gap-2 pointer-events-none">
                <span className="text-red-500 text-lg">📍</span>
                <div>
                  <div className="font-bold text-white text-xs">
                    {isAr ? "قرية غزالة الوادي" : "Ghazala Valley Village"}
                  </div>
                  <div className="text-white/70 text-xs">
                    {isAr ? "الكيلو ١٤٢ — الساحل الشمالي" : "Kilo 142 — North Coast"}
                  </div>
                </div>
              </div>
            </div>

            {/* Open in Google Maps CTA */}
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <a
                href={MAPS_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-bold"
              >
                <ExternalIcon />
                {isAr ? "فتح في خرائط جوجل" : "Open in Google Maps"}
              </a>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=31.0521,28.758&travelmode=driving"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 flex items-center justify-center gap-2 text-sm font-bold rounded-full border-2 border-sky-300 text-sky-600 hover:bg-sky-50 transition-all"
              >
                <NavIcon />
                {isAr ? "احصل على الاتجاهات" : "Get Directions"}
              </a>
            </div>
          </div>

          {/* Info sidebar — col 2 */}
          <div ref={infoRef} className="reveal-right lg:col-span-2 order-1 lg:order-2 space-y-4">

            {/* Address */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#4FC3F7,#0288D1)" }}>
                  <PinIcon />
                </div>
                <div>
                  <div className="font-black text-gray-800 dark:text-white text-sm mb-0.5">
                    {tr(t.location.addrLabel, lang)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {isAr
                      ? "قرية غزالة الوادي، الكيلو ١٤٢، طريق الإسكندرية–مطروح، الساحل الشمالي"
                      : "Ghazala Valley Village, Kilo 142, Alexandria–Matrouh Rd, North Coast"}
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp */}
            <div className="glass-card rounded-2xl p-5">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}>
                  <WaIcon />
                </div>
                <div>
                  <div className="font-black text-gray-800 dark:text-white text-sm mb-1">
                    {tr(t.location.contactLabel, lang)}
                  </div>
                  <a href="https://wa.me/201201543050" target="_blank" rel="noopener noreferrer"
                    className="text-green-500 text-sm font-bold block hover:text-green-600 transition-colors">
                    01201543050
                  </a>
                  <a href="https://wa.me/201060742957" target="_blank" rel="noopener noreferrer"
                    className="text-green-500 text-sm font-bold block hover:text-green-600 transition-colors">
                    01060742957
                  </a>
                </div>
              </div>
            </div>

            {/* Check-in / Check-out times */}
            <div className="glass-card rounded-2xl p-5 space-y-3">
              <div className="font-black text-gray-800 dark:text-white text-sm mb-1 flex items-center gap-2">
                <ClockIcon color="#0288D1" />
                {isAr ? "مواعيد الدخول والخروج" : "Check-in & Check-out"}
              </div>
              {CHECK_RULES.map((r, i) => (
                <div key={i} className={`rounded-xl border bg-gradient-to-r ${r.gradient} p-3`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm text-gray-700 dark:text-gray-200">
                      {r.icon} {isAr ? r.typeAr : r.typeEn}
                    </span>
                    <span className="font-black text-base" style={{ color: i === 0 ? "#16A34A" : "#DC2626" }}>
                      {isAr ? r.timeAr : r.timeEn}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {isAr ? r.note.ar : r.note.en}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Landmarks ── */}
        <div ref={landRef} className="reveal">
          <h3 className="font-black text-gray-800 dark:text-white text-xl text-center mb-6 flex items-center justify-center gap-2">
            <span>📍</span>
            {isAr ? "علامات مضمونة قريبة منك" : "Nearby Landmarks"}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {LANDMARKS.map((lm, i) => (
              <div
                key={i}
                className={`glass-card rounded-2xl p-5 cursor-pointer transition-all ${
                  activeLandmark === i ? "ring-2 ring-sky-400" : ""
                }`}
                onClick={() => setActiveLandmark(activeLandmark === i ? null : i)}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${lm.color} text-lg`}>
                    {lm.emoji}
                  </div>
                  <div className="font-black text-gray-800 dark:text-white text-sm leading-tight">
                    {isAr ? lm.nameAr : lm.nameEn}
                  </div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-xs leading-relaxed mb-3">
                  {isAr ? lm.descAr : lm.descEn}
                </p>
                <a
                  href={lm.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={e => e.stopPropagation()}
                  className="flex items-center gap-1.5 text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
                >
                  <ExternalIcon />
                  {isAr ? "عرض على الخريطة" : "View on Map"}
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* ── Check-in rules full card ── */}
        <div ref={checkRef} className="reveal">
          <div className="glass-card rounded-3xl p-6 md:p-8">
            <h3 className="font-black text-gray-800 dark:text-white text-xl mb-6 flex items-center gap-2">
              <span>📋</span>
              {isAr ? "سياسة الدخول والخروج" : "Check-in & Check-out Policy"}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Check-in */}
              <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-green-500 flex items-center justify-center text-white text-2xl">🟢</div>
                  <div>
                    <div className="font-black text-green-800 dark:text-green-300 text-lg">
                      {isAr ? "الدخول" : "Check-in"}
                    </div>
                    <div className="font-black text-green-600 dark:text-green-400 text-2xl">
                      {isAr ? "بعد ١٢:٠٠ ظ" : "After 12:00 PM"}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">✓</span>
                    {isAr ? "الغرف تكون جاهزة ونظيفة من الساعة ١٢" : "Rooms are ready and clean from 12 PM"}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">✓</span>
                    {isAr ? "تواصل معنا عند الوصول المبكر لترتيب الأمور" : "Contact us for early arrival arrangements"}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">✓</span>
                    {isAr ? "الدخول المتأخر مقبول بإشعار مسبق على الواتساب" : "Late check-in accepted with prior WhatsApp notice"}
                  </li>
                </ul>
              </div>

              {/* Check-out */}
              <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/10 p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-red-500 flex items-center justify-center text-white text-2xl">🔴</div>
                  <div>
                    <div className="font-black text-red-800 dark:text-red-300 text-lg">
                      {isAr ? "الخروج" : "Check-out"}
                    </div>
                    <div className="font-black text-red-600 dark:text-red-400 text-2xl">
                      {isAr ? "قبل ١٢:٠٠ ظ" : "Before 12:00 PM"}
                    </div>
                  </div>
                </div>
                <ul className="space-y-2 text-sm text-red-700 dark:text-red-300">
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">⚠️</span>
                    {isAr ? "التأخير عن موعد الخروج يُحتسب كيوم إضافي كامل" : "Late checkout is charged as a full extra day"}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">✓</span>
                    {isAr ? "يمكن الاتفاق على خروج متأخر بتكلفة إضافية مسبقاً" : "Late checkout can be arranged in advance for extra cost"}
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-0.5 flex-shrink-0">✓</span>
                    {isAr ? "يُرجى تسليم المفاتيح قبل الخروج مباشرة" : "Please hand over keys before leaving"}
                  </li>
                </ul>
              </div>
            </div>

            {/* General tips */}
            <div className="mt-6 rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 p-4">
              <div className="flex items-start gap-3">
                <span className="text-xl flex-shrink-0">💡</span>
                <div className="text-sm text-sky-700 dark:text-sky-300 leading-relaxed">
                  {isAr
                    ? "للحصول على أفضل تجربة، ننصح بالوصول في وقت الدخول المحدد والإشعار المسبق على الواتساب في حالة أي تغيير في التوقيت."
                    : "For the best experience, we recommend arriving at check-in time and notifying us on WhatsApp in advance of any schedule changes."}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
