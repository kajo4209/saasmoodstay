# Moodstay — احجز شاليه أحلامك في الساحل الشمالي

منصة حجز شاليهات فاخرة في قرية غزالة الوادي، الكيلو 142 الساحل الشمالي

---

## 🚀 رفع على Vercel (خطوات بسيطة)

### الطريقة الأسرع — مباشرة من GitHub

1. ارفع المجلد على GitHub repo جديد
2. افتح [vercel.com](https://vercel.com) وسجّل دخول
3. اضغط **"Add New → Project"**
4. اختر الـ repo من GitHub
5. Vercel سيكتشف Next.js تلقائياً — اضغط **Deploy**
6. خلال دقيقتين سيكون الموقع live ✅

### الطريقة البديلة — Vercel CLI

```bash
npm install -g vercel
cd moodstay
npm install
vercel
```

---

## 💻 تشغيل محلياً

```bash
npm install
npm run dev
# افتح http://localhost:3000
```

## 🏗️ Build للإنتاج

```bash
npm run build
npm start
```

---

## 📁 هيكل المشروع

```
moodstay/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout + metadata + fonts
│   │   ├── page.tsx            # الصفحة الرئيسية
│   │   └── globals.css         # Global styles + Tailwind
│   ├── components/
│   │   ├── Navbar.tsx          # Sticky navbar + dark mode + lang toggle
│   │   ├── HeroSection.tsx     # Hero + trust badges + CTA
│   │   ├── StatsBar.tsx        # Statistics bar
│   │   ├── ChaletsSection.tsx  # Featured chalets grid
│   │   ├── FeaturesSection.tsx # Why Moodstay
│   │   ├── PricingSection.tsx  # Smart pricing cards
│   │   ├── HowItWorksSection.tsx # 3-step process
│   │   ├── TestimonialsSection.tsx # Customer reviews
│   │   ├── LocationSection.tsx # Map + location info
│   │   ├── QRSection.tsx       # QR code + share buttons
│   │   ├── CtaSection.tsx      # Final CTA
│   │   ├── Footer.tsx          # Footer with social links
│   │   ├── WhatsAppFloat.tsx   # Floating WhatsApp button
│   │   └── Logo.tsx            # Moodstay logo component
│   ├── context/
│   │   └── LanguageContext.tsx # Arabic/English language context
│   ├── hooks/
│   │   └── useScrollReveal.ts  # Intersection Observer reveal hook
│   └── lib/
│       └── translations.ts     # Full AR/EN translations
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## ✨ المميزات

- 🌙 Dark Mode
- 🌐 Arabic ↔ English + RTL/LTR
- 📱 Mobile-first responsive
- ⚡ Next.js 14 App Router
- 🎨 Glassmorphism + premium animations
- 💚 Floating WhatsApp button
- ❤️ Favorite chalet hearts
- 📍 Google Maps embed
- 📱 QR Code generator
- 🔗 Social share buttons

---

## 📞 تواصل

- WhatsApp: 01201543050
- WhatsApp: 01060742957
- الموقع: قرية غزالة الوادي، الكيلو 142، الساحل الشمالي
