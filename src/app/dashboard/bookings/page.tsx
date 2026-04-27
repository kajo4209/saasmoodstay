"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type BookingStatus = "pending" | "confirmed" | "cancelled";

interface Booking {
  id: number;
  guestName: string;
  phone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  deposit: number;
  notes: string;
  features: string;
  status: BookingStatus;
  payment: string;
  createdAt: string;
  chalet: { name: string };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", { year: "numeric", month: "short", day: "numeric" });
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, { label: string; cls: string }> = {
    pending:   { label: "قيد الانتظار", cls: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    confirmed: { label: "مؤكد",         cls: "bg-green-100 text-green-800 border-green-200"  },
    cancelled: { label: "ملغي",         cls: "bg-red-100 text-red-800 border-red-200"        },
  };
  const { label, cls } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${cls}`}>
      {status === "pending" ? "⏳" : status === "confirmed" ? "✅" : "❌"} {label}
    </span>
  );
}

function StatCard({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) {
  return (
    <div className={`rounded-2xl p-5 border ${color} bg-white dark:bg-gray-900`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="text-2xl font-black text-gray-800 dark:text-white">{value}</div>
      <div className="text-sm text-gray-500 mt-0.5">{title}</div>
    </div>
  );
}

// ─── Booking Detail Modal ─────────────────────────────────────────────────────
function BookingDetailModal({ booking, onClose, onStatusChange }: {
  booking: Booking;
  onClose: () => void;
  onStatusChange: (id: number, status: BookingStatus) => Promise<void>;
}) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  async function changeStatus(s: BookingStatus) {
    setLoading(true); setErrorMsg("");
    try {
      await onStatusChange(booking.id, s);
      onClose();
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "حدث خطأ");
    } finally { setLoading(false); }
  }

  const depositAmt = booking.deposit || Math.round(booking.totalPrice * 0.15);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full overflow-y-auto p-6 space-y-5"
        style={{ maxWidth: 560, maxHeight: "90vh", direction: "rtl" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-black text-xl text-gray-800 dark:text-white">طلب حجز #{booking.id}</h2>
            <p className="text-sm text-sky-600 font-semibold">{booking.chalet?.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={booking.status} />
            <button onClick={onClose} className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500">✕</button>
          </div>
        </div>

        {/* Guest Info */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
            <div className="text-xs text-gray-400 mb-1">الاسم</div>
            <div className="font-bold text-gray-800 dark:text-white">{booking.guestName}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-4">
            <div className="text-xs text-gray-400 mb-1">الهاتف</div>
            <a href={`tel:${booking.phone}`} className="font-bold text-sky-600 hover:underline">{booking.phone}</a>
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">تاريخ الدخول</div>
            <div className="font-bold text-sky-700 text-sm">{fmtDate(booking.checkIn)}</div>
          </div>
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">تاريخ الخروج</div>
            <div className="font-bold text-sky-700 text-sm">{fmtDate(booking.checkOut)}</div>
          </div>
          <div className="bg-sky-50 dark:bg-sky-900/20 rounded-2xl p-4 text-center">
            <div className="text-xs text-gray-400 mb-1">عدد الليالي</div>
            <div className="font-bold text-sky-700 text-lg">{booking.nights || "—"}</div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-900/20 dark:to-blue-900/20 rounded-2xl p-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">إجمالي الحجز</span>
            <span className="font-black text-gray-800 dark:text-white">{booking.totalPrice.toLocaleString()} ج.م</span>
          </div>
          <div className="flex justify-between text-sm font-bold text-amber-700 border-t border-sky-200 pt-2 mt-1">
            <span>💳 العربون المطلوب (15%)</span>
            <span>{depositAmt.toLocaleString()} ج.م</span>
          </div>
        </div>

        {/* Features */}
        {booking.features && (
          <div>
            <div className="text-xs text-gray-400 mb-2">المميزات المطلوبة</div>
            <div className="flex flex-wrap gap-2">
              {booking.features.split("،").filter(Boolean).map((f, i) => (
                <span key={i} className="px-3 py-1 text-xs rounded-full bg-sky-50 text-sky-700 border border-sky-100">{f.trim()}</span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 rounded-2xl p-4">
            <div className="text-xs text-gray-400 mb-1">ملاحظات العميل</div>
            <p className="text-sm text-gray-700 dark:text-gray-300">{booking.notes}</p>
          </div>
        )}

        {/* Dates meta */}
        <div className="text-xs text-gray-400 text-center">
          تاريخ تقديم الطلب: {fmtDate(booking.createdAt)}
        </div>

        {/* Error */}
        {errorMsg && (
          <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            ❌ {errorMsg}
          </div>
        )}

        {/* Actions */}
        {booking.status === "pending" && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => changeStatus("confirmed")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm bg-green-500 hover:bg-green-600 text-white transition-all disabled:opacity-60"
            >
              {loading ? "⏳" : "✅"} تأكيد الحجز
            </button>
            <button
              onClick={() => changeStatus("cancelled")}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm border-2 border-red-400 text-red-600 hover:bg-red-50 transition-all disabled:opacity-60"
            >
              ❌ إلغاء
            </button>
          </div>
        )}
        {booking.status !== "pending" && (
          <div className="text-center text-sm text-gray-400 py-2">
            الحجز {booking.status === "confirmed" ? "مؤكد ✅" : "ملغي ❌"} — لا يمكن تعديل الحالة
          </div>
        )}
        {/* WhatsApp client */}
        <a
          href={`https://wa.me/${booking.phone.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3 rounded-full font-bold text-sm border-2 border-green-400 text-green-600 hover:bg-green-50 transition-all"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          تواصل مع العميل عبر واتساب
        </a>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | BookingStatus>("all");
  const [selected, setSelected] = useState<Booking | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  const loadBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch { setBookings([]); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { loadBookings(); }, [loadBookings]);

  async function updateStatus(id: number, status: BookingStatus) {
    const res = await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || "فشل تحديث الحالة");
    }
    showToast(status === "confirmed" ? "✅ تم تأكيد الحجز" : "❌ تم إلغاء الحجز", status === "confirmed" ? "success" : "error");
    await loadBookings();
  }

  // Stats
  const total     = bookings.length;
  const pending   = bookings.filter(b => b.status === "pending").length;
  const confirmed = bookings.filter(b => b.status === "confirmed").length;
  const revenue   = bookings.filter(b => b.status === "confirmed").reduce((s, b) => s + b.totalPrice, 0);

  // Filtered
  const filtered = bookings.filter(b => {
    const q = search.toLowerCase();
    const matchSearch =
      b.guestName?.toLowerCase().includes(q) ||
      b.phone?.includes(q) ||
      String(b.id).includes(q) ||
      b.chalet?.name?.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 space-y-6 font-arabic" dir="rtl">

      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl shadow-xl font-bold text-sm transition-all ${
          toast.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-800 dark:text-white">🗓️ إدارة الحجوزات</h1>
          <p className="text-gray-500 text-sm mt-0.5">جميع طلبات حجز الشاليهات</p>
        </div>
        <button
          onClick={loadBookings}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
        >
          🔄 تحديث
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="إجمالي الطلبات"     value={total}                          icon="📋" color="border-gray-200" />
        <StatCard title="قيد الانتظار"        value={pending}                        icon="⏳" color="border-yellow-200" />
        <StatCard title="مؤكدة"               value={confirmed}                      icon="✅" color="border-green-200" />
        <StatCard title="إيرادات مؤكدة"       value={revenue.toLocaleString() + " ج"} icon="💰" color="border-sky-200" />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400 pointer-events-none">🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث بالاسم أو الهاتف أو رقم الحجز أو اسم الشاليه..."
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:border-sky-400 dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="flex gap-2">
          {(["all","pending","confirmed","cancelled"] as const).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                statusFilter === s
                  ? "bg-sky-500 border-sky-500 text-white"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-sky-300"
              }`}
            >
              {s === "all" ? "الكل" : s === "pending" ? "⏳ انتظار" : s === "confirmed" ? "✅ مؤكد" : "❌ ملغي"}
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
                {["#", "الشاليه", "العميل", "الهاتف", "الدخول", "الخروج", "الليالي", "الإجمالي", "العربون", "الحالة", "الإجراء"].map(h => (
                  <th key={h} className="px-4 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [1,2,3].map(i => (
                  <tr key={i} className="border-b border-gray-50 dark:border-gray-800 animate-pulse">
                    {Array(11).fill(0).map((_, j) => (
                      <td key={j} className="px-4 py-4">
                        <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={11} className="text-center py-16 text-gray-400">
                    <div className="text-4xl mb-2">📭</div>
                    <p className="font-medium">{search ? "لا نتائج لهذا البحث" : "لا توجد حجوزات بعد"}</p>
                  </td>
                </tr>
              ) : filtered.map(b => (
                <tr
                  key={b.id}
                  className="border-b border-gray-50 dark:border-gray-800 hover:bg-sky-50/30 dark:hover:bg-sky-900/10 transition-colors cursor-pointer"
                  onClick={() => setSelected(b)}
                >
                  <td className="px-4 py-3 font-bold text-gray-400">#{b.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-white whitespace-nowrap">{b.chalet?.name || "—"}</td>
                  <td className="px-4 py-3 font-semibold text-sky-600 whitespace-nowrap">{b.guestName}</td>
                  <td className="px-4 py-3 text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    <a href={`tel:${b.phone}`} className="hover:text-sky-500" onClick={e => e.stopPropagation()}>{b.phone}</a>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{fmtDate(b.checkIn)}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-gray-600 dark:text-gray-400">{fmtDate(b.checkOut)}</td>
                  <td className="px-4 py-3 text-center font-bold text-gray-700 dark:text-gray-300">{b.nights || "—"}</td>
                  <td className="px-4 py-3 font-black text-sky-700 whitespace-nowrap">{b.totalPrice.toLocaleString()} ج</td>
                  <td className="px-4 py-3 font-bold text-amber-600 whitespace-nowrap">
                    {(b.deposit || Math.round(b.totalPrice * 0.15)).toLocaleString()} ج
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={b.status as BookingStatus} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      {b.status === "pending" && (
                        <>
                          <button
                            onClick={() => updateStatus(b.id, "confirmed")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-green-100 text-green-700 hover:bg-green-200 transition-all whitespace-nowrap"
                          >
                            ✅ تأكيد
                          </button>
                          <button
                            onClick={() => updateStatus(b.id, "cancelled")}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-700 hover:bg-red-200 transition-all whitespace-nowrap"
                          >
                            ❌ إلغاء
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setSelected(b)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-sky-100 text-sky-700 hover:bg-sky-200 transition-all"
                      >
                        👁 عرض
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Count */}
        {!loading && filtered.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 text-right">
            عرض {filtered.length} من {bookings.length} حجز
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <BookingDetailModal
          booking={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
        />
      )}
    </div>
  );
}
