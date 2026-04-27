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
          <div className="flex gap-2 pt-1">
            <a
              href="#contact"
              className="btn-primary flex-1 text-sm text-center px-4 py-3"
              onClick={() => setMenuOpen(false)}
            >
              {tr(t.nav.bookNow, lang)}
            </a>
            <a
              href="https://wa.me/201201543050"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 text-sm font-bold rounded-full py-3 text-white"
              style={{ background: "linear-gradient(135deg,#25D366,#128C7E)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              {tr(t.nav.whatsapp, lang)}
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
