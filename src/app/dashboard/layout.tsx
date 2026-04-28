"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const links = [
    { href: "/dashboard/bookings", label: "📅 الحجوزات",     },
    { href: "/dashboard/chalets",  label: "🏖️ الشاليهات",   },
    { href: "/dashboard/reports",  label: "📊 التقارير",     },
  ];

  async function handleLogout() {
    setLoggingOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen" dir="rtl">
      <aside className="w-64 bg-gray-900 flex flex-col p-5 text-white">
        {/* Brand */}
        <div className="mb-8">
          <h2 className="text-lg font-black text-white">🏖️ Moodstay</h2>
          <p className="text-xs text-gray-500 mt-0.5">لوحة التحكم</p>
        </div>

        {/* Nav links */}
        <ul className="space-y-2 flex-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  pathname === link.href
                    ? "bg-sky-600 text-white shadow"
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Logout */}
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="mt-6 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-400 hover:bg-red-900/40 hover:text-red-400 transition-all disabled:opacity-50"
        >
          {loggingOut ? (
            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".3" strokeWidth="4"/>
              <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>
          ) : "🚪"}
          {loggingOut ? "جارٍ الخروج..." : "تسجيل خروج"}
        </button>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}