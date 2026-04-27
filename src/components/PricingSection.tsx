"use client";

import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const WeekendIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#0288D1">
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </svg>
);
const SunIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
    <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z"/>
  </svg>
);
const SaleIcon = () => (
  <svg width="30" height="30" viewBox="0 0 24 24" fill="#C4A882">
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
  </svg>
);

export function PricingSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();
  const r1 = useScrollReveal();
  const r2 = useScrollReveal();
  const r3 = useScrollReveal();

  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-16">
          <span className="section-tag">{tr(t.pricing.tag, lang)}</span>
          <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">
            {tr(t.pricing.title, lang)}
          </h2>
          <div className="sep" />
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {tr(t.pricing.sub, lang)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Weekend */}
          <div ref={r1} className="reveal glass-card rounded-2xl p-7 text-center" style={{ transitionDelay: "0.1s" }}>
            <div className="w-16 h-16 rounded-2xl mb-6 mx-auto flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#E1F5FE,#B3E5FC)" }}>
              <WeekendIcon />
            </div>
            <h3 className="font-black text-xl text-gray-800 dark:text-white mb-3">
              {tr(t.pricing.p1t, lang)}
            </h3>
            <div className="text-4xl font-black gradient-text mb-3">{tr(t.pricing.p1v, lang)}</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {tr(t.pricing.p1d, lang)}
            </p>
          </div>

          {/* Seasonal - featured */}
          <div
            ref={r2}
            className="reveal relative rounded-2xl p-7 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg,#0288D1,#01579B)",
              transitionDelay: "0.2s",
            }}
          >
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-white opacity-10 pointer-events-none" />
            <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-white opacity-10 pointer-events-none" />

            {/* Badge */}
            <div className="absolute -top-px left-1/2 -translate-x-1/2">
              <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-4 py-1 rounded-full">
                {tr(t.pricing.bestVal, lang)}
              </span>
            </div>

            <div className="relative pt-6">
              <div className="w-16 h-16 rounded-2xl mb-6 mx-auto flex items-center justify-center bg-white/20">
                <SunIcon />
              </div>
              <h3 className="font-black text-xl text-white mb-3">{tr(t.pricing.p2t, lang)}</h3>
              <div className="text-3xl font-black text-white mb-3">{tr(t.pricing.p2v, lang)}</div>
              <p className="text-blue-200 text-sm leading-relaxed">{tr(t.pricing.p2d, lang)}</p>
            </div>
          </div>

          {/* Long Stay */}
          <div ref={r3} className="reveal glass-card rounded-2xl p-7 text-center" style={{ transitionDelay: "0.3s" }}>
            <div className="w-16 h-16 rounded-2xl mb-6 mx-auto flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#F9F3EC,#E8D8C3)" }}>
              <SaleIcon />
            </div>
            <h3 className="font-black text-xl text-gray-800 dark:text-white mb-3">
              {tr(t.pricing.p3t, lang)}
            </h3>
            <div className="text-4xl font-black gradient-text-gold mb-3">{tr(t.pricing.p3v, lang)}</div>
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              {tr(t.pricing.p3d, lang)}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
