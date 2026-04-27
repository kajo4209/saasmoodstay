"use client";

import { useEffect, useState } from "react";

type Booking = {
  id: number;
  name: string;
  phone: string;
  chalet: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled";
  total: number;
  payment: "cash" | "online";
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<"all" | Booking["status"]>("all");

  // 📥 تحميل البيانات
  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      const res = await fetch("/api/bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch {
      setBookings([]);
    }
  }

  // 🔍 فلترة
  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.name.includes(search) ||
      b.phone.includes(search) ||
      String(b.id).includes(search);

    const matchStatus = status === "all" || b.status === status;

    return matchSearch && matchStatus;
  });

  // 📊 Stats
  const total = bookings.length;
  const pending = bookings.filter((b) => b.status === "pending").length;
  const cancelled = bookings.filter((b) => b.status === "cancelled").length;
  const revenue = bookings
    .filter((b) => b.status === "confirmed")
    .reduce((sum, b) => sum + b.total, 0);

  return (
    <div className="p-6 space-y-6">

      {/* 🔷 Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat title="إجمالي الحجوزات" value={total} />
        <Stat title="قيد الانتظار" value={pending} />
        <Stat title="الملغاة" value={cancelled} />
        <Stat title="الأرباح" value={revenue + " EGP"} />
      </div>

      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          placeholder="بحث بالاسم / الموبايل / رقم الحجز"
          className="border p-2 rounded w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border p-2 rounded"
          value={status}
          onChange={(e) => setStatus(e.target.value as "all" | Booking["status"])}
        >
          <option value="all">كل الحالات</option>
          <option value="pending">قيد الانتظار</option>
          <option value="confirmed">مؤكد</option>
          <option value="cancelled">ملغي</option>
        </select>
      </div>

      {/* 📋 Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">الاسم</th>
              <th className="p-3">الموبايل</th>
              <th className="p-3">الشاليه</th>
              <th className="p-3">التاريخ</th>
              <th className="p-3">الحالة</th>
              <th className="p-3">الدفع</th>
              <th className="p-3">المبلغ</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t">
                <td className="p-3">{b.id}</td>

                <td className="p-3 font-semibold cursor-pointer text-sky-600">
                  {b.name}
                </td>

                <td className="p-3">{b.phone}</td>
                <td className="p-3">{b.chalet}</td>
                <td className="p-3">{b.date}</td>

                <td className="p-3">
                  <Status status={b.status} />
                </td>

                <td className="p-3">{b.payment}</td>
                <td className="p-3">{b.total} EGP</td>

                {/* ⚡ Actions */}
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => updateStatus(b.id, "confirmed")}
                    className="text-green-600"
                  >
                    تأكيد
                  </button>

                  <button
                    onClick={() => updateStatus(b.id, "cancelled")}
                    className="text-red-600"
                  >
                    إلغاء
                  </button>

                  <button className="text-blue-600">
                    عرض
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  // 🔄 تغيير الحالة
  async function updateStatus(id: number, newStatus: string) {
    await fetch(`/api/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({ status: newStatus }),
    });

    loadBookings();
  }
}

/* 🔹 Components */

function Stat({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded-xl shadow text-center">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  );
}

function Status({ status }: { status: Booking["status"] }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700",
    confirmed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  } as const;

  return (
    <span className={`px-2 py-1 rounded text-xs ${styles[status]}`}>
      {status}
    </span>
  );
}
