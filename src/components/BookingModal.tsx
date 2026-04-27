"use client";

import { useState, useEffect, useRef } from "react";
import { useLang } from "@/context/LanguageContext";

// ─── Types ────────────────────────────────────────────────────────────────────
interface ChaletDB {
  id: number;
  name: string;
  price: number;
  rooms: number;
  description: string;
  features: string;
  type: string;
  images: string[];
}

interface BookingModalProps {
  chalet: ChaletDB;
  onClose: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isFriday(date: Date) {
  return date.getDay() === 5; // 5 = Friday
}

function isWeekend(date: Date) {
  const d = date.getDay();
  return d === 4 || d === 5; // Thursday or Friday (Gulf weekend)
}

// Simulate booked dates (in a real app, fetch from API)
const BOOKED_RANGES: [string, string][] = [
  // ["2025-07-10", "2025-07-14"],
];

function isBooked(date: Date): boolean {
  const ds = date.toISOString().slice(0, 10);
  return BOOKED_RANGES.some(([s, e]) => ds >= s && ds <= e);
}

// Summer season July-August
function isSeason(date: Date): boolean {
  const m = date.getMonth() + 1;
  return m >= 7 && m <= 8;
}

function calcNights(start: Date | null, end: Date | null): number {
  if (!start || !end) return 0;
  return Math.round((end.getTime() - start.getTime()) / 86400000);
}

function calcDiscount(nights: number): number {
  if (nights >= 8) return 5;
  if (nights === 7) return 4;
  if (nights === 6) return 3;
  if (nights === 5) return 2;
  if (nights === 4) return 1;
  return 0;
}

function calcTotalPrice(basePrice: number, checkIn: Date | null, checkOut: Date | null): {
  nights: number;
  baseTotal: number;
  weekendSurcharge: number;
  seasonSurcharge: number;
  grossTotal: number;
  discountPct: number;
  discountAmt: number;
  finalTotal: number;
} {
  if (!checkIn || !checkOut) return {
    nights: 0, baseTotal: 0, weekendSurcharge: 0, seasonSurcharge: 0,
    grossTotal: 0, discountPct: 0, discountAmt: 0, finalTotal: 0,
  };

  let weekendExtra = 0;
  let seasonExtra = 0;

  const cur = new Date(checkIn);
  while (cur < checkOut) {
    if (isWeekend(cur)) weekendExtra += basePrice * 0.20;
    if (isSeason(cur)) seasonExtra += basePrice * 0.10;
    cur.setDate(cur.getDate() + 1);
  }

  const nights = calcNights(checkIn, checkOut);
  const baseTotal = nights * basePrice;
  const grossTotal = baseTotal + weekendExtra + seasonExtra;
  const discountPct = calcDiscount(nights);
  const discountAmt = grossTotal * (discountPct / 100);
  const finalTotal = grossTotal - discountAmt;

  return { nights, baseTotal, weekendSurcharge: weekendExtra, seasonSurcharge: seasonExtra, grossTotal, discountPct, discountAmt, finalTotal };
}

function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({
  checkIn, checkOut, onSelect,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (d: Date) => void;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay = new Date(viewYear, viewMonth + 1, 0);
  const startPad = firstDay.getDay(); // 0=Sun

  const days: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d));

