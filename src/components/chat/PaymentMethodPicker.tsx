"use client";

import { useState } from "react";
import { Banknote, Smartphone, CreditCard } from "lucide-react";

const METHODS = [
  { id: "bit", label: "ביט", icon: Smartphone },
  { id: "paybox", label: "פייבוקס", icon: CreditCard },
  { id: "bank", label: "העברה בנקאית", icon: Banknote },
] as const;

export function PaymentMethodPicker() {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-2.5">
      <p className="text-xs font-bold text-ink-muted">איך נוח לשלם?</p>
      <div className="flex flex-wrap gap-2">
        {METHODS.map((m) => {
          const active = selected === m.id;
          const Icon = m.icon;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setSelected(active ? null : m.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                active
                  ? "bg-brand text-white shadow-sm"
                  : "bg-surface-muted text-ink-muted hover:bg-brand-faint hover:text-brand-deep"
              }`}
            >
              <Icon className="size-3.5" strokeWidth={2} />
              {m.label}
            </button>
          );
        })}
      </div>
      {selected && (
        <p className="text-xs text-ink-faint">
          סמנתם העדפה — שתפו את הצד השני בצ׳אט.
        </p>
      )}
    </div>
  );
}
