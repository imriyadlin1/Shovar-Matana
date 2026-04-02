"use client";

import { MessageCircle } from "lucide-react";

const SUGGESTIONS = [
  "היי, אשמח לשמוע פרטים על השובר",
  "השובר עדיין בתוקף?",
  "מה המחיר הסופי?",
  "מתאים לי, בוא נסגור",
  "שולח את קוד השובר עכשיו",
  "קיבלתי את הקוד, תודה!",
  "התשלום הועבר",
] as const;

type Props = {
  onSelect: (text: string) => void;
};

export function ChatSuggestions({ onSelect }: Props) {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-1.5 text-[0.65rem] font-bold text-ink-faint">
        <MessageCircle className="size-3" strokeWidth={2} />
        משפטים מוכנים — לחצו לשימוש
      </p>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className="rounded-full border border-slate-200/80 bg-surface-muted/60 px-3 py-1.5 text-xs font-medium text-ink-muted transition hover:border-brand/30 hover:bg-brand-faint hover:text-brand-deep active:scale-[0.97]"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
