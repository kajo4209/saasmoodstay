"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Coupon {
  id: number;
  code: string;
  discount: number;
  type: "percent" | "fixed";
  maxUses: number;
  usedCount: number;
  active: boolean;
  expiresAt: string | null;
  description: string;
  createdAt: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    year: "numeric", month: "short", day: "numeric",
  });
}
function isExpired(expiresAt: string | null) {
  if (!expiresAt) return false;
  return new Date(expiresAt) < new Date();
}
function usagePercent(used: number, max: number) {
  return max === 0 ? 0 : Math.min(100, Math.round((used / max) * 100));
}

// ─── Toast ───────────────────────────────────────────────────────────────────
function Toast({ msg, type, onDone }: { msg: string; type: "success" | "error" | "info"; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  const colors = { success: "bg-green-500", error: "bg-red-500", info: "bg-sky-500" };
  const icons  = { success: "✅", error: "❌", info: "ℹ️" };
  return (
    <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-6 py-3.5 rounded-2xl shadow-2xl font-bold text-sm text-white flex items-center gap-2 animate-fade-up ${colors[type]}`}>
      {icons[type]} {msg}
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, sub, color }: {
  label: string; value: string | number; icon: string; sub?: string; color: string;
}) {
  return (
    <div className={`rounded-2xl p-5 border bg-white dark:bg-gray-900 ${color}`}>
      <div className="text-2xl mb-1">{icon}</div>
      <div className="text-2xl font-black text-gray-800 dark:text-white">{value}</div>
      <div className="text-sm font-semibold text-gray-600 dark:text-gray-400">{label}</div>
      {sub && <div className="text-xs text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

// ─── Generate Modal ───────────────────────────────────────────────────────────
function GenerateModal({ onClose, onCreated }: {
  onClose: () => void;
  onCreated: (c: Coupon) => void;
}) {
  const [mode, setMode]               = useState<"auto" | "manual">("auto");
  const [prefix, setPrefix]           = useState("MOOD");
  const [manualCode, setManualCode]   = useState("");
  const [discount, setDiscount]       = useState(10);
  const [type, setType]               = useState<"percent" | "fixed">("percent");
  const [maxUses, setMaxUses]         = useState(1);
  const [expiresAt, setExpiresAt]     = useState("");
  const [description, setDescription] = useState("");
  const [qty, setQty]                 = useState(1);   // bulk: كم كوبون يتولّد دفعة واحدة
  const [loading, setLoading]         = useState(false);
  const [err, setErr]                 = useState("");

  const PREFIXES = ["MOOD", "BEACH", "VIP", "SUMMER", "SAHEL", "PROMO"];

  async function submit() {
    setErr(""); setLoading(true);
    try {
      const created: Coupon[] = [];

      const calls = mode === "auto" ? qty : 1;

      for (let i = 0; i < calls; i++) {
        const res = await fetch("/api/coupons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            autoGenerate: mode === "auto",
            prefix,
            code: mode === "manual" ? manualCode : undefined,
            discount,
            type,
            maxUses,
            expiresAt: expiresAt || null,
            description,
          }),
        });
        const data = await res.json();
        if (!res.ok) { setErr(data.error || "حدث خطأ"); setLoading(false); return; }
        created.push(data);
      }

      created.forEach(c => onCreated(c));
      onClose();
    } catch {
      setErr("فشل الاتصال بالخادم");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full overflow-y-auto"
        style={{ maxWidth: 560, maxHeight: "92vh", direction: "rtl" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-t-3xl">
          <div>
            <h2 className="font-black text-xl text-gray-800 dark:text-white">🎟️ إنشاء كوبون جديد</h2>
            <p className="text-xs text-gray-400 mt-0.5">إنشاء يدوي أو توليد تلقائي</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold">✕</button>
        </div>

        <div className="p-6 space-y-5">

          {/* Mode Switch */}
          <div className="flex rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
            {(["auto", "manual"] as const).map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`flex-1 py-3 font-bold text-sm transition-all ${
                  mode === m
                    ? "bg-sky-500 text-white"
                    : "bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-sky-50"
                }`}
              >
                {m === "auto" ? "⚡ توليد تلقائي" : "✏️ إنشاء يدوي"}
              </button>
            ))}
          </div>

          {/* Auto: prefix + qty */}
          {mode === "auto" ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">بادئة الكود (Prefix)</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {PREFIXES.map(p => (
                    <button
                      key={p}
                      onClick={() => setPrefix(p)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-bold border-2 transition-all ${
                        prefix === p
                          ? "bg-sky-500 border-sky-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-sky-300 dark:border-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <input
                  value={prefix}
                  onChange={e => setPrefix(e.target.value.toUpperCase().slice(0, 8))}
                  placeholder="أو اكتب بادئة مخصصة..."
                  className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm font-bold focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:text-white uppercase"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-2">
                  عدد الكوبونات للتوليد دفعة واحدة
                </label>
                <div className="flex items-center gap-3">
                  {[1, 5, 10, 20, 50].map(n => (
                    <button
                      key={n}
                      onClick={() => setQty(n)}
                      className={`px-4 py-2 rounded-xl font-black text-sm border-2 transition-all ${
                        qty === n
                          ? "bg-sky-500 border-sky-500 text-white"
                          : "border-gray-200 text-gray-600 hover:border-sky-300 dark:border-gray-700 dark:text-gray-400"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              {/* Preview */}
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-600 px-4 py-3 flex items-center gap-3">
                <span className="text-gray-400 text-sm">معاينة الكود:</span>
                <span className="font-black text-sky-600 tracking-widest text-lg">{prefix}-XXXXXX</span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">كود الكوبون *</label>
              <input
                value={manualCode}
                onChange={e => setManualCode(e.target.value.toUpperCase().replace(/\s/g, ""))}
                placeholder="مثال: SAHEL25"
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 font-black text-lg tracking-widest focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:text-white"
              />
            </div>
          )}

          {/* Discount */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">قيمة الخصم</label>
            <div className="flex gap-3 mb-3">
              {(["percent", "fixed"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${
                    type === t
                      ? "bg-sky-500 border-sky-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-sky-300 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  {t === "percent" ? "💯 نسبة %" : "💰 مبلغ ثابت ج.م"}
                </button>
              ))}
            </div>
            <div className="relative">
              <input
                type="number"
                min={1}
                max={type === "percent" ? 100 : 99999}
                value={discount}
                onChange={e => setDiscount(Number(e.target.value))}
                className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-2xl font-black focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:text-white"
              />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xl">
                {type === "percent" ? "%" : "ج.م"}
              </span>
            </div>
            {/* Quick presets */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {(type === "percent" ? [5, 10, 15, 20, 25, 30] : [50, 100, 200, 500]).map(v => (
                <button
                  key={v}
                  onClick={() => setDiscount(v)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${
                    discount === v
                      ? "bg-sky-500 border-sky-500 text-white"
                      : "border-gray-200 text-gray-500 hover:border-sky-300"
                  }`}
                >
                  {v}{type === "percent" ? "%" : " ج"}
                </button>
              ))}
            </div>
          </div>

          {/* Max Uses */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">الحد الأقصى للاستخدام</label>
            <div className="flex gap-2">
              {[1, 2, 5, 10, 50, 100].map(n => (
                <button
                  key={n}
                  onClick={() => setMaxUses(n)}
                  className={`flex-1 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                    maxUses === n
                      ? "bg-sky-500 border-sky-500 text-white"
                      : "border-gray-200 text-gray-600 hover:border-sky-300 dark:border-gray-700 dark:text-gray-400"
                  }`}
                >
                  {n === 100 ? "∞" : n}
                </button>
              ))}
            </div>
          </div>

          {/* Expiry */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">
              تاريخ الانتهاء <span className="text-gray-400 font-normal">(اختياري)</span>
            </label>
            <input
              type="date"
              value={expiresAt}
              min={new Date().toISOString().slice(0, 10)}
              onChange={e => setExpiresAt(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:text-white"
            />
            {/* Quick date presets */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {[
                { label: "أسبوع", days: 7 },
                { label: "شهر", days: 30 },
                { label: "٣ أشهر", days: 90 },
                { label: "نهاية الموسم", days: 120 },
              ].map(p => (
                <button
                  key={p.days}
                  onClick={() => {
                    const d = new Date();
                    d.setDate(d.getDate() + p.days);
                    setExpiresAt(d.toISOString().slice(0, 10));
                  }}
                  className="px-3 py-1 rounded-lg text-xs font-bold border border-gray-200 hover:border-sky-300 text-gray-500 transition-all"
                >
                  {p.label}
                </button>
              ))}
              {expiresAt && (
                <button onClick={() => setExpiresAt("")} className="px-3 py-1 rounded-lg text-xs font-bold border border-red-200 text-red-400 hover:bg-red-50 transition-all">
                  ✕ بلا انتهاء
                </button>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-2">
              وصف الكوبون <span className="text-gray-400 font-normal">(للاستخدام الداخلي)</span>
            </label>
            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="مثال: كوبون للعملاء الجدد"
              className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:text-white"
            />
          </div>

          {/* Summary box */}
          <div className="rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 p-4">
            <div className="text-xs font-bold text-sky-700 dark:text-sky-300 mb-2">ملخص الكوبون</div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">الخصم</div>
              <div className="font-black text-sky-700">{discount}{type === "percent" ? "%" : " ج.م"}</div>
              <div className="text-gray-500">الاستخدامات</div>
              <div className="font-bold text-gray-800 dark:text-white">{maxUses} مرة</div>
              {expiresAt && <><div className="text-gray-500">ينتهي</div><div className="font-bold text-gray-800 dark:text-white">{fmtDate(expiresAt)}</div></>}
              {mode === "auto" && <><div className="text-gray-500">العدد</div><div className="font-bold text-sky-700">{qty} كوبون</div></>}
            </div>
          </div>

          {err && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">❌ {err}</div>
          )}

          {/* Submit */}
          <button
            onClick={submit}
            disabled={loading}
            className="w-full btn-primary py-4 text-base font-black flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <>
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/>
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
                جارٍ الإنشاء...
              </>
            ) : mode === "auto" ? (
              <>⚡ توليد {qty > 1 ? `${qty} كوبونات` : "كوبون"} تلقائياً</>
            ) : (
              <>✅ إنشاء الكوبون</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Coupon Row ───────────────────────────────────────────────────────────────
function CouponRow({ coupon, onToggle, onDelete, onCopy }: {
  coupon: Coupon;
  onToggle: (id: number, active: boolean) => void;
  onDelete: (id: number) => void;
  onCopy: (code: string) => void;
}) {
  const expired = isExpired(coupon.expiresAt);
  const exhausted = coupon.usedCount >= coupon.maxUses;
  const reallyActive = coupon.active && !expired && !exhausted;
  const pct = usagePercent(coupon.usedCount, coupon.maxUses);

  return (
    <tr className="border-b border-gray-50 dark:border-gray-800 hover:bg-sky-50/30 dark:hover:bg-sky-900/10 transition-colors group">
      {/* Code */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="font-black text-base tracking-widest text-sky-600 dark:text-sky-400 font-mono">
            {coupon.code}
          </span>
          <button
            onClick={() => onCopy(coupon.code)}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg bg-sky-100 hover:bg-sky-200 flex items-center justify-center text-sky-600 text-xs"
            title="نسخ"
          >
            📋
          </button>
        </div>
        {coupon.description && (
          <div className="text-xs text-gray-400 mt-0.5">{coupon.description}</div>
        )}
      </td>

      {/* Discount */}
      <td className="px-4 py-3">
        <span className="font-black text-lg text-emerald-600">
          {coupon.discount}{coupon.type === "percent" ? "%" : " ج.م"}
        </span>
      </td>

      {/* Usage + progress */}
      <td className="px-4 py-3 min-w-[140px]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
            {coupon.usedCount} / {coupon.maxUses}
          </span>
          <span className="text-xs text-gray-400">{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${pct >= 100 ? "bg-red-400" : pct >= 70 ? "bg-yellow-400" : "bg-emerald-400"}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </td>

      {/* Expiry */}
      <td className="px-4 py-3 text-sm whitespace-nowrap">
        {coupon.expiresAt ? (
          <span className={expired ? "text-red-500 font-bold" : "text-gray-600 dark:text-gray-400"}>
            {expired ? "⚠️ " : ""}{fmtDate(coupon.expiresAt)}
          </span>
        ) : (
          <span className="text-gray-400">بلا انتهاء</span>
        )}
      </td>

      {/* Status */}
      <td className="px-4 py-3">
        {reallyActive ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-green-100 text-green-700 border border-green-200">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block"/> فعّال
          </span>
        ) : expired ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-orange-100 text-orange-700 border border-orange-200">
            ⏰ منتهي
          </span>
        ) : exhausted ? (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-purple-100 text-purple-700 border border-purple-200">
            🔒 مستنفد
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-gray-100 text-gray-600 border border-gray-200">
            ⏸ موقوف
          </span>
        )}
      </td>

      {/* Created */}
      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
        {fmtDate(coupon.createdAt)}
      </td>

      {/* Actions */}
      <td className="px-4 py-3">
        <div className="flex gap-1.5 items-center">
          {/* Toggle */}
          <button
            onClick={() => onToggle(coupon.id, !coupon.active)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              coupon.active
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-green-100 hover:bg-green-200 text-green-700"
            }`}
            title={coupon.active ? "إيقاف" : "تفعيل"}
          >
            {coupon.active ? "⏸" : "▶️"}
          </button>
          {/* Copy */}
          <button
            onClick={() => onCopy(coupon.code)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-100 hover:bg-sky-200 text-sky-700 transition-all"
            title="نسخ الكود"
          >📋</button>
          {/* Delete */}
          <button
            onClick={() => onDelete(coupon.id)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 hover:bg-red-200 text-red-600 transition-all"
            title="حذف"
          >🗑️</button>
        </div>
      </td>
    </tr>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function CouponsPage() {
  const [coupons, setCoupons]     = useState<Coupon[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch]       = useState("");
  const [statusFilter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [toast, setToast]         = useState<{ msg: string; type: "success"|"error"|"info" } | null>(null);
  const intervalRef               = useRef<NodeJS.Timeout | null>(null);

  function showT(msg: string, type: "success" | "error" | "info" = "success") {
    setToast({ msg, type });
  }

  const load = useCallback(async () => {
    try {
      const res  = await fetch("/api/coupons");
      const data = await res.json();
      setCoupons(Array.isArray(data) ? data : []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    load();
    // Auto-refresh every 30s
    intervalRef.current = setInterval(load, 30000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [load]);

  async function handleToggle(id: number, active: boolean) {
    try {
      const res = await fetch(`/api/coupons/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active }),
      });
      if (!res.ok) throw new Error();
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, active } : c));
      showT(active ? "✅ تم تفعيل الكوبون" : "⏸ تم إيقاف الكوبون", active ? "success" : "info");
    } catch { showT("فشل التعديل", "error"); }
  }

  async function handleDelete(id: number) {
    if (!confirm("هل تريد حذف هذا الكوبون نهائياً؟")) return;
    try {
      const res = await fetch(`/api/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setCoupons(prev => prev.filter(c => c.id !== id));
      showT("🗑️ تم حذف الكوبون", "info");
    } catch { showT("فشل الحذف", "error"); }
  }

  function handleCopy(code: string) {
    navigator.clipboard.writeText(code).then(() => showT(`📋 تم نسخ: ${code}`, "info"));
  }

  function handleCreated(c: Coupon) {
    setCoupons(prev => [c, ...prev]);
    showT(`✅ تم إنشاء الكوبون: ${c.code}`, "success");
  }

  // Stats
  const activeCount  = coupons.filter(c => c.active && !isExpired(c.expiresAt) && c.usedCount < c.maxUses).length;
  const expiredCount = coupons.filter(c => isExpired(c.expiresAt)).length;
  const totalUses    = coupons.reduce((s, c) => s + c.usedCount, 0);
  const avgDiscount  = coupons.length
    ? Math.round(coupons.reduce((s, c) => s + c.discount, 0) / coupons.length)
    : 0;

  // Filter
  const filtered = coupons.filter(c => {
    const q = search.toLowerCase();
    const matchSearch = c.code.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q);
    const reallyActive = c.active && !isExpired(c.expiresAt) && c.usedCount < c.maxUses;
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active"   && reallyActive) ||
      (statusFilter === "inactive" && !reallyActive);
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6 font-arabic min-h-screen dark:bg-gray-950" dir="rtl">

      {/* Toast */}
      {toast && <Toast msg={toast.msg} type={toast.type} onDone={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white flex items-center gap-2">
            🎟️ إدارة الكوبونات
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            أنشئ وأدِر كوبونات الخصم لعملائك
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
          >
            🔄 تحديث
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2"
          >
            ⚡ إنشاء كوبون
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="إجمالي الكوبونات" value={coupons.length}    icon="🎟️" color="border-gray-200"   />
        <StatCard label="كوبونات فعّالة"    value={activeCount}       icon="✅" color="border-green-200"  sub={`${expiredCount} منتهية`} />
        <StatCard label="إجمالي الاستخدام"  value={totalUses}         icon="📊" color="border-sky-200"    />
        <StatCard label="متوسط الخصم"       value={`${avgDiscount}%`} icon="💯" color="border-purple-200" />
      </div>

      {/* Quick-generate bar */}
      <div className="rounded-2xl border border-dashed border-sky-300 dark:border-sky-700 bg-sky-50 dark:bg-sky-900/20 p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1">
          <div className="font-black text-sky-700 dark:text-sky-300 text-base mb-1">⚡ توليد سريع بضغطة واحدة</div>
          <p className="text-sky-600 dark:text-sky-400 text-sm">اضغط الزر لتوليد كوبون خصم 10% جاهز على الفور</p>
        </div>
        <button
          onClick={async () => {
            const res = await fetch("/api/coupons", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ autoGenerate: true, prefix: "MOOD", discount: 10, type: "percent", maxUses: 1 }),
            });
            const data = await res.json();
            if (res.ok) { handleCreated(data); }
            else showT(data.error || "حدث خطأ", "error");
          }}
          className="btn-primary px-7 py-3.5 font-black text-base whitespace-nowrap flex items-center gap-2"
        >
          ⚡ أنشئ الآن
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث بالكود أو الوصف..."
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "active", "inactive"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                statusFilter === f
                  ? "bg-sky-500 border-sky-500 text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-sky-300"
              }`}
            >
              {f === "all" ? "الكل" : f === "active" ? "✅ فعّال" : "⏸ موقوف"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: 800 }}>
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                {["الكود", "الخصم", "الاستخدام", "الانتهاء", "الحالة", "تاريخ الإنشاء", "الإجراءات"].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1, 2, 3].map(i => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800 animate-pulse">
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-gray-400">
                    <div className="text-5xl mb-3">🎟️</div>
                    <p className="font-bold text-base">
                      {search ? "لا نتائج لهذا البحث" : "لا توجد كوبونات بعد"}
                    </p>
                    {!search && (
                      <button
                        onClick={() => setShowModal(true)}
                        className="mt-4 btn-primary px-6 py-2.5 text-sm inline-flex items-center gap-2"
                      >
                        ⚡ أنشئ أول كوبون
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(c => (
                  <CouponRow
                    key={c.id}
                    coupon={c}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    onCopy={handleCopy}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-400">
            <span>عرض {filtered.length} من {coupons.length} كوبون</span>
            <span>{activeCount} فعّال • {expiredCount} منتهٍ</span>
          </div>
        )}
      </div>

      {/* Generate Modal */}
      {showModal && (
        <GenerateModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
