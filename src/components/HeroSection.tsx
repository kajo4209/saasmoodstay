"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";

const WhatsAppIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const ChevronDown = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
  </svg>
);

const MapPinIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

export function HeroSection() {
  const { lang } = useLang();

  const buildHeadline = () => {
    if (lang === "ar") {
      return (
        <>
          احجز{" "}
          <span className="text-sky-300">شاليه أحلامك</span>
          <br />
          في الساحل الشمالي
        </>
      );
    }
    return (
      <>
        Book Your{" "}
        <span className="text-sky-300">Dream Chalet</span>
        <br />
        on the North Coast
      </>
    );
  };

  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden"
      style={{ minHeight: "100svh" }}
    >
      {/* Background */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070"
          alt="North Coast Egypt Chalet"
          fill
          priority
          className="object-cover"
          style={{ filter: "brightness(0.85)" }}
        />
        <div className="absolute inset-0 hero-overlay" />

        {/* Floating particles */}
        {[
          { top: "20%", left: "10%", size: 8, delay: "0s", color: "rgba(179,229,252,0.35)" },
          { top: "60%", left: "80%", size: 12, delay: "1s", color: "rgba(255,255,255,0.2)" },
          { top: "40%", left: "20%", size: 6, delay: "2s", color: "rgba(129,212,250,0.28)" },
          { top: "75%", left: "40%", size: 10, delay: "0.5s", color: "rgba(244,196,48,0.2)" },
        ].map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full animate-float pointer-events-none"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              background: p.color,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl mx-auto px-6 py-24">
        {/* Tag */}
        <div className="animate-fade-up inline-flex items-center gap-2 mb-6 glass rounded-full px-5 py-2.5">
          <MapPinIcon />
          <span className="text-sky-100 font-semibold text-sm">
            {tr(t.hero.tag, lang)}
          </span>
        </div>

        {/* Headline */}
        <h1
          className="animate-fade-up-delay-1 font-black text-white mb-4 leading-tight"
          style={{
            fontSize: "clamp(2rem,6vw,4rem)",
            textShadow: "0 4px 30px rgba(0,0,0,0.3)",
          }}
        >
          {buildHeadline()}
        </h1>

        {/* Sub */}
        <p
          className="animate-fade-up-delay-2 text-sky-100 text-lg md:text-xl max-w-2xl mx-auto mb-8 leading-relaxed"
          style={{ textShadow: "0 2px 15px rgba(0,0,0,0.25)" }}
        >
          {tr(t.hero.sub, lang)}
        </p>

        {/* CTAs */}
        <div className="animate-fade-up-delay-3 flex flex-wrap gap-4 justify-center mb-10">
          <a
            href="#chalets"
            className="btn-primary text-base md:text-lg px-8 py-4 flex items-center gap-2"
          >
            <CalendarIcon />
            {tr(t.hero.ctaBook, lang)}
          </a>
          <a
            href="#chalets"
            className="btn-outline-white text-base md:text-lg px-8 py-4 flex items-center gap-2"
          >
            <EyeIcon />
            {tr(t.hero.ctaExplore, lang)}
          </a>
        </div>

        {/* Trust Badges */}
        <div className="animate-fade-up-delay-4 flex flex-wrap gap-3 justify-center">
          <div className="trust-badge">
            <span className="text-sky-300"><ShieldIcon /></span>
            {tr(t.hero.trust1, lang)}
          </div>
          <div className="trust-badge">
            <span className="text-sky-300"><LockIcon /></span>
            {tr(t.hero.trust2, lang)}
          </div>
          <div className="trust-badge">
            <span className="text-green-300"><WhatsAppIcon /></span>
            {tr(t.hero.trust3, lang)}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 animate-bounce">
        <span className="text-xs font-medium">{tr(t.hero.scroll, lang)}</span>
        <ChevronDown />
      </div>
    </section>
  );
}