  const monthNames = ["يناير","فبراير","مارس","أبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const dayNames = ["أح","إث","ثل","أر","خم","جم","سب"];

  function cellClass(d: Date): string {
    const past = d < today;
    const fri = isFriday(d);
    const book = isBooked(d);
    const inRange = checkIn && checkOut && d > checkIn && d < checkOut;
    const isStart = checkIn && d.getTime() === checkIn.getTime();
    const isEnd = checkOut && d.getTime() === checkOut.getTime();
    const weekend = isWeekend(d);
    const season = isSeason(d);

    if (past || fri || book) return "bg-gray-100 text-gray-300 cursor-not-allowed line-through";
    if (isStart || isEnd) return "bg-sky-500 text-white rounded-full font-bold cursor-pointer";
    if (inRange) return "bg-sky-100 text-sky-700 cursor-pointer";
    if (weekend && season) return "bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200";
    if (weekend) return "bg-yellow-50 text-yellow-700 cursor-pointer hover:bg-yellow-100";
    if (season) return "bg-green-50 text-green-700 cursor-pointer hover:bg-green-100";
    return "hover:bg-sky-50 text-gray-700 cursor-pointer";
  }

  function handleDay(d: Date) {
    const past = d < today;
    if (past || isFriday(d) || isBooked(d)) return;
    onSelect(d);
  }

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <button onClick={() => { const nd = new Date(viewYear, viewMonth - 1, 1); setViewYear(nd.getFullYear()); setViewMonth(nd.getMonth()); }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-50 text-sky-600">‹</button>
        <span className="font-bold text-gray-700">{monthNames[viewMonth]} {viewYear}</span>
        <button onClick={() => { const nd = new Date(viewYear, viewMonth + 1, 1); setViewYear(nd.getFullYear()); setViewMonth(nd.getMonth()); }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-50 text-sky-600">›</button>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {dayNames.map(n => (
          <div key={n} className="text-center text-xs font-bold text-gray-400 py-1">{n}</div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d ? (
              <button
                onClick={() => handleDay(d)}
                className={`w-8 h-8 text-xs flex items-center justify-center rounded-lg transition-all ${cellClass(d)}`}
                title={isFriday(d) ? "الجمعة غير متاح للخروج" : isBooked(d) ? "محجوز" : undefined}
              >
                {d.getDate()}
              </button>
            ) : <div />}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 rounded inline-block" />ويك إند +20%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded inline-block" />موسم +10%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded inline-block" />غير متاح</span>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function BookingModal({ chalet, onClose }: BookingModalProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  // Calendar state
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [calStep, setCalStep] = useState<"in" | "out">("in");

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deposit, setDeposit] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  // Payment
  const [paymentImg, setPaymentImg] = useState<File | null>(null);
  const [paymentPreview, setPaymentPreview] = useState<string | null>(null);
  const [bookingStatus, setBookingStatus] = useState<"idle" | "pending" | "success">("idle");

  // Favorites
  const [isFav, setIsFav] = useState(() => {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem("moodstay_favs") || "[]");
      return favs.includes(chalet.id);
    } catch { return false; }
  });

  // Features list from chalet
  const featureList = chalet.features
    ? chalet.features.split(/[-،,]/).map(f => f.trim()).filter(Boolean)
    : ["حمام سباحة", "إطلالة بحر", "واي فاي", "تكييف", "شاطئ خاص"];

  // Pricing
  const pricing = calcTotalPrice(chalet.price, checkIn, checkOut);

  // Coupon check
  const COUPONS: Record<string, number> = { "MOOD10": 10, "BEACH5": 5, "VIP15": 15 };
  function applyCoupon() {
    const c = coupon.trim().toUpperCase();
    if (COUPONS[c]) {
      setCouponDiscount(COUPONS[c]);
      setCouponMsg(`✅ تم تطبيق الكوبون! خصم ${COUPONS[c]}%`);
    } else {
      setCouponDiscount(0);
      setCouponMsg("❌ كود غير صحيح");
    }
  }

  const couponDiscountAmt = pricing.finalTotal * (couponDiscount / 100);
  const grandTotal = pricing.finalTotal - couponDiscountAmt;

  // Handle calendar
  function handleDateSelect(d: Date) {
    if (calStep === "in") {
      setCheckIn(d);
      setCheckOut(null);
      setCalStep("out");
    } else {
      if (checkIn && d <= checkIn) {
        setCheckIn(d);
        setCheckOut(null);
        setCalStep("out");
      } else {
        setCheckOut(d);
        setCalStep("in");
      }
    }
  }

  // Payment image
  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setPaymentImg(file);
      const reader = new FileReader();
      reader.onload = ev => setPaymentPreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  }

  // Toggle feature
  function toggleFeature(f: string) {
    setSelectedFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  // Toggle favorite
  function toggleFav() {
    try {
      const favs: number[] = JSON.parse(localStorage.getItem("moodstay_favs") || "[]");
      const newFavs = isFav ? favs.filter(id => id !== chalet.id) : [...favs, chalet.id];
      localStorage.setItem("moodstay_favs", JSON.stringify(newFavs));
      setIsFav(!isFav);
    } catch {}
  }

  // WhatsApp booking
  function bookWhatsApp() {
    const msg = encodeURIComponent(
      `🏖️ *طلب حجز شاليه - Moodstay*\n\n` +
      `*الشاليه:* ${chalet.name}\n` +
      `*الاسم:* ${name}\n` +
      `*الهاتف:* ${phone}\n` +
      `*تاريخ الدخول:* ${checkIn ? formatDate(checkIn) : "-"}\n` +
      `*تاريخ الخروج:* ${checkOut ? formatDate(checkOut) : "-"}\n` +
      `*عدد الليالي:* ${pricing.nights}\n` +
      `*المميزات المطلوبة:* ${selectedFeatures.join("، ") || "لا يوجد"}\n` +
      `*العربون:* ${deposit} ج.م\n` +
      `*الإجمالي:* ${grandTotal.toLocaleString()} ج.م\n` +
      `*ملاحظات:* ${notes || "لا يوجد"}`
    );
    window.open(`https://wa.me/201000000000?text=${msg}`, "_blank");
  }

  // Submit booking
  function submitBooking() {
    if (!name || !phone || !checkIn || !checkOut) {
      alert(isAr ? "يرجى تعبئة جميع الحقول المطلوبة" : "Please fill all required fields");
      return;
    }
    setBookingStatus("pending");
    // Simulate API call
    setTimeout(() => setBookingStatus("success"), 1500);
  }

  // Close on backdrop
  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).id === "booking-backdrop") onClose();
  }

  // ── Render ──
  return (
    <div
      id="booking-backdrop"
      onClick={handleBackdrop}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
    >
      <div
        className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full overflow-y-auto"
        style={{ maxWidth: 760, maxHeight: "95vh", direction: isAr ? "rtl" : "ltr" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-3xl">
          <div>
            <h2 className="font-black text-xl text-gray-800 dark:text-white">
              {isAr ? "🏖️ احجز الآن" : "🏖️ Book Now"}
            </h2>
            <p className="text-sm text-sky-600 font-semibold">{chalet.name}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Favorite */}
            <button
              onClick={toggleFav}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all border-2 ${isFav ? "border-red-400 bg-red-50 text-red-500" : "border-gray-200 text-gray-400 hover:border-red-300"}`}
              title={isAr ? "أضف للمفضلة" : "Add to Favorites"}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isFav ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
            {/* Close */}
            <button onClick={onClose} className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl transition-all">
              ✕
            </button>
          </div>
        </div>

        {bookingStatus === "success" ? (
          /* ── Success ── */
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-2">
              {isAr ? "تم إرسال طلب الحجز!" : "Booking Request Sent!"}
            </h3>
            <p className="text-gray-500 mb-2">
              {isAr ? "طلبك قيد المراجعة. سيتم التواصل معك خلال ساعات." : "Your request is under review. We'll contact you soon."}
            </p>
            <div className="mt-4 px-6 py-3 rounded-full bg-yellow-50 text-yellow-700 font-bold text-sm inline-block">
              ⏳ {isAr ? "قيد الانتظار" : "Pending Confirmation"}
            </div>
            <button onClick={onClose} className="mt-8 btn-primary px-8 py-3 text-sm">
              {isAr ? "حسناً، شكراً!" : "OK, Thank you!"}
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-6">

            {/* ── 1. Calendar ── */}
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="text-xl">📅</span>
                {isAr ? "اختر تواريخ الإقامة" : "Select Stay Dates"}
              </h3>

              {/* Date badges */}
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setCalStep("in")}
                  className={`flex-1 rounded-xl p-3 border-2 text-right transition-all ${calStep === "in" ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}
                >
                  <div className="text-xs text-gray-400">{isAr ? "تاريخ الدخول" : "Check-in"}</div>
                  <div className="font-bold text-gray-800 dark:text-white text-sm">
                    {checkIn ? formatDate(checkIn) : <span className="text-gray-300">{isAr ? "اختر تاريخ" : "Pick date"}</span>}
                  </div>
                </button>
                <div className="flex items-center text-gray-300 text-xl">→</div>
                <button
                  onClick={() => checkIn && setCalStep("out")}
                  className={`flex-1 rounded-xl p-3 border-2 text-right transition-all ${calStep === "out" ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}
                >
                  <div className="text-xs text-gray-400">{isAr ? "تاريخ الخروج" : "Check-out"}</div>
                  <div className="font-bold text-gray-800 dark:text-white text-sm">
                    {checkOut ? formatDate(checkOut) : <span className="text-gray-300">{isAr ? "اختر تاريخ" : "Pick date"}</span>}
                  </div>
                </button>
              </div>

              <MiniCalendar checkIn={checkIn} checkOut={checkOut} onSelect={handleDateSelect} />
              <p className="text-xs text-red-400 mt-2">⚠️ {isAr ? "الخروج يوم الجمعة غير مسموح به" : "Friday checkout is not allowed"}</p>
            </div>

            {/* ── 2. Price Summary ── */}
            {pricing.nights > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-100 p-4 space-y-2">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  {isAr ? "تفاصيل السعر" : "Price Details"}
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{pricing.nights} {isAr ? "ليلة" : "nights"} × {chalet.price.toLocaleString()} ج.م</span>
                  <span className="font-semibold">{pricing.baseTotal.toLocaleString()} ج.م</span>
                </div>
                {pricing.weekendSurcharge > 0 && (
                  <div className="flex justify-between text-sm text-yellow-700">
                    <span>🌙 {isAr ? "إضافة ويك إند (+20%)" : "Weekend surcharge (+20%)"}</span>
                    <span>+{Math.round(pricing.weekendSurcharge).toLocaleString()} ج.م</span>
                  </div>
                )}
                {pricing.seasonSurcharge > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>☀️ {isAr ? "موسم صيفي (+10%)" : "Peak season (+10%)"}</span>
                    <span>+{Math.round(pricing.seasonSurcharge).toLocaleString()} ج.م</span>
                  </div>
                )}
                {pricing.discountPct > 0 && (
                  <div className="flex justify-between text-sm text-emerald-700 font-semibold">
                    <span>🎁 {isAr ? `خصم إقامة طويلة (-${pricing.discountPct}%)` : `Long stay discount (-${pricing.discountPct}%)`}</span>
                    <span>-{Math.round(pricing.discountAmt).toLocaleString()} ج.م</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-purple-700 font-semibold">
                    <span>🏷️ {isAr ? `كوبون خصم (-${couponDiscount}%)` : `Coupon discount (-${couponDiscount}%)`}</span>
                    <span>-{Math.round(couponDiscountAmt).toLocaleString()} ج.م</span>
                  </div>
                )}
                <div className="flex justify-between font-black text-lg text-sky-700 border-t border-sky-200 pt-2 mt-2">
                  <span>{isAr ? "الإجمالي" : "Total"}</span>
                  <span>{Math.round(grandTotal).toLocaleString()} ج.م</span>
                </div>
              </div>
            )}

            {/* ── 3. Coupon ── */}
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="text-xl">🏷️</span>
                {isAr ? "كوبون الخصم" : "Discount Coupon"}
              </h3>
              <div className="flex gap-2">
                <input
                  value={coupon}
                  onChange={e => setCoupon(e.target.value)}
                  placeholder={isAr ? "أدخل كود الخصم" : "Enter coupon code"}
                  className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
                <button onClick={applyCoupon} className="btn-primary px-5 py-2 text-sm">
                  {isAr ? "تطبيق" : "Apply"}
                </button>
              </div>
              {couponMsg && <p className="text-sm mt-2">{couponMsg}</p>}
            </div>

            {/* ── 4. Features ── */}
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="text-xl">✨</span>
                {isAr ? "المميزات المطلوبة" : "Desired Features"}
              </h3>
              <div className="flex flex-wrap gap-2">
                {featureList.map(f => (
                  <button
                    key={f}
                    onClick={() => toggleFeature(f)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all ${
                      selectedFeatures.includes(f)
                        ? "bg-sky-500 border-sky-500 text-white"
                        : "bg-white border-gray-200 text-gray-600 hover:border-sky-300"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* ── 5. Personal Info ── */}
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="text-xl">👤</span>
                {isAr ? "البيانات الشخصية" : "Personal Information"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{isAr ? "الاسم الكامل *" : "Full Name *"}</label>
                  <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder={isAr ? "محمد أحمد" : "John Doe"}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{isAr ? "رقم الهاتف *" : "Phone Number *"}</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{isAr ? "قيمة العربون (ج.م) *" : "Deposit Amount (EGP) *"}</label>
                  <input
                    value={deposit}
                    onChange={e => setDeposit(e.target.value)}
                    placeholder="1000"
                    type="number"
                    min="0"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">{isAr ? "مدة الإقامة" : "Stay Duration"}</label>
                  <div className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white text-gray-600">
                    {pricing.nights > 0
                      ? `${pricing.nights} ${isAr ? "ليلة" : "nights"}`
                      : isAr ? "اختر التواريخ أولاً" : "Pick dates first"}
                  </div>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs text-gray-500 mb-1">{isAr ? "ملاحظات إضافية" : "Additional Notes"}</label>
                <textarea
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  rows={3}
                  placeholder={isAr ? "أي طلبات خاصة..." : "Any special requests..."}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>
            </div>

            {/* ── 6. Payment Proof ── */}
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="text-xl">💳</span>
                {isAr ? "إثبات الدفع (اختياري)" : "Payment Proof (Optional)"}
              </h3>
              <label className="block">
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${paymentPreview ? "border-sky-400 bg-sky-50" : "border-gray-200 hover:border-sky-300"}`}>
                  {paymentPreview ? (
                    <img src={paymentPreview} alt="payment" className="max-h-40 mx-auto rounded-xl object-contain" />
                  ) : (
                    <div>
                      <div className="text-4xl mb-2">📷</div>
                      <p className="text-sm text-gray-500">{isAr ? "ارفع صورة إيصال الدفع" : "Upload payment receipt screenshot"}</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG</p>
                    </div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
              {paymentImg && (
                <div className="mt-2 flex items-center gap-2 text-sm text-sky-700">
                  <span>✅</span>
                  <span>{paymentImg.name}</span>
                  <span className="ml-auto text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-bold">
                    {isAr ? "قيد الانتظار" : "Pending Review"}
                  </span>
                </div>
              )}
            </div>

            {/* ── 7. CTAs ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={submitBooking}
                disabled={bookingStatus === "pending"}
                className="flex-1 btn-primary py-3.5 text-base font-bold flex items-center justify-center gap-2"
              >
                {bookingStatus === "pending" ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                      <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    {isAr ? "جارٍ الإرسال..." : "Sending..."}
                  </span>
                ) : (
                  <>{isAr ? "🏖️ تأكيد الحجز" : "🏖️ Confirm Booking"}</>
                )}
              </button>
              <button
                onClick={bookWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-full font-bold text-base border-2 border-green-400 text-green-600 hover:bg-green-50 transition-all"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {isAr ? "واتساب" : "WhatsApp"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}