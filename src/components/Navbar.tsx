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
  const menuRef    = useRef<HTMLDivElement>(null);
  const clickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark     = theme === "dark";

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // إغلاق الـ dropdown لو الضغط جاء من بره
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const navLinks = [
    { href: "#features",     label: t.nav.why },
    { href: "#chalets",      label: t.nav.chalets },
    { href: "#pricing",      label: t.nav.pricing },
    { href: "#testimonials", label: { ar: "آراء العملاء", en: "Reviews" } },
    { href: "#location",     label: t.nav.location },
  ];

  // الداشبورد المخفي — 3 ضغطات خلال ثانيتين
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
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 md:px-8 transition-all duration-500 ${navBg}`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className={textColor}>
          <Logo />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <a key={link.href} href={link.href}
              className={`font-semibold text-sm hover:text-sky-400 transition-colors ${textColor}`}>
              {tr(link.label, lang)}
            </a>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">

          {/* Language — desktop */}
          <div className="lang-toggle hidden sm:flex">
            <button className={`lang-btn ${lang === "ar" ? "active" : ""}`} onClick={() => setLang("ar")}>عربي</button>
            <button className={`lang-btn ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
          </div>

          {/* Dark mode */}
          {mounted && (
            <button className="dark-toggle" onClick={() => setTheme(isDark ? "light" : "dark")} aria-label="Toggle dark mode"/>
          )}

          {/* Book now — desktop */}
          <a href="#contact" className="btn-primary text-sm hidden sm:block px-5 py-2.5">
            {tr(t.nav.bookNow, lang)}
          </a>

          {/* ── 3-line menu button ── */}
          <div className="relative" ref={menuRef}>
            {/* Hamburger */}
            <button
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Menu"
              className={`flex flex-col justify-center items-center gap-[5px] w-9 h-9 rounded-xl transition-colors
                ${scrolled
                  ? isDark ? "hover:bg-gray-800" : "hover:bg-gray-100"
                  : "hover:bg-white/15"}`}
            >
              <span className={`block h-[2px] w-[18px] rounded-full bg-current transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""} ${textColor}`}/>
              <span className={`block h-[2px] rounded-full bg-current transition-all duration-300 ${menuOpen ? "opacity-0 w-0" : "w-[18px]"} ${textColor}`}/>
              <span className={`block h-[2px] w-[18px] rounded-full bg-current transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""} ${textColor}`}/>
            </button>

            {/* Dropdown panel */}
            <div
              className={`absolute top-[calc(100%+8px)] w-56 rounded-2xl shadow-2xl border
                transition-all duration-200 origin-top-right overflow-hidden
                ${menuOpen ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"}
                ${isDark ? "bg-gray-900 border-gray-700/60" : "bg-white border-gray-100"}
                ${lang === "ar" ? "right-0" : "left-0"}`}
            >
              {/* Section names */}
              <nav className="py-2">
                {navLinks.map((link, i) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-semibold transition-colors
                      ${i < navLinks.length - 1
                        ? isDark ? "border-b border-gray-800" : "border-b border-gray-50"
                        : ""}
                      ${isDark
                        ? "text-gray-200 hover:bg-gray-800 hover:text-sky-400"
                        : "text-gray-700 hover:bg-sky-50 hover:text-sky-600"}`}
                  >
                    {tr(link.label, lang)}
                  </a>
                ))}
              </nav>

              {/* Divider */}
              <div className={`h-px mx-4 ${isDark ? "bg-gray-700" : "bg-gray-100"}`}/>

              {/* Book now — mobile */}
              <div className="p-3 sm:hidden">
                <a href="#contact" onClick={() => setMenuOpen(false)}
                  className="btn-primary block text-center text-sm py-2.5 w-full rounded-xl">
                  {tr(t.nav.bookNow, lang)}
                </a>
              </div>

              {/* Language — mobile */}
              <div className="px-3 pb-2 sm:hidden">
                <div className="lang-toggle w-full">
                  <button className={`lang-btn flex-1 ${lang === "ar" ? "active" : ""}`} onClick={() => setLang("ar")}>عربي</button>
                  <button className={`lang-btn flex-1 ${lang === "en" ? "active" : ""}`} onClick={() => setLang("en")}>EN</button>
                </div>
              </div>

              {/* Hidden dashboard dot — 3 taps */}
              <div className={`flex justify-center py-2 ${isDark ? "border-t border-gray-800" : "border-t border-gray-50"}`}>
                <button
                  onClick={handleDashClick}
                  aria-hidden="true"
                  tabIndex={-1}
                  title=""
                  className={`w-4 h-4 rounded-full transition-colors cursor-default select-none
                    ${isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"}`}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}