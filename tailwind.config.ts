import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        sky: {
          DEFAULT: "#4FC3F7",
          dark: "#0288D1",
          light: "#E1F5FE",
          ocean: "#0D47A1",
        },
        sand: {
          DEFAULT: "#E8D8C3",
          dark: "#C4A882",
          light: "#F9F3EC",
        },
        brand: {
          primary: "#4FC3F7",
          secondary: "#0288D1",
          accent: "#F4C430",
          coral: "#FF7043",
          green: "#25D366",
        },
      },
      fontFamily: {
        arabic: ["var(--font-tajawal)", "sans-serif"],
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "fade-up": "fadeUp 0.8s ease forwards",
        shimmer: "shimmer 2.5s linear infinite",
        "pulse-slow": "pulse 4s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(40px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      backgroundImage: {
        "gradient-sky": "linear-gradient(135deg, #4FC3F7, #0288D1)",
        "gradient-sand": "linear-gradient(135deg, #E8D8C3, #C4A882)",
        "gradient-hero":
          "linear-gradient(135deg, rgba(13,71,161,0.75) 0%, rgba(2,136,209,0.55) 40%, rgba(0,0,0,0.3) 100%)",
      },
      boxShadow: {
        sky: "0 8px 30px rgba(79, 195, 247, 0.4)",
        "sky-lg": "0 20px 60px rgba(79, 195, 247, 0.25)",
        card: "0 4px 24px rgba(0,0,0,0.08)",
        "card-hover": "0 24px 60px rgba(79,195,247,0.22)",
      },
    },
  },
  plugins: [],
};

export default config;
