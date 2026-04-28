"use client";

import { useEffect, useState } from "react";
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

// ─── Date Helpers ─────────────────────────────────────────────────────────────
function isWeekend(date: Date) { const d = date.getDay(); return d === 4 || d === 5; }
function isSeason(date: Date)  { const m = date.getMonth() + 1; return m >= 7 && m <= 8; }

function calcNights(a: Date | null, b: Date | null): number {
  if (!a || !b) return 0;
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000));
}

function calcLongStayDiscount(nights: number): number {
  if (nights >= 8) return 5;
  if (nights === 7) return 4;
  if (nights === 6) return 3;
  if (nights === 5) return 2;
  if (nights === 4) return 1;
  return 0;
}

function calcPricing(basePrice: number, checkIn: Date | null, checkOut: Date | null) {
  if (!checkIn || !checkOut) return {
    nights: 0, baseTotal: 0, weekendSurcharge: 0, seasonSurcharge: 0,
    grossTotal: 0, discountPct: 0, discountAmt: 0, finalTotal: 0, deposit: 0,
  };

  let weekendExtra = 0, seasonExtra = 0;
  const cur = new Date(checkIn);
  while (cur < checkOut) {
    if (isWeekend(cur)) weekendExtra += basePrice * 0.20;
    if (isSeason(cur))  seasonExtra  += basePrice * 0.10;
    cur.setDate(cur.getDate() + 1);
  }

  const nights       = calcNights(checkIn, checkOut);
  const baseTotal    = nights * basePrice;
  const grossTotal   = baseTotal + weekendExtra + seasonExtra;
  const discountPct  = calcLongStayDiscount(nights);
  const discountAmt  = grossTotal * (discountPct / 100);
  const finalTotal   = Math.round(grossTotal - discountAmt);
  const deposit      = Math.round(finalTotal * 0.15);

  return { nights, baseTotal, weekendSurcharge: weekendExtra, seasonSurcharge: seasonExtra,
    grossTotal, discountPct, discountAmt, finalTotal, deposit };
}

function fmt(d: Date): string { return d.toISOString().slice(0, 10); }

