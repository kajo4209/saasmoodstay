"use client";

import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const stats = [
  { value: "+50", key: "chalets" as const },
  { value: "+200", key: "bookings" as const },
  { value: "4.9★", key: "rating" as const },
  { value: "24/7", key: "support" as const },
];

export function StatsBar() {
  const { lang } = useLang();
  const ref = useScrollReveal();

  return (
    <section className="py-8 sky-section border-b border-sky-100 dark:border-gray-800">
      <div ref={ref} className="reveal max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <div key={i} style={{ transitionDelay: `${i * 0.1}s` }}>
              <div className="text-3xl font-black gradient-text mb-1">{s.value}</div>
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                {tr(t.stats[s.key], lang)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
