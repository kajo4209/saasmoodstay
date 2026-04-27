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

  // How it works
  how: {
    tag: { ar: "✦ كيف يعمل", en: "✦ How It Works" },
    title: { ar: "احجز في 3 خطوات بسيطة", en: "Book in 3 Simple Steps" },
    h1t: { ar: "اختر الشاليه", en: "Choose Your Chalet" },
    h1d: {
      ar: "تصفح مجموعتنا الواسعة وحدد الشاليه المثالي لرحلتك",
      en: "Browse our wide collection and find the perfect chalet for your trip",
    },
    h2t: { ar: "حدد التاريخ", en: "Set Your Dates" },
    h2d: {
      ar: "اختر تواريخ الوصول والمغادرة وأدخل بيانات ضيوفك",
      en: "Select your check-in and check-out dates and enter guest details",
    },
    h3t: { ar: "أكد الحجز", en: "Confirm Booking" },
    h3d: {
      ar: "أرسل طلبك عبر واتساب أو الموقع وسيصلك التأكيد خلال دقائق",
      en: "Send your request via WhatsApp or website and receive confirmation in minutes",
    },
  },

  // Testimonials
  testimonials: {
    tag: { ar: "✦ آراء العملاء", en: "✦ Customer Reviews" },
    title: { ar: "ماذا يقول عملاؤنا؟", en: "What Do Our Clients Say?" },
  },

  // Location
  location: {
    tag: { ar: "✦ موقعنا", en: "✦ Our Location" },
    title: { ar: "قرية غزالة الوادي", en: "Ghazala Valley Village" },
    sub: {
      ar: "الكيلو 142 على طريق الإسكندرية مطروح — الساحل الشمالي، مصر",
      en: "Kilo 142 on Alexandria–Matrouh Road — North Coast, Egypt",
    },
    addrLabel: { ar: "العنوان", en: "Address" },
    addrVal: {
      ar: "قرية غزالة الوادي، الكيلو 142، الساحل الشمالي",
      en: "Ghazala Valley Village, Kilo 142, North Coast",
    },
    timeLabel: { ar: "وقت الوصول", en: "Access Time" },
    timeVal: {
      ar: "متاح على مدار اليوم طوال الموسم الصيفي",
      en: "Available around the clock throughout the summer season",
    },
    contactLabel: { ar: "تواصل معنا", en: "Contact Us" },
    openMap: { ar: "فتح في خرائط جوجل", en: "Open in Google Maps" },
  },

  // QR Share
  qr: {
    tag: { ar: "✦ شارك Moodstay", en: "✦ Share Moodstay" },
    title: { ar: "شارك الموقع مع أصدقائك", en: "Share the Website with Friends" },
    sub: { ar: "امسح الكود للوصول السريع إلى Moodstay", en: "Scan the code for quick access to Moodstay" },
    copy: { ar: "نسخ", en: "Copy" },
    copied: { ar: "✓ تم النسخ", en: "✓ Copied!" },
    shareWa: { ar: "مشاركة عبر واتساب", en: "Share on WhatsApp" },
    shareFb: { ar: "مشاركة على فيسبوك", en: "Share on Facebook" },
  },

  // Final CTA
  cta: {
    tag: { ar: "✦ ابدأ رحلتك الآن", en: "✦ Start Your Journey Now" },
    h: { ar: "جاهز لعطلتك القادمة؟", en: "Ready for Your Next Vacation?" },
    highlight: { ar: "القادمة؟", en: "Next Vacation?" },
    sub: {
      ar: "لا تفوت أفضل الشاليهات في الساحل الشمالي — احجز الآن وأكد حجزك في دقائق",
      en: "Don't miss the best chalets on the North Coast — book now and confirm in minutes",
    },
    btn1: { ar: "احجز الآن", en: "Book Now" },
    btn2: { ar: "تواصل واتساب", en: "WhatsApp Us" },
  },

  // Footer
  footer: {
    desc: {
      ar: "منصة حجز شاليهات متميزة في قرية غزالة الوادي، الساحل الشمالي. نقدم أفضل تجربة حجز بأسعار مميزة.",
      en: "Premium chalet booking platform in Ghazala Valley, North Coast. Offering the best booking experience at great prices.",
    },
    links: { ar: "روابط سريعة", en: "Quick Links" },
    contact: { ar: "تواصل معنا", en: "Contact Us" },
    addr: { ar: "غزالة الوادي، ك142 الساحل الشمالي", en: "Ghazala Valley, Kilo 142 North Coast" },
    copy: { ar: "© 2025 Moodstay. جميع الحقوق محفوظة.", en: "© 2025 Moodstay. All rights reserved." },
    privacy: { ar: "سياسة الخصوصية", en: "Privacy Policy" },
    terms: { ar: "الشروط والأحكام", en: "Terms & Conditions" },
  },
};

export function tr(obj: { ar: string; en: string }, lang: Lang): string {
  return obj[lang];
}