// ─── Mini Calendar ────────────────────────────────────────────────────────────
function MiniCalendar({
  checkIn, checkOut, onSelect, bookedRanges,
}: {
  checkIn: Date | null;
  checkOut: Date | null;
  onSelect: (d: Date) => void;
  bookedRanges?: [string, string][];
}) {
  const today = new Date(); today.setHours(0,0,0,0);
  const [viewYear,  setViewYear]  = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const firstDay = new Date(viewYear, viewMonth, 1);
  const lastDay  = new Date(viewYear, viewMonth + 1, 0);
  const startPad = firstDay.getDay();

  const days: (Date | null)[] = [];
  for (let i = 0; i < startPad; i++) days.push(null);
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(viewYear, viewMonth, d));

  const MONTHS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
                  "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const DAYS   = ["أح","إث","ثل","أر","خم","جم","سب"];

  function isConflict(d: Date): boolean {
    const s = fmt(d);
    return (bookedRanges ?? []).some(([a, b]) => s >= a && s < b);
  }

  function cellClass(d: Date): string {
    const past     = d < today;
    const conflict = isConflict(d);
    const inRange  = checkIn && checkOut && d > checkIn && d < checkOut;
    const isStart  = checkIn  && d.getTime() === checkIn.getTime();
    const isEnd    = checkOut && d.getTime() === checkOut.getTime();
    const weekend  = isWeekend(d);
    const season   = isSeason(d);

    if (past || conflict) return "bg-gray-100 text-gray-300 cursor-not-allowed text-xs line-through";
    if (isStart || isEnd)        return "bg-sky-500 text-white rounded-full font-bold cursor-pointer text-xs";
    if (inRange)                 return "bg-sky-100 text-sky-700 cursor-pointer text-xs";
    if (weekend && season)       return "bg-orange-100 text-orange-700 cursor-pointer hover:bg-orange-200 text-xs";
    if (weekend)                 return "bg-yellow-50 text-yellow-700 cursor-pointer hover:bg-yellow-100 text-xs";
    if (season)                  return "bg-green-50 text-green-700 cursor-pointer hover:bg-green-100 text-xs";
    return "hover:bg-sky-50 text-gray-700 cursor-pointer text-xs";
  }

  function handleDay(d: Date) {
    if (d < today || isConflict(d)) return;
    onSelect(d);
  }

  function prevMonth() {
    const nd = new Date(viewYear, viewMonth - 1, 1);
    setViewYear(nd.getFullYear()); setViewMonth(nd.getMonth());
  }
  function nextMonth() {
    const nd = new Date(viewYear, viewMonth + 1, 1);
    setViewYear(nd.getFullYear()); setViewMonth(nd.getMonth());
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-sky-100 dark:border-sky-900 p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-50 text-sky-600 font-bold">‹</button>
        <span className="font-bold text-gray-700 dark:text-gray-200 text-sm">{MONTHS[viewMonth]} {viewYear}</span>
        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-sky-50 text-sky-600 font-bold">›</button>
      </div>
      <div className="grid grid-cols-7 gap-0.5 mb-1">
        {DAYS.map(n => <div key={n} className="text-center text-xs font-bold text-gray-400 py-1">{n}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {days.map((d, i) => (
          <div key={i} className="flex items-center justify-center">
            {d ? (
              <button
                onClick={() => handleDay(d)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${cellClass(d)}`}
              >
                {d.getDate()}
              </button>
            ) : <div className="w-8 h-8" />}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mt-3 text-xs text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-yellow-100 rounded inline-block"/>ويك إند +20%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-100 rounded inline-block"/>موسم +10%</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-100 rounded inline-block"/>محجوز</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-gray-100 rounded inline-block"/>غير متاح</span>
      </div>
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function BookingModal({ chalet, onClose }: BookingModalProps) {
  const { lang } = useLang();
  const isAr = lang === "ar";

  // Calendar
  const [checkIn,  setCheckIn]  = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [calStep,  setCalStep]  = useState<"in" | "out">("in");

  // Form
  const [name,  setName]  = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  // Coupon
  const [coupon, setCoupon]       = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState("");

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [bookedRanges, setBookedRanges] = useState<[string, string][]>([]);
  
  // WhatsApp redirect loading state
  const [redirecting, setRedirecting] = useState(false);

  // Features from chalet
  const featureList = chalet.features
    ? chalet.features.split(/[-،,]/).map(f => f.trim()).filter(Boolean)
    : ["حمام سباحة", "إطلالة بحر", "واي فاي", "تكييف"];

  // Pricing
  const pricing = calcPricing(chalet.price, checkIn, checkOut);

  // Coupon
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
  const grandTotal        = Math.round(pricing.finalTotal - couponDiscountAmt);
  const depositAmount     = Math.round(grandTotal * 0.15);

  // Validate Egyptian WhatsApp number (starts with 01, exactly 11 digits)
  function isValidEgyptianPhone(phoneNumber: string): boolean {
    return /^01[0-9]{9}$/.test(phoneNumber);
  }

  useEffect(() => {
    let cancelled = false;
    async function loadBookedRanges() {
      try {
        const res = await fetch(`/api/bookings?chaletId=${chalet.id}&status=confirmed`, { cache: "no-store" });
        if (!res.ok) return;
        const rows = await res.json();
        if (cancelled || !Array.isArray(rows)) return;
        const ranges: [string, string][] = [];
        for (const b of rows as Array<{ checkIn?: string; checkOut?: string }>) {
          const start = b.checkIn?.slice(0, 10);
          const end = b.checkOut?.slice(0, 10);
          if (start && end) ranges.push([start, end]);
        }
        setBookedRanges(ranges);
      } catch {
        if (!cancelled) setBookedRanges([]);
      }
    }

    loadBookedRanges();
    return () => { cancelled = true; };
  }, [chalet.id]);

  function hasRangeConflict(start: Date, end: Date): boolean {
    const from = fmt(start);
    const to = fmt(end);
    return bookedRanges.some(([a, b]) => from < b && to > a);
  }

  // Calendar logic
  function handleDateSelect(d: Date) {
    if (calStep === "in") {
      setCheckIn(d); setCheckOut(null); setCalStep("out");
    } else {
      if (checkIn && d <= checkIn) {
        setCheckIn(d); setCheckOut(null); setCalStep("out");
      } else {
        if (checkIn && hasRangeConflict(checkIn, d)) {
          setErrorMsg(isAr ? "الفترة المختارة تتعارض مع حجز مؤكد. اختر تواريخ أخرى." : "Selected dates overlap a confirmed booking. Please pick other dates.");
          return;
        }
        setErrorMsg("");
        setCheckOut(d); setCalStep("in");
      }
    }
  }

  function toggleFeature(f: string) {
    setSelectedFeatures(prev => prev.includes(f) ? prev.filter(x => x !== f) : [...prev, f]);
  }

  // Submit to dashboard first (all validation happens here)
  async function submitBooking(): Promise<boolean> {
    // Clear previous errors
    setErrorMsg("");
    
    // Validation: Name
    if (!name.trim()) {
      setErrorMsg(isAr ? "يرجى تعبئة الاسم" : "Please enter your name");
      return false;
    }
    
    // Validation: Phone (WhatsApp number)
    if (!phone.trim()) {
      setErrorMsg(isAr ? "يرجى إدخال رقم الواتساب" : "Please enter your WhatsApp number");
      return false;
    }
    
    if (!isValidEgyptianPhone(phone.trim())) {
      setErrorMsg(isAr ? "رقم واتساب غير صحيح. يجب أن يبدأ بـ 01 ويتكون من 11 رقمًا" : "Invalid WhatsApp number. Must start with 01 and be exactly 11 digits");
      return false;
    }
    
    // Validation: Dates
    if (!checkIn || !checkOut) {
      setErrorMsg(isAr ? "يرجى اختيار تاريخ الدخول والخروج" : "Please select check-in and check-out dates");
      return false;
    }
    
    if (hasRangeConflict(checkIn, checkOut)) {
      setErrorMsg(isAr ? "الفترة المختارة غير متاحة (محجوزة بالفعل)." : "Selected date range is unavailable (already booked).");
      return false;
    }
    
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chaletId: chalet.id,
          guestName: name.trim(),
          phone: phone.trim(),
          checkIn:  checkIn.toISOString(),
          checkOut: checkOut.toISOString(),
          notes: notes.trim(),
          features: selectedFeatures,
        }),
      });

      if (res.status === 409) {
        const data = await res.json();
        setErrorMsg(data.error || (isAr ? "الشاليه محجوز في هذه الفترة" : "Chalet is booked for these dates"));
        return false;
      }

      if (!res.ok) {
        const data = await res.json();
        setErrorMsg(data.error || (isAr ? "حدث خطأ" : "An error occurred"));
        return false;
      }

      return true;
    } catch {
      setErrorMsg(isAr ? "فشل الاتصال بالخادم" : "Connection failed");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  // Handle WhatsApp booking flow - sends message to OWNER
  async function handleWhatsAppBooking() {
    // Submit booking to dashboard first (includes all validation)
    const ok = await submitBooking();
    if (!ok) return;

    // Show loading screen
    setRedirecting(true);

    // Prepare WhatsApp message with customer data for the OWNER
    const messageLines = [
      `📢 طلب حجز جديد من الموقع`,
      ``,
      `🏖️ الشاليه: ${chalet.name}`,
      `👤 اسم العميل: ${name.trim()}`,
      `📞 رقم العميل: ${phone.trim()}`,
      `📅 تاريخ الدخول: ${fmt(checkIn!)}`,
      `📅 تاريخ الخروج: ${fmt(checkOut!)}`,
      `🌙 عدد الليالي: ${pricing.nights}`,
      `💰 الإجمالي: ${grandTotal.toLocaleString()} ج.م`,
      `💳 العربون المطلوب: ${depositAmount.toLocaleString()} ج.م (15%)`,
      notes.trim() ? `📝 ملاحظات العميل: ${notes.trim()}` : "",
      selectedFeatures.length > 0 ? `✨ المميزات المطلوبة: ${selectedFeatures.join(", ")}` : "",
      couponDiscount > 0 ? `🏷️ كوبون خصم: ${couponDiscount}%` : "",
      ``,
      `يرجى التواصل مع العميل لتأكيد الحجز وإرسال تفاصيل الدفع.`,
    ].filter(Boolean);
    
    const message = encodeURIComponent(messageLines.join("\n"));
    
    // Owner's phone number (fixed - the chalet owner)
    // Format: 01201543050 -> 201201543050 for WhatsApp international format
    const OWNER_PHONE = "201201543050";
    
    // Redirect to WhatsApp after 3 seconds
    setTimeout(() => {
      window.location.href = `https://wa.me/${OWNER_PHONE}?text=${message}`;
    }, 3000);
  }

  function handleBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if ((e.target as HTMLElement).id === "booking-backdrop") onClose();
  }

  // ── Render ──
  return (
    <>
      {/* Redirecting Loading Overlay */}
      {redirecting && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl text-center shadow-2xl max-w-sm mx-4">
            <div className="text-5xl mb-4">📱</div>
            <p className="mb-4 font-medium text-gray-800 dark:text-white text-lg">
              {isAr ? "جاري تحويلك إلى واتساب لتأكيد الحجز..." : "Redirecting you to WhatsApp to confirm booking..."}
            </p>
            <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="text-xs text-gray-400 mt-4">
              {isAr ? "سيتم التحويل خلال 3 ثوانٍ" : "Redirecting in 3 seconds"}
            </p>
          </div>
        </div>
      )}

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
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-3xl">
            <div>
              <h2 className="font-black text-xl text-gray-800 dark:text-white">
                {isAr ? "🏖️ احجز الآن" : "🏖️ Book Now"}
              </h2>
              <p className="text-sm text-sky-600 font-semibold">{chalet.name}</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-500 text-xl transition-all"
            >
              ✕
            </button>
          </div>

          <div className="p-6 space-y-6">

            {/* ── 1. Calendar ── */}
            <div>
              <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                <span className="text-xl">📅</span>
                {isAr ? "اختر تواريخ الإقامة" : "Select Stay Dates"}
              </h3>
              <div className="flex gap-3 mb-4">
                <button
                  onClick={() => setCalStep("in")}
                  className={`flex-1 rounded-xl p-3 border-2 text-right transition-all ${calStep === "in" ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}
                >
                  <div className="text-xs text-gray-400">{isAr ? "تاريخ الدخول" : "Check-in"}</div>
                  <div className="font-bold text-gray-800 dark:text-white text-sm">
                    {checkIn ? fmt(checkIn) : <span className="text-gray-300">{isAr ? "اختر تاريخ" : "Pick date"}</span>}
                  </div>
                </button>
                <div className="flex items-center text-gray-300 text-xl">→</div>
                <button
                  onClick={() => checkIn && setCalStep("out")}
                  className={`flex-1 rounded-xl p-3 border-2 text-right transition-all ${calStep === "out" ? "border-sky-500 bg-sky-50" : "border-gray-200"}`}
                >
                  <div className="text-xs text-gray-400">{isAr ? "تاريخ الخروج" : "Check-out"}</div>
                  <div className="font-bold text-gray-800 dark:text-white text-sm">
                    {checkOut ? fmt(checkOut) : <span className="text-gray-300">{isAr ? "اختر تاريخ" : "Pick date"}</span>}
                  </div>
                </button>
              </div>
              <MiniCalendar
                checkIn={checkIn}
                checkOut={checkOut}
                onSelect={handleDateSelect}
                bookedRanges={bookedRanges}
              />
            </div>

            {/* ── 2. Price Summary ── */}
            {pricing.nights > 0 && (
              <div className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 border border-sky-100 p-4 space-y-2">
                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="text-xl">💰</span>
                  {isAr ? "تفاصيل السعر" : "Price Details"}
                </h3>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{pricing.nights} {isAr ? "ليلة" : "nights"} × {chalet.price.toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                  <span className="font-semibold">{pricing.baseTotal.toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                </div>
                {pricing.weekendSurcharge > 0 && (
                  <div className="flex justify-between text-sm text-yellow-700">
                    <span>🌙 {isAr ? "إضافة ويك إند (+20%)" : "Weekend surcharge (+20%)"}</span>
                    <span>+{Math.round(pricing.weekendSurcharge).toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
                )}
                {pricing.seasonSurcharge > 0 && (
                  <div className="flex justify-between text-sm text-green-700">
                    <span>☀️ {isAr ? "موسم صيفي (+10%)" : "Peak season (+10%)"}</span>
                    <span>+{Math.round(pricing.seasonSurcharge).toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
                )}
                {pricing.discountPct > 0 && (
                  <div className="flex justify-between text-sm text-emerald-700 font-semibold">
                    <span>🎁 {isAr ? `خصم إقامة طويلة (-${pricing.discountPct}%)` : `Long stay discount (-${pricing.discountPct}%)`}</span>
                    <span>-{Math.round(pricing.discountAmt).toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
                )}
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm text-purple-700 font-semibold">
                    <span>🏷️ {isAr ? `كوبون (-${couponDiscount}%)` : `Coupon (-${couponDiscount}%)`}</span>
                    <span>-{Math.round(couponDiscountAmt).toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
                )}
                <div className="border-t border-sky-200 pt-2 mt-2 space-y-1.5">
                  <div className="flex justify-between font-black text-lg text-sky-700">
                    <span>{isAr ? "الإجمالي" : "Total"}</span>
                    <span>{grandTotal.toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-amber-700 bg-amber-50 rounded-xl px-3 py-2">
                    <span>💳 {isAr ? "العربون المطلوب (15%)" : "Required Deposit (15%)"}</span>
                    <span>{depositAmount.toLocaleString()} {isAr ? "ج.م" : "EGP"}</span>
                  </div>
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
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-sky-300"
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
                  <label className="block text-xs text-gray-500 mb-1">{isAr ? "رقم الواتساب *" : "WhatsApp Number *"}</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="01234567890"
                    type="tel"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    📱 {isAr ? "برجاء إدخال رقم الواتساب الصحيح ليتم تأكيد الحجز عليه" : "Please enter the correct WhatsApp number to confirm the booking"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs text-gray-500 mb-1">{isAr ? "مدة الإقامة" : "Stay Duration"}</label>
                  <div className="w-full border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 dark:border-gray-700 text-gray-600 dark:text-gray-300">
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

            {/* ── Error ── */}
            {errorMsg && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 font-medium">
                ❌ {errorMsg}
              </div>
            )}

            {/* ── WhatsApp Confirm Button ── */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleWhatsAppBooking}
                disabled={isSubmitting || redirecting}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl w-full font-bold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>💬</span>
                {isAr ? "تأكيد الحجز عبر واتساب" : "Confirm Booking via WhatsApp"}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}