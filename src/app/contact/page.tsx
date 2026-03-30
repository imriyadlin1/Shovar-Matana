import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "יצירת קשר · הון כלוא",
  description: "משוב על שוברים, מסחר וצ׳אט — דברו איתנו.",
};

export default function ContactPage() {
  return (
    <main className="page-shell pb-24 pt-12 md:pb-28 md:pt-16">
      <div className="mx-auto max-w-xl">
        <p className="eyebrow">יצירת קשר</p>
        <h1 className="mt-3 page-hero-title">דברו איתנו</h1>
        <p className="mt-5 text-base leading-relaxed text-ink-muted">
          שוברים, סכומים, מסחר או צ׳אט — אם משהו מבלבל או נראה שבור, כתבו בקצרה מה ניסיתם. זה עוזר להחזיר ערך
          גם למשתמשים הבאים.
        </p>
        <div className="mt-10">
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
