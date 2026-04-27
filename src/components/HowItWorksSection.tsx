"use client";

import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const SearchIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#0288D1">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
  </svg>
);
const CalIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#0288D1">
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="#0288D1">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
  </svg>
);

const steps = [
  { icon: <SearchIcon />, titleKey: "h1t" as const, descKey: "h1d" as const, num: 1 },
  { icon: <CalIcon />,    titleKey: "h2t" as const, descKey: "h2d" as const, num: 2 },
  { icon: <CheckIcon />,  titleKey: "h3t" as const, descKey: "h3d" as const, num: 3 },
];

export function HowItWorksSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();

  return (
    <section id="how" className="py-24 sand-section overflow-hidden">
      <div className="max-w-5xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-16">
          <span className="section-tag">{tr(t.how.tag, lang)}</span>
          <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">
            {tr(t.how.title, lang)}
          </h2>
          <div className="sep" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connector */}
          <div
            className="hidden md:block absolute h-px mx-16 opacity-30"
            style={{
              background: "linear-gradient(to left,#4FC3F7,#0288D1)",
              top: "2.5rem",
              left: 0,
              right: 0,
            }}
          />

          {steps.map((step, i) => {
            const ref = useScrollReveal();
            return (
              <div
                key={i}
                ref={ref}
                className="reveal text-center relative z-10"
                style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="step-num">{step.num}</div>
                <div className="glass-card rounded-3xl p-6">
                  <div className="mb-3">{step.icon}</div>
                  <h3 className="font-black text-xl text-gray-800 dark:text-white mb-2">
                    {tr(t.how[step.titleKey], lang)}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                    {tr(t.how[step.descKey], lang)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
