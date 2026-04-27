"use client";

import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const reviews = [
  {
    initials: "م",
    nameAr: "محمد العيسى",
    nameEn: "Mohamed Al-Essa",
    cityAr: "القاهرة",
    cityEn: "Cairo",
    stars: 5,
    textAr: "تجربة رائعة جداً! الشاليه كان أفضل مما هو في الصور. الفريق كان سريع الاستجابة والحجز سهل جداً. بالتأكيد سأحجز مجدداً",
    textEn: "Amazing experience! The chalet was even better than the photos. The team was very responsive and booking was super easy. Definitely booking again",
    gradient: "linear-gradient(135deg,#4FC3F7,#0288D1)",
  },
  {
    initials: "ن",
    nameAr: "نوران أحمد",
    nameEn: "Nouran Ahmed",
    cityAr: "الإسكندرية",
    cityEn: "Alexandria",
    stars: 5,
    textAr: "Moodstay غيرت تجربتنا في الساحل كلياً. الإطلالة البحرية من الشاليه كانت خيالية والخدمة من البداية للنهاية ممتازة",
    textEn: "Moodstay completely changed our North Coast experience. The sea view was breathtaking and the service from start to finish was excellent",
    gradient: "linear-gradient(135deg,#E8D8C3,#C4A882)",
  },
  {
    initials: "ك",
    nameAr: "كريم سليمان",
    nameEn: "Karim Suleiman",
    cityAr: "الجيزة",
    cityEn: "Giza",
    stars: 5,
    textAr: "أفضل منصة حجز شاليهات جربتها. الأسعار منافسة جداً والشاليهات بتطابق الوصف. الدعم على واتساب فوري وممتاز",
    textEn: "Best chalet booking platform I've tried. Prices are very competitive and chalets truly match the description. WhatsApp support is instant",
    gradient: "linear-gradient(135deg,#4FC3F7,#25D366)",
  },
];

export function TestimonialsSection() {
  const { lang } = useLang();
  const titleRef = useScrollReveal();

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div ref={titleRef} className="reveal text-center mb-16">
          <span className="section-tag">{tr(t.testimonials.tag, lang)}</span>
          <h2 className="text-3xl md:text-4xl font-black dark:text-white mt-3 mb-4">
            {tr(t.testimonials.title, lang)}
          </h2>
          <div className="sep" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((r, i) => {
            const ref = useScrollReveal();
            return (
              <div
                key={i}
                ref={ref}
                className="testimonial-card reveal p-8"
                style={{ transitionDelay: `${0.1 + i * 0.15}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg flex-shrink-0"
                    style={{ background: r.gradient }}
                  >
                    {r.initials}
                  </div>
                  <div>
                    <div className="font-black text-gray-800 dark:text-white text-sm">
                      {lang === "ar" ? r.nameAr : r.nameEn}
                    </div>
                    <div className="text-xs text-gray-400">
                      {lang === "ar" ? r.cityAr : r.cityEn}
                    </div>
                  </div>
                  <div className="mr-auto text-yellow-400 text-sm">
                    {"★".repeat(r.stars)}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {lang === "ar" ? `"${r.textAr}"` : `"${r.textEn}"`}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
