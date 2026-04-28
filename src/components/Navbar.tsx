"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { Logo } from "./Logo";
import { useLang } from "@/context/LanguageContext";
import { t, tr } from "@/lib/translations";

export function Navbar() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isDark = theme === "dark";

  useEffect(() => {
    setMounted(true);
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navLinks = [
    { href: "#features", label: t.nav.why },
    { href: "#chalets", label: t.nav.chalets },
    { href: "#pricing", label: t.nav.pricing },
    { href: "#location", label: t.nav.location },
  ];

  const baseText = scrolled
    ? isDark
      ? "text-gray-100"
      : "text-gray-800"
    : "text-white";

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 py-3 px-4 md:px-8 transition-all duration-500 ${
        scrolled
          ? isDark
            ? "bg-gray-950/95 backdrop-blur-xl shadow-2xl"
            : "bg-white/97 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className={`${baseText}`}>
          <Logo />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-semibold text-sm hover:text-sky-400 transition-colors ${baseText}`}
            >
              {tr(link.label, lang)}
            </a>
          ))}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          
          {/* Dashboard Button 🔥 */}
          <Link
            href="/login"
            className="hidden sm:block px-4 py-2 rounded-lg bg-sky-600 text-white text-sm font-semibold hover:bg-sky-700 transition"
          >
            {tr(t.nav.dashboard || "Dashboard", lang)}
          </Link>

          {/* Language Toggle */}
          <div className="lang-toggle hidden sm:flex">
            <button
              className={`lang-btn ${lang === "ar" ? "active" : ""}`}
              onClick={() => setLang("ar")}
            >
              عربي
            </button>
            <button
              className={`lang-btn ${lang === "en" ? "active" : ""}`}
              onClick={() => setLang("en")}
            >
              EN
            </button>
          </div>

          {/* Dark Mode */}
          {mounted && (
            <button
              className="dark-toggle"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              aria-label="Toggle dark mode"
            />
          )}

          {/* CTA */}
          <a
            href="#contact"
            className="btn-primary text-sm hidden sm:block px-5 py-2.5"
          >
            {tr(t.nav.bookNow, lang)}
          </a>

          {/* Hamburger */}
          <button
            className={`md:hidden p-1 ${baseText}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            ) : (
              <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          menuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div
          className={`mx-0 mt-2 rounded-2xl shadow-2xl px-6 py-4 flex flex-col gap-4 ${
            isDark ? "bg-gray-900" : "bg-white"
          }`}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-bold text-gray-800 dark:text-gray-200 hover:text-sky-500 border-b border-gray-100 dark:border-gray-700 pb-3 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {tr(link.label, lang)}
            </a>
          ))}

          {/* Dashboard في الموبايل */}
          <Link
            href="/login"
            className="btn-primary text-center py-3"
            onClick={() => setMenuOpen(false)}
          >
            {tr(t.nav.dashboard || "Dashboard", lang)}
          </Link>

          <div className="flex gap-2 pt-1">
            <a
              href="#contact"
              className="btn-primary flex-1 text-sm text-center px-4 py-3"
              onClick={() => setMenuOpen(false)}
            >
              {tr(t.nav.bookNow, lang)}
            </a>
          </div>

          {/* Mobile Lang */}
          <div className="lang-toggle self-center">
            <button className={`lang-btn ${lang === "ar" ? "active" : ""} !text-gray-700 dark:!text-gray-200`} onClick={() => setLang("ar")}>عربي</button>
            <button className={`lang-btn ${lang === "en" ? "active" : ""} !text-gray-700 dark:!text-gray-200`} onClick={() => setLang("en")}>EN</button>
          </div>
        </div>
      </div>
    </nav>
  );
}