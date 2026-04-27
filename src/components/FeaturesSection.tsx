"use client";

import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const LightningIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#0288D1">
    <path d="M7 2v11h3v9l7-12h-4l4-8z"/>
  </svg>
);
const ShieldIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#0288D1">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);
const WhatsAppIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#25D366">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const TagIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#0288D1">
    <path d="M21.41 11.58l-9-9C12.05 2.22 11.55 2 11 2H4c-1.1 0-2 .9-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58.55 0 1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41 0-.55-.23-1.06-.59-1.42zM5.5 7C4.67 7 4 6.33 4 5.5S4.67 4 5.5 4 7 4.67 7 5.5 6.33 7 5.5 7z"/>
  </svg>
);

const features = [
  { icon: <LightningIcon />, titleKey: "f1t" as const, descKey: "f1d" as const, delay: "0.1s" },
  { icon: <ShieldIcon />,   titleKey: "f2t" as const, descKey: "f2d" as const, delay: "0.2s" },
  { icon: <WhatsAppIcon />, titleKey: "f3t" as const, descKey: "f3d" as const, delay: "0.3s" },
  { icon: <TagIcon />,      titleKey: "f4t" as const, descKey: "f4d" as const, delay: "0.4s" },
];

export function FeaturesSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();

  return (
    <section id="features" className="py-24 sky-section overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-16">
          <span className="section-tag">{tr(t.features.tag, lang)}</span>
          <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">
            {tr(t.features.title, lang)}
          </h2>
          <div className="sep" />
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {tr(t.features.sub, lang)}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => {
            const ref = useScrollReveal();
            return (
              <div
                key={i}
                ref={ref}
                className="glass-card reveal rounded-3xl p-8 text-center"
                style={{ transitionDelay: f.delay }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 className="font-black text-gray-800 dark:text-white text-xl mb-3">
                  {tr(t.features[f.titleKey], lang)}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
                  {tr(t.features[f.descKey], lang)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
