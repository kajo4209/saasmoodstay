"use client";

import { useEffect, useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────────────
type MonthlyPoint = { month: string; revenue: number; bookings: number; nights: number };
type DayPoint     = { day: string; bookings: number };
type ChaletMonthly = { month: string; revenue: number };

type ChaletStat = {
  id: number; name: string; type: string; rooms: number; pricePerNight: number;
  totalBookings: number; confirmedCount: number; pendingCount: number; cancelledCount: number;
  revenue: number; deposits: number; avgNights: number; avgPrice: number;
  occupancyRate: number; occupiedDays: number; revenueShare: number;
  monthlyData: ChaletMonthly[];
  recentBookings: {
    id: number; guestName: string; phone: string; checkIn: string; checkOut: string;
    nights: number; totalPrice: number; deposit: number; status: string; createdAt: string;
  }[];
};

type ReportData = {
  totalBookings: number; totalRevenue: number; totalDeposits: number; totalNights: number;
  avgNights: number; avgRevPerBooking: number; conversionRate: number; cancellationRate: number;
  totalChalets: number;
  statusBreakdown: { confirmed: number; pending: number; cancelled: number };
  bestByRevenue: string; bestByOccupancy: string; bestByBookings: string;
  monthlyRevenue: MonthlyPoint[];
  bookingsByDay: DayPoint[];
  chaletStats: ChaletStat[];
  topGuests: { name: string; phone: string; bookings: number; revenue: number }[];
};

// ── Helpers ────────────────────────────────────────────────────────────────────
const EGP = (n: number) => n.toLocaleString("ar-EG") + " ج";
const shortMonth = (key: string) => {
  const months = ["يناير","فبراير","مارس","إبريل","مايو","يونيو","يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];
  const [, m] = key.split("-");
  return months[parseInt(m) - 1] ?? key;
};

const statusLabel = (s: string) =>
  s === "confirmed" ? "مؤكد" : s === "pending" ? "انتظار" : "ملغي";
const statusColor = (s: string) =>
  s === "confirmed" ? "bg-emerald-100 text-emerald-700"
  : s === "pending" ? "bg-amber-100 text-amber-700"
  : "bg-red-100 text-red-700";

// ── Mini bar chart (pure SVG) ──────────────────────────────────────────────────
function BarChart({ data, color = "#0ea5e9", valueKey = "revenue", labelKey = "month" }:
  { data: Record<string, unknown>[]; color?: string; valueKey?: string; labelKey?: string }) {
  const vals = data.map(d => Number(d[valueKey]) || 0);
  const max  = Math.max(...vals, 1);
  const W = 480, H = 120, barW = Math.floor((W - 8) / data.length) - 4;

  return (
    <svg viewBox={`0 0 ${W} ${H + 24}`} className="w-full" style={{ overflow: "visible" }}>
      {data.map((d, i) => {
        const val  = Number(d[valueKey]) || 0;
        const barH = Math.max(4, (val / max) * H);
        const x    = 4 + i * (barW + 4);
        const y    = H - barH;
        return (
          <g key={i}>
            <rect x={x} y={y} width={barW} height={barH} rx={3} fill={color} opacity={0.85}/>
            {val > 0 && (
              <text x={x + barW / 2} y={y - 4} textAnchor="middle" fontSize={9} fill="#64748b">
                {val > 999 ? `${Math.round(val / 1000)}k` : val}
              </text>
            )}
            <text x={x + barW / 2} y={H + 16} textAnchor="middle" fontSize={9} fill="#94a3b8">
              {shortMonth(String(d[labelKey]))}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Tiny sparkline ─────────────────────────────────────────────────────────────
function Sparkline({ data, color = "#0ea5e9" }: { data: number[]; color?: string }) {
  if (!data.length) return null;
  const max = Math.max(...data, 1);
  const W = 80, H = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * W},${H - (v / max) * H}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round"/>
    </svg>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────────
function StatCard({ label, value, sub, icon, color = "sky", spark }:
  { label: string; value: string; sub?: string; icon: string; color?: string; spark?: number[] }) {
  const colors: Record<string, string> = {
    sky:    "bg-sky-50 text-sky-600",
    emerald:"bg-emerald-50 text-emerald-600",
    amber:  "bg-amber-50 text-amber-600",
    violet: "bg-violet-50 text-violet-600",
    rose:   "bg-rose-50 text-rose-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  const sparkColors: Record<string, string> = {
    sky:"#0ea5e9", emerald:"#10b981", amber:"#f59e0b", violet:"#8b5cf6", rose:"#f43f5e", indigo:"#6366f1"
  };
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${colors[color] ?? colors.sky}`}>
          {icon}
        </div>
        {spark && <Sparkline data={spark} color={sparkColors[color] ?? "#0ea5e9"}/>}
      </div>
      <p className="text-2xl font-black text-gray-800 mt-1">{value}</p>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      {sub && <p className="text-xs text-gray-400">{sub}</p>}
    </div>
  );
}

// ── Occupancy ring ─────────────────────────────────────────────────────────────
function OccupancyRing({ pct, color }: { pct: number; color: string }) {
  const r = 22, circ = 2 * Math.PI * r;
  return (
    <svg width={56} height={56} viewBox="0 0 56 56">
      <circle cx={28} cy={28} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5}/>
      <circle cx={28} cy={28} r={r} fill="none" stroke={color} strokeWidth={5}
        strokeDasharray={`${(pct / 100) * circ} ${circ}`}
        strokeLinecap="round" transform="rotate(-90 28 28)"/>
      <text x={28} y={33} textAnchor="middle" fontSize={11} fontWeight="700" fill={color}>{pct}%</text>
    </svg>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [data,     setData]     = useState<ReportData | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [tab,      setTab]      = useState<"overview" | "chalets" | "guests">("overview");
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/reports", { cache: "no-store" })
      .then(r => r.json())
      .then(j => { setData(j); setLoading(false); })
      .catch(() => { setError("تعذر تحميل البيانات"); setLoading(false); });
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 gap-3">
      <svg className="animate-spin w-6 h-6" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="#cbd5e1" strokeWidth="4"/>
        <path d="M4 12a8 8 0 018-8" stroke="#0ea5e9" strokeWidth="4" strokeLinecap="round"/>
      </svg>
      جارٍ تحميل التقارير...
    </div>
  );

  if (error || !data) return (
    <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">{error || "خطأ"}</div>
  );

  const chalet = selected !== null ? data.chaletStats.find(c => c.id === selected) : null;
  const palettes = ["#0ea5e9","#10b981","#f59e0b","#8b5cf6","#f43f5e","#06b6d4","#84cc16","#ec4899","#f97316","#a855f7"];

  return (
    <div dir="rtl" className="space-y-6 pb-12">

      {/* ── Header + Tabs ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-800">📊 التقارير والتحليلات</h1>
          <p className="text-sm text-gray-500 mt-0.5">بيانات حية من قاعدة البيانات</p>
        </div>
        <div className="flex gap-2 bg-white rounded-xl border border-gray-200 p-1 shadow-sm">
          {([["overview","نظرة عامة"],["chalets","الشاليهات"],["guests","الضيوف"]] as const).map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tab === key ? "bg-sky-600 text-white shadow" : "text-gray-500 hover:bg-gray-50"}`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ════════════════ OVERVIEW TAB ════════════════ */}
      {tab === "overview" && (<>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="💰" label="إجمالي الإيرادات" value={EGP(data.totalRevenue)} sub={`إيداعات: ${EGP(data.totalDeposits)}`} color="emerald"
            spark={data.monthlyRevenue.map(m => m.revenue)}/>
          <StatCard icon="📅" label="إجمالي الحجوزات" value={String(data.totalBookings)} sub={`مؤكد: ${data.statusBreakdown.confirmed} | انتظار: ${data.statusBreakdown.pending}`} color="sky"
            spark={data.monthlyRevenue.map(m => m.bookings)}/>
          <StatCard icon="🌙" label="إجمالي الليالي" value={String(data.totalNights)} sub={`متوسط إقامة: ${data.avgNights} ليلة`} color="violet"
            spark={data.monthlyRevenue.map(m => m.nights)}/>
          <StatCard icon="💳" label="متوسط قيمة الحجز" value={EGP(data.avgRevPerBooking)} sub={`تحويل: ${data.conversionRate}% | إلغاء: ${data.cancellationRate}%`} color="amber"/>
        </div>

        {/* Best chalets badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon:"🏆", label:"الأعلى إيراداً",  value: data.bestByRevenue,   color:"amber" },
            { icon:"🔥", label:"الأكثر إشغالاً",  value: data.bestByOccupancy, color:"rose"  },
            { icon:"⭐", label:"الأكثر حجوزاً",   value: data.bestByBookings,  color:"sky"   },
          ].map(b => (
            <div key={b.label} className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4 flex items-center gap-3">
              <span className="text-2xl">{b.icon}</span>
              <div>
                <p className="text-xs text-gray-400">{b.label}</p>
                <p className="font-black text-gray-800 text-sm">{b.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Monthly revenue chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-700 mb-4">📈 الإيرادات الشهرية (آخر 12 شهر)</h2>
          <BarChart data={data.monthlyRevenue} valueKey="revenue" labelKey="month" color="#0ea5e9"/>
        </div>

        {/* Bookings by month + day side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-700 mb-4">📅 الحجوزات الشهرية</h2>
            <BarChart data={data.monthlyRevenue} valueKey="bookings" labelKey="month" color="#10b981"/>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-700 mb-4">📆 أكثر أيام الأسبوع حجزاً</h2>
            <BarChart data={data.bookingsByDay} valueKey="bookings" labelKey="day" color="#f59e0b"/>
          </div>
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-700 mb-4">توزيع حالات الحجوزات</h2>
          <div className="flex flex-wrap gap-4">
            {[
              { label:"مؤكدة",   val: data.statusBreakdown.confirmed, color:"#10b981" },
              { label:"انتظار",  val: data.statusBreakdown.pending,   color:"#f59e0b" },
              { label:"ملغاة",   val: data.statusBreakdown.cancelled, color:"#f43f5e" },
            ].map(s => {
              const pct = data.totalBookings ? Math.round((s.val / data.totalBookings) * 100) : 0;
              return (
                <div key={s.label} className="flex items-center gap-3 flex-1 min-w-40">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: s.color }}/>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600 font-medium">{s.label}</span>
                      <span className="font-bold" style={{ color: s.color }}>{s.val} ({pct}%)</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full">
                      <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: s.color }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </>)}

      {/* ════════════════ CHALETS TAB ════════════════ */}
      {tab === "chalets" && (<>

        {/* Chalet selector */}
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setSelected(null)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selected === null ? "bg-sky-600 text-white border-sky-600" : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"}`}>
            المقارنة الشاملة
          </button>
          {data.chaletStats.map((c, i) => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${selected === c.id ? "text-white border-transparent" : "bg-white text-gray-600 border-gray-200 hover:border-sky-300"}`}
              style={selected === c.id ? { background: palettes[i % palettes.length] } : {}}>
              {c.name}
            </button>
          ))}
        </div>

        {/* ── All chalets comparison ── */}
        {selected === null && (<>
          {/* Revenue share bars */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h2 className="font-bold text-gray-700 mb-5">🏅 مقارنة الإيرادات والإشغال</h2>
            <div className="space-y-4">
              {data.chaletStats.map((c, i) => (
                <div key={c.id}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="font-semibold text-gray-700 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: palettes[i % palettes.length] }}/>
                      {c.name}
                    </span>
                    <span className="text-gray-500">{EGP(c.revenue)} · {c.revenueShare}% من الإجمالي</span>
                  </div>
                  <div className="h-2.5 bg-gray-100 rounded-full">
                    <div className="h-2.5 rounded-full" style={{ width: `${c.revenueShare}%`, background: palettes[i % palettes.length] }}/>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-700">📋 جدول مقارنة تفصيلي</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-center">
                <thead className="bg-gray-50 text-gray-500 text-xs">
                  <tr>
                    {["الشاليه","السعر/ليلة","إجمالي حجوزات","مؤكد","انتظار","ملغي","الإيرادات","متوسط الحجز","متوسط إقامة","نسبة الإشغال","الإيداعات"].map(h => (
                      <th key={h} className="px-3 py-3 font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.chaletStats.map((c, i) => (
                    <tr key={c.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 font-bold text-gray-800 text-right whitespace-nowrap">
                        <span className="w-2 h-2 rounded-full inline-block ml-2" style={{ background: palettes[i % palettes.length] }}/>
                        {c.name}
                      </td>
                      <td className="px-3 py-3 text-gray-600">{EGP(c.pricePerNight)}</td>
                      <td className="px-3 py-3 font-bold text-gray-800">{c.totalBookings}</td>
                      <td className="px-3 py-3 text-emerald-600 font-semibold">{c.confirmedCount}</td>
                      <td className="px-3 py-3 text-amber-600 font-semibold">{c.pendingCount}</td>
                      <td className="px-3 py-3 text-red-500 font-semibold">{c.cancelledCount}</td>
                      <td className="px-3 py-3 font-black text-sky-700">{EGP(c.revenue)}</td>
                      <td className="px-3 py-3 text-gray-600">{EGP(c.avgPrice)}</td>
                      <td className="px-3 py-3 text-gray-600">{c.avgNights} ليلة</td>
                      <td className="px-3 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-12 h-1.5 bg-gray-100 rounded-full">
                            <div className="h-1.5 rounded-full" style={{ width: `${c.occupancyRate}%`, background: palettes[i % palettes.length] }}/>
                          </div>
                          <span className="text-xs font-bold" style={{ color: palettes[i % palettes.length] }}>{c.occupancyRate}%</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-500">{EGP(c.deposits)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Occupancy rings */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {data.chaletStats.map((c, i) => (
              <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2 cursor-pointer hover:shadow-md transition-all"
                onClick={() => setSelected(c.id)}>
                <OccupancyRing pct={c.occupancyRate} color={palettes[i % palettes.length]}/>
                <p className="text-xs font-bold text-gray-700 text-center">{c.name}</p>
                <p className="text-xs text-gray-400">{c.occupiedDays} يوم محجوز</p>
              </div>
            ))}
          </div>
        </>)}

        {/* ── Single chalet detail ── */}
        {chalet && (() => {
          const idx = data.chaletStats.findIndex(c => c.id === chalet.id);
          const color = palettes[idx % palettes.length];
          return (
            <div className="space-y-5">
              {/* Header */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-wrap items-center gap-5">
                <OccupancyRing pct={chalet.occupancyRate} color={color}/>
                <div>
                  <h2 className="text-xl font-black text-gray-800">{chalet.name}</h2>
                  <p className="text-gray-400 text-sm">{chalet.type === "family" ? "شاليه عائلي" : "شاليه"} · {chalet.rooms} غرف · {EGP(chalet.pricePerNight)}/ليلة</p>
                </div>
                <div className="flex gap-3 flex-wrap mr-auto">
                  {[
                    {l:"الإيرادات",       v: EGP(chalet.revenue)},
                    {l:"مؤكد",            v: String(chalet.confirmedCount)},
                    {l:"نسبة الإشغال",    v: `${chalet.occupancyRate}%`},
                    {l:"متوسط إقامة",     v: `${chalet.avgNights} ليلة`},
                  ].map(k => (
                    <div key={k.l} className="text-center px-4 py-2 rounded-xl" style={{ background: `${color}15` }}>
                      <p className="text-xs text-gray-500">{k.l}</p>
                      <p className="font-black text-gray-800 text-sm">{k.v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* KPI cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  {icon:"📅", l:"إجمالي حجوزات", v: String(chalet.totalBookings)},
                  {icon:"✅", l:"مؤكدة",          v: String(chalet.confirmedCount)},
                  {icon:"⏳", l:"انتظار",         v: String(chalet.pendingCount)},
                  {icon:"❌", l:"ملغاة",          v: String(chalet.cancelledCount)},
                  {icon:"💰", l:"إجمالي إيرادات", v: EGP(chalet.revenue)},
                  {icon:"💳", l:"إيداعات",        v: EGP(chalet.deposits)},
                  {icon:"🌙", l:"أيام محجوزة",    v: `${chalet.occupiedDays} يوم`},
                  {icon:"📊", l:"متوسط الحجز",    v: EGP(chalet.avgPrice)},
                ].map(k => (
                  <div key={k.l} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                    <p className="text-lg">{k.icon}</p>
                    <p className="font-black text-gray-800 mt-1">{k.v}</p>
                    <p className="text-xs text-gray-400">{k.l}</p>
                  </div>
                ))}
              </div>

              {/* Monthly chart */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-700 mb-4">📈 الإيرادات الشهرية (آخر 6 شهور)</h3>
                <BarChart data={chalet.monthlyData} valueKey="revenue" labelKey="month" color={color}/>
              </div>

              {/* Recent bookings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100">
                  <h3 className="font-bold text-gray-700">🧾 آخر الحجوزات</h3>
                </div>
                {chalet.recentBookings.length === 0 ? (
                  <p className="text-center text-gray-400 py-8">لا توجد حجوزات بعد</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 text-gray-500 text-xs">
                        <tr>
                          {["#","الضيف","رقم الهاتف","تسجيل الدخول","تسجيل الخروج","الليالي","الإجمالي","الإيداع","الحالة"].map(h => (
                            <th key={h} className="px-3 py-3 text-right font-semibold">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {chalet.recentBookings.map(b => (
                          <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50">
                            <td className="px-3 py-3 text-gray-400 text-xs">#{b.id}</td>
                            <td className="px-3 py-3 font-semibold text-gray-800">{b.guestName}</td>
                            <td className="px-3 py-3 text-gray-500 text-xs" dir="ltr">{b.phone}</td>
                            <td className="px-3 py-3 text-gray-600">{b.checkIn}</td>
                            <td className="px-3 py-3 text-gray-600">{b.checkOut}</td>
                            <td className="px-3 py-3 text-center font-bold text-gray-700">{b.nights}</td>
                            <td className="px-3 py-3 font-bold text-sky-700">{EGP(b.totalPrice)}</td>
                            <td className="px-3 py-3 text-gray-500">{EGP(b.deposit)}</td>
                            <td className="px-3 py-3">
                              <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusColor(b.status)}`}>
                                {statusLabel(b.status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          );
        })()}
      </>)}

      {/* ════════════════ GUESTS TAB ════════════════ */}
      {tab === "guests" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-bold text-gray-700">👤 أكثر الضيوف حجزاً</h2>
            <p className="text-xs text-gray-400 mt-0.5">من الحجوزات المؤكدة فقط</p>
          </div>
          {data.topGuests.length === 0 ? (
            <p className="text-center text-gray-400 py-12">لا توجد بيانات ضيوف بعد</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {data.topGuests.map((g, i) => (
                <div key={g.phone} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0`}
                    style={{ background: palettes[i % palettes.length] }}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-sm">{g.name}</p>
                    <p className="text-xs text-gray-400" dir="ltr">{g.phone}</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="font-black text-gray-800">{g.bookings}</p>
                    <p className="text-xs text-gray-400">حجوزات</p>
                  </div>
                  <div className="text-center px-3">
                    <p className="font-black text-sky-700">{EGP(g.revenue)}</p>
                    <p className="text-xs text-gray-400">إجمالي</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

    </div>
  );
}