import Link from "next/link";

const cards = [
  {
    href: "/dashboard/chalets",
    title: "إدارة الشاليهات",
    description: "إضافة، تعديل، وحذف الشاليهات",
  },
  {
    href: "/dashboard/bookings",
    title: "إدارة الحجوزات",
    description: "متابعة الحجوزات وتغيير الحالة",
  },
  {
    href: "/dashboard/reports",
    title: "التقارير",
    description: "عرض الإحصائيات والبيانات",
  },
];

export default function DashboardPage() {
  return (
    <div dir="rtl">
      <h1 className="mb-4 text-2xl font-bold">لوحة التحكم</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-xl bg-white p-5 shadow transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-gray-600">{card.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
