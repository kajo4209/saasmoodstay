"use client";

import { useEffect, useState } from "react";

type ReportsResponse = {
  totalBookings: number;
  revenue: number;
  totalChalets: number;
  topChalets: Array<{ chaletId: number; _count: { chaletId: number } }>;
};

export default function ReportsPage() {
  const [data, setData] = useState<ReportsResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      try {
        const res = await fetch("/api/reports", { cache: "no-store" });
        const json = await res.json();

        if (!res.ok) {
          throw new Error(json?.error || "Failed to load reports");
        }

        setData({
          totalBookings: Number(json?.totalBookings ?? 0),
          revenue: Number(json?.revenue ?? 0),
          totalChalets: Number(json?.totalChalets ?? 0),
          topChalets: Array.isArray(json?.topChalets) ? json.topChalets : [],
        });
      } catch (err) {
        console.error("Load reports error:", err);
        setData({
          totalBookings: 0,
          revenue: 0,
          totalChalets: 0,
          topChalets: [],
        });
        setError("تعذر تحميل التقارير الآن");
      }
    };

    load();
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">لوحة الإحصائيات</h1>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="text-lg font-semibold">عدد الحجوزات</h2>
          <p className="mt-2 text-2xl">{data.totalBookings}</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="text-lg font-semibold">الإيرادات</h2>
          <p className="mt-2 text-2xl">{data.revenue} جنيه</p>
        </div>

        <div className="rounded-xl bg-white p-5 shadow">
          <h2 className="text-lg font-semibold">الشاليهات الأكثر طلبًا</h2>

          <ul className="mt-2 space-y-2">
            {data.topChalets.map((c, i) => (
              <li key={i}>
                شاليه #{c.chaletId} - {c._count?.chaletId ?? 0} حجز
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
