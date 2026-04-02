"use client";

import { useState } from "react";
import { Check, Loader2, QrCode } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Props = {
  conversationId: string;
  voucherCode: string;
};

export function SendVoucherCode({ conversationId, voucherCode }: Props) {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (sending || sent) return;
    if (!confirm(`לשלוח את קוד השובר (${voucherCode}) בצ׳אט? הקונה יראה אותו.`)) return;
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
        body: `🔑 קוד השובר: ${voucherCode}`,
      });
      setSent(true);
    } catch {
      // silently fail
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-2xl border border-brand/15 bg-brand-faint/30 p-4">
      <div className="flex items-center gap-2">
        <QrCode className="size-4 text-brand" strokeWidth={2} />
        <p className="text-xs font-bold text-brand-deep">יש לכם קוד שובר שמור</p>
      </div>
      <p className="mt-1 select-all font-mono text-sm font-bold tracking-wider text-brand-deep" dir="ltr">
        {voucherCode}
      </p>
      <button
        type="button"
        onClick={handleSend}
        disabled={sending || sent}
        className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-60 ${
          sent
            ? "bg-money-faint text-money-dark"
            : "bg-brand text-white hover:bg-brand-deep"
        }`}
      >
        {sending ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            שולח…
          </>
        ) : sent ? (
          <>
            <Check className="size-4" strokeWidth={2.5} />
            הקוד נשלח בצ׳אט
          </>
        ) : (
          <>
            <QrCode className="size-4" strokeWidth={2} />
            שלחו את הקוד לקונה
          </>
        )}
      </button>
    </div>
  );
}
