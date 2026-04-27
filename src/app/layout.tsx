import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "Moodstay | شاليهات قرية غزالة الوادي - الساحل الشمالي",
  description:
    "احجز شاليه أحلامك في قرية غزالة الوادي، الكيلو 142 الساحل الشمالي. أفضل شاليهات الساحل بأسعار مميزة وحجز سهل وسريع.",
  keywords: "شاليهات ساحل شمالي, غزالة الوادي, حجز شاليه, Moodstay",
  openGraph: {
    title: "Moodstay | شاليهات غزالة الوادي",
    description: "احجز شاليه أحلامك في الساحل الشمالي",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
