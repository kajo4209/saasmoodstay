"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/chalets", label: "إدارة الشاليهات" },
    { href: "/dashboard/bookings", label: "إدارة الحجوزات" },
    { href: "/dashboard/reports", label: "التقارير" },
  ];

  return (
    <div className="flex min-h-screen" dir="rtl">
      <aside className="w-64 bg-gray-900 p-5 text-white">
        <h2 className="mb-6 text-xl font-bold">Dashboard</h2>

        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block rounded-lg px-3 py-2 transition ${
                  pathname === link.href ? "bg-sky-600" : "hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
