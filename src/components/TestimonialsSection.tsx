"use client";

import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const reviews = [
  {
    initials: "ح",
    nameAr: "حسام محمود",
    nameEn: "Hossam Mahmoud",
    cityAr: "القاهرة",
    cityEn: "Cairo",
    stars: 5,
    textAr: "بصراحة تجربة ممتازة في قرية غزالة، الشاليه كان نضيف جداً ومجهز بشكل كويس والإطلالة حلوة. الحجز كان سريع والتعامل محترم جداً",
    textEn: "Honestly a great experience in Ghazala. The chalet was very clean and well prepared and the view was nice. Booking was smooth and the service was professional",
    gradient: "linear-gradient(135deg,#4FC3F7,#0288D1)",
  },
  {
    initials: "ر",
    nameAr: "ريم أحمد",
    nameEn: "Reem Ahmed",
    cityAr: "الإسكندرية",
    cityEn: "Alexandria",
    stars: 4,
    textAr: "المكان حلو وهادي في غزالة، مناسب للعائلات جداً. كان فيه تأخير بسيط في الاستلام بس اتحل بسرعة",
    textEn: "Nice and calm place in Ghazala, very suitable for families. There was a small delay in check-in but it was handled quickly",
    gradient: "linear-gradient(135deg,#E8D8C3,#C4A882)",
  },
  {
    initials: "م",
    nameAr: "محمد طارق",
    nameEn: "Mohamed Tarek",
    cityAr: "المنصورة",
    cityEn: "Mansoura",
    stars: 5,
    textAr: "من أحسن التجارب في الساحل، الشاليه مطابق للصور بالظبط والمكان نظيف جداً. أكيد هكررها تاني",
    textEn: "One of the best North Coast experiences. The chalet matches the photos exactly and it's very clean. Definitely doing it again",
    gradient: "linear-gradient(135deg,#4FC3F7,#25D366)",
  },
  {
    initials: "س",
    nameAr: "سارة خالد",
    nameEn: "Sara Khaled",
    cityAr: "الجيزة",
    cityEn: "Giza",
    stars: 4,
    textAr: "الشاليه في غزالة كان حلو جداً وقريب من البحر، بس كنت أتمنى المطبخ يكون مجهز أكتر شوية",
    textEn: "The chalet in Ghazala was really nice and close to the beach, but I wish the kitchen was a bit more equipped",
    gradient: "linear-gradient(135deg,#FFB74D,#F57C00)",
  },
  {
    initials: "أ",
    nameAr: "احمد عادل",
    nameEn: "Ahmed Adel",
    cityAr: "القاهرة",
    cityEn: "Cairo",
    stars: 3,
    textAr: "المكان حلو بس بصراحة الزحمة في الويك إند كانت مزعجة شوية، محتاج تختار توقيت مناسب علشان تستمتع أكتر",
    textEn: "The place is nice, but honestly weekends were a bit crowded. You need to pick the right timing to fully enjoy it",
    gradient: "linear-gradient(135deg,#EF5350,#C62828)",
  },
  {
    initials: "ن",
    nameAr: "ندى حمدي",
    nameEn: "Nada Hamdi",
    cityAr: "الإسكندرية",
    cityEn: "Alexandria",
    stars: 5,
    textAr: "حبيت جداً الإقامة في غزالة، المكان نضيف والخدمة سريعة. مناسب جداً لبنات أو عائلات",
    textEn: "Loved staying in Ghazala. Clean place and fast service. Very suitable for girls or families",
    gradient: "linear-gradient(135deg,#BA68C8,#7B1FA2)",
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
                    className="w-12 h-12 rounded-full flex items-center justify-center font-black text-white text-lg"
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

                  <div className="mr-auto text-sm text-yellow-400">
                    {"★".repeat(r.stars)}
                    {"☆".repeat(5 - r.stars)}
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