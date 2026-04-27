"use client";

import { useEffect, useState } from "react";

export default function ReportsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/reports")
      .then((res) => res.json())
      .then(setData);
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">لوحة الإحصائيات</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* عدد الحجوزات */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">عدد الحجوزات</h2>
          <p className="text-2xl mt-2">{data.totalBookings}</p>
        </div>

        {/* الإيرادات */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">الإيرادات</h2>
          <p className="text-2xl mt-2">
            {data.revenue} جنيه
          </p>
        </div>

        {/* الأكثر طلبًا */}
        <div className="bg-white p-5 rounded-xl shadow">
          <h2 className="text-lg font-semibold">
            الشاليهات الأكثر طلبًا
          </h2>

          <ul className="mt-2 space-y-2">
            {data.topChalets.map((c: any, i: number) => (
              <li key={i}>
                شاليه #{c.chaletId} - {c._count} حجز
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}