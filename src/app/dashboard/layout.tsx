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
    { href: "/dashboard/reports", label: "التقارير" },
  ];

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-6">Dashboard</h2>

        <ul className="space-y-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`block px-3 py-2 rounded-lg transition ${
                  pathname === link.href
                    ? "bg-sky-600"
                    : "hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Content */}
      <main className="flex-1 p-6 bg-gray-100">
        {children}
      </main>
    </div>
  );
}