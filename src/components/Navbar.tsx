"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Logo } from "./Logo";
import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";

export function Navbar() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const [scrolled,   setScrolled]   = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [dashClicks, setDashClicks] = useState(0);
  const [mounted,    setMounted]    = useState(false);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#features",     label: t.nav.why },
    { href: "#chalets",      label: t.nav.chalets },
    { href: "#pricing",      label: t.nav.pricing },
    { href: "#testimonials", label: { ar: "آراء العملاء", en: "Reviews" } },
    { href: "#location",     label: t.nav.location },
  ];

  function handleDashClick() {
    const next = dashClicks + 1;
    setDashClicks(next);
    if (clickTimer.current) clearTimeout(clickTimer.current);
    if (next >= 3) {
      setDashClicks(0);
      window.location.href = "/login";
    } else {
      clickTimer.current = setTimeout(() => setDashClicks(0), 2000);
    }
  }

  const navBg = scrolled
    ? isDark ? "bg-gray-950/95 backdrop-blur-xl shadow-2xl" : "bg-white/97 backdrop-blur-xl shadow-lg"
    : "bg-transparent";

  const textColor = scrolled
    ? isDark ? "text-gray-100" : "text-gray-800"
    : "text-white";

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
    >
      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">

        {/* LEFT: hamburger + logo */}
        <div className="flex items-center gap-2">
          {/* 3-line button */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Menu"
            className={`flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-xl transition-colors flex-shrink-0
              ${scrolled
                ? isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                : "hover:bg-white/15"}`}
          >
            <span className={`block h-[2px] w-[18px] rounded-full bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""} ${textColor}`}/>
            <span className={`block h-[2px] rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-[18px]"} ${textColor}`}/>
            <span className={`block h-[2px] w-[18px] rounded-full bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""} ${textColor}`}/>
          </button>

          {/* Logo */}
          <Link href="/" className={textColor}>
            <Logo />
          </Link>
        </div>

        {/* CENTER: desktop nav links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              className={`font-semibold text-sm hover:text-sky-400 transition-colors ${textColor}`}>
              {tr(link.label, lang)}
            </a>
          ))}
        </div>

        {/* RIGHT: controls */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="lang-toggle hidden sm:flex">
            <button className={`lang-btn ${lang === "ar" ? "active" : ""}`} onClick={() => setLang("ar")}>عربي</button>
            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
          </div>

          {mounted && (
            <button className="dark-toggle" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle dark mode"/>
          )}

          <a href="#contact" className="btn-primary text-sm hidden sm:block px-5 py-2.5">
            {tr(t.nav.bookNow, lang)}
          </a>
        </div>
      </div>

      {/* ── Full-width dropdown ── */}
      <div className={`transition-all duration-300 overflow-hidden ${menuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className={`mx-3 mb-3 rounded-2xl shadow-2xl border ${isDark ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}`}>

          {/* Section links */}
          <nav className="py-2">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center px-5 py-3 text-sm font-bold transition-colors
                  ${i < navLinks.length - 1 ? isDark ? "border-b border-gray-800" : "border-b border-gray-50" : ""}
                  ${isDark ? "text-gray-100 hover:bg-gray-800 hover:text-sky-400" : "text-gray-800 hover:bg-sky-50 hover:text-sky-600"}`}
              >
                {tr(link.label, lang)}
              </a>
            ))}
          </nav>

          <div className={`h-px mx-4 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}/>

          {/* Book now + Language — mobile */}
          <div className="p-3 flex flex-col gap-2 sm:hidden">
            <a href="#contact" onClick={() => setMenuOpen(false)}
              className="btn-primary block text-center text-sm py-3 w-full rounded-xl">
              {tr(t.nav.bookNow, lang)}
            </a>
            <div className="lang-toggle w-full">
              <button className={`lang-btn flex-1 ${lang === "ar" ? "active" : ""}`} onClick={() => setLang("ar")}>عربي</button>
              <button className={`lang-btn flex-1 ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
            </div>
          </div>

          {/* Hidden dashboard dot */}
          <div className={`flex justify-center py-2.5 ${isDark ? "border-t border-gray-800" : "border-t border-gray-50"}`}>
            <button
              onClick={handleDashClick}
              aria-hidden="true"
              tabIndex={-1}
              className="w-3 h-3 rounded-full bg-sky-500 opacity-40 hover:opacity-70 transition-opacity cursor-default select-none"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}