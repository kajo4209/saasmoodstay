"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const links = [
  { href: "/dashboard",          label: "الرئيسية",       icon: "🏠" },
  { href: "/dashboard/chalets",  label: "إدارة الشاليهات", icon: "🏖️" },
  { href: "/dashboard/bookings", label: "إدارة الحجوزات",  icon: "🗓️" },
  { href: "/dashboard/coupons",  label: "الكوبونات",       icon: "🎟️" },
  { href: "/dashboard/reports",  label: "التقارير",        icon: "📊" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const Sidebar = ({ mobile = false }) => (
    <aside
      className={`
        flex flex-col bg-gray-900 text-white
        ${mobile
          ? "fixed inset-y-0 right-0 z-50 w-72 shadow-2xl transform transition-transform duration-300 " + (sidebarOpen ? "translate-x-0" : "translate-x-full")
          : "hidden lg:flex w-64 min-h-screen sticky top-0 h-screen"
        }
      `}
      dir="rtl"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-gray-800">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4FC3F7,#0288D1)" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C10 4 8 6 9 9H15C16 6 14 4 12 2Z" fill="white" opacity="0.9"/>
            <path d="M12 9L11 19H13L12 9Z" fill="white"/>
            <path d="M9 9C7 7 4 8 3 10C5 10 7 9 9 9Z" fill="white" opacity="0.8"/>
            <path d="M15 9C17 7 20 8 21 10C19 10 17 9 15 9Z" fill="white" opacity="0.8"/>
            <path d="M3 21C5 19 7 20 9 21C11 19 13 20 15 21C17 19 19 20 21 21" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
          </svg>
        </div>
        <div>
          <div className="font-black text-white text-lg leading-none">Moodstay</div>
          <div className="text-gray-400 text-xs mt-0.5">لوحة التحكم</div>
        </div>
        {mobile && (
          <button onClick={() => setSidebarOpen(false)} className="mr-auto w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400">✕</button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {links.map(link => {
          const active = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                active
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-900/40"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <span className="text-lg">{link.icon}</span>
              {link.label}
              {active && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-white" />}
            </Link>
          );
        })}
      </nav>

      {/* Back to site */}
      <div className="px-4 py-4 border-t border-gray-800">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition-all font-semibold"
        >
          <span>🌐</span> العودة للموقع
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-arabic" dir="rtl">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
      <Sidebar mobile />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#4FC3F7,#0288D1)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C10 4 8 6 9 9H15C16 6 14 4 12 2Z" fill="white"/>
                <path d="M12 9L11 19H13L12 9Z" fill="white"/>
                <path d="M3 21C5 19 7 20 9 21C11 19 13 20 15 21C17 19 19 20 21 21" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
              </svg>
            </div>
            <span className="font-black text-gray-800 dark:text-white">Moodstay Dashboard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 12h18M3 6h18M3 18h18"/>
            </svg>
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
