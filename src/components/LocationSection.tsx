"use client";

import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const PinIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);
const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67V7z"/>
  </svg>
);
const WaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);
const ExternalIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z"/>
  </svg>
);

export function LocationSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();
  const infoRef = useScrollReveal();
  const mapRef = useScrollReveal();

  return (
    <section id="location" className="py-24 sky-section overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-12">
          <span className="section-tag">{tr(t.location.tag, lang)}</span>
          <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">
            {tr(t.location.title, lang)}
          </h2>
          <div className="sep" />
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            {tr(t.location.sub, lang)}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Info Card */}
          <div ref={infoRef} className="reveal-right lg:col-span-1">
            <div className="glass-card rounded-3xl p-8 space-y-5">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#4FC3F7,#0288D1)" }}>
                  <PinIcon />
                </div>
                <div>
                  <div className="font-black text-gray-800 dark:text-white mb-1 text-sm">
                    {tr(t.location.addrLabel, lang)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {tr(t.location.addrVal, lang)}
                  </div>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#4FC3F7,#0288D1)" }}>
                  <ClockIcon />
                </div>
                <div>
                  <div className="font-black text-gray-800 dark:text-white mb-1 text-sm">
                    {tr(t.location.timeLabel, lang)}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400 text-sm">
                    {tr(t.location.timeVal, lang)}
                  </div>
                </div>
              </div>

              {/* WhatsApp */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}>
                  <WaIcon />
                </div>
                <div>
                  <div className="font-black text-gray-800 dark:text-white mb-1 text-sm">
                    {tr(t.location.contactLabel, lang)}
                  </div>
                  <a href="https://wa.me/201201543050" target="_blank" rel="noopener noreferrer"
                    className="text-green-500 text-sm font-semibold block hover:text-green-600 transition-colors">
                    01201543050
                  </a>
                  <a href="https://wa.me/201060742957" target="_blank" rel="noopener noreferrer"
                    className="text-green-500 text-sm font-semibold block hover:text-green-600 transition-colors">
                    01060742957
                  </a>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=قرية+غزالة+الوادي+الكيلو+142+الساحل+الشمالي"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3 text-sm"
              >
                <ExternalIcon />
                {tr(t.location.openMap, lang)}
              </a>
            </div>
          </div>

          {/* Map */}
          <div ref={mapRef} className="reveal-left lg:col-span-2">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ height: 400 }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3420.1587!2d28.8476!3d30.9517!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMzDCsDU3JzA2LjEiTiAyOMKwNTAnNTEuNCJF!5e0!3m2!1sar!2seg!4v1"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ghazala Valley Location"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
