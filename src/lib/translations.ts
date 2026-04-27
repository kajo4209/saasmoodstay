export type Lang = "ar" | "en";

export const t = {
  // Navbar
  nav: {
    why: { ar: "لماذا Moodstay", en: "Why Moodstay" },
    chalets: { ar: "الشاليهات", en: "Chalets" },
    pricing: { ar: "الأسعار", en: "Pricing" },
    location: { ar: "الموقع", en: "Location" },
    bookNow: { ar: "احجز الآن", en: "Book Now" },
    whatsapp: { ar: "واتساب", en: "WhatsApp" },

    // ✅ الإضافة المهمة
    dashboard: { ar: "لوحة التحكم", en: "Dashboard" },
  },

  // Hero
  hero: {
    tag: {
      ar: "قرية غزالة الوادي — الكيلو 142 الساحل الشمالي",
      en: "Ghazala Valley Village — Kilo 142 North Coast",
    },
    h1ar: "احجز شاليه أحلامك في الساحل الشمالي",
    h1en: "Book Your Dream Luxury Chalet on the North Coast",
    highlight: { ar: "شاليه أحلامك", en: "Dream Luxury Chalet" },
    sub: {
      ar: "أفضل شاليهات قرية غزالة الوادي بأسعار مميزة وتجربة حجز سهلة وسريعة",
      en: "Premium chalets in Ghazala Valley with exclusive prices and a seamless booking experience",
    },
    ctaBook: { ar: "احجز الآن", en: "Book Now" },
    ctaExplore: { ar: "استكشف الشاليهات", en: "Explore Chalets" },
    trust1: { ar: "شاليهات موثقة", en: "Verified Listings" },
    trust2: { ar: "حجز آمن", en: "Secure Booking" },
    trust3: { ar: "دعم واتساب", en: "WhatsApp Support" },
    scroll: { ar: "اكتشف المزيد", en: "Discover More" },
  },

  // Stats
  stats: {
    chalets: { ar: "شاليه متاح", en: "Available Chalets" },
    bookings: { ar: "حجز ناجح", en: "Successful Bookings" },
    rating: { ar: "تقييم العملاء", en: "Customer Rating" },
    support: { ar: "دعم فوري", en: "Instant Support" },
  },

  // Chalets
  chalets: {
    tag: { ar: "✦ شاليهاتنا المميزة", en: "✦ Featured Chalets" },
    title: { ar: "استكشف أرقى الشاليهات", en: "Explore Premium Chalets" },
    sub: {
      ar: "مجموعة مختارة من أفضل شاليهات قرية غزالة الوادي بإطلالات بحرية خلابة",
      en: "A curated selection of the finest chalets in Ghazala Valley with stunning sea views",
    },
    seaView: { ar: "إطلالة بحرية", en: "Sea View" },
    featured: { ar: "مميز", en: "Featured" },
    mostBooked: { ar: "الأكثر حجزاً", en: "Most Booked" },
    perNight: { ar: "ج / ليلة", en: "EGP / night" },
    viewDetails: { ar: "عرض التفاصيل", en: "View Details" },
    location: { ar: "غزالة الوادي، الكيلو 142", en: "Ghazala Valley, Kilo 142" },
    phase2: { ar: "غزالة الوادي، المرحلة 2", en: "Ghazala Valley, Phase 2" },
    viewAll: { ar: "عرض جميع الشاليهات ←", en: "View All Chalets →" },
    pool: { ar: "مسبح", en: "Pool" },
    beach: { ar: "شاطئ خاص", en: "Private Beach" },
    rooms: (n: number) => ({ ar: `${n} غرف`, en: `${n} Rooms` }),
    persons: (n: number) => ({ ar: `${n} أشخاص`, en: `${n} Persons` }),
  },

  // Features
  features: {
    tag: { ar: "✦ مميزاتنا", en: "✦ Our Features" },
    title: { ar: "لماذا Moodstay؟", en: "Why Moodstay?" },
    sub: {
      ar: "نقدم لك أفضل تجربة حجز في الساحل الشمالي مع ضمان الجودة والأمان",
      en: "We deliver the best booking experience on the North Coast with guaranteed quality and safety",
    },
    f1t: { ar: "حجز سريع", en: "Fast Booking" },
    f1d: {
      ar: "أكمل حجزك في دقائق معدودة عبر واتساب أو الموقع مباشرة",
      en: "Complete your booking in minutes via WhatsApp or our platform directly",
    },
    f2t: { ar: "شاليهات موثقة", en: "Verified Chalets" },
    f2d: {
      ar: "كل شاليه تم التحقق منه ومراجعته للتأكد من جودته ومطابقته للصور",
      en: "Every chalet is verified and reviewed to ensure quality matches photos",
    },
    f3t: { ar: "دعم واتساب مباشر", en: "Direct WhatsApp Support" },
    f3d: {
      ar: "فريق متخصص متاح 24/7 للإجابة على جميع استفساراتك فوراً",
      en: "Specialized team available 24/7 to answer all your inquiries instantly",
    },
    f4t: { ar: "أفضل الأسعار", en: "Best Prices" },
    f4d: {
      ar: "نضمن أفضل الأسعار في السوق مع خصومات حصرية للحجوزات المبكرة",
      en: "We guarantee the best market prices with exclusive discounts for early bookings",
    },
  },

  // Pricing
  pricing: {
    tag: { ar: "✦ الأسعار الذكية", en: "✦ Smart Pricing" },
    title: { ar: "تسعير مرن وشفاف", en: "Flexible & Transparent Pricing" },
    sub: {
      ar: "نظام تسعير ذكي يناسب جميع احتياجاتك وميزانيتك",
      en: "Smart pricing system that fits all your needs and budget",
    },
    p1t: { ar: "أسعار نهاية الأسبوع", en: "Weekend Pricing" },
    p1v: { ar: "+15%", en: "+15%" },
    p1d: {
      ar: "تطبق زيادة طفيفة على الجمعة والسبت لارتفاع الطلب في هذه الأيام",
      en: "A small premium applies on Fridays & Saturdays due to high demand",
    },
    p2t: { ar: "الأسعار الموسمية", en: "Seasonal Pricing" },
    p2v: { ar: "يونيو–أغسطس", en: "June–August" },
    p2d: {
      ar: "أسعار الموسم الرئيسي تعكس أوقات الذروة في الساحل الشمالي للحجز المبكر",
      en: "Peak season prices reflect North Coast's prime time — early booking recommended",
    },
    bestVal: { ar: "الأفضل قيمة", en: "Best Value" },
    p3t: { ar: "خصم الإقامة الطويلة", en: "Long Stay Discount" },
    p3v: { ar: "وفر 5%", en: "Save 5%" },
    p3d: {
      ar: "احصل على خصم حتى 5% عند الحجز لمدة 7 ليالٍ أو أكثر",
      en: "Get up to 5% off when booking 7+ nights — the longer the stay the more you save",
    },
  },

  // باقي الكود زي ما هو بدون تغيير...

};

export function tr(obj: { ar: string; en: string }, lang: Lang): string {
  return obj[lang];
}