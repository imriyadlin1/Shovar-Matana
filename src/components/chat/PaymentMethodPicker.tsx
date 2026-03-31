"use client";

import { useState } from "react";
import { Banknote, Smartphone, CreditCard, Check, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const METHODS = [
  { id: "bit", label: "ביט", icon: Smartphone },
  { id: "paybox", label: "פייבוקס", icon: CreditCard },
  { id: "bank", label: "העברה בנקאית", icon: Banknote },
] as const;

type Props = {
  conversationId: string;
};

export function PaymentMethodPicker({ conversationId }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function selectAndNotify(methodId: string) {
    if (sending) return;
    const method = METHODS.find((m) => m.id === methodId);
    if (!method) return;

    const alreadySelected = selected === methodId;
    setSelected(alreadySelected ? null : methodId);

    if (alreadySelected) {
      setSent(false);
      return;
    }

    setSending(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from("messages").insert({
        conversation_id: conversationId,
        sender_id: user.id,
        body: `💳 העדפת תשלום: ${method.label}`,
      });
      setSent(true);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  }

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
              disabled={sending}
              onClick={() => selectAndNotify(m.id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition disabled:opacity-60 ${
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
      {sending && (
        <p className="flex items-center gap-1.5 text-xs text-ink-faint">
          <Loader2 className="size-3 animate-spin" />
          שולח לצד השני...
        </p>
      )}
      {sent && !sending && (
        <p className="flex items-center gap-1.5 text-xs text-money">
          <Check className="size-3" strokeWidth={2.5} />
          הצד השני יראה את ההעדפה שלכם בצ׳אט.
        </p>
      )}
    </div>
  );
}
