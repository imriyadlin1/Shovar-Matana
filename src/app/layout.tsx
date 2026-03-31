import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { BottomNav } from "@/components/layout/BottomNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { WelcomeToast } from "@/components/auth/WelcomeToast";
import { getNavSession } from "@/lib/auth/navSession";

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  variable: "--font-heebo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "הון כלוא",
  description:
    "שוברים דיגיטליים שלא מנוצלים: סיכום כמה שווים, מסחר והחלפות — וסגירת עסקאות בצ׳אט.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const nav = await getNavSession();
  const mobileNavPad = nav.email ? "pb-[4.75rem] md:pb-0" : "";

  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <body className={`flex min-h-screen flex-col font-sans text-ink antialiased ${mobileNavPad}`}>
        <SiteHeader {...nav} />
        <div className="flex-1">{children}</div>
        <SiteFooter />
        <BottomNav {...nav} />
        <Suspense><WelcomeToast /></Suspense>
      </body>
    </html>
  );
}
