"use client";

import { useState } from "react";
import { Loader2, Send } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    if (!name || !email || !message) return;

    setPending(true);
    await new Promise((r) => setTimeout(r, 450));
    setPending(false);
    setSent(true);
    form.reset();
  }

  if (sent) {
    return (
      <div className="card-elevated px-8 py-12 text-center shadow-md" role="status">
        <p className="text-lg font-bold text-brand-deep">קיבלנו את הפנייה</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-muted">
          נחזור אליכם בהקדם האפשרי, בדרך כלל תוך ימי עסקים ספורים. אם זה דחוף — אפשר לציין זאת בשדה
          ההודעה בעמוד זה.
        </p>
        <button type="button" className="btn-secondary mx-auto mt-8" onClick={() => setSent(false)}>
          שליחת פנייה נוספת
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="card-elevated space-y-6 px-7 py-8 shadow-md sm:px-9 sm:py-10">
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="label-form">
          שם
          <input name="name" required autoComplete="name" className="input-field" placeholder="למשל: דני" />
        </label>
        <label className="label-form">
          דוא״ל
          <input name="email" type="email" required autoComplete="email" className="input-field input-ltr" dir="ltr" placeholder="you@example.com" />
        </label>
      </div>
      <label className="label-form">
        איך נוכל לעזור?
        <textarea
          name="message"
          required
          rows={5}
          className="input-field min-h-[8rem] resize-y"
          placeholder="תארו בקצרה את השאלה או הבקשה..."
        />
      </label>
      <div className="flex flex-wrap items-center gap-4 pt-2">
        <button type="submit" disabled={pending} className="btn-primary min-w-[8.5rem] gap-2">
          {pending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              שולחים…
            </>
          ) : (
            <>
              <Send className="size-4 opacity-90" aria-hidden />
              שליחה
            </>
          )}
        </button>
        <p className="text-xs leading-relaxed text-ink-faint">
          בגרסה זו הטופס מדגים חוויית שליחה מלאה; אפשר לחבר אותו לתיבת דוא״ל או ל-API בהמשך.
        </p>
      </div>
    </form>
  );
}
