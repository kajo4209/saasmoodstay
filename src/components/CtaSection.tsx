"use client";

import Image from "next/image";
import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const HomeIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
  </svg>
);
const WaIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

export function CtaSection() {
  const { lang } = useLang();
  const ref = useScrollReveal();

  const buildHeadline = () => {
    if (lang === "ar") {
      return (
        <>
          جاهز لعطلتك<br />
          <span className="text-sky-300">القادمة؟</span>
        </>
      );
    }
    return (
      <>
        Ready for Your<br />
        <span className="text-sky-300">Next Vacation?</span>
      </>
    );
  };

  return (
    <section id="contact" className="py-28 relative overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070"
          alt="CTA background"
          fill
          className="object-cover"
          style={{ filter: "brightness(0.6)" }}
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg,rgba(2,136,209,0.85),rgba(13,71,161,0.75))" }}
        />
      </div>

      <div className="relative z-10 text-center max-w-3xl mx-auto px-6">
        <div ref={ref} className="reveal">
          <span className="inline-block bg-white/20 text-white border border-white/30 text-sm font-bold px-5 py-2 rounded-full mb-6">
            {tr(t.cta.tag, lang)}
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            {buildHeadline()}
          </h2>

          <p className="text-sky-200 text-lg mb-10 leading-relaxed">
            {tr(t.cta.sub, lang)}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#chalets"
              className="btn-primary text-lg px-10 py-4 flex items-center gap-2"
            >
              <HomeIcon />
              {tr(t.cta.btn1, lang)}
            </a>
            <a
              href="https://wa.me/201201543050"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-lg px-10 py-4 rounded-full font-bold text-white transition-transform hover:scale-105"
              style={{
                background: "linear-gradient(135deg,#25D366,#128C7E)",
                boxShadow: "0 8px 25px rgba(37,211,102,0.4)",
              }}
            >
              <WaIcon />
              {tr(t.cta.btn2, lang)}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
